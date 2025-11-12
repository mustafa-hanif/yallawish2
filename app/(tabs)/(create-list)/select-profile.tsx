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
  Switch,
  Text,
  TextInput,
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
type DropdownKey = "gender" | "relation";

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

  const formattedBirthDate = birthDate ? formatDisplayDate(birthDate) : "";
  const showEmptyState = !isLoadingProfiles && profiles.length === 0;

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

  const toggleDropdown = (key: DropdownKey) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
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

  const handleDateConfirm = (date: Date) => {
    setBirthDate(date);
    setDatePickerVisible(false);
    setActiveDropdown(null);
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

  const renderDropdown = (options: string[], onSelect: (value: string) => void) => (
    <View style={styles.dropdown}>
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => {
            onSelect(option);
            setActiveDropdown(null);
          }}
          style={styles.dropdownItem}
        >
          <Text style={styles.dropdownItemText}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderModalContent = () => (
    <ScrollView
      contentContainerStyle={
        isDesktop ? styles.desktopModalScroll : styles.mobileModalScroll
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={isDesktop ? styles.modalTitleDesktop : styles.modalTitle}>
        Create a profile for someone else
      </Text>
      <Text
        style={
          isDesktop ? styles.modalSubtitleDesktop : styles.modalSubtitle
        }
      >
        Add a child, partner, parent, or friend and build their wishlist on their behalf.
      </Text>

      <View style={[styles.fieldRow, isDesktop && styles.fieldRowDesktop]}>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>First name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            placeholder="John"
            placeholderTextColor="#B1A6C4"
            style={[styles.input, isDesktop && styles.inputDesktop]}
          />
        </View>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Last name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            placeholder="Doe"
            placeholderTextColor="#B1A6C4"
            style={[styles.input, isDesktop && styles.inputDesktop]}
          />
        </View>
      </View>

      <View style={[styles.fieldRow, isDesktop && styles.fieldRowDesktop]}>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Date of birth</Text>
          <Pressable
            onPress={() => {
              setDatePickerVisible(true);
              setActiveDropdown(null);
            }}
            style={[styles.input, styles.inputPressable, isDesktop && styles.inputDesktop]}
          >
            <Text style={formattedBirthDate ? styles.inputValue : styles.inputPlaceholder}>
              {formattedBirthDate || "Select date"}
            </Text>
            <Ionicons name="calendar-outline" size={18} color="#6F5F8F" />
          </Pressable>
        </View>
        <View
          style={[
            styles.field,
            isDesktop && styles.fieldHalf,
            activeDropdown === "gender" && styles.fieldDropdownActive,
          ]}
        >
          <Text style={styles.fieldLabel}>Gender</Text>
          <Pressable
            onPress={() => toggleDropdown("gender")}
            style={[styles.input, styles.inputPressable, isDesktop && styles.inputDesktop]}
          >
            <Text style={gender ? styles.inputValue : styles.inputPlaceholder}>
              {gender || "Select"}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
          </Pressable>
          {activeDropdown === "gender"
            ? renderDropdown(GENDER_OPTIONS, setGender)
            : null}
        </View>
      </View>

      <View style={[styles.fieldRow, isDesktop && styles.fieldRowDesktop]}>
        <View style={[styles.field, isDesktop && styles.fieldHalf]}>
          <Text style={styles.fieldLabel}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
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
              onChangeText={setCountryCode}
              placeholder="+971"
              placeholderTextColor="#B1A6C4"
              style={[styles.input, styles.countryInput, isDesktop && styles.inputDesktop]}
            />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="521 123 456"
              placeholderTextColor="#B1A6C4"
              keyboardType="phone-pad"
              style={[styles.input, styles.phoneInput, isDesktop && styles.inputDesktop]}
            />
          </View>
        </View>
      </View>

      <View style={[styles.field, activeDropdown === "relation" && styles.fieldDropdownActive]}>
        <Text style={styles.fieldLabel}>Relation with this person (optional)</Text>
        <Pressable
          onPress={() => toggleDropdown("relation")}
          style={[styles.input, styles.inputPressable, isDesktop && styles.inputDesktop]}
        >
          <Text style={relation ? styles.inputValue : styles.inputPlaceholder}>
            {relation || "Select"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6F5F8F" />
        </Pressable>
        {activeDropdown === "relation"
          ? renderDropdown(RELATION_OPTIONS, setRelation)
          : null}
      </View>

      <View style={styles.toggleRow}>
        <View style={styles.toggleTexts}>
          <Text style={styles.toggleTitle}>Allow them to edit</Text>
          <Text style={styles.toggleSubtitle}>
            They can add or update items on this list.
          </Text>
        </View>
        <Switch
          value={allowEdit}
          onValueChange={setAllowEdit}
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
          style={[styles.secondaryButton, isSaving && styles.buttonDisabled]}
          onPress={closeModal}
          disabled={isSaving}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
          onPress={() => handleSaveProfile(true)}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Save & Continue</Text>
          )}
        </Pressable>
      </View>

      <Pressable
        style={[styles.ghostButton, isSaving && styles.buttonDisabled]}
        onPress={() => handleSaveProfile(false)}
        disabled={isSaving}
      >
        <Text style={styles.ghostButtonText}>Save & add another</Text>
      </Pressable>
    </ScrollView>
  );

  return (
    <Fragment>
      {isDesktop ? renderProfilesDesktop() : renderProfilesMobile()}
      <ProfileModal
        visible={isModalVisible}
        isDesktop={isDesktop}
        onRequestClose={closeModal}
      >
        {renderModalContent()}
      </ProfileModal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisible(false)}
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

