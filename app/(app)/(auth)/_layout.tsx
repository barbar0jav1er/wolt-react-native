import { Stack } from "expo-router";
import React from "react";

const Latout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Feed" }} />
    </Stack>
  );
};

export default Latout;
