import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

const PRIMARY_PURPLE = "#330065";
const SECONDARY_PURPLE = "#4B0082";
const ACCENT_TEAL = "#03FFEE";

const DESKTOP_BREAKPOINT = 1024;

type PersonaChoice = "giftee" | "gifter" | "both";

type StepStatus = "current" | "upcoming" | "complete";

const PERSONA_OPTIONS: {
  id: PersonaChoice;
  title: string;
  description: string;
}[] = [
  {
    id: "giftee",
    title: "I'm creating my wishlists",
    description: "Plan events, add gifts, and share lists so friends know what to buy.",
  },
  {
    id: "gifter",
    title: "I'm shopping for others",
    description: "Claim gifts from shared lists and keep purchases organised.",
  },
  {
    id: "both",
    title: "I do a bit of both",
    description: "Swap between making lists for yourself and buying for loved ones.",
  },
];

const OCCASION_OPTIONS = [
  "Birthday",
  "Anniversary",
  "Baby shower",
  "Wedding",
  "Graduation",
  "Holiday gifting",
];

type SetupStep = "profile" | "preferences" | "stores" | "experience";

const STEPS: { id: SetupStep; label: string }[] = [
  { id: "profile", label: "Profile Details" },
  { id: "preferences", label: "Gift Preferences" },
  { id: "stores", label: "Favorite Stores" },
  { id: "experience", label: "Experience Settings" },
];

const GIFT_INTEREST_OPTIONS = [
  "Tech & Gadgets",
  "Home & Living",
  "Fashion & Accessories",
  "Beauty & Wellness",
  "Experiences",
  "Books & Stationery",
  "Kids & Family",
  "Food & Gourmet",
];

const SHOPPING_STYLE_OPTIONS = [
  "I love curated picks",
  "Show me trending now",
  "Let me browse everything",
];

const BUDGET_RANGE_OPTIONS = [
  "Under AED 150",
  "AED 150 – 350",
  "AED 350 – 750",
  "AED 750+",
];

const DISCOVERY_CHANNEL_OPTIONS = [
  "Instagram",
  "TikTok",
  "Pinterest",
  "YouTube",
  "Newsletters",
  "Friends & family",
  "In-store browsing",
];

