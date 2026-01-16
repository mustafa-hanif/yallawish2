import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useLayoutEffect, useState } from "react";

import { Desktop } from "@/components/homepage/Desktop";
import { Mobile } from "@/components/homepage/Mobile";
import { Redirect } from "expo-router";
import { Dimensions, Platform, View } from "react-native";

const DESKTOP_BREAKPOINT = 1024;

export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [currentDevice, setCurrentDevice] = useState<string | null>(null);
  const { isLoaded: isUserLoaded } = useUser();

  useLayoutEffect(() => {
    if (isDesktop) {
      setCurrentDevice("desktop");
    } else {
      setCurrentDevice("mobile");
    }
  }, [isDesktop]);

  if (!isAuthLoaded || !isUserLoaded || !currentDevice) {
    return <View />;
  }

  if (!isDesktop) {
    if (!isSignedIn) {
      return <Redirect href="/sign-in" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  }

  if (currentDevice === "desktop") {
    return <Desktop />;
  }

  return <Mobile />;
}
