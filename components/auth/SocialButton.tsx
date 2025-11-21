import React from "react";
import { Dimensions, Platform, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import Ripple from "react-native-material-ripple";

type SocialButtonVariant = "default" | "primary" | "icon";

type SocialButtonProps = {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  variant?: SocialButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

const rippleRipple: Record<SocialButtonVariant, string> = {
  default: "#3B0076",
  primary: "#0000",
  icon: "#3B0076",
};

export function SocialButton({ icon, label, onPress, variant = "default", style, textStyle, accessibilityLabel }: SocialButtonProps) {
  const isIconOnly = variant === "icon";

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <Ripple onPress={onPress}  rippleColor={rippleRipple[variant]} rippleDuration={900} accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? label} style={[[styles.base, !isDesktop ? styles.baseMobile : {}], styles[`button_${variant}`], style]}>
      {isIconOnly ? (
        <View style={styles.iconOnly}>{icon}</View>
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          {label ? <Text style={[styles.label, styles[`label_${variant}`], textStyle]}>{label}</Text> : null}
        </View>
      )}
    </Ripple>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    overflow: "hidden",
  },
  baseMobile: { borderRadius: 8 },
  pressed: {
    opacity: 0.85,
  },
  button_default: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  button_primary: {
    backgroundColor: "#03FFEE",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  button_icon: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.65)",
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    width: "100%",
    minHeight: 24,
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  iconOnly: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  label_default: {
    fontSize: 16,
    color: "#3B0076",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
  label_primary: {
    fontSize: 16,
    color: "#330065",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
  label_icon: {
    color: "#FFFFFF",
  },
});
