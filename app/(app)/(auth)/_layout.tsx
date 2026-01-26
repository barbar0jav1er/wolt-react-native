import { Stack } from "@/components/Stack";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import Transition from "react-native-screen-transitions";

const Layout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/map"
        options={{ ...Transition.presets.SharedAppleMusic() }}
      />
      <Stack.Screen
        name="(modal)/(restaurant)/[id]"
        options={{ ...Transition.presets.DraggableCard() }}
      />
      <Stack.Screen
        name="(modal)/location"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.7],
          title: "",
          sheetCornerRadius: 16,
          sheetGrabberVisible: true,
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
      <Stack.Screen
        name="(modal)/filter"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [0.8],
          title: "",
          sheetCornerRadius: 16,
          sheetGrabberVisible: true,
          contentStyle: { backgroundColor: "#fff" },
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
