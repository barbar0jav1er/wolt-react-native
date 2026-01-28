import { Stack } from "@/components/Stack";
import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen
        name="checkout"
        options={{
          headerBackButtonDisplayMode: "minimal",
          title: "",
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen
        name="schedule"
        options={{
          presentation: "formSheet",
          headerBackButtonDisplayMode: "minimal",
          title: "Schedule Delivery",
          sheetCornerRadius: 24,
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5],
          contentStyle: { backgroundColor: Colors.background },
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.dismiss()}
              style={{ padding: 4, borderRadius: 20 }}
            >
              <Ionicons name="close-sharp" size={28} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
