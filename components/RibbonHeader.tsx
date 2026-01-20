import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import BottomSheet from "./ui/BottomSheet";

export interface RibbonHeaderProps {
  title: string;
  subtitle: string;
  occasion?: string;
}

export function RibbonHeader({ title, subtitle, occasion }: RibbonHeaderProps) {
  const [showSheet, setShowSheet] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 hidden,1 visible

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: showSheet ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showSheet, sheetAnim]);

  const translateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleToggleSheet = () => {
    setShowSheet((prev) => !prev);
  };

  const occasionColor: Record<string, string> = {
    birthday: "#FC0",
    wedding: "#FF3B30",
    "baby-shower": "#91DA93",
    graduation: "#32ADE6",
    "new-home": "#A2845E",
    retirement: "#FF9500",
    "no-occasion": "#4D4D4D",
    other: "#D1D1D6",
  };

  const occasionTextColor: Record<string, string> = {
    birthday: "#1C0335",
    wedding: "#FFFFFF",
    "baby-shower": "#1C0335",
    graduation: "#ffff",
    "new-home": "#ffff",
    retirement: "#1C0335",
    "no-occasion": "#ffff",
    other: "#1C0335",
  };

  const bgColor = occasionColor[String(occasion)?.toLocaleLowerCase()] || "#FFCC00";
  const textColor = occasionTextColor[String(occasion)?.toLocaleLowerCase()] || "#FFCC00";

  return (
    <>
      <View style={styles.container}>
        <Svg width={343} height={76} viewBox="0 0 343 76" style={styles.ribbonBackground}>
          <Path
            d="M342.941 75.9806H0C0.382014 74.9064 0.6171 74.0935 0.950139 73.3096C5.39718 62.7607 9.80504 52.1925 14.35 41.6824C15.2218 39.6597 15.1434 37.9565 14.3206 35.9531C9.73647 24.7752 5.25025 13.5393 0.744438 2.32268C0.489762 1.66459 0.342833 0.967783 0.0587715 0H343C342.109 2.30332 341.345 4.37438 340.522 6.43576C336.418 16.6943 332.274 26.9237 328.248 37.2113C327.866 38.1984 327.876 39.6017 328.278 40.5791C332.784 51.5441 337.407 62.451 341.991 73.387C342.295 74.1128 342.54 74.8677 342.951 76L342.941 75.9806Z"
            fill={bgColor}
          />
        </Svg>
        <Pressable style={styles.textContainer} onPress={handleToggleSheet}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.subtitle, { color: textColor }]}>
            {subtitle}
          </Text>
        </Pressable>
      </View>
      <BottomSheet isVisible={showSheet} onClose={handleToggleSheet} height={332}>
        <View style={styles.sheetContent}>
          <Text style={styles.sortSheetTitle}>{title}</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.subTitleModal}>
              {subtitle} {subtitle} {subtitle} {subtitle} {subtitle}
            </Text>
          </ScrollView>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 343,
    height: 76,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ribbonBackground: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  textContainer: {
    width: 309,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  title: {
    color: "#1C0335",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    lineHeight: 20,
    // width: "100%",
  },
  subtitle: {
    color: "#1C0335",
    textAlign: "center",
    fontFamily: "Nunito_300Light",
    fontSize: 16,
    lineHeight: 16,
    width: "100%",
  },

  sheetContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
  sortSheetTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    textAlign: "center",
    marginTop: 4,
  },

  subTitleModal: {
    color: "#1C0335",
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 16,
    width: "100%",
  },
});
