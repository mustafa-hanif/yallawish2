import { useAuth } from "@clerk/clerk-expo";
import React, { useEffect, useState } from "react";

import { Desktop } from "@/components/homepage/Desktop";
import { Mobile } from "@/components/homepage/Mobile";
import { useSegments } from "expo-router";
import { Dimensions, Platform, View } from "react-native";

const DESKTOP_BREAKPOINT = 1024;

export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;

  const { isSignedIn } = useAuth();
  const segments = useSegments();

  const [currentDevice, setCurrentDevice] = useState<string | null>(null);

  // Run once: detect device
  useEffect(() => {
    setCurrentDevice(isDesktop ? "desktop" : "mobile");
  }, []);

  // Avoid redirect loop
  useEffect(() => {
    // if (isSignedIn && !isDesktop) {
    //   router.replace("/(tabs)");
    // }
  }, [isSignedIn, isDesktop]);

  if (!currentDevice) return <View />;

  return currentDevice === "desktop" ? <Desktop /> : <Mobile />;
}
