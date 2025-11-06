import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, Tabs, useGlobalSearchParams, usePathname } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@clerk/clerk-expo";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const search = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      v.forEach((vv) => search.append(k, String(vv)));
    } else if (v != null) {
      search.append(k, String(v));
    }
  });
  const qs = search.toString() ? `?${search.toString()}` : "";
  const returnTo = `${pathname}${qs}`;
  // Register for push notifications and save token when signed in
  usePushNotifications();
  const allowAnonymous = ['/view-list', '/gift-detail', '/purchase-success'].some((p) => pathname?.includes(p));
  if (!isSignedIn && !allowAnonymous) {
    const encoded = encodeURIComponent(returnTo);
    return <Redirect href={{ pathname: "/splash", params: { returnTo: encoded } }} />;
  }

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
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: focused ? "#4B0082" : "#6A0FBF",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 6,
                marginTop: -24,
              }}
            >
              <Ionicons name="add" size={42} color="#FFFFFF" />
            </View>
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

      {/* Gift and List journey screens - hidden from tab bar but included in this navigator */}
      <Tabs.Screen
        name="create-list-step1"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="create-list-step2"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="create-list-step3"
        options={{
          href: null, // This hides it from the tab bar
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="select-profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="add-gift"
        options={{
          href: null, // This hides it from the tab bar
          // Hide the TabBar entirely on this screen so fixed footers are not overlapped
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="view-list"
        options={{
          href: null, // Hide from tab bar
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="manage-list"
        options={{
          href: null, // Hide manage-list from tab bar
        }}
      />
      <Tabs.Screen
        name="gift-detail"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="purchase-success"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
