import { Stack } from "@/components/Stack";
import { Colors } from "@/constants/theme";
import React from "react";

const Layout = () => {
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
    </Stack>
  );
};

export default Layout;
