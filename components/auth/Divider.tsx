import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type DividerTone = "light" | "card";

type DividerProps = {
  text?: string;
  tone?: DividerTone;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  marginVertical?: number
};

export function Divider({
  text = "OR",
  tone = "light",
  marginVertical = 16,
  style,
  textStyle,
}: DividerProps) {
  return (
    <View style={[styles.container, { marginVertical } , style]}>
      <View style={[styles.line, tone === "card" && styles.lineCard]} />
      <Text style={[styles.text, tone === "card" && styles.textCard, textStyle]}>
        {text}
      </Text>
      <View style={[styles.line, tone === "card" && styles.lineCard]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  lineCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  text: {
    marginHorizontal: 14,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 0.4,
  },
  textCard: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
  },
});
