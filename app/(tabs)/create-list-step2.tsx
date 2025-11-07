import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";

// Stable, top-level FormField component
type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  style?: any;
};
const FormField = React.memo(
  ({
    label,
    value,
    onChangeText,
    multiline = false,
    rightIcon,
    placeholder,
    style,
  }: FormFieldProps) => (
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
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
    </View>
  )
);
FormField.displayName = "FormField";

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
  coverPhotoUri: string | null;
}

export default function CreateListStep2() {
  const [formData, setFormData] = useState<FormData>({
    eventTitle: "",
    eventNote: "",
    eventDate: "",
    shippingAddress: "",
    occasion: null,
    coverPhotoUri: null,
  });

  const [characterCount, setCharacterCount] = useState(0);
  const createList = useMutation(api.products.createList);
  const updateListDetails = useMutation(api.products.updateListDetails);
  const { user } = useUser();
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const existing = useQuery(api.products.getListById, listId ? { listId: listId as any } : "skip");

  React.useEffect(() => {
    if (existing) {
      setFormData({
        eventTitle: existing.title ?? "",
        eventNote: existing.note ?? "",
        eventDate: existing.eventDate ?? "",
        shippingAddress: existing.shippingAddress ?? "",
        occasion: (existing.occasion as Occasion) ?? null,
        coverPhotoUri: (existing.coverPhotoUri as string | null) ?? null,
      });
      setCharacterCount((existing.note ?? "").length);
    }
  }, [existing]);

  // Date picker state & handlers
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const showDatePicker = () => {
    if (Platform.OS === "web") {
      try {
        const input = document.createElement("input");
        input.type = "date";
        if (formData.eventDate) input.value = formData.eventDate;
        input.style.position = "fixed";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";
        document.body.appendChild(input);
        const cleanup = () => {
          input.onchange = null;
          input.onblur = null;
          if (input.parentNode) input.parentNode.removeChild(input);
        };
        input.onchange = () => {
          const value = input.value;
          if (value) updateFormData("eventDate", value);
          cleanup();
        };
        input.onblur = () => cleanup();
        if (typeof (input as any).showPicker === "function") {
          (input as any).showPicker();
        } else {
          input.click();
        }
      } catch {
        setDatePickerVisible(true);
      }
      return;
    }
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleDateConfirm = (date: Date) => {
    // Store as YYYY-MM-DD
    const formatted = date.toISOString().split("T")[0];
    updateFormData("eventDate", formatted);
    hideDatePicker();
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    try {
      if (listId) {
        // Editing existing list: update and then continue to step 3
        await updateListDetails({
          listId: listId as any,
          title: formData.eventTitle,
          note: formData.eventNote || null,
          eventDate: formData.eventDate || null,
          shippingAddress: formData.shippingAddress || null,
          occasion: formData.occasion || null,
          coverPhotoUri: formData.coverPhotoUri || null,
        });
        router.push({ pathname: "/create-list-step3", params: { listId: String(listId) } });
        return;
      }
      // Save a draft list with default privacy 'private'; step 3 can update it later if needed
      const newListId = await createList({
        title: formData.eventTitle,
        note: formData.eventNote || null,
        eventDate: formData.eventDate || null,
        shippingAddress: formData.shippingAddress || null,
        occasion: formData.occasion || null,
        coverPhotoUri: formData.coverPhotoUri || null,
        privacy: "private",
        user_id: user?.id ?? null,
      });
      router.push({ pathname: "/create-list-step3", params: { listId: String(newListId) } });
    } catch (e) {
      console.error("Failed to save list", e);
      Alert.alert("Error", "Could not save your list. Please try again.");
    }
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

  // Image picker for cover photo upload
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please allow photo library access to upload a cover photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset) return;

      const uri = asset.uri;
      const mime = asset.mimeType ?? "";
      const ext = uri.split(".").pop()?.toLowerCase();
      const isValidType =
        mime.startsWith("image/jpeg") ||
        mime.startsWith("image/png") ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "png";

      if (!isValidType) {
        Alert.alert("Unsupported file", "Please select a JPG or PNG image.");
        return;
      }

      const sizeBytes = asset.fileSize;
      if (typeof sizeBytes === "number" && sizeBytes > 4 * 1024 * 1024) {
        Alert.alert("File too large", "Please choose an image under 4MB.");
        return;
      }

      updateFormData("coverPhotoUri", uri);
    } catch (e) {
      console.error("Image picker error", e);
      Alert.alert("Upload failed", "Something went wrong. Please try again.");
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

  const headerTitle = listId ? 'Edit Event' : 'Create List'
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
              <Text style={styles.headerTitle}>{headerTitle}</Text>
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

            {/* Event Date - Date Picker */}
            <View style={styles.fieldContainer}>
              <Pressable onPress={showDatePicker} style={styles.fieldWrapper}>
                <Text
                  style={[
                    styles.textInput,
                    !formData.eventDate && styles.textInputEmpty,
                    { color: formData.eventDate ? "#1C0335" : "#D1D1D6" },
                  ]}
                >
                  {formData.eventDate || "Select a date"}
                </Text>
                <View style={styles.floatingLabel}>
                  <Text style={styles.floatingLabelText}>Event date</Text>
                </View>
                <View style={styles.rightIconContainer}>
                  <Ionicons name="calendar-outline" size={24} color="#AEAEB2" />
                </View>
              </Pressable>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
              display={Platform.OS === "ios" ? "inline" : "default"}
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

              <Pressable
                style={[
                  styles.uploadArea,
                  formData.coverPhotoUri && styles.uploadAreaPreview,
                ]}
                onPress={handlePickImage}
              >
                {formData.coverPhotoUri ? (
                  <Image
                    source={{ uri: formData.coverPhotoUri }}
                    style={styles.coverPhotoImage}
                  />
                ) : (
                  <View style={styles.uploadContent}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color="#3B0076"
                    />
                    <Text style={styles.uploadText}>Upload</Text>
                  </View>
                )}
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

        {/* Bottom space for global tab bar */}
        <View style={styles.tabBarSpacer} />
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
  uploadAreaPreview: {
    borderStyle: "solid",
    overflow: "hidden",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coverPhotoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
    height: 100, // Space for global tab bar
  },
});
