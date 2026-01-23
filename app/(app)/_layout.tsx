import useUserStore from "@/hooks/use-userstore";
import { Stack } from "expo-router";
import React from "react";

export default function RootNav() {
  const { isGuest, user } = useUserStore();
  console.log("🚀 ~ RootNav ~ isGuest:", isGuest);

  return (
    <Stack>
      <Stack.Protected guard={isGuest || user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isGuest && !user}>
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
