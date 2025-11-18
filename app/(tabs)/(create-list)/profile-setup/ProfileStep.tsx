import { profileSetupStyles as styles } from "@/styles/profileSetupStyles";
import { Ionicons } from "@expo/vector-icons";
import { allCountries } from "country-telephone-data";
import { Image } from "expo-image";
import React, { useMemo } from "react";
import { ActivityIndicator, Platform, Pressable, Text, TextInput, View } from "react-native";
import { GENDER_OPTIONS } from "./constants";

// Convert ISO2 country code to flag emoji
const getCountryFlag = (iso2: string): string => {
  if (!iso2 || iso2.length !== 2) return "";
  const codePoints = iso2
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

type ProfileStepProps = {
  variant: "desktop" | "mobile";
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: Date | null;
  location: string;
  profileImagePreview?: string;
  profileImageUploading: boolean;
  isSubmitting: boolean;
  initials: string;
  formattedDateOfBirth: string;
  activeDropdown: "gender" | "countryCode" | null;
  isWebDatePickerOpen: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPickProfileImage: () => void;
  onOpenDatePicker: () => void;
  onCloseDatePicker: () => void;
  onDateConfirm: (date: Date) => void;
  onWebDateChange: (event: any) => void;
  onClearDate: () => void;
  onToggleGenderDropdown: () => void;
  onSelectGender: (value: string) => void;
  onToggleCountryCodeDropdown: () => void;
  onSelectCountryCode: (value: string) => void;
  renderGenderDropdown: () => React.ReactNode;
  renderCountryCodeDropdown: () => React.ReactNode;
};

export function ProfileStep({
  variant,
  firstName,
  lastName,
  email,
  phoneCountryCode,
  phoneNumber,
  gender,
  dateOfBirth,
  location,
  profileImagePreview,
  profileImageUploading,
  isSubmitting,
  initials,
  formattedDateOfBirth,
  activeDropdown,
  isWebDatePickerOpen,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneCountryCodeChange,
  onPhoneNumberChange,
  onGenderChange,
  onLocationChange,
  onPickProfileImage,
  onOpenDatePicker,
  onCloseDatePicker,
  onDateConfirm,
  onWebDateChange,
  onClearDate,
  onToggleGenderDropdown,
  onSelectGender,
  onToggleCountryCodeDropdown,
  onSelectCountryCode,
  renderGenderDropdown,
  renderCountryCodeDropdown,
}: ProfileStepProps) {
  const SECONDARY_PURPLE = "#4B0082";

  const countries = useMemo(() => {
    const uaeIndex = allCountries.findIndex((c: any) => c.iso2?.toLowerCase() === "ae");
    const uae = uaeIndex >= 0 ? allCountries[uaeIndex] : null;
    const otherCountries = allCountries.filter((c: any) => c.iso2?.toLowerCase() !== "ae");
    return uae ? [uae, ...otherCountries] : allCountries;
  }, []);

  const selectedCountry = useMemo(() => {
    const codeWithoutPlus = phoneCountryCode.replace("+", "");
    return countries.find((c: any) => c.dialCode === codeWithoutPlus || `+${c.dialCode}` === phoneCountryCode);
  }, [countries, phoneCountryCode]);

  const displayCountryCode = useMemo(() => {
    if (!selectedCountry) {
      const defaultCode = phoneCountryCode || "+971";
      const defaultCountry = countries.find((c: any) => c.dialCode === defaultCode.replace("+", ""));
      if (defaultCountry) {
        return `${getCountryFlag(defaultCountry.iso2)} +${defaultCountry.dialCode}`;
      }
      return defaultCode;
    }
    return `${getCountryFlag(selectedCountry.iso2)} +${selectedCountry.dialCode}`;
  }, [selectedCountry, phoneCountryCode, countries]);

  if (variant === "desktop") {
    return (
      <>
        <View style={styles.desktopHeadingRow}>
          <View style={styles.avatarCircle}>
            {profileImagePreview ? (
              <Image source={{ uri: profileImagePreview }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>
          <Pressable
            style={[styles.uploadButton, (profileImageUploading || isSubmitting) && styles.uploadButtonDisabled]}
            onPress={onPickProfileImage}
            accessibilityRole="button"
            disabled={profileImageUploading || isSubmitting}
          >
            {profileImageUploading ? (
              <ActivityIndicator color={SECONDARY_PURPLE} />
            ) : (
              <Text style={styles.uploadButtonText}>
                {profileImagePreview ? "Change picture" : "Upload picture"}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.desktopFormRow}>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>First name</Text>
            <TextInput
              value={firstName}
              onChangeText={onFirstNameChange}
              placeholder="First name"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={styles.desktopInput}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>Last name</Text>
            <TextInput
              value={lastName}
              onChangeText={onLastNameChange}
              placeholder="Last name"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={styles.desktopInput}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={{...styles.desktopFormRow, zIndex: 1}}>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={onEmailChange}
              placeholder="you@example.com"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={styles.desktopInput}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>WhatsApp number (optional)</Text>
            <View style={styles.inlineFieldRow}>
              <View style={[activeDropdown === "countryCode" && styles.fieldDropdownActive, { position: "relative", overflow: "visible" as any }]}>
                <Pressable
                  onPress={onToggleCountryCodeDropdown}
                  style={[styles.desktopInput, styles.inputPressable, styles.countryCodeBox]}
                >
                  <Text style={phoneCountryCode ? styles.inputValue : styles.inputPlaceholder}>
                    {displayCountryCode}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
                </Pressable>
                {activeDropdown === "countryCode" ? renderCountryCodeDropdown() : null}
              </View>
              <TextInput
                value={phoneNumber}
                onChangeText={onPhoneNumberChange}
                placeholder="521 123 456"
                placeholderTextColor="rgba(28, 3, 53, 0.35)"
                style={[styles.desktopInput, { flex: 1 }]}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.desktopFormRow}>
          <View style={[styles.desktopField, Platform.OS === "web" ? {} : activeDropdown === "gender" && styles.fieldDropdownActive]}>
            <Text style={styles.fieldLabel}>Gender</Text>
            {Platform.OS === "web" ? (
              <View style={styles.webSelectWrapper}>
                <select
                  value={gender || ""}
                  onChange={(e) => onSelectGender(e.target.value)}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 12,
                    border: "1.5px solid #DDD7E4",
                    paddingLeft: 16,
                    paddingRight: 16,
                    fontFamily: "Nunito_500Medium, Nunito, sans-serif",
                    fontSize: 16,
                    color: "#1C0335",
                    backgroundColor: "#FBFAFF",
                    outline: "none",
                  } as React.CSSProperties}
                >
                  <option value="">Select</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </View>
            ) : (
              <>
                <Pressable onPress={onToggleGenderDropdown} style={[styles.desktopInput, styles.inputPressable]}>
                  <Text style={gender ? styles.inputValue : styles.inputPlaceholder}>{gender || "Select"}</Text>
                  <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
                </Pressable>
                {activeDropdown === "gender" ? renderGenderDropdown() : null}
              </>
            )}
          </View>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>Date of birth</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                value={dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""}
                onChange={onWebDateChange}
                max={new Date().toISOString().split("T")[0]}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "#DDD7E4",
                  paddingLeft: 16,
                  paddingRight: 16,
                  fontFamily: "Nunito_500Medium, Nunito, sans-serif",
                  fontSize: 16,
                  color: "#1C0335",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#FBFAFF",
                }}
              />
            ) : (
              <Pressable onPress={onOpenDatePicker} style={[styles.desktopInput, styles.inputPressable]}>
                <Text style={formattedDateOfBirth ? styles.inputValue : styles.inputPlaceholder}>
                  {formattedDateOfBirth || "DD/MM/YYYY"}
                </Text>
                <Ionicons name="calendar-outline" size={18} color="#6F5F8F" />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.desktopFormRow}>
          <View style={styles.desktopField}>
            <Text style={styles.fieldLabel}>Location (optional)</Text>
            <TextInput
              value={location}
              onChangeText={onLocationChange}
              placeholder="e.g. Dubai"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={styles.desktopInput}
              autoCapitalize="words"
            />
          </View>
        </View>
      </>
    );
  }

  return (
    <>
      <View style={styles.mobileCard}>
        <View style={styles.mobileAvatarRow}>
          <View style={styles.avatarCircle}>
            {profileImagePreview ? (
              <Image source={{ uri: profileImagePreview }} style={styles.avatarImage} contentFit="cover" />
            ) : (
              <Text style={styles.avatarInitials}>{initials}</Text>
            )}
          </View>
          <Pressable
            style={[styles.uploadButton, (profileImageUploading || isSubmitting) && styles.uploadButtonDisabled]}
            onPress={onPickProfileImage}
            disabled={profileImageUploading || isSubmitting}
          >
            {profileImageUploading ? (
              <ActivityIndicator color={SECONDARY_PURPLE} />
            ) : (
              <Text style={styles.uploadButtonText}>
                {profileImagePreview ? "Change picture" : "Upload picture"}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={onFirstNameChange}
            placeholder="First name"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={onLastNameChange}
            placeholder="Last name"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={onEmailChange}
            placeholder="you@example.com"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>WhatsApp number (optional)</Text>
          <View style={styles.inlineFieldRow}>
            <View style={[activeDropdown === "countryCode" && styles.fieldDropdownActive, { width: 140, overflow: "visible" as any }]}>
              <Pressable
                onPress={onToggleCountryCodeDropdown}
                style={[styles.mobileInput, styles.inputPressable, styles.countryCodeBox]}
              >
                <Text style={phoneCountryCode ? styles.inputValue : styles.inputPlaceholder}>
                  {displayCountryCode}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
              </Pressable>
              {activeDropdown === "countryCode" ? renderCountryCodeDropdown() : null}
            </View>
            <TextInput
              value={phoneNumber}
              onChangeText={onPhoneNumberChange}
              placeholder="521 123 456"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={[styles.mobileInput, { flex: 1 }]}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={[styles.mobileFieldBlock, activeDropdown === "gender" && styles.fieldDropdownActive]}>
          <Text style={styles.fieldLabel}>Gender</Text>
          {Platform.OS === "web" ? (
            <View style={styles.webSelectWrapper}>
              <select
                value={gender || ""}
                onChange={(e) => onSelectGender(e.target.value)}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  border: "1.5px solid #DDD7E4",
                  paddingLeft: 16,
                  paddingRight: 16,
                  fontFamily: "Nunito_500Medium, Nunito, sans-serif",
                  fontSize: 16,
                  color: "#1C0335",
                  backgroundColor: "#FBFAFF",
                  outline: "none",
                } as React.CSSProperties}
              >
                <option value="">Select</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </View>
          ) : (
            <>
              <Pressable onPress={onToggleGenderDropdown} style={[styles.mobileInput, styles.inputPressable]}>
                <Text style={gender ? styles.inputValue : styles.inputPlaceholder}>{gender || "Select"}</Text>
                <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
              </Pressable>
              {activeDropdown === "gender" ? renderGenderDropdown() : null}
            </>
          )}
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Date of birth</Text>
          {Platform.OS === "web" ? (
            <input
              type="date"
              value={dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : ""}
              onChange={onWebDateChange}
              max={new Date().toISOString().split("T")[0]}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                borderWidth: 1.5,
                borderStyle: "solid",
                borderColor: "#DDD7E4",
                paddingLeft: 16,
                paddingRight: 16,
                fontFamily: "Nunito_500Medium, Nunito, sans-serif",
                fontSize: 16,
                color: "#1C0335",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "#FBFAFF",
              }}
            />
          ) : (
            <Pressable onPress={onOpenDatePicker} style={[styles.mobileInput, styles.inputPressable]}>
              <Text style={formattedDateOfBirth ? styles.inputValue : styles.inputPlaceholder}>
                {formattedDateOfBirth || "DD/MM/YYYY"}
              </Text>
              <Ionicons name="calendar-outline" size={18} color="#6F5F8F" />
            </Pressable>
          )}
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Location (optional)</Text>
          <TextInput
            value={location}
            onChangeText={onLocationChange}
            placeholder="e.g. Dubai"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="words"
          />
        </View>
      </View>
    </>
  );
}

