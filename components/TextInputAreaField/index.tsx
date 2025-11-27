import React, { useEffect, useState } from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import { styles } from "./style";

type TTextInputAreaFieldVariant = "default" | "primary";

type TTextInputAreaFieldProps = {
  label?: string;
  labelStyling?: StyleSheet;
  inputStyling?: StyleSheet;
  variant?: TTextInputAreaFieldVariant;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: React.ReactNode;
  placeholderTextColor?: string;
};

export function TextInputAreaField({ icon, label, variant = "default", placeholder, value, onChangeText, placeholderTextColor }: TTextInputAreaFieldProps) {
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount((value ?? "").length);
  }, [value]);
  
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}

        <TextInput multiline placeholderTextColor={placeholderTextColor} placeholder={placeholder} style={styles.input} value={value} onChangeText={onChangeText} />
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>{characterCount}</Text>
        </View>
      </View>
    </View>
  );
}
