import { Fonts } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CategoryList } from "../CategoryList";
import RestaurantHeader from "../RestaurantHeader";
import RestaurantList from "../RestaurantList";

const HEADER_OFFSET = 60;

const RestaurantListPage = () => {
  const insets = useSafeAreaInsets();
  const scrollOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollOffset.value = e.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <RestaurantHeader title="Restaurants" scrollOffset={scrollOffset} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + HEADER_OFFSET }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <Text style={styles.pageTitle}>Restaurant</Text>
        <CategoryList />
        <Text style={styles.allRestaurantsTitle}>All restaurants</Text>
        <RestaurantList />
      </Animated.ScrollView>
    </View>
  );
};

export default RestaurantListPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontFamily: Fonts.brandBlack,
    fontSize: 30,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  allRestaurantsTitle: {
    fontFamily: Fonts.brandBold,
    fontSize: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});
