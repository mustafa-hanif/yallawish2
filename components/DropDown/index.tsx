import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View, ViewStyle } from "react-native";
import { styles } from "./style";

type DropDownFieldVariant = "default" | "primary";

type DropDownFieldProps = {
  label?: string;
  labelStyling?: StyleSheet;
  inputStyling?: StyleSheet;
  variant?: DropDownFieldVariant;
  placeholder?: string;
  value?: string;
  onSelectOption: (value: string) => void;
  options: string[];
  icon?: React.ReactNode;
  placeholderTextColor?: string;
  error?: string[] | string | null;
  inputLabelContainerStyle?: ViewStyle;
};

export function DropDownField({ label, icon, placeholder = "Select", value, options, onSelectOption, error, inputLabelContainerStyle, placeholderTextColor = "#D1D1D6" }: DropDownFieldProps) {
  const [activeDropdown, setActiveDropdown] = useState(false);

  const toggleDropdown = () => setActiveDropdown((prev) => !prev);

  return (
    <Pressable style={styles.container} onPress={toggleDropdown}>
      <View style={styles.inputWrapper}>
        <View style={{ ...styles.labelContainer, ...inputLabelContainerStyle }}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.input, { color: value ? "#1C0335" : placeholderTextColor }]}>{value || placeholder}</Text>
        {icon && <View style={styles.rightIconContainer}>{icon}</View>}
        {activeDropdown && (
          <Modal transparent animationType="fade">
            <Pressable style={styles.backdrop} onPress={toggleDropdown} />
            <View style={[styles.sheetContainer]}>
              <Pressable onPress={toggleDropdown}>
                <View style={styles.sheetHandle} />
              </Pressable>
              <Text style={styles.sortSheetTitle}>{label}</Text>
              <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
                {options?.map((option, index) => (
                  <View key={option}>
                    {index !== 0 && <View style={styles.didYouBuyThisGiftSeparator} />}

                    <Pressable
                      onPress={() => {
                        onSelectOption(option);
                        setActiveDropdown(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          </Modal>
        )}
      </View>
      {error ? <>{Array.isArray(error) ? <>{error?.map((errorItem) => <Text style={styles.errorText}>{errorItem || ""}</Text>)}</> : <Text style={styles.errorText}>{error || ""}</Text>}</> : <></>}
    </Pressable>
  );
}
