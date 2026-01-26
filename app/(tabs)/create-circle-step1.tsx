import Header from "@/components/Header";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface FormData {
  name: string;
  description: string;
  coverPhotoUri: string | null;
  coverPhotoStorageId: string | null;
}

const CreateCircleStep1 = () => {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const { userId } = useAuth();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    coverPhotoUri: null,
    coverPhotoStorageId: null,
  });

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const generateCoverUploadUrl = useMutation(api.products.generateListCoverUploadUrl as any);
  const getCoverUrl = useMutation(api.products.getListCoverUrl as any);

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isFormValid = formData.name.trim().length > 0 && formData.name.length <= 50;

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handlePickImage = async () => {
    try {
      if (isUploadingCover) return;

      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Please allow photo library access to upload a cover photo.");
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: Platform.OS !== "web",
        aspect: Platform.OS !== "web" ? [16, 9] : undefined,
        quality: 0.9,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        Alert.alert("Error", "Failed to get image. Please try again.");
        return;
      }

      const uri = asset.uri;
      const mime = asset.mimeType ?? "";
      const ext = uri.split(".").pop()?.toLowerCase();
      const isValidType = mime.startsWith("image/jpeg") || mime.startsWith("image/png") || ext === "jpg" || ext === "jpeg" || ext === "png";

      if (!isValidType) {
        Alert.alert("Unsupported file", "Please select a JPG or PNG image.");
        return;
      }

      const sizeBytes = asset.fileSize;
      if (typeof sizeBytes === "number" && sizeBytes > 4 * 1024 * 1024) {
        Alert.alert("File too large", "Please choose an image under 4MB.");
        return;
      }

      setIsUploadingCover(true);
      const uploadUrl = await generateCoverUploadUrl();

      if (typeof uploadUrl !== "string" || uploadUrl.length === 0) {
        throw new Error("Failed to get upload URL");
      }

      let storageId: string | undefined;

      if (Platform.OS === "web") {
        let blob: Blob;
        if (asset && "file" in asset && asset.file instanceof File) {
          blob = asset.file;
        } else if (uri.startsWith("blob:")) {
          const response = await fetch(uri);
          if (!response.ok) throw new Error(`Failed to fetch blob: ${response.status}`);
          blob = await response.blob();
        } else if (uri.startsWith("data:")) {
          const response = await fetch(uri);
          blob = await response.blob();
        } else {
          const response = await fetch(uri);
          if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
          blob = await response.blob();
        }

        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          body: blob,
          headers: { "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream" },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "");
          throw new Error(`Upload failed with status ${uploadResponse.status}: ${errorText}`);
        }

        const parsed = await uploadResponse.json();
        storageId = parsed?.storageId;
      } else {
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, uri, {
          httpMethod: "POST",
          headers: { "Content-Type": mime && mime.length > 0 ? mime : "application/octet-stream" },
        });

        if (uploadResult.status !== 200) {
          throw new Error(`Upload failed with status ${uploadResult.status}`);
        }

        const parsed = JSON.parse(uploadResult.body ?? "{}");
        storageId = parsed?.storageId;
      }

      if (!storageId) throw new Error("No storageId returned from upload");

      const publicUrl = await getCoverUrl({ storageId } as any);
      updateFormData("coverPhotoUri", publicUrl);
      updateFormData("coverPhotoStorageId", storageId);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      Alert.alert("Upload failed", `Something went wrong: ${errorMessage}`);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleContinue = () => {
    if (!isFormValid) return;

    router.push({
      pathname: "/create-circle-step2",
      params: {
        name: formData.name,
        description: formData.description || "",
        coverPhotoUri: formData.coverPhotoUri || "",
        coverPhotoStorageId: formData.coverPhotoStorageId || "",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Add Circle Details" handleBack={handleBack} />

      <ProgressIndicator activeSteps={1} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Circle details</Text>
          <View style={styles.formContainer}>
            <TextInputField label="Circle title" maxLength={50} value={formData.name} onChangeText={(text) => updateFormData("name", text)} />
            <TextInputAreaField label="Circle Description (optional)" placeholderTextColor="#D1D1D6" placeholder="Share a sweet message, special instructions, or anything you'd like your guests to know" value={formData.description} onChangeText={(text) => updateFormData("description", text)} />
            <View style={styles.coverPhotoSection}>
              <Text style={styles.coverPhotoLabel}>Cover photo (optional)</Text>

              <Pressable style={[styles.uploadArea, formData.coverPhotoUri && styles.uploadAreaPreview, isUploadingCover && styles.uploadAreaDisabled]} onPress={handlePickImage} disabled={isUploadingCover}>
                {isUploadingCover ? (
                  <View style={styles.uploadingPlaceholder}>
                    <ActivityIndicator color="#4B0082" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                ) : formData.coverPhotoUri ? (
                  <Image source={{ uri: formData.coverPhotoUri }} style={styles.coverPhotoImage} resizeMode="contain" />
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
      </ScrollView>
      <View style={styles.bottomButtons}>
        <Pressable style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]} onPress={handleContinue} disabled={!isFormValid}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateCircleStep1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    gap: 40,
  },
  coverPhotoSection: {
    gap: 16,
  },
  coverPhotoLabel: {
    fontSize: 16,
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
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
  },
  continueButton: {
    height: 56,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
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
});
