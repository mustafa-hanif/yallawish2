import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useUser } from "@clerk/clerk-expo";
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

  const steps: { label: string; status: StepStatus }[] = [
    { label: "Profile Details", status: "current" },
    { label: "Gift Preferences", status: "upcoming" },
    { label: "Favorite Stores", status: "upcoming" },
    { label: "Preferences", status: "upcoming" },
  ];

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions((current) =>
      current.includes(occasion)
        ? current.filter((item) => item !== occasion)
        : [...current, occasion]
    );
  };

  const goToApp = () => {
    const target = decodedReturnTo ? (decodedReturnTo as any) : "/";
    router.replace(target);
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
        },
      });
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
      {steps.map((step, index) => {
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

  const renderDesktop = () => (
    <ScrollView
      contentContainerStyle={styles.desktopWrapper}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.desktopCard}>
        {renderStepper()}
        <View style={styles.desktopContent}>
          <View style={styles.desktopTopBar}>
            <Pressable style={styles.skipButton} onPress={goToApp} accessibilityRole="button">
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </Pressable>
          </View>

          <View style={styles.desktopHeadingRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <Pressable style={styles.uploadButton} onPress={() => {}} accessibilityRole="button">
              <Text style={styles.uploadButtonText}>Upload picture</Text>
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

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.desktopActions}>
            <Pressable
              onPress={handleContinue}
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Save & Continue</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderMobile = () => (
    <ScrollView
      contentContainerStyle={styles.mobileScroll}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Text style={styles.mobileHeading}>Profile Setup</Text>
      <Text style={styles.mobileSubheading}>
        Tell us how you plan to use YallaWish so we can customise suggestions for you.
      </Text>

      <View style={styles.mobileCard}>
        <View style={styles.mobileAvatarRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>
          <Pressable style={styles.uploadButton} onPress={() => {}}>
            <Text style={styles.uploadButtonText}>Upload picture</Text>
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

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleContinue}
        style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
        disabled={isSubmitting}
        accessibilityRole="button"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Save & Continue</Text>
        )}
      </Pressable>

      <Pressable onPress={goToApp} style={styles.mobileSkipLink} accessibilityRole="button">
        <Text style={styles.mobileSkipText}>Skip for now</Text>
      </Pressable>
    </ScrollView>
  );

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
  desktopActions: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "flex-end",
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
  mobileSkipLink: {
    alignItems: "center",
    paddingVertical: 20,
  },
  mobileSkipText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    color: SECONDARY_PURPLE,
  },
});
