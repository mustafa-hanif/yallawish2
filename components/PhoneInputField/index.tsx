import React from "react";
import { Dimensions, Platform, Text, TextInput, View } from "react-native";
import { styles } from "./style";

type PhoneInputFieldProps = {
  label?: string;
  value?: string;
  onChangeCountryCode?: (text: string) => void;
  onChangePhoneNumber?: (text: string) => void;
  countryCodeValue?: string;
  phoneNumberValue?: string;
  countryCodePlaceholder?: string;
  phoneNumberPlaceholder?: string;
};

export function PhoneInputField({ label, countryCodeValue, onChangeCountryCode, phoneNumberValue, onChangePhoneNumber, countryCodePlaceholder, phoneNumberPlaceholder, error = [] }: PhoneInputFieldProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <View style={{ ...styles.labelContainer }}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.inputContainer}>
          <View>
            <TextInput maxLength={3} style={styles.countryInput} value={countryCodeValue} onChangeText={onChangeCountryCode} placeholder={countryCodePlaceholder} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputFieldDivider} />
          <View>
            <TextInput maxLength={11} style={styles.input} value={phoneNumberValue} onChangeText={onChangePhoneNumber} placeholder={phoneNumberPlaceholder} keyboardType="phone-pad" />
          </View>
        </View>
      </View>
    </View>
  );
}
