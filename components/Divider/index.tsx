import React from "react";
import { Text, View } from "react-native";
import { style } from "./style";

type Props = {
  marginVertical?: number;
  text?: string;
};

export function Divider({ text = "", marginVertical = 0 }: Props) {
  return (
    <View style={[style.container, { marginVertical }]}>
      <View style={style.dividerLine} />
      <Text style={style.text}>{text}</Text>
      <View style={style.dividerLine} />
    </View>
  );
}
