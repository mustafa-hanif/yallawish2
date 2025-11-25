import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
  useWindowDimensions
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";


type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  style?: any;
  inputStyle?: any;
  labelStyle?: any;
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
    inputStyle,
    labelStyle,
  }: FormFieldProps) => (
    <View style={[styles.fieldContainer, style]}>
      <View style={styles.fieldWrapper}>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
            !value && styles.textInputEmpty,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={placeholder}
          placeholderTextColor="#D1D1D6"
        />
        <View style={styles.floatingLabel}>
          <Text style={[styles.floatingLabelText, labelStyle]}>{label}</Text>
        </View>
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
    </View>
  )
);
FormField.displayName = "FormField";

const { width: screenWidth } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 1024;

type StepStatus = "complete" | "current" | "upcoming";

type StepItem = {
  label: string;
  status: StepStatus;
};

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
  coverPhotoStorageId: string | null;
}

type OccasionOption = {
  id: Exclude<Occasion, null>;
  title: string;
  borderColor: string;
  icon: (color: string, size: number) => React.ReactNode;
  mobileIcon?: React.ReactNode;
  backgroundColor?: string
};

const OCCASION_OPTIONS: OccasionOption[] = [
  {
    id: "birthday",
    title: "Birthday",
    borderColor: "#FC0",
    icon: (color, size) => <Ionicons name="gift" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/birthdayIcon.png")}/>,
    backgroundColor: "#FFF6D2"
  },
  {
    id: "wedding",
    title: "Wedding",
    borderColor: "#FF3B30",
    icon: (color, size) => <Ionicons name="heart" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/weddingIcon.png")}/>,
    backgroundColor: "#FFE0E0"
  },
  {
    id: "baby-shower",
    title: "Baby Shower",
    borderColor: "#91DA93",
    icon: (color, size) => <Ionicons name="person" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/babyShowerIcon.png")}/>,
    backgroundColor: "#F0F9F0"
  },
  {
    id: "graduation",
    title: "Graduation",
    borderColor: "#32ADE6",
    icon: (color, size) => <Ionicons name="school" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/graduationIcon.png")}/>,
    backgroundColor: "#D9F3FF"
  },
  {
    id: "new-home",
    title: "New Home",
    borderColor: "#A2845E",
    icon: (color, size) => <Ionicons name="home" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/newHomeIcon.png")}/>,
    backgroundColor: "#F5E8D5"
  },
  {
    id: "retirement",
    title: "Retirement",
    borderColor: "#FF9500",
    icon: (color, size) => <Ionicons name="person" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/retirementIcon.png")}/>,
    backgroundColor: "#FFEBCC"
  },
  {
    id: "no-occasion",
    title: "No Occasion",
    borderColor: "#4D4D4D",
    icon: (color, size) => (
      <Ionicons name="document-text" size={size} color={color} />
    ),
    mobileIcon: <Image source={require("@/assets/images/noOccasionIcon.png")}/>,
    backgroundColor: "#F4F4F4"
  },
  {
    id: "other",
    title: "Other",
    borderColor: "#D1D1D6",
    icon: (color, size) => <Ionicons name="gift" size={size} color={color} />,
    mobileIcon: <Image source={require("@/assets/images/otherIcon.png")}/>,
    backgroundColor: "#E9E9E9"
  },
];

