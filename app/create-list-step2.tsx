import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

type Occasion =
  | "birthday"
  | "wedding"
  | "baby-shower"
  | "graduation"
  | "new-home"
  | "retirement"
  | "no-occasion"
  | "other"
  | null;

interface FormData {
  eventTitle: string;
  eventNote: string;
  eventDate: string;
  shippingAddress: string;
  occasion: Occasion;
}

export default function CreateListStep2() {
  const [formData, setFormData] = useState<FormData>({
    eventTitle: "",
    eventNote: "",
    eventDate: "",
    shippingAddress: "",
    occasion: null,
  });

  const [characterCount, setCharacterCount] = useState(0);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    console.log("Continue with form data:", formData);
    router.push("/create-list-step3");
  };

  const updateFormData = (field: keyof FormData, value: string | Occasion) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNoteChange = (text: string) => {
    if (text.length <= 400) {
      updateFormData("eventNote", text);
      setCharacterCount(text.length);
    }
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        {/* Step 1 - Completed */}
        <View style={[styles.progressSegment, styles.progressActive]} />
        {/* Step 2 - Active */}
        <View style={[styles.progressSegment, styles.progressActive]} />
        {/* Step 3 - Inactive */}
        <View style={[styles.progressSegment, styles.progressInactive]} />
      </View>
    </View>
  );

  const FormField = ({
    label,
    value,
    onChangeText,
    multiline = false,
    rightIcon,
    placeholder,
    style,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
    rightIcon?: React.ReactNode;
    placeholder?: string;
    style?: any;
  }) => (
    <View style={[styles.fieldContainer, style]}>
      <View style={styles.fieldWrapper}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
            !value && styles.textInputEmpty,
          ]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor="#D1D1D6"
        />
        <View style={styles.floatingLabel}>
          <Text style={styles.floatingLabelText}>{label}</Text>
        </View>
        {rightIcon && (
          <View style={styles.rightIconContainer}>{rightIcon}</View>
        )}
      </View>
    </View>
  );

  const OccasionItem = ({
    occasion,
    icon,
    title,
    borderColor,
    isSelected,
  }: {
    occasion: Occasion;
    icon: React.ReactNode;
    title: string;
    borderColor: string;
    isSelected: boolean;
  }) => (
    <Pressable
      style={[styles.occasionItem, { borderLeftColor: borderColor }]}
      onPress={() => updateFormData("occasion", occasion)}
    >
      <View style={styles.occasionContent}>
        <View style={styles.occasionLeft}>
          {icon}
          <Text style={styles.occasionTitle}>{title}</Text>
        </View>
        <View
          style={[styles.radioButton, isSelected && styles.radioButtonSelected]}
        >
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </View>
    </Pressable>
  );

  const occasions = [
    {
      id: "birthday" as Occasion,
      title: "Birthday",
      icon: <Ionicons name="gift" size={24} color="#1C0335" />,
      borderColor: "#FC0",
    },
    {
      id: "wedding" as Occasion,
      title: "Wedding",
      icon: <Ionicons name="heart" size={24} color="#1C0335" />,
      borderColor: "#FF3B30",
    },
    {
      id: "baby-shower" as Occasion,
      title: "Baby shower",
      icon: <Ionicons name="person" size={24} color="#1C0335" />,
      borderColor: "#91DA93",
    },
    {
      id: "graduation" as Occasion,
      title: "Graduation",
      icon: <Ionicons name="school" size={24} color="#1C0335" />,
      borderColor: "#32ADE6",
    },
    {
      id: "new-home" as Occasion,
      title: "New home",
      icon: <Ionicons name="home" size={24} color="#1C0335" />,
      borderColor: "#A2845E",
    },
    {
      id: "retirement" as Occasion,
      title: "Retirement",
      icon: <Ionicons name="person" size={24} color="#1C0335" />,
      borderColor: "#FF9500",
    },
    {
      id: "no-occasion" as Occasion,
      title: "No Occasion",
      icon: <Ionicons name="document-text" size={24} color="#1C0335" />,
      borderColor: "#4D4D4D",
    },
    {
      id: "other" as Occasion,
      title: "Other",
      icon: <Ionicons name="gift" size={24} color="#1C0335" />,
      borderColor: "#D1D1D6",
    },
  ];

  const isFormValid =
    formData.eventTitle.trim() !== "" && formData.occasion !== null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      {/* Header */}
      <LinearGradient
        colors={["#330065", "#6600CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            {/* Status Bar */}
            <View style={styles.statusBar}>
              <Text style={styles.timeText}>12:48</Text>
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={16} color="#FFFFFF" />
                <Ionicons name="wifi" size={16} color="#FFFFFF" />
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryFill} />
                </View>
              </View>
            </View>

            {/* Navigation */}
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>Create List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Progress Indicator */}
      <ProgressIndicator />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Giftlist Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giftlist details</Text>

          <View style={styles.formContainer}>
            <FormField
              label="Event title"
              value={formData.eventTitle}
              onChangeText={(text) => updateFormData("eventTitle", text)}
            />

            <View style={styles.fieldContainer}>
              <View style={[styles.fieldWrapper, styles.noteFieldWrapper]}>
                <TextInput
                  style={[styles.textInput, styles.noteInput]}
                  value={formData.eventNote}
                  onChangeText={handleNoteChange}
                  multiline
                  placeholder="Share a sweet message, special instructions, or anything you'd like your guests to know"
                  placeholderTextColor="#D1D1D6"
                />
                <View style={styles.floatingLabel}>
                  <Text style={styles.floatingLabelText}>
                    Add note (optional)
                  </Text>
                </View>
                <View style={styles.characterCount}>
                  <Text style={styles.characterCountText}>
                    {characterCount}
                  </Text>
                </View>
              </View>
            </View>

            <FormField
              label="Event date"
              value={formData.eventDate}
              onChangeText={(text) => updateFormData("eventDate", text)}
              rightIcon={
                <Ionicons name="calendar-outline" size={24} color="#AEAEB2" />
              }
            />

            <FormField
              label="Shipping Address (optional)"
              value={formData.shippingAddress}
              onChangeText={(text) => updateFormData("shippingAddress", text)}
              placeholder="Apt/house #, building/community area, city..."
              rightIcon={
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#AEAEB2"
                />
              }
            />

            {/* Cover Photo Upload */}
            <View style={styles.coverPhotoSection}>
              <Text style={styles.coverPhotoLabel}>Cover photo (optional)</Text>

              <Pressable style={styles.uploadArea}>
                <View style={styles.uploadContent}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color="#3B0076"
                  />
                  <Text style={styles.uploadText}>Upload</Text>
                </View>
              </Pressable>

              <Text style={styles.uploadInfo}>Max: 4MB | JPG, PNG | 16:9</Text>
            </View>
          </View>
        </View>

        {/* Choose Occasion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose occassion</Text>

          <View style={styles.occasionsContainer}>
            {occasions.map((occasion) => (
              <OccasionItem
                key={occasion.id}
                occasion={occasion.id}
                icon={occasion.icon}
                title={occasion.title}
                borderColor={occasion.borderColor}
                isSelected={formData.occasion === occasion.id}
              />
            ))}
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <Pressable
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            // disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>

          <Pressable style={styles.backButtonBottom} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        </View>

        {/* Bottom Tab Navigation Spacer */}
        <View style={styles.tabBarSpacer}>
          <View style={styles.tabBar}>
            <Ionicons name="home-outline" size={24} color="#8E8E93" />
            <Ionicons name="heart-outline" size={24} color="#8E8E93" />
            <View style={styles.addButton}>
              <Ionicons name="add" size={30} color="#FFFFFF" />
            </View>
            <Ionicons name="globe-outline" size={24} color="#8E8E93" />
            <Ionicons name="mail-outline" size={24} color="#8E8E93" />
          </View>
          <View style={styles.homeIndicator} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    paddingTop: 10,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  batteryIcon: {
    width: 22,
    height: 11,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 2,
    padding: 1,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    width: screenWidth - 32,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressActive: {
    backgroundColor: "#45018A",
  },
  progressInactive: {
    backgroundColor: "#DDD7E4",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 24,
    lineHeight: 28,
  },
  formContainer: {
    gap: 40,
  },
  fieldContainer: {
    position: "relative",
  },
  fieldWrapper: {
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    minHeight: 56,
    position: "relative",
  },
  noteFieldWrapper: {
    minHeight: 135,
  },
  textInput: {
    padding: 16,
    paddingTop: 24,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
    lineHeight: 24,
  },
  textInputMultiline: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  textInputEmpty: {
    paddingTop: 16,
  },
  noteInput: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: 24,
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    top: -9,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
  },
  floatingLabelText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 24,
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  characterCount: {
    position: "absolute",
    right: 16,
    bottom: 8,
  },
  characterCountText: {
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    lineHeight: 24,
  },
  coverPhotoSection: {
    gap: 16,
  },
  coverPhotoLabel: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 24,
  },
  uploadArea: {
    height: 134,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
    lineHeight: 16,
  },
  uploadInfo: {
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    lineHeight: 24,
    textAlign: "center",
  },
  occasionsContainer: {
    backgroundColor: "#FFFFFF",
  },
  occasionItem: {
    borderLeftWidth: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  occasionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  occasionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  occasionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 24,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#3B0076",
    backgroundColor: "#3B0076",
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  continueButton: {
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
  backButtonBottom: {
    borderWidth: 1,
    borderColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: "#3B0076",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
  tabBarSpacer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#D1D1D6",
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B0076",
    justifyContent: "center",
    alignItems: "center",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 34,
    backgroundColor: "#1C1C1C",
    alignSelf: "center",
    marginBottom: 8,
  },
});
