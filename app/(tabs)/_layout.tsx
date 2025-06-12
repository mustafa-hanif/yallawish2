import { Image } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            height: 100,
            paddingTop: 30,
            paddingBottom: 10,
          },
          default: {
            height: 100,
            paddingTop: 30,
            paddingBottom: 10,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/home.svg")}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/favourite.svg")}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/addProductIcon.png")}
              style={{ width: 72, height: 72, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/global.svg")}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/filter-mail-circle.svg")}
              style={{ width: 28, height: 28, tintColor: color }}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