export default function CreateListStep2() {
  const [formData, setFormData] = useState<FormData>({
    eventTitle: "",
    eventNote: "",
    eventDate: "",
    shippingAddress: "",
    occasion: null,
    coverPhotoUri: null,
    coverPhotoStorageId: null,
  });
  const [characterCount, setCharacterCount] = useState(0);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const createList = useMutation(api.products.createList);
  const updateListDetails = useMutation(api.products.updateListDetails);
  const generateCoverUploadUrl = useMutation(
    api.products.generateListCoverUploadUrl as any,
  );
  const getCoverUrl = useMutation(api.products.getListCoverUrl as any);
  const { user } = useUser();
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const existing = useQuery(
    api.products.getListById,
    listId ? { listId: listId as any } : "skip"
  );

  React.useEffect(() => {
    if (existing) {
      setFormData({
        eventTitle: existing.title ?? "",
        eventNote: existing.note ?? "",
        eventDate: existing.eventDate ?? "",
        shippingAddress: existing.shippingAddress ?? "",
        occasion: (existing.occasion as Occasion) ?? null,
        coverPhotoUri: (existing.coverPhotoUri as string | null) ?? null,
        coverPhotoStorageId: (existing as any)?.coverPhotoStorageId ?? null,
      });
      setCharacterCount((existing.note ?? "").length);
    }
  }, [existing]);

  const updateFormData = (
    field: keyof FormData,
    value: string | Occasion | null,
  ) => {
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
        await updateListDetails({
          listId: listId as any,
          title: formData.eventTitle,
          note: formData.eventNote || null,
          eventDate: formData.eventDate || null,
          shippingAddress: formData.shippingAddress || null,
          occasion: formData.occasion || null,
          coverPhotoUri: formData.coverPhotoUri || null,
          coverPhotoStorageId: formData.coverPhotoStorageId || null,
        });
        router.push({
          pathname: "/create-list-step3",
          params: { listId: String(listId) },
        });
        return;
      }

      const newListId = await createList({
        title: formData.eventTitle,
        note: formData.eventNote || null,
        eventDate: formData.eventDate || null,
        shippingAddress: formData.shippingAddress || null,
        occasion: formData.occasion || null,
        coverPhotoUri: formData.coverPhotoUri || null,
        coverPhotoStorageId: formData.coverPhotoStorageId || null,
        privacy: "private",
        user_id: user?.id ?? null,
      });
      router.push({
        pathname: "/create-list-step3",
        params: { listId: String(newListId) },
      });
    } catch (e) {
      console.error("Failed to save list", e);
      Alert.alert("Error", "Could not save your list. Please try again.");
    }
  };

  const handlePickImage = async () => {
    try {
      console.log("[ImageUpload] Starting image picker...");
      if (isUploadingCover) {
        console.log("[ImageUpload] Already uploading, skipping");
        return;
      }

      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow photo library access to upload a cover photo.",
          );
          return;
        }
      }

      console.log("[ImageUpload] Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: Platform.OS !== "web", // Disable editing on web as it may cause issues
        aspect: Platform.OS !== "web" ? [16, 9] : undefined,
        quality: 0.9,
      });

      console.log("[ImageUpload] Image picker result:", result);

      if (result.canceled) {
        console.log("[ImageUpload] User canceled");
        return;
      }

      const asset = result.assets?.[0];
      console.log("[ImageUpload] Selected asset:", asset);
      
      if (!asset?.uri) {
        console.error("[ImageUpload] No asset URI found");
        Alert.alert("Error", "Failed to get image. Please try again.");
        return;
      }

      const uri = asset.uri;
      const mime = asset.mimeType ?? "";
      const ext = uri.split(".").pop()?.toLowerCase();
      console.log("[ImageUpload] URI:", uri, "MIME:", mime, "EXT:", ext);
      
      const isValidType =
        mime.startsWith("image/jpeg") ||
        mime.startsWith("image/png") ||
        ext === "jpg" ||
        ext === "jpeg" ||
        ext === "png";

      if (!isValidType) {
        console.error("[ImageUpload] Invalid file type");
        Alert.alert("Unsupported file", "Please select a JPG or PNG image.");
        return;
      }

      const sizeBytes = asset.fileSize;
      console.log("[ImageUpload] File size:", sizeBytes);
      if (typeof sizeBytes === "number" && sizeBytes > 4 * 1024 * 1024) {
        console.error("[ImageUpload] File too large");
        Alert.alert("File too large", "Please choose an image under 4MB.");
        return;
      }

      console.log("[ImageUpload] Starting upload process...");
      setIsUploadingCover(true);

      console.log("[ImageUpload] Generating upload URL...");
      const uploadUrl = await generateCoverUploadUrl();
      console.log("[ImageUpload] Upload URL:", uploadUrl);
      
      if (typeof uploadUrl !== "string" || uploadUrl.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      let storageId: string | undefined;

      if (Platform.OS === "web") {
        // Web platform: use fetch with blob
        console.log("[ImageUpload] Web platform detected, processing blob...");
        let blob: Blob;
        
        // Check if we have a File object directly (some web implementations provide this)
        if (asset && 'file' in asset && asset.file instanceof File) {
          console.log("[ImageUpload] Using File object directly");
          blob = asset.file;
        } else if (uri.startsWith('blob:')) {
          // For blob URLs, fetch the blob
          console.log("[ImageUpload] Fetching blob URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch blob: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[ImageUpload] Blob fetched, size:", blob.size);
        } else if (uri.startsWith('data:')) {
          // For data URLs, convert to blob
          console.log("[ImageUpload] Converting data URL to blob...");
          const response = await fetch(uri);
          blob = await response.blob();
          console.log("[ImageUpload] Blob created, size:", blob.size);
        } else {
          // Try fetching as regular URL
          console.log("[ImageUpload] Fetching as regular URL...");
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
          }
          blob = await response.blob();
          console.log("[ImageUpload] Blob fetched, size:", blob.size);
        }

        console.log("[ImageUpload] Uploading blob to:", uploadUrl);
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: blob,
          headers: {
            "Content-Type":
              mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        console.log("[ImageUpload] Upload response status:", uploadResponse.status);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => '');
          console.error("[ImageUpload] Upload failed:", uploadResponse.status, errorText);
          throw new Error(
            `Upload failed with status ${uploadResponse.status}: ${errorText}`,
          );
        }

        try {
          const parsed = await uploadResponse.json();
          console.log("[ImageUpload] Upload response:", parsed);
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("[ImageUpload] Failed to parse upload response", parseError);
          const responseText = await uploadResponse.text().catch(() => '');
          console.error("[ImageUpload] Response body:", responseText);
          throw new Error("Unexpected response from upload service");
        }
      } else {
        // Native platforms: use FileSystem
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          headers: {
            "Content-Type":
              mime && mime.length > 0 ? mime : "application/octet-stream",
          },
        });

        if (uploadResult.status !== 200) {
          throw new Error(`Upload failed with status ${uploadResult.status}`);
        }

        try {
          const parsed = JSON.parse(uploadResult.body ?? "{}");
          storageId = parsed?.storageId;
        } catch (parseError) {
          console.error("Failed to parse upload response", parseError);
          throw new Error("Unexpected response from upload service");
        }
      }

      if (!storageId) {
        console.error("[ImageUpload] No storageId returned");
        throw new Error("No storageId returned from upload");
      }

      console.log("[ImageUpload] Getting public URL for storageId:", storageId);
      const publicUrl = await getCoverUrl({ storageId } as any);
      console.log("[ImageUpload] Public URL:", publicUrl);
      
      updateFormData("coverPhotoUri", publicUrl);
      updateFormData("coverPhotoStorageId", storageId);
      console.log("[ImageUpload] Upload completed successfully!");
    } catch (e) {
      console.error("[ImageUpload] Error:", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      console.error("[ImageUpload] Error message:", errorMessage);
      Alert.alert("Upload failed", `Something went wrong: ${errorMessage}`);
    }
    finally {
      setIsUploadingCover(false);
      console.log("[ImageUpload] Upload process finished");
    }
  };

  const isFormValid =
    formData.eventTitle.trim().length > 0 && formData.occasion !== null;

  const headerTitle = listId ? "Edit Event" : "Create Gift List";
  const steps: StepItem[] = [
    { label: "Who is this list for?", status: "complete" },
    { label: "Giftlist Details", status: "current" },
    { label: "Who can see this list?", status: "upcoming" },
  ];

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const onOccasionSelect = (occasionId: OccasionOption["id"]) =>
    updateFormData("occasion", occasionId);

  const datePicker =
    Platform.OS !== "web" ? (
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === "ios" ? "inline" : "default"}
      />
    ) : null;

  const layoutProps: SharedLayoutProps = {
    headerTitle,
    formData,
    characterCount,
    updateFormData,
    handleNoteChange,
    handleBack,
    handleContinue,
    showDatePicker,
    handlePickImage,
    isFormValid,
    isUploadingCover,
    occasions: OCCASION_OPTIONS,
    onOccasionSelect,
  };

  if (isDesktop) {
    return (
      <>
        <DesktopLayout steps={steps} {...layoutProps} />
        {datePicker}
      </>
    );
  }

  return (
    <>
      <MobileLayout {...layoutProps} />
      {datePicker}
    </>
  );
}

