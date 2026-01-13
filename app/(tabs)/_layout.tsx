import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, Tabs, useGlobalSearchParams, usePathname } from "expo-router";
import React from "react";
import { Platform, View, useWindowDimensions } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DESKTOP_BREAKPOINT = 1024;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { bottom } = useSafeAreaInsets(); // Get the safe area bottom inset
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const baseTabBarStyle = Platform.select({
    ios: {
      position: "absolute",
      height: 97,
      paddingTop: 24,
      paddingBottom: 38 + bottom,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderColor: "#D1D1D6",
      elevation: 0,
      shadowOpacity: 0,
    },
    default: {
      height: 97,
      paddingTop: 24,
      paddingBottom: 38 + bottom,
      backgroundColor: "#FFFFFF",
      borderTopWidth: 1,
      borderColor: "#D1D1D6",
      elevation: 0,
    },
  });
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
  const allowAnonymous = ["/view-list", "/gift-detail", "/purchase-success", "/profile-setup"].some((p) => pathname?.includes(p));
  if (!isSignedIn && !allowAnonymous) {
    const encoded = encodeURIComponent(returnTo);
    return <Redirect href={{ pathname: "/sign-in", params: { returnTo: encoded } }} />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#330065",
        tabBarInactiveTintColor: "#9BADB4",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: isDesktopWeb ? { display: "none" } : baseTabBarStyle, // Apply dynamic bottom padding here
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Image source={require("@/assets/images/home.svg")} style={{ width: 24, height: 24, tintColor: color }} contentFit="contain" />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Image source={require("@/assets/images/favourite.svg")} style={{ width: 24, height: 24, tintColor: color }} contentFit="contain" />,
        }}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 36,
                backgroundColor: "#330065",
                alignItems: "center",
                justifyContent: "center",
                shadowRadius: 8,
              }}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Image source={require("@/assets/images/global.svg")} style={{ width: 24, height: 24, tintColor: color }} contentFit="contain" />,
        }}
      />
      <Tabs.Screen
        name="wishlists"
        options={{
          title: "",
          tabBarIcon: ({ color }) => <Image source={require("@/assets/images/filter-mail-circle.svg")} style={{ width: 24, height: 24, tintColor: color }} contentFit="contain" />,
        }}
      />

      <Tabs.Screen name="(create-list)" options={{ href: null }} />
      <Tabs.Screen name="create-circle-step1" options={{ href: null }} />
      <Tabs.Screen name="create-circle-step2" options={{ href: null }} />
      <Tabs.Screen name="create-circle-step3" options={{ href: null }} />
      <Tabs.Screen name="create-circle-success" options={{ href: null }} />
      <Tabs.Screen name="view-circle" options={{ href: null }} />
      {/* Gift and List journey screens - hidden from tab bar but included in this navigator */}
      {/* <Tabs.Screen
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
      /> */}
      {/* <Tabs.Screen
        name="profile-setup"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      /> */}

      <Tabs.Screen
        name="add-gift"
        options={{
          href: null, // This hides it from the tab bar
          // Hide the TabBar entirely on this screen so fixed footers are not overlapped
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="view-list"
        options={{
          href: null, // Hide from tab bar
          tabBarStyle: { display: "none" },
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
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="purchase-success"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
