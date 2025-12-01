import { useAuth } from "@clerk/clerk-expo";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { Desktop } from "@/components/homepage/Desktop";
import { Mobile } from "@/components/homepage/Mobile";
import { router } from "expo-router";
import { Dimensions, Platform, View } from "react-native";

const DESKTOP_BREAKPOINT = 1024;

export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;
  const { isSignedIn } = useAuth();
  const [currentDevice, setCurrentDevice] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (isDesktop) {
      setCurrentDevice("desktop");
    } else {
      setCurrentDevice("mobile");
    }
  }, []);

  useEffect(() => {
    if (isSignedIn && !isDesktop) router.replace("/(tabs)");
  }, [router, isDesktop]);

  if (currentDevice) {
    if (currentDevice === "desktop") return <Desktop />;
    else return <Mobile />;
  } else return <View />;
}