const STORE_SUGGESTIONS = [
  "Amazon.ae",
  "Namshi",
  "Bloomingdale's",
  "Level Shoes",
  "Pottery Barn",
  "Crate & Barrel",
  "Ounass",
  "Virgin Megastore",
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [location, setLocation] = useState("");
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
    setDateOfBirth(metadataDob ?? "");
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
    router.replace("/create-list-step1");
  };

  const handleContinue = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await user.update({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          persona,
          giftOccasions: selectedOccasions,
          shareUpdates,
          displayName: `${firstName} ${lastName}`.trim() || email.trim(),
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          contactEmail: email.trim() || undefined,
          phoneCountryCode: phoneCountryCode.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          gender: gender.trim() || undefined,
          dateOfBirth: dateOfBirth.trim() || undefined,
          location: location.trim() || undefined,
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

  const renderProfileDesktopContent = () => (
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
          style={[
            styles.uploadButton,
            (profileImageUploading || isSubmitting) && styles.uploadButtonDisabled,
          ]}
          onPress={handlePickProfileImage}
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
            onChangeText={setFirstName}
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
            onChangeText={setLastName}
            placeholder="Last name"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.desktopInput}
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.desktopFormRow}>
        <View style={styles.desktopField}>
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
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
            <TextInput
              value={phoneCountryCode}
              onChangeText={setPhoneCountryCode}
              placeholder="+971"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={[styles.desktopInput, styles.countryCodeBox]}
              autoCapitalize="none"
            />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="521 123 456"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={[styles.desktopInput, { flex: 1 }]}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </View>

      <View style={styles.desktopFormRow}>
        <View style={styles.desktopField}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Select"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.desktopInput}
          />
        </View>
        <View style={styles.desktopField}>
          <Text style={styles.fieldLabel}>Date of birth</Text>
          <TextInput
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.desktopInput}
            autoCapitalize="none"
          />
        </View>
      </View>

      <View style={styles.desktopFormRow}>
        <View style={styles.desktopField}>
          <Text style={styles.fieldLabel}>Location (optional)</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Dubai"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.desktopInput}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.desktopField}>
          <Text style={styles.fieldLabel}>YallaWish updates</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Get launch announcements and feature previews</Text>
            <Switch
              value={shareUpdates}
              onValueChange={setShareUpdates}
              thumbColor={shareUpdates ? "#FFFFFF" : "#F4F4F5"}
              trackColor={{ false: "#D7CCE8", true: SECONDARY_PURPLE }}
            />
          </View>
        </View>
      </View>

      <View style={styles.desktopDivider} />

      <View>
        <Text style={styles.sectionTitle}>How would you describe yourself?</Text>
        <Text style={styles.sectionSubtitle}>
          Pick the option that feels most like you. You can change this later.
        </Text>
        <View style={styles.personaGrid}>
          {PERSONA_OPTIONS.map((option) => {
            const active = persona === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPersona(option.id)}
                style={[styles.personaTile, active && styles.personaTileActive]}
                accessibilityRole="button"
                accessibilityLabel={option.title}
              >
                <Text style={[styles.personaTitle, active && styles.personaTitleActive]}>
                  {option.title}
                </Text>
                <Text style={[styles.personaDescription, active && styles.personaDescriptionActive]}>
                  {option.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.desktopDivider} />

      <View>
        <Text style={styles.sectionTitle}>What are you planning for next?</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a few occasions so we can line up ideas and reminders.
        </Text>
        <View style={styles.chipWrap}>
          {OCCASION_OPTIONS.map((occasion) => {
            const active = selectedOccasions.includes(occasion);
            return (
              <Pressable
                key={occasion}
                onPress={() => toggleOccasion(occasion)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={occasion}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {occasion}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );

  const renderProfileMobileContent = () => (
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
            style={[
              styles.uploadButton,
              (profileImageUploading || isSubmitting) && styles.uploadButtonDisabled,
            ]}
            onPress={handlePickProfileImage}
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
            onChangeText={setFirstName}
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
            onChangeText={setLastName}
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
            onChangeText={setEmail}
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
            <TextInput
              value={phoneCountryCode}
              onChangeText={setPhoneCountryCode}
              placeholder="+971"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={[styles.mobileInput, styles.countryCodeBox]}
              autoCapitalize="none"
            />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="521 123 456"
              placeholderTextColor="rgba(28, 3, 53, 0.35)"
              style={[styles.mobileInput, { flex: 1 }]}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Gender</Text>
          <TextInput
            value={gender}
            onChangeText={setGender}
            placeholder="Select"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
          />
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Date of birth</Text>
          <TextInput
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.mobileFieldBlock}>
          <Text style={styles.fieldLabel}>Location (optional)</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Dubai"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={styles.mobileInput}
            autoCapitalize="words"
          />
        </View>
        <View style={[styles.mobileFieldBlock, styles.switchRow]}>
          <Text style={styles.switchLabel}>Get launch announcements and feature previews</Text>
          <Switch
            value={shareUpdates}
            onValueChange={setShareUpdates}
            thumbColor={shareUpdates ? "#FFFFFF" : "#F4F4F5"}
            trackColor={{ false: "#D7CCE8", true: SECONDARY_PURPLE }}
          />
        </View>
      </View>

      <View style={styles.mobileCard}>
        <Text style={styles.sectionTitle}>How would you describe yourself?</Text>
        <Text style={styles.sectionSubtitle}>
          Pick the option that feels most like you. You can change this later.
        </Text>
        <View style={styles.personaStack}>
          {PERSONA_OPTIONS.map((option) => {
            const active = persona === option.id;
            return (
              <Pressable
                key={option.id}
                onPress={() => setPersona(option.id)}
                style={[styles.personaTile, active && styles.personaTileActive]}
                accessibilityRole="button"
                accessibilityLabel={option.title}
              >
                <Text style={[styles.personaTitle, active && styles.personaTitleActive]}>
                  {option.title}
                </Text>
                <Text style={[styles.personaDescription, active && styles.personaDescriptionActive]}>
                  {option.description}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.mobileCard}>
        <Text style={styles.sectionTitle}>What are you planning for next?</Text>
        <Text style={styles.sectionSubtitle}>
          Choose a few occasions so we can line up ideas and reminders.
        </Text>
        <View style={styles.chipWrap}>
          {OCCASION_OPTIONS.map((occasion) => {
            const active = selectedOccasions.includes(occasion);
            return (
              <Pressable
                key={occasion}
                onPress={() => toggleOccasion(occasion)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={occasion}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {occasion}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </>
  );

  const renderGiftPreferencesContent = (variant: "desktop" | "mobile") => {
    const cardStyle = [styles.mobileCard, variant === "desktop" && styles.desktopStepCard];
    const wrapStyle = [styles.preferenceTileWrap, variant === "mobile" && styles.preferenceTileWrapMobile];
    return (
      <View style={cardStyle}>
        <Text style={styles.sectionTitle}>Dial in your gifting style</Text>
        <Text style={styles.sectionSubtitle}>
          Tell Genie what you enjoy so we can surface spot-on ideas.
        </Text>

        <View style={styles.chipWrap}>
          {GIFT_INTEREST_OPTIONS.map((interest) => {
            const active = giftInterests.includes(interest);
            return (
              <Pressable
                key={interest}
                onPress={() => toggleGiftInterest(interest)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={interest}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{interest}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>How do you like to shop?</Text>
        <View style={wrapStyle}>
          {SHOPPING_STYLE_OPTIONS.map((option) => {
            const active = giftShoppingStyle === option;
            return (
              <Pressable
                key={option}
                onPress={() => selectGiftShoppingStyle(option)}
                style={[
                  styles.preferenceTile,
                  active && styles.preferenceTileActive,
                  variant === "mobile" && styles.preferenceTileMobile,
                ]}
                accessibilityRole="button"
                accessibilityLabel={option}
              >
                <Text style={[styles.preferenceTileTitle, active && styles.preferenceTileTitleActive]}>{option}</Text>
                <Text style={[styles.preferenceTileCopy, active && styles.preferenceTileCopyActive]}>
                  {option === "I love curated picks"
                    ? "Give me a shortlist that just feels right."
                    : option === "Show me trending now"
                      ? "Keep me in the loop with what others love."
                      : "I want to explore and compare everything myself."}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Typical budget sweet spot</Text>
        <View style={styles.preferencePillsRow}>
          {BUDGET_RANGE_OPTIONS.map((range) => {
            const active = giftBudgetRange === range;
            return (
              <Pressable
                key={range}
                onPress={() => selectGiftBudgetRange(range)}
                style={[styles.preferencePill, active && styles.preferencePillActive]}
                accessibilityRole="button"
                accessibilityLabel={range}
              >
                <Text style={[styles.preferencePillText, active && styles.preferencePillTextActive]}>{range}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Where do you discover new gifts?</Text>
        <Text style={styles.sectionSubtitle}>Pick the channels that inspire you the most.</Text>
        <View style={styles.chipWrap}>
          {DISCOVERY_CHANNEL_OPTIONS.map((channel) => {
            const active = giftDiscoveryChannels.includes(channel);
            return (
              <Pressable
                key={channel}
                onPress={() => toggleDiscoveryChannel(channel)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={channel}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{channel}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const renderFavoriteStoresContent = (variant: "desktop" | "mobile") => {
    const cardStyle = [styles.mobileCard, variant === "desktop" && styles.desktopStepCard];
    const inputBaseStyle = variant === "desktop" ? styles.desktopInput : styles.mobileInput;
    return (
      <View style={cardStyle}>
        <Text style={styles.sectionTitle}>Where do you love to shop?</Text>
        <Text style={styles.sectionSubtitle}>
          Highlight your go-to stores so we can personalise brand recommendations.
        </Text>

        <View style={styles.chipWrap}>
          {STORE_SUGGESTIONS.map((store) => {
            const active = favoriteStores.includes(store);
            return (
              <Pressable
                key={store}
                onPress={() => toggleFavoriteStoreSelection(store)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={store}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{store}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionDivider} />

        <Text style={styles.sectionTitle}>Add your own</Text>
        <Text style={styles.sectionSubtitle}>Think local boutiques or hidden gems you rely on.</Text>
        <View style={styles.storeInputRow}>
          <TextInput
            value={customStoreInput}
            onChangeText={setCustomStoreInput}
            placeholder="e.g. Crate & Barrel"
            placeholderTextColor="rgba(28, 3, 53, 0.35)"
            style={[inputBaseStyle, styles.storeInput]}
            autoCapitalize="words"
            onSubmitEditing={handleAddCustomStore}
            returnKeyType="done"
          />
          <Pressable
            style={[styles.addStoreButton, !customStoreInput.trim() && styles.addStoreButtonDisabled]}
            onPress={handleAddCustomStore}
            disabled={!customStoreInput.trim()}
            accessibilityRole="button"
          >
            <Text style={styles.addStoreButtonText}>Add</Text>
          </Pressable>
        </View>

        {favoriteStores.length ? (
          <View style={styles.selectedStoresWrap}>
            {favoriteStores.map((store) => (
              <Pressable
                key={store}
                onPress={() => toggleFavoriteStoreSelection(store)}
                style={styles.selectedStoreChip}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${store}`}
              >
                <Text style={styles.selectedStoreText}>{store}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  const renderExperienceSettingsContent = (variant: "desktop" | "mobile") => {
    const cardStyle = [styles.mobileCard, variant === "desktop" && styles.desktopStepCard];
    return (
      <View style={cardStyle}>
        <Text style={styles.sectionTitle}>Tune your experience</Text>
        <Text style={styles.sectionSubtitle}>
          Decide how much help you want from YallaWish moving forward.
        </Text>

        <View style={styles.preferenceToggleBlock}>
          <View style={styles.preferenceToggleCopy}>
            <Text style={styles.preferenceToggleTitle}>Friendly reminders</Text>
            <Text style={styles.preferenceToggleSubtitle}>Send me nudges before big dates so I never miss a moment.</Text>
          </View>
          <Switch
            value={reminderOptIn}
            onValueChange={setReminderOptIn}
            thumbColor={reminderOptIn ? "#FFFFFF" : "#F4F4F5"}
            trackColor={{ false: "#D7CCE8", true: SECONDARY_PURPLE }}
          />
        </View>

        <View style={styles.preferenceToggleBlock}>
          <View style={styles.preferenceToggleCopy}>
            <Text style={styles.preferenceToggleTitle}>AI ideas & guides</Text>
            <Text style={styles.preferenceToggleSubtitle}>Let Genie share curated picks and planning checklists.</Text>
          </View>
          <Switch
            value={aiIdeasOptIn}
            onValueChange={setAiIdeasOptIn}
            thumbColor={aiIdeasOptIn ? "#FFFFFF" : "#F4F4F5"}
            trackColor={{ false: "#D7CCE8", true: SECONDARY_PURPLE }}
          />
        </View>

        <View style={styles.preferenceToggleBlock}>
          <View style={styles.preferenceToggleCopy}>
            <Text style={styles.preferenceToggleTitle}>Community updates</Text>
            <Text style={styles.preferenceToggleSubtitle}>Hear about new features, drops, and popular public lists.</Text>
          </View>
          <Switch
            value={communityUpdatesOptIn}
            onValueChange={setCommunityUpdatesOptIn}
            thumbColor={communityUpdatesOptIn ? "#FFFFFF" : "#F4F4F5"}
            trackColor={{ false: "#D7CCE8", true: SECONDARY_PURPLE }}
          />
        </View>

        <View style={styles.preferenceSummaryBox}>
          <Text style={styles.preferenceSummaryTitle}>All set!</Text>
          <Text style={styles.preferenceSummaryText}>
            We’ll combine these choices with your lists to suggest thoughtful gifts and keep you in sync with the people you care about.
          </Text>
        </View>
      </View>
    );
  };

  const renderDesktop = () => {
    const step = STEPS[currentStepIndex];
    const isFinalStep = currentStepIndex === STEPS.length - 1;

    let stepContent: JSX.Element | null = null;
    switch (step.id) {
      case "profile":
        stepContent = renderProfileDesktopContent();
        break;
      case "preferences":
        stepContent = renderGiftPreferencesContent("desktop");
        break;
      case "stores":
        stepContent = renderFavoriteStoresContent("desktop");
        break;
      case "experience":
        stepContent = renderExperienceSettingsContent("desktop");
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
        stepContent = renderProfileMobileContent();
        break;
      case "preferences":
        stepContent = renderGiftPreferencesContent("mobile");
        break;
      case "stores":
        stepContent = renderFavoriteStoresContent("mobile");
        break;
      case "experience":
        stepContent = renderExperienceSettingsContent("mobile");
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  desktopWrapper: {
    flexGrow: 1,
    paddingHorizontal: 48,
    paddingVertical: 56,
    alignItems: "center",
  },
  desktopCard: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 40,
    shadowColor: "#1C0335",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    gap: 40,
  },
  desktopSidebar: {
    width: 240,
    borderRightWidth: 1,
    borderColor: "#E6DEF4",
    paddingRight: 32,
  },
  sidebarTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 28,
    color: "#1C0335",
    marginBottom: 12,
  },
  sidebarSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    lineHeight: 20,
    color: "#4B3F66",
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#D4CAE9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#F5F1FF",
  },
  stepBadgeCurrent: {
    borderColor: SECONDARY_PURPLE,
    backgroundColor: SECONDARY_PURPLE,
  },
  stepBadgeComplete: {
    borderColor: ACCENT_TEAL,
    backgroundColor: ACCENT_TEAL,
  },
  stepBadgeText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#4B3F66",
  },
  stepBadgeTextActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontFamily: "Nunito_500Medium",
    fontSize: 15,
    color: "#6A5A89",
  },
  stepLabelActive: {
    color: "#1C0335",
  },
  desktopContent: {
    flex: 1,
  },
  desktopStepContainer: {
    marginTop: 24,
    gap: 32,
  },
  desktopTopBar: {
    alignItems: "flex-end",
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6840D3",
  },
  skipButtonText: {
    fontFamily: "Nunito_600SemiBold",
    color: "#6840D3",
  },
  desktopHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginTop: 28,
    marginBottom: 32,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 52,
  },
  avatarInitials: {
    fontFamily: "Nunito_700Bold",
    fontSize: 32,
    color: "#FFFFFF",
  },
  uploadButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#EFE9FF",
    borderRadius: 12,
  },
  uploadButtonDisabled: {
    opacity: 0.65,
  },
  uploadButtonText: {
    fontFamily: "Nunito_600SemiBold",
    color: SECONDARY_PURPLE,
  },
  desktopFormRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  desktopField: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#4B3F66",
    marginBottom: 8,
  },
  desktopInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDD7E4",
    paddingHorizontal: 16,
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: "#1C0335",
    backgroundColor: "#FBFAFF",
  },
  inlineFieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  countryCodeBox: {
    width: 96,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  switchLabel: {
    flex: 1,
    fontFamily: "Nunito_500Medium",
    fontSize: 14,
    color: "#4B3F66",
  },
  desktopDivider: {
    height: 1,
    backgroundColor: "#E7E0F3",
    marginVertical: 28,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#E7E0F3",
    marginVertical: 24,
  },
  desktopActions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  primaryButtonDisabled: {
    opacity: 0.75,
  },
  primaryButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: PRIMARY_PURPLE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonMobile: {
    flex: 1,
  },
  secondaryButtonDisabled: {
    opacity: 0.75,
  },
  secondaryButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: PRIMARY_PURPLE,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  errorBox: {
    borderRadius: 14,
    backgroundColor: "#FCE8E6",
    borderWidth: 1.5,
    borderColor: "#F5B5AF",
    padding: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  errorText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#A42222",
  },
  mobileScroll: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 20,
  },
  mobileContainer: {
    flex: 1,
  },
  mobileHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  mobileBackButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  mobileBackText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: PRIMARY_PURPLE,
  },
  mobileStepIndicator: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#6A5A89",
    marginBottom: 4,
  },
  mobileStepLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: "#1C0335",
    marginBottom: 20,
  },
  mobileHeading: {
    fontFamily: "Nunito_700Bold",
    fontSize: 28,
    color: "#1C0335",
  },
  mobileSubheading: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: "#4B3F66",
    marginBottom: 12,
  },
  mobileCard: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#1C0335",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 16,
  },
  mobileAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  mobileFieldBlock: {
    gap: 8,
  },
  mobileInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#DDD7E4",
    paddingHorizontal: 16,
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: "#1C0335",
    backgroundColor: "#FBFAFF",
  },
  sectionTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#1C0335",
  },
  sectionSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#4B3F66",
  },
  personaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 16,
  },
  personaStack: {
    gap: 12,
  },
  personaTile: {
    flex: 1,
    minWidth: 220,
    borderWidth: 1.5,
    borderColor: "#E5DFF5",
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#FBF9FF",
  },
  personaTileActive: {
    borderColor: PRIMARY_PURPLE,
    backgroundColor: "#F0E7FF",
  },
  personaTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: "#2A0E59",
    marginBottom: 6,
  },
  personaTitleActive: {
    color: PRIMARY_PURPLE,
  },
  personaDescription: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#4B3F66",
  },
  personaDescriptionActive: {
    color: "#2F1D63",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E5DFF5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FBF9FF",
  },
  chipActive: {
    borderColor: ACCENT_TEAL,
    backgroundColor: "#E6FFFB",
  },
  chipText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#4B3F66",
  },
  chipTextActive: {
    color: "#0F766E",
  },
  mobileActions: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
    marginTop: 28,
  },
  mobileSkipLink: {
    alignItems: "center",
    paddingVertical: 20,
  },
  mobileSkipText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: SECONDARY_PURPLE,
  },
  desktopStepCard: {
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5DFF5",
    padding: 32,
    gap: 20,
  },
  preferenceTileWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 18,
  },
  preferenceTileWrapMobile: {
    flexDirection: "column",
  },
  preferenceTile: {
    flex: 1,
    minWidth: 240,
    borderWidth: 1.5,
    borderColor: "#E5DFF5",
    borderRadius: 20,
    padding: 20,
    backgroundColor: "#FBF9FF",
  },
  preferenceTileMobile: {
    width: "100%",
  },
  preferenceTileActive: {
    borderColor: SECONDARY_PURPLE,
    backgroundColor: "#EFE9FF",
  },
  preferenceTileTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#2A0E59",
    marginBottom: 8,
  },
  preferenceTileTitleActive: {
    color: SECONDARY_PURPLE,
  },
  preferenceTileCopy: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: "#4B3F66",
    lineHeight: 18,
  },
  preferenceTileCopyActive: {
    color: "#311663",
  },
  preferencePillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 18,
  },
  preferencePill: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E5DFF5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FBF9FF",
  },
  preferencePillActive: {
    borderColor: SECONDARY_PURPLE,
    backgroundColor: "#EFE9FF",
  },
  preferencePillText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#4B3F66",
  },
  preferencePillTextActive: {
    color: SECONDARY_PURPLE,
  },
  storeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  storeInput: {
    flex: 1,
  },
  addStoreButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: SECONDARY_PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  addStoreButtonDisabled: {
    opacity: 0.5,
  },
  addStoreButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  selectedStoresWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  selectedStoreChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#EFE9FF",
  },
  selectedStoreText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13,
    color: SECONDARY_PURPLE,
  },
  preferenceToggleBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    paddingVertical: 12,
  },
  preferenceToggleCopy: {
    flex: 1,
    gap: 4,
  },
  preferenceToggleTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#1C0335",
  },
  preferenceToggleSubtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: "#4B3F66",
    lineHeight: 18,
  },
  preferenceSummaryBox: {
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#F5F1FF",
    borderWidth: 1,
    borderColor: "#E5DFF5",
    gap: 8,
  },
  preferenceSummaryTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#1C0335",
  },
  preferenceSummaryText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: "#4B3F66",
    lineHeight: 18,
  },
});
