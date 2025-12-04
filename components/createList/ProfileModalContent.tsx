import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import styles from "@/styles/selectProfileStyles";
import { Image } from "react-native";
import { DateInputField } from "../DateInputField";
import { DropDownField } from "../DropDown";
import { PhoneInputField } from "../PhoneInputField";
import { TextInputField } from "../TextInputField";

export type DropdownKey = "gender" | "relation";
  const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type ProfileModalContentProps = {
  isDesktop: boolean;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  gender: string;
  relation: string;
  birthDate: Date | null;
  formattedBirthDate: string;
  allowEdit: boolean;
  submitError: string | null;
  formMessage: string | null;
  isSaving: boolean;
  activeDropdown: DropdownKey | null;
  genderOptions: string[];
  relationOptions: string[];
  onChangeFirstName: (value: string) => void;
  onChangeLastName: (value: string) => void;
  onOpenDatePicker: () => void;
  onToggleDropdown: (key: DropdownKey) => void;
  onSelectGender: (value: string) => void;
  onSelectRelation: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangeCountryCode: (value: string) => void;
  onChangePhoneNumber: (value: string) => void;
  onToggleAllowEdit: (value: boolean) => void;
  onCancel: () => void;
  onSave: (navigateNext: boolean) => void;
  isWebDatePickerOpen: boolean;
  onSelectDate: (value: Date | null) => void;
  onCloseWebDatePicker: () => void;
  onClearDate: () => void;
  setBirthDate?: () => void;
};

type WebDateChangeEvent = {
  target?: {
    value?: string | null;
  };
};

type WebSelectChangeEvent = {
  target?: {
    value?: string | null;
  };
};

const getWebSelectStyle = (hasValue: boolean): React.CSSProperties => ({
  width: "100%",
  height: "100%",
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontFamily: "Nunito, sans-serif",
  fontSize: 15,
  color: hasValue ? "#1C0335" : "#B1A6C4",
  paddingRight: "36px",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
});

