import { Colors } from "@/constants/theme";
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RestaurantDetailHeaderProps {
  scrollOffset: SharedValue<number>;
}

const SCROLL_THRESHOLD_START = 50;
const SCROLL_THRESHOLD_END = 80;

const RestaurantDetailHeader = ({
  scrollOffset,
}: RestaurantDetailHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const headerStyle = useAnimatedStyle(() => {
    const backgroundOpacity = interpolate(
      scrollOffset.value,
      [SCROLL_THRESHOLD_START, SCROLL_THRESHOLD_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const shadowOpacity = interpolate(
      scrollOffset.value,
      [SCROLL_THRESHOLD_START, SCROLL_THRESHOLD_END],
      [0, 0.05],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: `rgba(255,255,255, ${backgroundOpacity})`,
      shadowOpacity,
    };
  });

  const searchBarStyle = useAnimatedStyle(() => {
    const backgroundOpacity = interpolate(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD_START],
      [0.9, 1],
      Extrapolation.CLAMP,
    );
    return {
      backgroundColor: `rgba(230,230,230, ${backgroundOpacity})`,
    };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, SCROLL_THRESHOLD_END],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
    };
  });

  const buttonStyleTwo = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0.3, SCROLL_THRESHOLD_END],
      [0, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.headerContainer, { paddingTop: insets.top }, headerStyle]}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Animated.View style={[styles.searchBar, searchBarStyle]}>
          <Ionicons name="search" size={20} color={Colors.muted} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors.muted}
            style={{ flex: 1 }}
          />
        </Animated.View>
        <View style={styles.spacer} />
        <Animated.View style={[styles.iconButton, buttonStyle]}>
          <Ionicons name="heart-outline" size={24} />
        </Animated.View>
        <Animated.View style={[styles.iconButton, buttonStyleTwo]}>
          {/* <Ionicons name="ellipsis-horizontal" size={24} /> */}
          <Host matchContents>
            <ContextMenu>
              <ContextMenu.Items>
                <Button
                  systemImage="info.circle.fill"
                  onPress={() => console.log("Pressed1")}
                >
                  More Info
                </Button>
                <Button
                  variant="bordered"
                  systemImage="heart"
                  onPress={() => console.log("Pressed2")}
                >
                  Love it
                </Button>
                <Button
                  variant="bordered"
                  systemImage="square.and.arrow.up"
                  onPress={() => console.log("Pressed2")}
                >
                  Share Venue
                </Button>
              </ContextMenu.Items>
              <ContextMenu.Trigger>
                <Button systemImage="ellipsis" color={Colors.dark} />
              </ContextMenu.Trigger>
            </ContextMenu>
          </Host>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default RestaurantDetailHeader;

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: "0px 4px 2px -2px rgba(0,0,0, 0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 2px -2px rgba(0,0,0, 0.1)",
  },
  searchBar: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  iconButton: {
    position: "absolute",
    top: 14,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 2px -2px rgba(0,0,0, 0.1)",
  },
  spacer: {
    width: 40,
    height: 40,
  },
});
