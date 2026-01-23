import useUserStore from "@/hooks/use-userstore";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Page = () => {
  const setIsGuest = useUserStore((state) => state.setIsGuest);

  return (
    <View>
      <Text>Page</Text>
      <Button title="Go login" onPress={() => setIsGuest(false)} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({});
