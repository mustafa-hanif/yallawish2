import React from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import { styles } from "./style";

type TextInputFieldVariant = "default" | "primary";

type TextInputFieldProps = {
  label?: string;
  labelStyling?: StyleSheet;
  inputStyling?: StyleSheet;
  variant?: TextInputFieldVariant;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: React.ReactNode;
  placeholderTextColor?: string;

};

export function TextInputField({ icon, label, variant = "default", placeholder, value, onChangeText ,  placeholderTextColor = '#D1D1D6' }: TextInputFieldProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}

        <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={placeholderTextColor}/>
      </View>
    </View>
  );
}
