import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

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

  const handleToggleSheet = () =>
    subtitle?.length > 35 && setShowSheet((prev) => !prev);

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

  // Determine if color is dark
  const isColorDark = (hexColor: string): boolean => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const bgColor =
    occasionColor[String(occasion)?.toLocaleLowerCase()] || "#FFCC00";
  const textColor = isColorDark(bgColor) ? "#FFFFFF" : "#1C0335";

  return (
    <>
      <View style={styles.container}>
        <Svg
          width={343}
          height={76}
          viewBox="0 0 343 76"
          style={styles.ribbonBackground}
        >
          <Path
            d="M342.941 75.9806H0C0.382014 74.9064 0.6171 74.0935 0.950139 73.3096C5.39718 62.7607 9.80504 52.1925 14.35 41.6824C15.2218 39.6597 15.1434 37.9565 14.3206 35.9531C9.73647 24.7752 5.25025 13.5393 0.744438 2.32268C0.489762 1.66459 0.342833 0.967783 0.0587715 0H343C342.109 2.30332 341.345 4.37438 340.522 6.43576C336.418 16.6943 332.274 26.9237 328.248 37.2113C327.866 38.1984 327.876 39.6017 328.278 40.5791C332.784 51.5441 337.407 62.451 341.991 73.387C342.295 74.1128 342.54 74.8677 342.951 76L342.941 75.9806Z"
            fill={bgColor}
          />
        </Svg>
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: textColor }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            onPress={handleToggleSheet}
            ellipsizeMode="tail"
            numberOfLines={1}
            style={[styles.subtitle, { color: textColor }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Modal
        visible={showSheet}
        transparent
        animationType="none"
        onRequestClose={handleToggleSheet}
      >
        <Pressable style={styles.backdrop} onPress={handleToggleSheet} />
        <Animated.View
          style={[styles.sheetContainer, { transform: [{ translateY }] }]}
        >
          <Pressable onPress={handleToggleSheet}>
            <View style={styles.sheetHandle} />
          </Pressable>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sortSheetTitle}>Event Description</Text>
            <Text style={styles.subTitleModal}>{subtitle}</Text>
          </ScrollView>
        </Animated.View>
      </Modal>
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

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "92%",
    backgroundColor: "#F5F4F8",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 8,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C8C7CC",
    marginTop: 8,
    marginBottom: 16,
  },
  sheetContent: { paddingHorizontal: 16, paddingBottom: 60, gap: 20 },
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
