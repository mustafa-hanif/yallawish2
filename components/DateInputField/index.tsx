import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, Platform, Pressable, Text, View, ViewStyle } from "react-native";

import DatePicker from "@amjed-bouhouch/react-native-ui-datepicker";

import { styles } from "./style";

type DateInputFieldVariant = "default" | "primary";

type DateInputFieldVariantProps = {
  label?: string;
  value?: string;
  onChange?: (date: string) => void;
  variant?: DateInputFieldVariant;
  placeholder?: string;
  placeholderTextColor?: string;
  error?: string[] | string | null;
  inputLabelContainerStyle?: ViewStyle;
};

export function DateInputField({ label, value, onChange, variant = "default", placeholder = "Select a date", placeholderTextColor = "#D1D1D6", error, inputLabelContainerStyle }: DateInputFieldVariantProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  
  useEffect(() => {
    // Reset the date picker visibility when the component is unmounted
    return () => handleCloseModal()
  }, []);
  
  const handleDateConfirm = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD
    if (onChange) onChange(formattedDate); // Notify parent about the change  
  };

  const handleDatePickerVisibility = () => {
    if (Platform.OS === "web") {
      try {
        const input = document.createElement("input");
        input.type = "date";
        input.value = value || ""; // Use passed value prop
        input.style.position = "fixed";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";
        document.body.appendChild(input);

        input.onchange = () => {
          const selectedDate = input.value;
          if (selectedDate && onChange) {
            onChange(selectedDate); // Notify parent about the selected date
          }
          cleanup();
        };

        const cleanup = () => {
          input.onchange = null;
          if (input.parentNode) input.parentNode.removeChild(input);
        };

        if (typeof (input as any).showPicker === "function") {
          (input as any).showPicker(); // Show the native date picker if available
        } else {
          input.click(); // Otherwise, trigger the click to open the date picker
        }
      } catch {
        setDatePickerVisible(true); // Fallback to modal picker if error occurs
      }
    } else {
      setDatePickerVisible(true); // For mobile devices, show the modal picker
    }
  };
  
  const handleCloseModal = () => {
     setDatePickerVisible(false);
  }
  


  const getSafeDate = (val?: string): Date => {
  if (!val) return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
};

  return (
    <Pressable style={styles.container} onPress={handleDatePickerVisibility}>
      <View style={styles.inputWrapper}>
        <View style={{ ...styles.labelContainer, ...inputLabelContainerStyle }}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.input, { color: value ? "#1C0335" : placeholderTextColor }]}>{value || placeholder}</Text>
        <View style={styles.rightIconContainer}>
          <Image source={require("@/assets/images/calendarIcon.png")} />
        </View>
      </View>

      {error ? <>{Array.isArray(error) ? <>{error?.map((errorItem) => <Text style={styles.errorText}>{errorItem || ""}</Text>)}</> : <Text style={styles.errorText}>{error || ""}</Text>}</> : <></>}
      {isDatePickerVisible && (
        <Modal transparent animationType="fade">
          <Pressable onPress={handleCloseModal} style={styles.modalBackdrop} >
            <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 16 }}>
              <DatePicker
                mode="single"
                date={getSafeDate(value)}
                onChange={(params: any) => {
                  const d = params.date;
                  if (d) {
                    const dateObj = new Date(d); // Ensure it's a Date object
                    const year = dateObj.getFullYear();
                    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const day = String(dateObj.getDate()).padStart(2, "0");
                    const formatted = `${year}-${month}-${day}`;
                    onChange?.(formatted);
                  }
                  setDatePickerVisible(false);
                }}
                headerContainerStyle={styles.calendarHeader}
                headerTextStyle={styles.calendarHeaderTextStyle}
                headerButtonColor="#1C0335"
                headerButtonSize={20}
                weekDaysTextStyle={styles.weekDaysTextStyle}
                dayContainerStyle={styles.calendarDayContainerStyle}
                calendarTextStyle={styles.calendarTextStyle}
                selectedItemColor="#330065"
              />
            </View>
          </Pressable>
        </Modal>
      )}

      {/* {Platform.OS !== "web" && <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleDateConfirm} onCancel={() => setDatePickerVisible(false)} display={Platform.OS === "ios" ? "inline" : "default"} />} */}
    </Pressable>
  );
}
