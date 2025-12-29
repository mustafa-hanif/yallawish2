import React from "react";
import {
  Dimensions,
  Platform,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
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
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  error?: string[] | string | null;
  inputLabelContainerStyle?: ViewStyle;
};

export function TextInputField({
  icon,
  label,
  autoCorrect,
  autoCapitalize,
  variant = "default",
  keyboardType,
  placeholder,
  value,
  onChangeText,
  placeholderTextColor = "#D1D1D6",
  error,
  inputLabelContainerStyle,
}: TextInputFieldProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={{ ...styles.labelContainer, ...inputLabelContainerStyle }}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <TextInput
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, icon ? { paddingRight: 50 } : undefined]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
        />
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}
      </View>
      {error ? (
        <>
          {Array.isArray(error) ? (
            <>
              {error?.map((errorItem) => (
                <Text style={styles.errorText}>{errorItem || ""}</Text>
              ))}
            </>
          ) : (
            <Text style={styles.errorText}>{error || ""}</Text>
          )}
        </>
      ) : (
        <></>
      )}
    </View>
  );
}
