import { Desktop } from "@/components/homepage/Desktop";
import { Mobile } from "@/components/homepage/Mobile";
import React from "react";

import { Dimensions, Platform } from "react-native";

const DESKTOP_BREAKPOINT = 1024;

export default function HomeScreen() {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;

  if (isDesktop) {
    return <Desktop />;
  }
  return <Mobile />;
}
