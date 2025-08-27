import { Tabs } from "expo-router";
import React from "react";
import { Home, Send } from "lucide-react-native"; // Import icons

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Send size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
