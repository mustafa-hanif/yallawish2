import { Eye, EyeOff } from "lucide-react-native";
import React from "react";
import { Dimensions, Platform, Pressable, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { styles } from "./style";

type TextInputFieldVariant = "default" | "primary" | "password";

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
  disabled?: boolean;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
  editable?: boolean;
  maxLength?: number;
  hint?: string;
  showCounter?: boolean;
  descriptionLimit?: number;
  characterCount?: number;
};

export function TextInputField({ icon, label, autoCorrect, autoCapitalize, variant = "default", keyboardType, placeholder, value, onChangeText, placeholderTextColor = "#D1D1D6", error, inputLabelContainerStyle, containerStyle, secureTextEntry = false, maxLength, hint, editable = true, showCounter = false, descriptionLimit, characterCount = 0 }: TextInputFieldProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  const [isSecureEntry, setIsSecureEntry] = React.useState(secureTextEntry);

  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      <View style={styles.inputWrapper}>
        {label && (
          <View style={{ ...styles.labelContainer, ...inputLabelContainerStyle }}>
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
        <TextInput secureTextEntry={isSecureEntry} autoCorrect={autoCorrect} keyboardType={keyboardType} autoCapitalize={autoCapitalize} style={[styles.input, icon ? { paddingRight: 50 } : undefined]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={placeholderTextColor} editable={editable} maxLength={maxLength} />
        {variant === "password" && (
          <Pressable onPress={() => setIsSecureEntry(!isSecureEntry)} style={styles.rightIconContainer}>
            {isSecureEntry ? <Eye /> : <EyeOff />}
          </Pressable>
        )}
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}
      </View>
      {hint && (
        <View>
          <Text style={styles.hintText}>{hint}</Text>
        </View>
      )}
      {showCounter ? (
        <>
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {characterCount}
              {descriptionLimit ? `/${descriptionLimit}` : ""}
            </Text>
          </View>
        </>
      ) : null}
      {error ? <>{Array.isArray(error) ? <>{error?.map((errorItem) => <Text style={styles.errorText}>{errorItem || ""}</Text>)}</> : <Text style={styles.errorText}>{error || ""}</Text>}</> : <></>}
    </View>
  );
}
