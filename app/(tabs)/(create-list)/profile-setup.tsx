import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { useColorScheme } from "@/hooks/useColorScheme";
import { profileSetupStyles as styles } from "@/styles/profileSetupStyles";
import { useUser } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { allCountries } from "country-telephone-data";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  useWindowDimensions
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GENDER_OPTIONS, PersonaChoice } from "./profile-setup/constants";
import { ExperienceSettingsStep } from "./profile-setup/ExperienceSettingsStep";
import { FavoriteStoresStep } from "./profile-setup/FavoriteStoresStep";
import { GiftPreferencesStep } from "./profile-setup/GiftPreferencesStep";
import { ProfileStep } from "./profile-setup/ProfileStep";

const PRIMARY_PURPLE = "#330065";
const SECONDARY_PURPLE = "#4B0082";
const ACCENT_TEAL = "#03FFEE";

const DESKTOP_BREAKPOINT = 1024;

type StepStatus = "current" | "upcoming" | "complete";

type SetupStep = "profile" | "preferences" | "stores" | "experience";

const STEPS: { id: SetupStep; label: string }[] = [
  { id: "profile", label: "Profile Details" },
  { id: "preferences", label: "Gift Preferences" },
  { id: "stores", label: "Favorite Stores" },
  { id: "experience", label: "Experience Settings" },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];
  const { user, isLoaded } = useUser();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  const upsertUserProfile = useMutation(api.products.upsertUserProfile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isWebDatePickerOpen, setWebDatePickerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"gender" | "countryCode" | null>(null);
  const [persona, setPersona] = useState<PersonaChoice>("giftee");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [shareUpdates, setShareUpdates] = useState(true);
  const [giftInterests, setGiftInterests] = useState<string[]>([]);
  const [giftShoppingStyle, setGiftShoppingStyle] = useState<string | null>(null);
  const [giftBudgetRange, setGiftBudgetRange] = useState<string | null>(null);
  const [giftDiscoveryChannels, setGiftDiscoveryChannels] = useState<string[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<string[]>([]);
  const [customStoreInput, setCustomStoreInput] = useState("");
  const [reminderOptIn, setReminderOptIn] = useState(true);
  const [aiIdeasOptIn, setAiIdeasOptIn] = useState(true);
  const [communityUpdatesOptIn, setCommunityUpdatesOptIn] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState<string | undefined>(undefined);
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const metadata = user?.unsafeMetadata ?? {};
    const savedPersona = metadata?.persona as PersonaChoice | undefined;
    const savedOccasions = Array.isArray(metadata?.giftOccasions)
      ? (metadata.giftOccasions as string[])
      : [];
    const savedUpdates =
      typeof metadata?.shareUpdates === "boolean"
        ? (metadata.shareUpdates as boolean)
        : true;

    const metadataFirst = typeof metadata?.firstName === "string" ? (metadata.firstName as string) : undefined;
    const metadataLast = typeof metadata?.lastName === "string" ? (metadata.lastName as string) : undefined;
    const metadataEmail = typeof metadata?.contactEmail === "string" ? (metadata.contactEmail as string) : undefined;
    const metadataPhoneCode = typeof metadata?.phoneCountryCode === "string" ? (metadata.phoneCountryCode as string) : undefined;
    const metadataPhone = typeof metadata?.phoneNumber === "string" ? (metadata.phoneNumber as string) : undefined;
    const metadataGender = typeof metadata?.gender === "string" ? (metadata.gender as string) : undefined;
    const metadataDob = typeof metadata?.dateOfBirth === "string" ? (metadata.dateOfBirth as string) : undefined;
    const metadataLocation = typeof metadata?.location === "string" ? (metadata.location as string) : undefined;
    const metadataProfileImage = typeof metadata?.profileImageUrl === "string" ? (metadata.profileImageUrl as string) : undefined;
    const metadataGiftInterests = Array.isArray(metadata?.giftInterests)
      ? (metadata.giftInterests as string[])
      : [];
    const metadataGiftShoppingStyle = typeof metadata?.giftShoppingStyle === "string"
      ? (metadata.giftShoppingStyle as string)
      : undefined;
    const metadataGiftBudgetRange = typeof metadata?.giftBudgetRange === "string"
      ? (metadata.giftBudgetRange as string)
      : undefined;
    const metadataDiscoveryChannels = Array.isArray(metadata?.giftDiscoveryChannels)
      ? (metadata.giftDiscoveryChannels as string[])
      : [];
    const metadataFavoriteStores = Array.isArray(metadata?.favoriteStores)
      ? (metadata.favoriteStores as string[])
      : [];
    const metadataReminderOptIn = typeof metadata?.reminderOptIn === "boolean"
      ? (metadata.reminderOptIn as boolean)
      : true;
    const metadataAiIdeasOptIn = typeof metadata?.aiIdeasOptIn === "boolean"
      ? (metadata.aiIdeasOptIn as boolean)
      : true;
    const metadataCommunityUpdatesOptIn = typeof metadata?.communityUpdatesOptIn === "boolean"
      ? (metadata.communityUpdatesOptIn as boolean)
      : true;

    setFirstName(metadataFirst ?? user?.firstName ?? "");
    setLastName(metadataLast ?? user?.lastName ?? "");
    setEmail(metadataEmail ?? user?.emailAddresses?.[0]?.emailAddress ?? "");
    setPhoneCountryCode(metadataPhoneCode ?? "+971");
    setPhoneNumber(metadataPhone ?? "");
    setGender(metadataGender ?? "");
    if (metadataDob) {
      try {
        const parsedDate = new Date(metadataDob);
        if (!isNaN(parsedDate.getTime())) {
          setDateOfBirth(parsedDate);
        } else {
          setDateOfBirth(null);
        }
      } catch {
        setDateOfBirth(null);
      }
    } else {
      setDateOfBirth(null);
    }
    setLocation(metadataLocation ?? "");

    if (savedPersona) setPersona(savedPersona);
    if (savedOccasions.length) setSelectedOccasions(savedOccasions);
    setShareUpdates(savedUpdates);
    setProfileImagePreview(metadataProfileImage ?? user?.imageUrl ?? undefined);
    setGiftInterests(metadataGiftInterests);
    setGiftShoppingStyle(metadataGiftShoppingStyle ?? null);
    setGiftBudgetRange(metadataGiftBudgetRange ?? null);
    setGiftDiscoveryChannels(metadataDiscoveryChannels);
    setFavoriteStores(metadataFavoriteStores);
    setReminderOptIn(metadataReminderOptIn);
    setAiIdeasOptIn(metadataAiIdeasOptIn);
    setCommunityUpdatesOptIn(metadataCommunityUpdatesOptIn);
  }, [isLoaded, user]);

  const initials = useMemo(() => {
    const source = `${firstName} ${lastName}`.trim();
    if (!source) return "YW";
    const letters = source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("");
    return letters || "YW";
  }, [firstName, lastName]);

  const stepStatuses = useMemo(
    () =>
      STEPS.map((step, index) => {
        if (index < currentStepIndex) {
          return { ...step, status: "complete" as StepStatus };
        }
        if (index === currentStepIndex) {
          return { ...step, status: "current" as StepStatus };
        }
        return { ...step, status: "upcoming" as StepStatus };
      }),
    [currentStepIndex]
  );

  const formatDisplayDate = (date: Date | null): string => {
    if (!date) return "";
    try {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "";
    }
  };

  const formattedDateOfBirth = useMemo(() => formatDisplayDate(dateOfBirth), [dateOfBirth]);

  const handleOpenDatePicker = () => {
    setActiveDropdown(null);
    if (Platform.OS === "web") {
      setWebDatePickerOpen((prev) => !prev);
      return;
    }
    setDatePickerVisible(true);
  };

  const handleCloseDatePicker = () => {
    setDatePickerVisible(false);
    setWebDatePickerOpen(false);
    setActiveDropdown(null);
  };

  const handleDateConfirm = (date: Date) => {
    setDateOfBirth(date);
    handleCloseDatePicker();
  };

  const handleWebDateChange = (event: any) => {
    const value = event.target?.value ?? "";
    if (!value) {
      setDateOfBirth(null);
      handleCloseDatePicker();
      return;
    }
    const parsed = new Date(`${value}T00:00:00`);
    if (!isNaN(parsed.getTime())) {
      setDateOfBirth(parsed);
    }
    handleCloseDatePicker();
  };

  const handleClearDate = () => {
    setDateOfBirth(null);
    handleCloseDatePicker();
  };

  const handleToggleGenderDropdown = () => {
    if (Platform.OS === "web") {
      return;
    }
    setWebDatePickerOpen(false);
    setActiveDropdown((prev) => (prev === "gender" ? null : "gender"));
  };

  const handleSelectGender = (value: string) => {
    setGender(value);
    setActiveDropdown(null);
  };

  const renderGenderDropdown = () => (
    <View style={styles.dropdown}>
      {GENDER_OPTIONS.map((option) => (
        <Pressable
          key={option}
          onPress={() => handleSelectGender(option)}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownItemText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );

  const countries = useMemo(() => {
    const uaeIndex = allCountries.findIndex((c: any) => c.iso2?.toLowerCase() === "ae");
    const uae = uaeIndex >= 0 ? allCountries[uaeIndex] : null;
    const otherCountries = allCountries.filter((c: any) => c.iso2?.toLowerCase() !== "ae");
    return uae ? [uae, ...otherCountries] : allCountries;
  }, []);

  const handleToggleCountryCodeDropdown = () => {
    setWebDatePickerOpen(false);
    setActiveDropdown((prev) => (prev === "countryCode" ? null : "countryCode"));
  };

  const handleSelectCountryCode = (value: string) => {
    setPhoneCountryCode(value);
    setActiveDropdown(null);
  };

  // Convert ISO2 country code to flag emoji
  const getCountryFlag = (iso2: string): string => {
    if (!iso2 || iso2.length !== 2) return "";
    const codePoints = iso2
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const renderCountryCodeDropdown = () => (
    <View style={styles.dropdown}>
      <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
        {countries.map((country: any) => (
          <Pressable
            key={country.iso2}
            onPress={() => handleSelectCountryCode(country.dialCode)}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownItemText}>
              {getCountryFlag(country.iso2)} {country.dialCode} {country.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((current) =>
      current.includes(occasion)
        ? current.filter((item) => item !== occasion)
        : [...current, occasion]
    );
  };

  const toggleGiftInterest = (interest: string) => {
    setGiftInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const selectGiftShoppingStyle = (style: string) => {
    setGiftShoppingStyle((current) => (current === style ? current : style));
  };

  const selectGiftBudgetRange = (range: string) => {
    setGiftBudgetRange((current) => (current === range ? current : range));
  };

  const toggleDiscoveryChannel = (channel: string) => {
    setGiftDiscoveryChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel]
    );
  };

  const toggleFavoriteStoreSelection = (store: string) => {
    setFavoriteStores((current) =>
      current.includes(store)
        ? current.filter((item) => item !== store)
        : [...current, store]
    );
  };

  const handleAddCustomStore = () => {
    const trimmed = customStoreInput.trim();
    if (!trimmed) return;
    setFavoriteStores((current) =>
      current.includes(trimmed) ? current : [...current, trimmed]
    );
    setCustomStoreInput("");
  };

  const handlePickProfileImage = async () => {
    try {
      setError(null);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== "granted") {
        setError("We need access to your photos to update your profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const asset = result.assets[0];
      if (!asset.uri || !user) {
        return;
      }

      setProfileImageUploading(true);
      setProfileImagePreview(asset.uri);

      try {
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        await user.setProfileImage({ file: blob });
        await user.reload();
        const newImageUrl = user.imageUrl ?? asset.uri;
        setProfileImagePreview(newImageUrl);
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            profileImageUrl: newImageUrl,
          },
        });
      } catch (uploadErr) {
        console.error("Failed to upload profile image", uploadErr);
        setError("We couldn't upload your profile picture. Please try again.");
      }
    } catch (err) {
      console.error("Image picker error", err);
      setError("Something went wrong while selecting an image.");
    } finally {
      setProfileImageUploading(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex === 0) {
      router.back();
      return;
    }
    setError(null);
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToApp = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.replace("/");
  };

  const handleContinue = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedEmail = email.trim();
      const trimmedPhoneCode = phoneCountryCode.trim();
      const trimmedPhoneNumber = phoneNumber.trim();
      const trimmedGender = gender.trim();
      const trimmedDob = dateOfBirth ? dateOfBirth.toISOString().split("T")[0] : "";
      const trimmedLocation = location.trim();
      const displayName = `${trimmedFirstName} ${trimmedLastName}`.trim() || trimmedEmail;

      await user.update({
        firstName: trimmedFirstName || undefined,
        lastName: trimmedLastName || undefined,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          persona,
          giftOccasions: selectedOccasions,
          shareUpdates,
          displayName,
          firstName: trimmedFirstName || undefined,
          lastName: trimmedLastName || undefined,
          contactEmail: trimmedEmail || undefined,
          phoneCountryCode: trimmedPhoneCode || undefined,
          phoneNumber: trimmedPhoneNumber || undefined,
          gender: trimmedGender || undefined,
          dateOfBirth: trimmedDob || undefined,
          location: trimmedLocation || undefined,
          giftInterests,
          giftShoppingStyle: giftShoppingStyle ?? undefined,
          giftBudgetRange: giftBudgetRange ?? undefined,
          giftDiscoveryChannels,
          favoriteStores,
          reminderOptIn,
          aiIdeasOptIn,
          communityUpdatesOptIn,
          profileImageUrl: profileImagePreview,
        },
      });

      await upsertUserProfile({
        user_id: user.id,
        displayName,
        firstName: trimmedFirstName || undefined,
        lastName: trimmedLastName || undefined,
        contactEmail: trimmedEmail || undefined,
        phoneCountryCode: trimmedPhoneCode || undefined,
        phoneNumber: trimmedPhoneNumber || undefined,
        gender: trimmedGender || undefined,
        dateOfBirth: trimmedDob || undefined,
        location: trimmedLocation || undefined,
        persona,
        giftOccasions: selectedOccasions,
        shareUpdates,
        giftInterests,
        giftShoppingStyle: giftShoppingStyle ?? null,
        giftBudgetRange: giftBudgetRange ?? null,
        giftDiscoveryChannels,
        favoriteStores,
        reminderOptIn,
        aiIdeasOptIn,
        communityUpdatesOptIn,
        profileImageUrl: profileImagePreview ?? undefined,
      });
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        return;
      }
      goToApp();
    } catch (err) {
      console.error("Failed to update user metadata", err);
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepper = () => (
    <View style={styles.desktopSidebar}>
      <Text style={styles.sidebarTitle}>Profile Setup</Text>
      <Text style={styles.sidebarSubtitle}>
        To setup your profile, please provide the following information.
      </Text>
      {stepStatuses.map((step, index) => {
        const isCurrent = step.status === "current";
        const isComplete = step.status === "complete";
        return (
          <View key={step.label} style={styles.stepItem}>
            <View
              style={[
                styles.stepBadge,
                isCurrent && styles.stepBadgeCurrent,
                isComplete && styles.stepBadgeComplete,
              ]}
            >
              <Text
                style={[
                  styles.stepBadgeText,
                  (isCurrent || isComplete) && styles.stepBadgeTextActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                (isCurrent || isComplete) && styles.stepLabelActive,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );



  const renderDesktop = () => {
    const step = STEPS[currentStepIndex];
    const isFinalStep = currentStepIndex === STEPS.length - 1;

    let stepContent: JSX.Element | null = null;
    switch (step.id) {
      case "profile":
        stepContent = (
          <ProfileStep
            variant="desktop"
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneCountryCode={phoneCountryCode}
            phoneNumber={phoneNumber}
            gender={gender}
            dateOfBirth={dateOfBirth}
            location={location}
            profileImagePreview={profileImagePreview}
            profileImageUploading={profileImageUploading}
            isSubmitting={isSubmitting}
            initials={initials}
            formattedDateOfBirth={formattedDateOfBirth}
            activeDropdown={activeDropdown}
            isWebDatePickerOpen={isWebDatePickerOpen}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneCountryCodeChange={setPhoneCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            onGenderChange={setGender}
            onLocationChange={setLocation}
            onPickProfileImage={handlePickProfileImage}
            onOpenDatePicker={handleOpenDatePicker}
            onCloseDatePicker={handleCloseDatePicker}
            onDateConfirm={handleDateConfirm}
            onWebDateChange={handleWebDateChange}
            onClearDate={handleClearDate}
            onToggleGenderDropdown={handleToggleGenderDropdown}
            onSelectGender={handleSelectGender}
            onToggleCountryCodeDropdown={handleToggleCountryCodeDropdown}
            onSelectCountryCode={handleSelectCountryCode}
            renderGenderDropdown={renderGenderDropdown}
            renderCountryCodeDropdown={renderCountryCodeDropdown}
          />
        );
        break;
      case "preferences":
        stepContent = (
          <GiftPreferencesStep
            variant="desktop"
            persona={persona}
            selectedOccasions={selectedOccasions}
            giftInterests={giftInterests}
            giftShoppingStyle={giftShoppingStyle}
            giftBudgetRange={giftBudgetRange}
            giftDiscoveryChannels={giftDiscoveryChannels}
            onPersonaChange={setPersona}
            onToggleOccasion={toggleOccasion}
            onToggleGiftInterest={toggleGiftInterest}
            onSelectGiftShoppingStyle={selectGiftShoppingStyle}
            onSelectGiftBudgetRange={selectGiftBudgetRange}
            onToggleDiscoveryChannel={toggleDiscoveryChannel}
          />
        );
        break;
      case "stores":
        stepContent = (
          <FavoriteStoresStep
            variant="desktop"
            favoriteStores={favoriteStores}
            customStoreInput={customStoreInput}
            onToggleFavoriteStore={toggleFavoriteStoreSelection}
            onCustomStoreInputChange={setCustomStoreInput}
            onAddCustomStore={handleAddCustomStore}
          />
        );
        break;
      case "experience":
        stepContent = (
          <ExperienceSettingsStep
            variant="desktop"
            reminderOptIn={reminderOptIn}
            aiIdeasOptIn={aiIdeasOptIn}
            communityUpdatesOptIn={communityUpdatesOptIn}
            shareUpdates={shareUpdates}
            onReminderOptInChange={setReminderOptIn}
            onAiIdeasOptInChange={setAiIdeasOptIn}
            onCommunityUpdatesOptInChange={setCommunityUpdatesOptIn}
            onShareUpdatesChange={setShareUpdates}
          />
        );
        break;
      default:
        stepContent = null;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.desktopWrapper}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.desktopCard}>
          {renderStepper()}
          <View style={styles.desktopContent}>
            <View style={styles.desktopTopBar}>
              <Pressable
                style={styles.skipButton}
                onPress={goToApp}
                accessibilityRole="button"
              >
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </Pressable>
            </View>

            <View style={styles.desktopStepContainer}>{stepContent}</View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.desktopActions}>
              {currentStepIndex > 0 ? (
                <Pressable
                  onPress={handleBack}
                  style={[styles.secondaryButton, (isSubmitting || profileImageUploading) && styles.secondaryButtonDisabled]}
                  disabled={isSubmitting || profileImageUploading}
                  accessibilityRole="button"
                >
                  <Text style={styles.secondaryButtonText}>Back</Text>
                </Pressable>
              ) : null}
              <Pressable
                onPress={handleContinue}
                style={[styles.primaryButton, (isSubmitting || profileImageUploading) && styles.primaryButtonDisabled]}
                disabled={isSubmitting || profileImageUploading}
                accessibilityRole="button"
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {isFinalStep ? "Finish setup" : "Save & Continue"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderMobile = () => {
    const step = STEPS[currentStepIndex];
    const isFinalStep = currentStepIndex === STEPS.length - 1;

    let stepContent: JSX.Element | null = null;
    switch (step.id) {
      case "profile":
        stepContent = (
          <ProfileStep
            variant="mobile"
            firstName={firstName}
            lastName={lastName}
            email={email}
            phoneCountryCode={phoneCountryCode}
            phoneNumber={phoneNumber}
            gender={gender}
            dateOfBirth={dateOfBirth}
            location={location}
            profileImagePreview={profileImagePreview}
            profileImageUploading={profileImageUploading}
            isSubmitting={isSubmitting}
            initials={initials}
            formattedDateOfBirth={formattedDateOfBirth}
            activeDropdown={activeDropdown}
            isWebDatePickerOpen={isWebDatePickerOpen}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onEmailChange={setEmail}
            onPhoneCountryCodeChange={setPhoneCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            onGenderChange={setGender}
            onLocationChange={setLocation}
            onPickProfileImage={handlePickProfileImage}
            onOpenDatePicker={handleOpenDatePicker}
            onCloseDatePicker={handleCloseDatePicker}
            onDateConfirm={handleDateConfirm}
            onWebDateChange={handleWebDateChange}
            onClearDate={handleClearDate}
            onToggleGenderDropdown={handleToggleGenderDropdown}
            onSelectGender={handleSelectGender}
            onToggleCountryCodeDropdown={handleToggleCountryCodeDropdown}
            onSelectCountryCode={handleSelectCountryCode}
            renderGenderDropdown={renderGenderDropdown}
            renderCountryCodeDropdown={renderCountryCodeDropdown}
          />
        );
        break;
      case "preferences":
        stepContent = (
          <GiftPreferencesStep
            variant="mobile"
            persona={persona}
            selectedOccasions={selectedOccasions}
            giftInterests={giftInterests}
            giftShoppingStyle={giftShoppingStyle}
            giftBudgetRange={giftBudgetRange}
            giftDiscoveryChannels={giftDiscoveryChannels}
            onPersonaChange={setPersona}
            onToggleOccasion={toggleOccasion}
            onToggleGiftInterest={toggleGiftInterest}
            onSelectGiftShoppingStyle={selectGiftShoppingStyle}
            onSelectGiftBudgetRange={selectGiftBudgetRange}
            onToggleDiscoveryChannel={toggleDiscoveryChannel}
          />
        );
        break;
      case "stores":
        stepContent = (
          <FavoriteStoresStep
            variant="mobile"
            favoriteStores={favoriteStores}
            customStoreInput={customStoreInput}
            onToggleFavoriteStore={toggleFavoriteStoreSelection}
            onCustomStoreInputChange={setCustomStoreInput}
            onAddCustomStore={handleAddCustomStore}
          />
        );
        break;
      case "experience":
        stepContent = (
          <ExperienceSettingsStep
            variant="mobile"
            reminderOptIn={reminderOptIn}
            aiIdeasOptIn={aiIdeasOptIn}
            communityUpdatesOptIn={communityUpdatesOptIn}
            shareUpdates={shareUpdates}
            onReminderOptInChange={setReminderOptIn}
            onAiIdeasOptInChange={setAiIdeasOptIn}
            onCommunityUpdatesOptInChange={setCommunityUpdatesOptIn}
            onShareUpdatesChange={setShareUpdates}
          />
        );
        break;
      default:
        stepContent = null;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.mobileScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <SafeAreaView style={styles.mobileContainer}>
          <View style={styles.mobileHeader}>
            <Pressable
              onPress={handleBack}
              style={styles.mobileBackButton}
              accessibilityRole="button"
            >
              <Text style={styles.mobileBackText}>{currentStepIndex === 0 ? "Close" : "Back"}</Text>
            </Pressable>
            <Pressable onPress={goToApp} accessibilityRole="button">
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </Pressable>
          </View>

          <Text style={styles.mobileStepIndicator}>
            Step {currentStepIndex + 1} of {STEPS.length}
          </Text>
          <Text style={styles.mobileStepLabel}>{step.label}</Text>

          {stepContent}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.mobileActions}>
            {currentStepIndex > 0 ? (
              <Pressable
                onPress={handleBack}
                style={[styles.secondaryButton, styles.secondaryButtonMobile, (isSubmitting || profileImageUploading) && styles.secondaryButtonDisabled]}
                disabled={isSubmitting || profileImageUploading}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={handleContinue}
              style={[styles.primaryButton, (isSubmitting || profileImageUploading) && styles.primaryButtonDisabled]}
              disabled={isSubmitting || profileImageUploading}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isFinalStep ? "Finish setup" : "Save & Continue"}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDesktop ? "#F6F2FF" : palette.background },
      ]}
    >
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />
      {isDesktop ? renderDesktop() : renderMobile()}
      {Platform.OS !== "web" && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={handleCloseDatePicker}
          display={Platform.OS === "ios" ? "inline" : "default"}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}
