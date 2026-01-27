import DeleteConfirmation from "@/components/DeleteConfirmationModal";
import Header from "@/components/Header";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

interface FormData {
  name: string;
  description: string;
  coverPhotoUri: string | null;
  coverPhotoStorageId: string | null;
}

const EditCircle = () => {
  const { userId } = useAuth();
  const { returnTo, circleId } = useLocalSearchParams<{ returnTo?: string; circleId?: string }>();

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [adminToggles, setAdminToggles] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    coverPhotoUri: null,
    coverPhotoStorageId: null,
  });

  // Fetch circle details
  const circle = useQuery(api.products.getGroupById, circleId && userId ? { group_id: circleId as any, user_id: userId } : "skip");

  // Fetch circle members
  const members = useQuery(api.products.getGroupMembers, circleId ? { group_id: circleId as any } : "skip");

  // Mutations
  const generateCoverUploadUrl = useMutation(api.products.generateListCoverUploadUrl as any);
  const getCoverUrl = useMutation(api.products.getListCoverUrl as any);
  const updateGroup = useMutation(api.products.updateGroup);
  const removeGroupMember = useMutation(api.products.removeGroupMember);
  const updateMemberAdminStatus = useMutation(api.products.updateGroupMemberAdminStatus);

  // Initialize form data when circle loads
  useEffect(() => {
    if (circle) {
      setFormData({
        name: circle.name || "",
        description: circle.description || "",
        coverPhotoUri: circle.coverPhotoUri || null,
        coverPhotoStorageId: circle.coverPhotoStorageId || null,
      });
    }
  }, [circle]);

  // Initialize admin toggles when members load
  useEffect(() => {
    if (members) {
      const toggles: Record<string, boolean> = {};
      members.forEach((member) => {
        if (member.user_id && member.user_id !== circle?.owner_id) {
          toggles[member.user_id] = member.is_admin || false;
        }
      });
      setAdminToggles(toggles);
    }
  }, [members, circle]);

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePickImage = async (isReframe: boolean = false) => {
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
        allowsEditing: Platform.OS !== "web" || isReframe,
        aspect: Platform.OS !== "web" || isReframe ? [16, 9] : undefined,
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

  const handleSaveChanges = async () => {
    if (!circleId || !userId) return;

    try {
      setIsSaving(true);

      // Update circle details
      await updateGroup({
        group_id: circleId as any,
        user_id: userId,
        name: formData.name,
        description: formData.description,
        coverPhotoUri: formData.coverPhotoUri || undefined,
        coverPhotoStorageId: formData.coverPhotoStorageId || undefined,
      });

      // Update admin statuses for changed toggles
      if (members) {
        for (const member of members) {
          if (member.user_id && member.user_id !== circle?.owner_id) {
            const newAdminStatus = adminToggles[member.user_id] || false;
            const oldAdminStatus = member.is_admin || false;

            if (newAdminStatus !== oldAdminStatus) {
              await updateMemberAdminStatus({
                group_id: circleId as any,
                user_id: member.user_id,
                is_admin: newAdminStatus,
              });
            }
          }
        }
      }

      router.push("/(tabs)/circle");
    } catch (error: any) {
      console.error("Failed to update circle:", error);
      Alert.alert("Error", error?.message || "Failed to update circle. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = (memberUserId: string) => {
    setMemberToRemove(memberUserId);
    setShowRemoveModal(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove || !circleId || !userId) return;

    try {
      await removeGroupMember({
        group_id: circleId as any,
        member_user_id: memberToRemove,
        requester_user_id: userId,
      });
      setShowRemoveModal(false);
      setMemberToRemove(null);
    } catch (error: any) {
      console.error("Failed to remove member:", error);
      Alert.alert("Error", error?.message || "Failed to remove member");
      setShowRemoveModal(false);
      setMemberToRemove(null);
    }
  };

  const handleToggleAdmin = (memberUserId: string) => {
    setAdminToggles((prev) => ({
      ...prev,
      [memberUserId]: !prev[memberUserId],
    }));
  };

  const getMemberInitials = (member: any) => {
    const firstName = member.profile?.firstName || "";
    const lastName = member.profile?.lastName || "";
    const displayName = member.profile?.displayName || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (displayName) {
      const parts = displayName.split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return displayName.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const isLoading = circle === undefined || members === undefined;
  const regularMembers = members?.filter((m) => m.user_id !== circle?.owner_id) || [];
  const adminMembers = members?.filter((m) => m.user_id === circle?.owner_id) || [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Modify Circle" handleBack={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#3B0076" size="large" />
          <Text style={styles.loadingText}>Loading circle...</Text>
        </View>
      </View>
    );
  }

  if (!circle) {
    return (
      <View style={styles.container}>
        <Header title="Modify Circle" handleBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Circle not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Modify Circle" handleBack={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.mainTitle}>Edit Circle</Text>
          <View style={styles.formContainer}>
            <TextInputField label="Edit Circle Title" value={formData.name} onChangeText={(text) => updateFormData("name", text)} maxLength={30} placeholder="Enter circle name" />
            <TextInputAreaField label="Edit Circle Description" value={formData.description} onChangeText={(text) => updateFormData("description", text)} maxLength={150} placeholderTextColor="#D1D1D6" placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
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

        {/* Members Section */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionHeaderContainer, { paddingHorizontal: 16 }]}>
            <View style={styles.sectionTitleWithBadge}>
              <Text style={styles.sectionTitle}>Members</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{members.length}</Text>
              </View>
            </View>
            <Pressable style={styles.inviteButton}>
              <Text style={styles.inviteButtonText}>+ Add</Text>
            </Pressable>
          </View>

          <View style={styles.membersContainer}>
            {members.map((member, index) => (
              <View key={member.user_id || index} style={[styles.memberItem, index === members.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.memberLeft}>
                  <View style={styles.memberProfileAndInitial}>
                    {member.profile?.profileImageUrl ? (
                      <Image source={{ uri: member.profile.profileImageUrl }} style={styles.profileImage} />
                    ) : (
                      <View style={styles.initialsContainer}>
                        <Text style={styles.nameInitials}>{getMemberInitials(member)}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName} numberOfLines={1}>
                      {member.profile?.displayName || member.profile?.firstName || "Unknown"}
                    </Text>
                    <Text style={styles.memberEmail} numberOfLines={1}>
                      {member.profile?.contactEmail || "No email"}
                    </Text>
                  </View>
                </View>
                <View style={styles.memberRight}>
                  {adminToggles[member.user_id || ""] && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>ADMIN</Text>
                    </View>
                  )}
                  {circle.isOwner && member.user_id !== circle.owner_id && (
                    <Pressable style={styles.removeButton} onPress={() => handleRemoveMember(member.user_id || "")}>
                      <Entypo name="circle-with-cross" size={24} color="#3B0076" />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Admins Section */}
        <View style={[styles.section, { paddingHorizontal: 0 }]}>
          <View style={[styles.sectionTitleWithBadge, { paddingHorizontal: 16 }]}>
            <Text style={styles.sectionTitle}>Admins</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{adminMembers.length}</Text>
            </View>
          </View>

          <View style={styles.membersContainer}>
            {adminMembers.map((member, index) => (
              <View key={member.user_id || index} style={[styles.memberItem, index === adminMembers.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.memberLeft}>
                  <View style={styles.memberProfileAndInitial}>
                    {member.profile?.profileImageUrl ? (
                      <Image source={{ uri: member.profile.profileImageUrl }} style={styles.profileImage} />
                    ) : (
                      <View style={styles.initialsContainer}>
                        <Text style={styles.nameInitials}>{getMemberInitials(member)}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName} numberOfLines={1}>
                      {member.profile?.displayName || member.profile?.firstName || "Unknown"}
                    </Text>
                    <Text style={styles.memberEmail} numberOfLines={1}>
                      {member.profile?.contactEmail || "No email"}
                    </Text>
                  </View>
                </View>
                {circle.isOwner && member.user_id !== circle.owner_id && <Switch value={adminToggles[member.user_id || ""] || false} onValueChange={() => handleToggleAdmin(member.user_id || "")} trackColor={{ false: "#D1D1D6", true: "#34C759" }} thumbColor="#FFFFFF" ios_backgroundColor="#D1D1D6" />}
              </View>
            ))}
          </View>
        </View>

        {/* Back Button */}
        <View style={styles.bottomButtonContainer}>
          <Pressable style={[styles.backButton, isSaving && styles.backButtonDisabled]} onPress={handleSaveChanges} disabled={isSaving}>
            {isSaving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.backButtonText}>Back</Text>}
          </Pressable>
        </View>
      </ScrollView>

      {/* Modals */}
      <DeleteConfirmation visible={showRemoveModal} text="Are you sure you want to\nremove this member?" onCancel={() => setShowRemoveModal(false)} onDelete={confirmRemoveMember} deleteButtonText="Remove" />
    </View>
  );
};
export default EditCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#8E8E93",
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 28,
    paddingVertical: 17,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 28,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  countBadge: {
    backgroundColor: "#00A0FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },
  inviteButton: {
    backgroundColor: "#03FFEE",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inviteButtonText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  formContainer: {
    gap: 32,
    marginTop: 18,
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
  coverPhotoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    lineHeight: 24,
  },
  membersContainer: {
    borderRadius: 8,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  memberLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  memberRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberProfileAndInitial: {
    width: 48,
    height: 48,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#3B0076",
    justifyContent: "center",
    alignItems: "center",
  },
  nameInitials: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  memberEmail: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#8E8E93",
  },
  adminBadge: {
    backgroundColor: "#34C759",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  adminBadgeText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  removeButton: {
    padding: 4,
  },
  bottomButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  backButton: {
    height: 56,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
