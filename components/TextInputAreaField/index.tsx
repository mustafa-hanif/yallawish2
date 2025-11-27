import React, { useEffect, useState } from "react";
import { Dimensions, Platform, Text, TextInput, View, ViewStyle } from "react-native";
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
  showCounter?: boolean;
  height?: number
  inputLabelContainerStyle?: ViewStyle
  descriptionLimit?: number | null
  // DESCRIPTION_LIMIT - description.length


};

export function TextInputAreaField({ icon, height = 160, label, variant = "default", placeholder, value, onChangeText, placeholderTextColor, showCounter = true, inputLabelContainerStyle, descriptionLimit = null }: TTextInputAreaFieldProps) {
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount((value ?? "").length);
  }, [value]);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <View style={styles.container}>
      <View style={{...styles.inputWrapper, height}}>
        <View style={{...styles.labelContainer, ...inputLabelContainerStyle}}>
          <Text style={styles.label}>{label}</Text>
        </View>
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}

        <TextInput multiline placeholderTextColor={placeholderTextColor} placeholder={placeholder} style={styles.input} value={value} onChangeText={onChangeText} />
        {showCounter ? (
          <>
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>{descriptionLimit? `${descriptionLimit} - ` : ""}{characterCount}</Text>
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}
