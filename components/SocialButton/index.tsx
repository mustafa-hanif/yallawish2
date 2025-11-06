import React from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";
import { style } from "./style";

type Props = {
  icon: ImageSourcePropType;
  onPress: () => void;
  label: string;
};
export function SocialButton({ onPress = () => {}, label = "", icon }: Props) {
  return (
    <Pressable onPress={onPress} style={style.mainContainer}>
      <View style={style.innerContainer}>
        {icon && (
          <View style={style.iconContainer}>
            <Image source={icon} />
          </View>
        )}
        <Text style={style.text}>{label}</Text>
      </View>
    </Pressable>
  );
}
