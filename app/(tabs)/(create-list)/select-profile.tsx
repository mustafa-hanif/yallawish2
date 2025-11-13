import { DropdownKey, ProfileModalContent } from "@/components/createList/ProfileModalContent";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Fragment, ReactNode, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "@/styles/selectProfileStyles";
const DESKTOP_BREAKPOINT = 1024;
const DEFAULT_COUNTRY_CODE = "+971";
const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
];
const RELATION_OPTIONS = [
  "Spouse",
  "Partner",
  "Son",
  "Daughter",
  "Parent",
  "Sibling",
  "Friend",
  "Colleague",
  "Pet",
  "Other",
];
const STEP_ITEMS = [
  "Who is this list for?",
  "Giftlist Details",
  "Who can see this list?",
];

type ContactDoc = Doc<"contacts">;

type Params = {
  profileId?: string | string[];
  returnTo?: string | string[];
};

function getParamValue(param?: string | string[]) {
  if (!param) return undefined;
  return Array.isArray(param) ? param[0] : param;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (!parts.length) return "YW";
  const [first, second] = parts;
  if (!second) return (first[0] ?? "").toUpperCase();
  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase();
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function SelectProfileScreen() {
  const { userId } = useAuth();
  const params = useLocalSearchParams<Params>();
  const initialProfileId = getParamValue(params.profileId);
  const encodedReturnTo = getParamValue(params.returnTo);

  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    initialProfileId ?? null,
  );
  const contacts = useQuery(
    api.products.getContacts as any,
    userId ? ({ owner_id: userId } as any) : "skip",
  );
  const createContact = useMutation(api.products.createContact as any);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  const isLoadingProfiles = contacts === undefined;

  const profiles = useMemo(() => {
    if (!Array.isArray(contacts)) return [] as ContactDoc[];
    return [...contacts].sort((a, b) => a.name.localeCompare(b.name));
  }, [contacts]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState("");
  const [relation, setRelation] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [allowEdit, setAllowEdit] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isWebDatePickerOpen, setWebDatePickerOpen] = useState(false);

  const formattedBirthDate = birthDate ? formatDisplayDate(birthDate) : "";
  const showEmptyState = !isLoadingProfiles && profiles.length === 0;

  const closeWebDatePicker = () => {
    setWebDatePickerOpen(false);
    setActiveDropdown(null);
  };

  const handleOpenDatePicker = () => {
    setActiveDropdown(null);
    if (Platform.OS === "web") {
      setWebDatePickerOpen((prev) => !prev);
      return;
    }
    setDatePickerVisible(true);
  };

  const handleToggleDropdown = (key: DropdownKey) => {
    if (Platform.OS === "web") {
      return;
    }
    setWebDatePickerOpen(false);
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleSelectGender = (value: string) => {
    setGender(value);
    setActiveDropdown(null);
  };

  const handleSelectRelation = (value: string) => {
    setRelation(value);
    setActiveDropdown(null);
  };

  const resetForm = (clearMessages = true) => {
    setFirstName("");
    setLastName("");
    setBirthDate(null);
    setGender("");
    setRelation("");
    setEmail("");
    setCountryCode(DEFAULT_COUNTRY_CODE);
    setPhoneNumber("");
    setAllowEdit(true);
    setActiveDropdown(null);
    setWebDatePickerOpen(false);
    if (clearMessages) {
      setSubmitError(null);
      setFormMessage(null);
    }
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSelectProfile = (profile: ContactDoc) => {
    setSelectedProfileId(String(profile._id));
  };

  const handleContinue = () => {
    if (!selectedProfileId) {
      Alert.alert(
        "Select a profile",
        "Choose an existing profile or create a new one to continue.",
      );
      return;
    }
    const nextParams: Record<string, string> = {
      profileId: selectedProfileId,
    };
    if (encodedReturnTo) {
      nextParams.returnTo = encodedReturnTo;
    }
    router.push({ pathname: "/create-list-step2", params: nextParams });
  };

  const handleDateChange = (date: Date | null) => {
    setBirthDate(date);
    setDatePickerVisible(false);
    setWebDatePickerOpen(false);
    setActiveDropdown(null);
  };

  const handleNativeDateConfirm = (date: Date) => {
    handleDateChange(date);
  };

  const handleClearBirthDate = () => {
    handleDateChange(null);
  };

  const handleSaveProfile = async (navigateNext: boolean) => {
    if (!userId) {
      Alert.alert("Sign in required", "Please sign in before creating profiles.");
      return;
    }

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedFirst && !trimmedLast) {
      setSubmitError("Add at least a first name to save the profile.");
      setFormMessage(null);
      return;
    }

    const displayName = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");

    setIsSaving(true);
    setSubmitError(null);
    setFormMessage(null);

    try {
      const payload = {
        owner_id: userId,
        name: displayName,
        email: email.trim() || undefined,
        firstName: trimmedFirst || undefined,
        lastName: trimmedLast || undefined,
        dateOfBirth: birthDate?.toISOString(),
        gender: gender || undefined,
        phoneCountryCode: countryCode.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
        relation: relation || undefined,
        allowEdit,
      };

      const newId = await createContact(payload as any);
      const newIdString = String(newId);
      setSelectedProfileId(newIdString);

      if (navigateNext) {
        closeModal();
        const nextParams: Record<string, string> = {
          profileId: newIdString,
        };
        if (encodedReturnTo) {
          nextParams.returnTo = encodedReturnTo;
        }
        router.push({ pathname: "/create-list-step2", params: nextParams });
        return;
      }

      resetForm(false);
      setFormMessage("Profile saved. Add another or close the modal when you're ready.");
    } catch (error) {
      console.error("Failed to create contact", error);
      setSubmitError("We couldn't save that profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfilesDesktop = () => (
    <SafeAreaView style={styles.desktopSafeArea} edges={['top']}>
      <View style={styles.desktopWrapper}>
        <View style={styles.desktopSidebar}>
          <Pressable onPress={() => router.back()} style={styles.desktopBackRow}>
            <Ionicons name="chevron-back" size={18} color="#4B0082" />
            <Text style={styles.desktopBackText}>Back</Text>
          </Pressable>
          <Text style={styles.desktopSidebarTitle}>Create Gift List</Text>
          <Text style={styles.desktopSidebarSubtitle}>
            Choose who this wishlist is for, then add the details and sharing preferences.
          </Text>
          <View style={styles.desktopStepList}>
            {STEP_ITEMS.map((label, index) => {
              const isActive = index === 0;
              return (
                <View key={label} style={styles.desktopStepItem}>
                  <View style={styles.desktopStepIndicator}>
                    <View
                      style={[
                        styles.desktopStepCircle,
                        isActive
                          ? styles.desktopStepCircleActive
                          : styles.desktopStepCircleInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.desktopStepNumber,
                          isActive
                            ? styles.desktopStepNumberActive
                            : styles.desktopStepNumberInactive,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    {index < STEP_ITEMS.length - 1 ? (
                      <View style={styles.desktopStepConnector} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.desktopStepLabel,
                      isActive
                        ? styles.desktopStepLabelActive
                        : styles.desktopStepLabelInactive,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.desktopContent}>
          <ScrollView
            contentContainerStyle={styles.desktopScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.desktopHeading}>Who is this list for?</Text>
            <Text style={styles.desktopSubheading}>
              Select an existing giftee or create a new profile to continue setup.
            </Text>

            {isLoadingProfiles ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator color="#4B0082" />
              </View>
            ) : (
              <View style={styles.desktopGrid}>
                {profiles.map((profile) => {
                  const isSelected = selectedProfileId === String(profile._id);
                  return (
                    <Pressable
                      key={String(profile._id)}
                      onPress={() => handleSelectProfile(profile)}
                      style={[
                        styles.desktopCard,
                        isSelected && styles.desktopCardSelected,
                      ]}
                    >
                      <View style={styles.desktopAvatar}>
                        <Text style={styles.desktopInitials}>
                          {getInitials(profile.name)}
                        </Text>
                      </View>
                      <Text style={styles.desktopName} numberOfLines={1}>
                        {profile.name}
                      </Text>
                      {isSelected ? (
                        <Text style={styles.desktopSelectedLabel}>Selected</Text>
                      ) : null}
                    </Pressable>
                  );
                })}

                <Pressable style={styles.desktopAddCard} onPress={openModal}>
                  <View style={styles.desktopAddIconWrap}>
                    <Ionicons name="add" size={26} color="#4B0082" />
                  </View>
                  <Text style={styles.desktopAddText}>New Profile</Text>
                </Pressable>
              </View>
            )}

            {showEmptyState ? (
              <View style={styles.desktopEmpty}>
                <Text style={styles.emptyHeading}>No profiles yet</Text>
                <Text style={styles.emptyBody}>
                  Create your first profile to start building wishlists for the people you love.
                </Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.desktopFooterActions}>
            <Pressable style={styles.desktopSecondaryButton} onPress={() => router.back()}>
              <Text style={styles.desktopSecondaryButtonText}>Back</Text>
            </Pressable>
            <Pressable
              style={[
                styles.desktopPrimaryButton,
                !selectedProfileId && styles.desktopPrimaryButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!selectedProfileId}
            >
              <Text style={styles.desktopPrimaryButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderProfilesMobile = () => (
    <View style={styles.mobileContainer}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#330065", "#6600CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mobileHeaderGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.mobileHeaderContent}>
            <Pressable onPress={() => router.back()} style={styles.mobileBackButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text style={styles.mobileHeaderTitle}>Select Profile</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.mobileBody}>
        <Text style={styles.mobileHeading}>Select or add profile</Text>
        <Text style={styles.mobileSubheading}>
          Choose a giftee to manage their wishlist or create someone new.
        </Text>

        {isLoadingProfiles ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color="#4B0082" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.mobileScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {profiles.length > 0 ? (
              <View style={styles.mobileCardsWrap}>
                {profiles.map((profile) => {
                  const isSelected = selectedProfileId === String(profile._id);
                  return (
                    <Pressable
                      key={String(profile._id)}
                      onPress={() => handleSelectProfile(profile)}
                      style={[
                        styles.mobileCard,
                        isSelected && styles.mobileCardSelected,
                      ]}
                    >
                      <View style={styles.mobileAvatar}>
                        <Text style={styles.mobileInitials}>
                          {getInitials(profile.name)}
                        </Text>
                      </View>
                      <Text style={styles.mobileName} numberOfLines={1}>
                        {profile.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={styles.mobileEmpty}>
                <Text style={styles.emptyHeading}>No profiles yet</Text>
                <Text style={styles.emptyBody}>
                  Tap “New Profile” to add someone before building their list.
                </Text>
              </View>
            )}

            <Pressable style={styles.mobileAddCard} onPress={openModal}>
              <View style={styles.mobileAddIconWrap}>
                <Ionicons name="add" size={28} color="#4B0082" />
              </View>
              <Text style={styles.mobileAddText}>New Profile</Text>
            </Pressable>

            <View style={styles.mobileBottomSpacer} />
          </ScrollView>
        )}
      </View>

      <SafeAreaView edges={['bottom']} style={styles.mobileFooterSafeArea}>
        <View style={styles.mobileFooter}>
          <Pressable
            style={[
              styles.mobileContinueButton,
              !selectedProfileId && styles.mobileContinueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedProfileId}
          >
            <Text style={styles.mobileContinueText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );

  return (
    <Fragment>
      {isDesktop ? renderProfilesDesktop() : renderProfilesMobile()}
      <ProfileModal
        visible={isModalVisible}
        isDesktop={isDesktop}
        onRequestClose={closeModal}
      >
        <ProfileModalContent
          isDesktop={isDesktop}
          firstName={firstName}
          lastName={lastName}
          email={email}
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          gender={gender}
          relation={relation}
          birthDate={birthDate}
          formattedBirthDate={formattedBirthDate}
          allowEdit={allowEdit}
          submitError={submitError}
          formMessage={formMessage}
          isSaving={isSaving}
          activeDropdown={activeDropdown}
          genderOptions={GENDER_OPTIONS}
          relationOptions={RELATION_OPTIONS}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onOpenDatePicker={handleOpenDatePicker}
          onToggleDropdown={handleToggleDropdown}
          onSelectGender={handleSelectGender}
          onSelectRelation={handleSelectRelation}
          onChangeEmail={setEmail}
          onChangeCountryCode={setCountryCode}
          onChangePhoneNumber={setPhoneNumber}
          onToggleAllowEdit={setAllowEdit}
          onCancel={closeModal}
          onSave={handleSaveProfile}
          isWebDatePickerOpen={isWebDatePickerOpen}
          onSelectDate={handleDateChange}
          onCloseWebDatePicker={closeWebDatePicker}
          onClearDate={handleClearBirthDate}
        />
      </ProfileModal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleNativeDateConfirm}
        onCancel={() => {
          setDatePickerVisible(false);
          setActiveDropdown(null);
        }}
        display={Platform.OS === "ios" ? "inline" : "default"}
        maximumDate={new Date()}
      />
    </Fragment>
  );
}

type ProfileModalProps = {
  visible: boolean;
  isDesktop: boolean;
  onRequestClose: () => void;
  children: ReactNode;
};

function ProfileModal({ visible, isDesktop, onRequestClose, children }: ProfileModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={isDesktop ? "fade" : "slide"}
      onRequestClose={onRequestClose}
    >
      {isDesktop ? (
        <View style={styles.desktopModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={onRequestClose} />
          <View style={styles.desktopModalCard}>{children}</View>
        </View>
      ) : (
        <View style={styles.mobileModalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={onRequestClose} />
          <View style={styles.modalSheet}>{children}</View>
        </View>
      )}
    </Modal>
  );
}

