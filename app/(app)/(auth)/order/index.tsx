import CheckoutButton from "@/components/buttons/CheckoutButton";
import OrderItem from "@/components/OrderItem";
import { RecommendedDish } from "@/components/RecommendedDish";
import { BoxShadows, Colors } from "@/constants/theme";
import { useCartStore } from "@/hooks/use-cartstore";
import { usePopularDishes } from "@/hooks/useMenu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OrderPage = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { items, selectedRestaurant } = useCartStore();

  const { data: recommendedDishes, isLoading } = usePopularDishes("rest_001");
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: top }]}>
        <View style={styles.restaurantInfo}>
          <TouchableOpacity
            onPress={() => router.dismiss()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-down" size={24} />
          </TouchableOpacity>
          <View style={styles.restaurantTextContainer}>
            <Text style={styles.restaurantText} numberOfLines={1}>
              {selectedRestaurant?.name}
            </Text>
            <Text style={styles.restaurantSubtitle} numberOfLines={1}>
              Your order
            </Text>
          </View>
        </View>
      </View>

      {/* Order Items */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Order Items</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.addMoreLink}>+ Add More</Text>
            </TouchableOpacity>
          </View>
          {items.map((item, index) => (
            <OrderItem item={item} key={item.dish.id} />
          ))}
        </View>
        {/* Recommended Dishes */}
        {recommendedDishes && recommendedDishes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Recommended for your</Text>
            </View>
            <View style={styles.recommendedGrid}>
              {recommendedDishes.map((dish) => (
                <RecommendedDish key={dish.id} dish={dish} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout button */}
      <CheckoutButton/>
    </View>
  );
};

export default OrderPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: BoxShadows.normal,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 48,
  },
  restaurantText: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  restaurantSubtitle: {
    fontSize: 13,
    color: Colors.muted,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  section: {
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    padding: 16,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "700",
  },
  addMoreLink: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondary,
  },
  recommendedGrid: {
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 16,
  },
});