type SharedLayoutProps = {
  headerTitle: string;
  formData: FormData;
  characterCount: number;
  updateFormData: (
    field: keyof FormData,
    value: string | Occasion | null,
  ) => void;
  handleNoteChange: (text: string) => void;
  handleBack: () => void;
  handleContinue: () => void;
  showDatePicker: () => void;
  handlePickImage: () => void;
  isFormValid: boolean;
  isUploadingCover: boolean;
  occasions: OccasionOption[];
  onOccasionSelect: (occasionId: OccasionOption["id"]) => void;
};

type DesktopLayoutProps = SharedLayoutProps & {
  steps: StepItem[];
};

function DesktopLayout({
  headerTitle,
  formData,
  characterCount,
  updateFormData,
  handleNoteChange,
  handleBack,
  handleContinue,
  showDatePicker,
  handlePickImage,
  isFormValid,
  isUploadingCover,
  occasions,
  onOccasionSelect,
  steps,
}: DesktopLayoutProps) {
  return (
    <SafeAreaView style={styles.desktopSafeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.desktopWrapper}>
        <View style={styles.desktopSidebar}>
          <Pressable onPress={handleBack} style={styles.desktopBackLink}>
            <Ionicons name="chevron-back" size={20} color="#4B0082" />
            <Text style={styles.desktopBackText}>Back</Text>
          </Pressable>
          <Text style={styles.desktopTitle}>{headerTitle}</Text>
          <Text style={styles.desktopSubtitle}>
            To create your gift list, please provide the following details:
          </Text>
          <View style={styles.desktopStepList}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <View key={step.label} style={styles.desktopStepItem}>
                  <View style={styles.desktopStepIndicator}>
                    <View
                      style={[
                        styles.desktopStepCircle,
                        step.status === "complete" &&
                          styles.desktopStepCircleComplete,
                        step.status === "current" &&
                          styles.desktopStepCircleCurrent,
                      ]}
                    >
                      {step.status === "complete" ? (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      ) : (
                        <Text
                          style={[
                            styles.desktopStepNumber,
                            step.status === "current"
                              ? styles.desktopStepNumberActive
                              : styles.desktopStepNumberInactive,
                          ]}
                        >
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    {!isLast && <View style={styles.desktopStepConnector} />}
                  </View>
                  <Text
                    style={[
                      styles.desktopStepLabel,
                      step.status === "current" &&
                        styles.desktopStepLabelActive,
                      step.status === "complete" &&
                        styles.desktopStepLabelComplete,
                    ]}
                  >
                    {step.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.desktopContentScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.desktopContent}>
            <Text style={styles.desktopSectionHeading}>Giftlist Details</Text>
            <View style={styles.desktopCoverSection}>
              <Text style={styles.desktopCoverLabel}>
                Cover Photo (optional)
              </Text>
              <Pressable
                style={[
                  styles.uploadArea,
                  styles.desktopUploadArea,
                  formData.coverPhotoUri && styles.uploadAreaPreview,
                  isUploadingCover && styles.uploadAreaDisabled,
                ]}
                onPress={handlePickImage}
                disabled={isUploadingCover}
              >
                {isUploadingCover ? (
                  <View style={styles.uploadingPlaceholder}>
                    <ActivityIndicator color="#4B0082" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : formData.coverPhotoUri ? (
                  <Image
                    source={{ uri: formData.coverPhotoUri }}
                    style={styles.desktopCoverPhotoImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.desktopUploadContent}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={20}
                      color="#4B0082"
                    />
                    <Text style={styles.desktopUploadText}>
                      Upload cover photo
                    </Text>
                  </View>
                )}
              </Pressable>
              <Text style={styles.desktopUploadInfo}>
                Max size: 4MB. Only JPG, JPEG and PNG with a ratio of 16:9
              </Text>
            </View>

            <View style={styles.desktopFieldGrid}>
              <View style={styles.desktopFieldColumn}>
                <Text style={styles.desktopFieldLabel}>Event Title *</Text>
                <TextInput
                  style={styles.desktopTextInput}
                  value={formData.eventTitle}
                  onChangeText={(text) => updateFormData("eventTitle", text)}
                  placeholder="Event Title"
                  placeholderTextColor="#8E8EA9"
                />
              </View>
              <View style={styles.desktopFieldColumn}>
                <Text style={styles.desktopFieldLabel}>
                  Event Date (optional)
                </Text>
                <Pressable
                  onPress={showDatePicker}
                  style={styles.desktopDateInput}
                >
                  <Text
                    style={[
                      styles.desktopDateText,
                      !formData.eventDate && styles.desktopDatePlaceholder,
                    ]}
                  >
                    {formData.eventDate || "DD/MM/YYYY"}
                  </Text>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#AEAEB2"
                  />
                </Pressable>
              </View>
            </View>

            <View style={[styles.desktopFieldGrid, styles.desktopFieldGridGap]}>
              <View style={styles.desktopFieldColumn}>
                <Text style={styles.desktopFieldLabel}>
                  Shipping Address (optional)
                </Text>
                <TextInput
                  style={styles.desktopTextInput}
                  value={formData.shippingAddress}
                  onChangeText={(text) =>
                    updateFormData("shippingAddress", text)
                  }
                  placeholder="Apt/house #, building/community area, city..."
                  placeholderTextColor="#8E8EA9"
                />
              </View>
              <View style={styles.desktopFieldColumn}>
                <Text style={styles.desktopFieldLabel}>
                  Add Note (optional)
                </Text>
                <TextInput
                  style={[styles.desktopTextInput, styles.desktopNoteInput]}
                  value={formData.eventNote}
                  onChangeText={handleNoteChange}
                  placeholder="Share a sweet message, special instructions, or anything you'd like your guests to know"
                  placeholderTextColor="#8E8EA9"
                  multiline
                />
                <Text style={styles.desktopCharacterCount}>
                  {characterCount}/400
                </Text>
              </View>
            </View>

            <View style={styles.desktopOccasionSection}>
              <Text style={styles.desktopSectionHeading}>Choose Occasion *</Text>
              <View style={styles.desktopOccasionGrid}>
                {occasions.map((option) => (
                  <DesktopOccasionCard
                    key={option.id}
                    option={option}
                    selected={formData.occasion === option.id}
                    onPress={() => onOccasionSelect(option.id)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.desktopActions}>
              <Pressable onPress={handleBack} style={styles.desktopBackButton}>
                <Text style={styles.desktopBackButtonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={handleContinue}
                disabled={!isFormValid}
                style={[
                  styles.desktopContinueButton,
                  !isFormValid && styles.desktopContinueButtonDisabled,
                ]}
              >
                <Text style={styles.desktopContinueButtonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

type DesktopOccasionCardProps = {
  option: OccasionOption;
  selected: boolean;
  onPress: () => void;
};

function DesktopOccasionCard({
  option,
  selected,
  onPress,
}: DesktopOccasionCardProps) {
  const accentColor = option.borderColor;
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.desktopOccasionCard,
        { borderColor: accentColor },
        selected && styles.desktopOccasionCardSelected,
      ]}
    >
      <View style={styles.desktopOccasionHeader}>
        <View style={styles.desktopOccasionInfo}>
          {option.icon("#330065", 18)}
          <Text style={styles.desktopOccasionTitle}>{option.title}</Text>
        </View>
        <View
          style={[
            styles.desktopOccasionRadio,
            selected && styles.desktopOccasionRadioSelected,
          ]}
        >
          {selected && <View style={styles.desktopOccasionRadioDot} />}
        </View>
      </View>
    </Pressable>
  );
}

function MobileLayout({
  headerTitle,
  formData,
  characterCount,
  updateFormData,
  handleNoteChange,
  handleBack,
  handleContinue,
  showDatePicker,
  handlePickImage,
  isFormValid,
  isUploadingCover,
  occasions,
  onOccasionSelect,
}: SharedLayoutProps) {
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient
        colors={["#330065", "#45018ad7"]}
        locations={[0, 0.7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 2 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>{headerTitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ProgressIndicator />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giftlist details</Text>

          <View style={styles.formContainer}>
            <FormField
              label="Event title *"
              value={formData.eventTitle}
              onChangeText={(text) => updateFormData("eventTitle", text)}
              style={{ minHeight: 'auto' }}
              
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
                  <Text style={styles.characterCountText}>{characterCount}</Text>
                </View>
              </View>
            </View>

            <View style={{...styles.fieldContainer, ...{ minHeight: 'auto' }}}>
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

            <FormField
              style={{ minHeight: 'auto' }}
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

            <View style={styles.coverPhotoSection}>
              <Text style={styles.coverPhotoLabel}>Cover photo (optional)</Text>

              <Pressable
                style={[
                  styles.uploadArea,
                  formData.coverPhotoUri && styles.uploadAreaPreview,
                  isUploadingCover && styles.uploadAreaDisabled,
                ]}
                onPress={handlePickImage}
                disabled={isUploadingCover}
              >
                {isUploadingCover ? (
                  <View style={styles.uploadingPlaceholder}>
                    <ActivityIndicator color="#4B0082" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : formData.coverPhotoUri ? (
                  <Image
                    source={{ uri: formData.coverPhotoUri }}
                    style={styles.coverPhotoImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.uploadContent}>
                    <Image source={require("@/assets/images/uploadIcon.png")} />
                    <Text style={styles.uploadText}>Upload</Text>
                  </View>
                )}
              </Pressable>

              <Text style={styles.uploadInfo}>Max: 4MB | JPG, PNG | 16:9</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Occasion *</Text>

          <View style={styles.occasionsContainer}>
            {occasions.map((option) => (
              <OccasionItem
                key={option.id}
                option={option}
                isSelected={formData.occasion === option.id}
                onSelect={onOccasionSelect}
              />
            ))}
          </View>
        </View>

        <View style={styles.tabBarSpacer} />
      </ScrollView>

      <View style={styles.bottomButtons}>
        <Pressable
          style={[
            styles.continueButton,
            !isFormValid && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
        <Pressable onPress={handleBack} style={styles.backButtonBottom}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}

type OccasionItemProps = {
  option: OccasionOption;
  isSelected: boolean;
  onSelect: (occasionId: OccasionOption["id"]) => void;
};

function OccasionItem({ option, isSelected, onSelect }: OccasionItemProps) {
      const scale = useSharedValue(0);

      React.useEffect(() => {
        scale.value = withTiming(isSelected ? 1 : 0, { duration:700 });
      }, [isSelected]);

      const bgStyle = useAnimatedStyle(() => ({transform: [{ scaleX: scale.value }],}));


  return (
     <Pressable onPress={() => onSelect(option.id)} style={[styles.occasionItem, { borderLeftColor: option.borderColor }]}>
      <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: option.backgroundColor,
                borderTopRightRadius: 40,
                borderBottomRightRadius: 40,
                transformOrigin: "left",
              },
              bgStyle,
            ]}
          />

      {/* Content on top */}
      <View style={styles.occasionContent}>
        <View style={styles.occasionLeft}>
          {option.mobileIcon}
          <Text style={styles.occasionTitle}>{option.title}</Text>
        </View>

        <View
          style={[
            styles.radioButton,
            isSelected && styles.radioButtonSelected,
          ]}
        >
          {isSelected && <View style={styles.radioButtonInner} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 108,
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
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 24,
    lineHeight: 28,
  },
  formContainer: {
    gap: 24,
  },
  fieldContainer: {
    minHeight: 135,
  },
  fieldWrapper: {
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#FFFFFF",
  },
  noteFieldWrapper: {
    minHeight: 160,
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
  uploadAreaDisabled: {
    opacity: 0.6,
  },
  uploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  uploadingPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coverPhotoImage: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    fontSize: 16,
    // fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
    lineHeight: 16,
  },
  uploadingText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  uploadInfo: {
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    lineHeight: 24,
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
    paddingVertical: 16,
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
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
  tabBarSpacer: {
    height: 100,
  },
  desktopSafeArea: {
    flex: 1,
    backgroundColor: "#F8F5FF",
  },
  desktopWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  desktopSidebar: {
    width: 320,
    paddingVertical: 56,
    paddingHorizontal: 48,
    backgroundColor: "#FBF8FF",
    borderRightWidth: 1,
    borderRightColor: "#E7DCF6",
  },
  desktopBackLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  desktopBackText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  desktopTitle: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
    marginBottom: 12,
  },
  desktopSubtitle: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#4A3B66",
    lineHeight: 24,
    marginBottom: 40,
  },
  desktopStepList: {
    gap: 24,
  },
  desktopStepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  desktopStepIndicator: {
    alignItems: "center",
    position: "relative",
  },
  desktopStepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#D8C9F6",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  desktopStepCircleComplete: {
    backgroundColor: "#4B0082",
    borderColor: "#4B0082",
  },
  desktopStepCircleCurrent: {
    borderColor: "#4B0082",
    backgroundColor: "#F5EDFF",
  },
  desktopStepNumber: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  desktopStepNumberActive: {
    color: "#4B0082",
  },
  desktopStepNumberInactive: {
    color: "#8E8EA9",
  },
  desktopStepConnector: {
    position: "absolute",
    top: 44,
    left: 19,
    width: 2,
    height: 48,
    backgroundColor: "#E7DCF6",
  },
  desktopStepLabel: {
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    color: "#8E8EA9",
    flex: 1,
  },
  desktopStepLabelActive: {
    color: "#330065",
  },
  desktopStepLabelComplete: {
    color: "#4B0082",
  },
  desktopContentScroll: {
    flexGrow: 1,
    paddingVertical: 56,
    paddingHorizontal: 64,
  },
  desktopContent: {
    flex: 1,
    gap: 40,
  },
  desktopSectionHeading: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
  },
  desktopCoverSection: {
    gap: 16,
  },
  desktopCoverLabel: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
  },
  desktopUploadArea: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D8C9F6",
    borderStyle: "dashed",
    backgroundColor: "#FFFFFF",
  },
  desktopUploadContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  desktopUploadText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  desktopUploadInfo: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#6B5C87",
  },
  desktopCoverPhotoImage: {
    width: "100%",
    height: "100%",
  },
  desktopFieldGrid: {
    flexDirection: "row",
    gap: 32,
  },
  desktopFieldGridGap: {
    marginTop: 8,
  },
  desktopFieldColumn: {
    flex: 1,
  },
  desktopFieldLabel: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4A3B66",
    marginBottom: 12,
  },
  desktopTextInput: {
    borderWidth: 1,
    borderColor: "#D8C9F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#330065",
    backgroundColor: "#FFFFFF",
  },
  desktopDateInput: {
    borderWidth: 1,
    borderColor: "#D8C9F6",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  desktopDateText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#330065",
  },
  desktopDatePlaceholder: {
    color: "#8E8EA9",
  },
  desktopNoteInput: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  desktopCharacterCount: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#8E8EA9",
  },
  desktopOccasionSection: {
    gap: 24,
  },
  desktopOccasionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  desktopOccasionCard: {
    flexGrow: 1,
    minWidth: 240,
    maxWidth: 320,
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  desktopOccasionCardSelected: {
    borderColor: "#4B0082",
    backgroundColor: "#F5EDFF",
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 12px 16px 0px rgba(75, 0, 130, 0.12)",
        }
      : {
          shadowColor: "#4B0082",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 12 },
          elevation: 4,
        }),
  },
  desktopOccasionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  desktopOccasionInfo: {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  desktopOccasionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    color: "#330065",
  },
  desktopOccasionRadio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D8C9F6",
    alignItems: "center",
    justifyContent: "center",
  },
  desktopOccasionRadioSelected: {
    borderColor: "#4B0082",
  },
  desktopOccasionRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4B0082",
  },
  desktopActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  desktopBackButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#4B0082",
    backgroundColor: "#FFFFFF",
  },
  desktopBackButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  desktopContinueButton: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 10,
    backgroundColor: "#4B0082",
  },
  desktopContinueButtonDisabled: {
    backgroundColor: "#CDB8EC",
  },
  desktopContinueButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
});
