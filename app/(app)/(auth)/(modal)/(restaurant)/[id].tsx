import MenuItem from "@/components/MenuItem";
import RestaurantDetailHeader from "@/components/RestaurantDetailHeader";
import { Colors } from "@/constants/theme";
import { Dish } from "@/data/restaurant_menu";
import { useMenu } from "@/hooks/useMenu";
import { useRestaurant } from "@/hooks/useRestaurants";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const IMAGE_HIGHT = 300;
const STICKY_THRESHOLD_START = 265;
const STICKY_THRESHOLD_END = 320;

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList<Dish>);

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionListRef = useRef<SectionList>(null);
  const categoryScrollRef = useRef<ScrollView>(null);
  const scrollOffset = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const categoryTabWidth = 100;

  //fetch data

  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant(id);
  const { data: menu, isLoading: menuLoading } = useMenu(id);

  const handleCategoryPress = (index: number) => () => {
    setActiveCategory(index);
    sectionListRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewOffset: insets.top + 100,
    });
    scrollCategoryTabIntoView(index);
  };

  const scrollCategoryTabIntoView = (index: number) => {
    categoryScrollRef.current?.scrollTo({
      x: index * categoryTabWidth - width / 2 + categoryTabWidth / 2,
      animated: true,
    });
  };

  const sections =
    menu?.map((category) => ({
      title: category.category,
      subtitle: category.subtitle,
      data: category.dishes,
    })) || [];

  const onViewableItemChanges = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const firstVisibleSection = viewableItems[0].section;
        const sectionIndex = sections.findIndex(
          (s) => s.title === firstVisibleSection.title,
        );

        if (sectionIndex !== -1 && sectionIndex !== activeCategory) {
          setActiveCategory(sectionIndex);
          scrollCategoryTabIntoView(sectionIndex);
        }
      }
    },
    [sections, activeCategory],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollOffset.value = e.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [-100, 0],
      [1.5, 1],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, 400],
      [0, -150],
      Extrapolation.CLAMP,
    );

    return { transform: [{ scale }, { translateY }] };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, 70],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const stickyTabsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [STICKY_THRESHOLD_START, STICKY_THRESHOLD_END],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  if (restaurantLoading || menuLoading)
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );

  if (!restaurant)
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text>Restaurant not found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Animated.Image
        resizeMode={"cover"}
        source={restaurant.image!}
        style={[styles.bgImage, parallaxStyle]}
      />
      <Animated.View style={[styles.witheOverlay, overlayStyle]} />
      <View style={{ zIndex: 100 }}>
        <RestaurantDetailHeader scrollOffset={scrollOffset} />
      </View>

      <Animated.View
        style={[
          styles.stickyTabOverlay,
          { top: insets.top + 64 },
          stickyTabsStyle,
        ]}
      >
        <View style={styles.categoryStickyTabsContainer}>
          <ScrollView
            horizontal
            ref={categoryScrollRef}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryTabs}
          >
            {menu?.map((category, index) => (
              <TouchableOpacity
                key={`sticky-${index}`}
                style={[
                  styles.categoryTab,
                  activeCategory === index && styles.categoryTabActive,
                ]}
                onPress={handleCategoryPress(index)}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    activeCategory === index && styles.categoryTabTextActive,
                  ]}
                >
                  {category.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      <AnimatedSectionList
        ref={sectionListRef}
        sections={sections}
        renderItem={({ item }) => <MenuItem dish={item} />}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        onViewableItemsChanged={onViewableItemChanges}
        renderSectionHeader={({ section }: { section: any }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View style={styles.imageSpacer} />
            <View style={styles.whiteContentContainer}>
              <Svg
                height={30}
                width={width}
                viewBox={`0 0 ${width} 30`}
                style={{ position: "absolute", top: -29, left: 0 }}
              >
                <Path
                  d={`M 0,30 Q ${width / 2},0 ${width},30 L ${width},30 L 0,30 Z`}
                  fill="#fff"
                />
              </Svg>
              <View style={styles.logoContainer}>
                <Image source={restaurant.image!} style={styles.logo} />
              </View>

              {/* Restaurant Info */}
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.infoRow}>
                  <Ionicons name="star-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>{restaurant.rating}</Text>
                  <Text style={styles.infoDot}>•</Text>
                  <Text style={styles.infoText}>Open until 21:30</Text>
                  <Text style={styles.infoDot}>•</Text>
                  <Text style={styles.infoText}>
                    Min. order {restaurant.minOrder.toFixed(2)} €
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="bicycle-outline" size={16} color="#666" />
                  <Text style={styles.infoText}>
                    {restaurant.deliveryFee.toFixed(2)} €
                  </Text>
                  <Text style={styles.infoDot}>•</Text>
                  <TouchableOpacity>
                    <Text style={styles.moreLink}>More</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Delivery Info */}
              <View style={styles.deliveryInfo}>
                <TouchableOpacity style={styles.deliveryButton}>
                  <Ionicons name="bicycle" size={16} color="#009de0" />
                  <Text style={styles.deliveryText}>
                    Delivery {restaurant.deliveryTime}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#009de0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonSmall}>
                  <Ionicons name="people-outline" size={20} color="#009de0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButtonSmall}>
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="#009de0"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width,
    height: IMAGE_HIGHT,
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.muted,
  },
  imageSpacer: {
    height: IMAGE_HIGHT - 60,
  },
  whiteContentContainer: {
    backgroundColor: Colors.background,
    marginTop: -30,
    paddingTop: 30,
    overflow: "visible",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: -60,
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 3,
    borderColor: Colors.background,
    boxShadow: "0px 4px 10px 2px rgba(0,0,0,0.3)",
  },

  restaurantInfo: {
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
  infoDot: {
    fontSize: 14,
    color: "#999",
  },
  moreLink: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: "600",
  },
  deliveryInfo: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },
  deliveryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f9ff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  deliveryText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: "600",
  },
  iconButtonSmall: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  witheOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width,
    height: IMAGE_HIGHT,
    backgroundColor: Colors.background,
  },
  stickyTabOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Colors.background,
  },
  categoryStickyTabsContainer: {
    boxShadow: "0px 4px 2px -2px rgba(0,0,0,0.1)",
  },
  categoryTabs: {
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 20,
  },
  categoryTab: {
    paddingBottom: 12,
  },
  categoryTabText: {
    fontSize: 15,
    color: Colors.muted,
    fontWeight: "500",
  },
  categoryTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.secondary,
  },
  categoryTabTextActive: {
    color: Colors.secondary,
    fontWeight: "600",
  },
});
