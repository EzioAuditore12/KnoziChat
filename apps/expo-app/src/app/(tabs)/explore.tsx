import { View } from "react-native";
import React from "react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

const Explore = () => {
  return (
    <View className="flex-1 items-center justify-center gap-y-3 bg-red-500">
      <Button>
        <Text>Hello</Text>
      </Button>
      <Text variant={"p"}>Hello</Text>
    </View>
  );
};

export default Explore;