export function ProfileModalContent({
  isDesktop,
  firstName,
  lastName,
  email,
  countryCode,
  phoneNumber,
  gender,
  relation,
  birthDate,
  formattedBirthDate,
  allowEdit,
  submitError,
  formMessage,
  isSaving,
  activeDropdown,
  genderOptions,
  relationOptions,
  onChangeFirstName,
  onChangeLastName,
  onOpenDatePicker,
  onToggleDropdown,
  onSelectGender,
  onSelectRelation,
  onChangeEmail,
  onChangeCountryCode,
  onChangePhoneNumber,
  onToggleAllowEdit,
  onCancel,
  onSave,
  isWebDatePickerOpen,
  onSelectDate,
  onCloseWebDatePicker,
  onClearDate,
  setBirthDate
}: ProfileModalContentProps) {
  const isWeb = Platform.OS === "web";
  const webTodayIso = useMemo(
    () => new Date().toISOString().split("T")[0] ?? "",
    [],
  );
  const webDateValue = useMemo(
    () => (birthDate ? birthDate.toISOString().split("T")[0] : ""),
    [birthDate],
  );
  const webDateInputStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      padding: "12px 16px",
      borderRadius: 14,
      border: "1px solid #E5E0EC",
      fontFamily: "Nunito, sans-serif",
      fontSize: 15,
      color: "#1C0335",
      outline: "none",
      boxSizing: "border-box",
      backgroundColor: "#FFFFFF",
    }),
    [],
  );

  const handleWebDateChange = (event: WebDateChangeEvent) => {
    const value = event.target?.value ?? "";
    if (!value) {
      onSelectDate(null);
      onCloseWebDatePicker();
      return;
    }
    const parsed = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      onSelectDate(parsed);
    }
    onCloseWebDatePicker();
  };

  const handleWebClear = () => {
    onClearDate();
    onCloseWebDatePicker();
  };

  const genderSelectStyle = useMemo(
    () => getWebSelectStyle(Boolean(gender)),
    [gender],
  );

  const relationSelectStyle = useMemo(
    () => getWebSelectStyle(Boolean(relation)),
    [relation],
  );

  const handleWebGenderChange = (event: WebSelectChangeEvent) => {
    onSelectGender(event.target?.value ?? "");
  };

  const handleWebRelationChange = (event: WebSelectChangeEvent) => {
    onSelectRelation(event.target?.value ?? "");
  };

  const updateFormDate = () => {
    
  }
  const renderDropdown = (
    options: string[],
    onSelect: (value: string) => void,
  ) => (
    <View style={styles.dropdown}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelect(option)}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownItemText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={[
        !isDesktop ? { height: SCREEN_HEIGHT * 0.7 } : {}, 
      // isDesktop
      //   ? styles.desktopModalScrollContainer
      //   : styles.mobileModalScrollContainer
    
    ]
      }
      contentContainerStyle={
        isDesktop ? styles.desktopModalScroll : styles.mobileModalScroll
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={isDesktop ? styles.modalTitleDesktop : styles.modalTitle}>
        {isDesktop ? "Create a profile for someone else" : `Create a profile for\nsomeone else`}
        
      </Text>
      <Text
        style={
          isDesktop ? styles.modalSubtitleDesktop : styles.modalSubtitle
        }
      >
        {isDesktop ? "Add a child, parent, partner, or even a pet — and build their gift list on their behalf." : `Add a child, parent, partner, or even a pet —\nand build their gift list on their behalf.`}
        
      </Text>

      <View
        style={[
          styles.fieldRow,
          isDesktop && styles.fieldRowDesktop,
          !isWeb && activeDropdown === "gender" && styles.dropdownRowRaised,
        ]}
      >
        {isDesktop ? 
        <>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={onChangeFirstName}
            placeholder="John"
            placeholderTextColor="#B1A6C4"
            style={[styles.input, isDesktop && styles.inputDesktop]}
          />
        </View>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={onChangeLastName}
            placeholder="Doe"
            placeholderTextColor="#B1A6C4"
            style={[styles.input, isDesktop && styles.inputDesktop]}
          />
        </View>
        </> : 
        <View style={{ rowGap: 40 }}>
          <TextInputField 
            label="First name"
            value={firstName}
            onChangeText={onChangeFirstName}
          />
           <TextInputField 
            label="Last name"
            value={lastName}
            onChangeText={onChangeLastName}
          />
        </View>}
      </View>

      <View style={[styles.fieldRow, isDesktop && styles.fieldRowDesktop]}>
        {isDesktop ? <>
          <View
          style={[
            styles.field,
            isDesktop && styles.fieldHalf,
            isWeb && isWebDatePickerOpen && styles.fieldDropdownActive,
            isDesktop && isWeb && isWebDatePickerOpen && styles.dropdownRowRaised,
          ]}
        >
          <Text style={styles.fieldLabel}>Date of birth</Text>
          <Pressable
            onPress={onOpenDatePicker}
            style={[styles.input, styles.inputPressable, isDesktop && styles.inputDesktop]}
          >
            <Text style={formattedBirthDate ? styles.inputValue : styles.inputPlaceholder}>
              {formattedBirthDate || "Select date"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#6F5F8F" />
          </Pressable>
          {isWeb && isWebDatePickerOpen ? (
            <View style={styles.webDatePicker}>
              <input
                type="date"
                value={webDateValue}
                onChange={handleWebDateChange}
                max={webTodayIso}
                style={webDateInputStyle}
              />
              <View style={styles.webDateActions}>
                <Pressable style={styles.webDateAction} onPress={handleWebClear}>
                  <Text style={styles.webDateActionText}>Clear</Text>
                </Pressable>
                <Pressable style={styles.webDateAction} onPress={onCloseWebDatePicker}>
                  <Text style={styles.webDateActionText}>Done</Text>
                </Pressable>
              </View>
            </View>
          ) : null}
        </View>
        </> : 
        <>
        <View style={{marginTop: 25 }}>
          <DateInputField 
            value={birthDate ? birthDate.toISOString().split("T")[0] : ""}
            onChange={(dateString) => {
              setBirthDate(dateString ? new Date(dateString) : null);
            }} 
            label="Date of birth" 
            placeholder=""
          
          />
        </View>
        
        </>}
        
        {isWeb ? (
          <View style={[styles.field, isDesktop && styles.fieldHalf]}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View
              style={[
                styles.webSelectWrapper,
                isDesktop && styles.webSelectWrapperDesktop,
              ]}
            >
              <select
                value={gender || ""}
                onChange={handleWebGenderChange}
                style={genderSelectStyle}
              >
                <option value="">Select</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </View>
          </View>
        ) : (
          <View style={{ marginTop:25 }}>
            <DropDownField 
              value={gender} 
              label="Gender" 
              options={genderOptions} 
              onSelectOption={onSelectGender}
              icon={<Image source={require("@/assets/images/chevrondown.png")}/>}
            />
          </View>
          // <View
          //   style={[
          //     styles.field,
          //     isDesktop && styles.fieldHalf,
          //     activeDropdown === "gender" && styles.fieldDropdownActive,
          //   ]}
          // >
          //   <Text style={styles.fieldLabel}>Gender</Text>
          //   <Pressable
          //     onPress={() => onToggleDropdown("gender")}
          //     style={[styles.input, styles.inputPressable, isDesktop && styles.inputDesktop]}
          //   >
          //     <Text style={gender ? styles.inputValue : styles.inputPlaceholder}>
          //       {gender || "Select"}
          //     </Text>
          //     <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
          //   </Pressable>
          //   {activeDropdown === "gender"
          //     ? renderDropdown(genderOptions, onSelectGender)
          //     : null}
          // </View>
        )}
      </View>

      <View style={[styles.fieldRow, isDesktop && styles.fieldRowDesktop]}>
        {isDesktop ? 
        <>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={onChangeEmail}
            placeholder="john.doe@mail.com"
            placeholderTextColor="#B1A6C4"
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, isDesktop && styles.inputDesktop]}
          />
        </View>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Mobile number (optional)</Text>
          <View style={styles.phoneRow}>
            <TextInput
              value={countryCode}
              onChangeText={onChangeCountryCode}
              placeholder="+971"
              placeholderTextColor="#B1A6C4"
              style={[styles.input, styles.countryInput, isDesktop && styles.inputDesktop]}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
              placeholder="521 123 456"
              placeholderTextColor="#B1A6C4"
              keyboardType="phone-pad"
              style={[styles.input, styles.phoneInput, isDesktop && styles.inputDesktop]}
            />
          </View>
        </View>
      
        </> : 
        <View style={{rowGap:40, marginTop: 25}}>
         <TextInputField 
            keyboardType="email-address"
            label="Email address"
            value={email}
            onChangeText={onChangeEmail}
          />
          <PhoneInputField 
            countryCodeValue={countryCode} 
            onChangeCountryCode={onChangeCountryCode}
            countryCodePlaceholder={"+971"}
            phoneNumberValue={phoneNumber}
            onChangePhoneNumber={onChangePhoneNumber}
            phoneNumberPlaceholder="521 123 456"
            label="Mobile number (optional)" 
          />
          {/* <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Mobile number (optional)</Text>
          <View style={styles.phoneRow}>
            <TextInput
              value={countryCode}
              onChangeText={onChangeCountryCode}
              placeholder="+971"
              placeholderTextColor="#B1A6C4"
              style={[styles.input, styles.countryInput, isDesktop && styles.inputDesktop]}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={onChangePhoneNumber}
              placeholder="521 123 456"
              placeholderTextColor="#B1A6C4"
              keyboardType="phone-pad"
              style={[styles.input, styles.phoneInput, isDesktop && styles.inputDesktop]}
            />
          </View>
        </View> */}
      </View>
      }
      </View>

      {isWeb ? (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Relation with this person (optional)</Text>
          <View
            style={[
              styles.webSelectWrapper,
              isDesktop && styles.webSelectWrapperDesktop,
            ]}
          >
            <select
              value={relation || ""}
              onChange={handleWebRelationChange}
              style={relationSelectStyle}
            >
              <option value="">Select</option>
              {relationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 25 }}>
          <DropDownField  icon={<Image source={require("@/assets/images/chevrondown.png")}/>} value={relation} label="Relation with this person (optional)" options={relationOptions} onSelectOption={onSelectRelation}/>
        </View>
   
      )}

      <View style={styles.toggleRow}>
        <View style={styles.toggleTexts}>
          <Text style={isDesktop ? styles.toggleTitle : styles.toggleTitleMobile}>Allow them to edit</Text>
          {isDesktop ? 
          <Text style={styles.toggleSubtitle}>
            They can add or update items on this list.
          </Text> : null}
          
        </View>
        <Switch
          value={allowEdit}
          onValueChange={onToggleAllowEdit}
          trackColor={{ false: "#D9D3E5", true: "#22C55E" }}
          thumbColor="#FFFFFF"
        />
      </View>

      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      {formMessage ? <Text style={styles.successText}>{formMessage}</Text> : null}

      <View
        style={[
          styles.modalButtonRow,
          isDesktop && styles.modalButtonRowDesktop,
        ]}
      >
        <Pressable
          style={[isDesktop?  styles.secondaryButton : styles.secondaryButtonMobile, isSaving && styles.buttonDisabled]}
          onPress={onCancel}
          disabled={isSaving}
        >
          <Text style={isDesktop?  styles.secondaryButtonText: styles.secondaryButtonTextMobile}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[isDesktop? styles.primaryButton : styles.primaryButtonMobile, isSaving && styles.buttonDisabled]}
          onPress={() => onSave(true)}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isDesktop? "Save & Continue" : "Save profile"}
              
            </Text>
          )}
        </Pressable>

       <Pressable
          style={[isDesktop?  styles.secondaryButton : styles.secondaryButtonMobile, isSaving && styles.buttonDisabled]}
           onPress={() => onSave(false)}
          disabled={isSaving}
        >
          <View style={{flexDirection:'row', gap:13, justifyContent:'center'}}>
            <Ionicons name="add" size={22} color="#3B0076" />
            <Text style={isDesktop?  styles.secondaryButtonText: styles.secondaryButtonTextMobile}>
              {isDesktop ? "Save & add another" : "Add another profile"}
            </Text>
          </View>
        </Pressable>
      </View>
      
    </ScrollView>
  );
}
