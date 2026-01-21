import Header from "@/components/Header";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const FriendsProfile = () => {
  const { user } = useUser();
  const { connectionId, friendUserId } = useLocalSearchParams<{
    connectionId?: string;
    friendUserId?: string;
  }>();

  const [customDisplayName, setCustomDisplayName] = useState("");
  const [personalNote, setPersonalNote] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch all friends to get the connection details with personal notes
  const myFriends = useQuery(api.products.getMyFriends, user?.id ? { user_id: user.id } : "skip");

  // Find the specific friend connection
  const friendConnection = myFriends?.find((f) => f.connection._id === connectionId);

  const friend = friendConnection?.profile;

  // Mutations
  const removeFriend = useMutation(api.products.removeFriend);
  const blockUser = useMutation(api.products.blockUser);
  const updateNotes = useMutation(api.products.updateFriendNotes);

  // Load existing personal notes when data is available
  useEffect(() => {
    if (friendConnection) {
      setCustomDisplayName(friendConnection.myCustomName || "");
      setPersonalNote(friendConnection.myPersonalNote || "");
    }
  }, [friendConnection]);

  // Track changes
  useEffect(() => {
    if (friendConnection) {
      const nameChanged = customDisplayName !== (friendConnection.myCustomName || "");
      const noteChanged = personalNote !== (friendConnection.myPersonalNote || "");
      setHasChanges(nameChanged || noteChanged);
    }
  }, [customDisplayName, personalNote, friendConnection]);

  const handleSaveNotes = async () => {
    if (!user?.id || !connectionId || !hasChanges) return;

    try {
      await updateNotes({
        connection_id: connectionId as any,
        user_id: user.id,
        personal_note: personalNote,
        custom_display_name: customDisplayName,
      });
      Alert.alert("Success", "Notes saved successfully");
      setHasChanges(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRemoveFriend = async () => {
    if (!user?.id || !connectionId) return;

    Alert.alert("Remove Friend", "Are you sure you want to remove this friend?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeFriend({ connection_id: connectionId as any, user_id: user.id });
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to remove friend");
          }
        },
      },
    ]);
  };

  const handleBlockUser = async () => {
    if (!user?.id || !friendUserId) return;

    Alert.alert("Block User", "Are you sure you want to block this user? This will also remove them from your friends.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Block",
        style: "destructive",
        onPress: async () => {
          try {
            await blockUser({ blocker_id: user.id, blocked_id: friendUserId });
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to block user");
          }
        },
      },
    ]);
  };

  const displayName = friend?.displayName || friend?.firstName || "Unknown User";
  const imageUrl = friend?.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";

  return (
    <View style={styles.container}>
      <Header title="Friend Profile" handleBack={handleBack} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image resizeMode="cover" style={styles.image} source={{ uri: imageUrl }} />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{displayName}</Text>
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Pressable style={[styles.button, styles.removeButton]} onPress={handleRemoveFriend}>
              <FontAwesome name="user-times" size={16} color="#FF3B30" />
              <Text style={[styles.buttonText, styles.removeButtonText]}>Remove Friend</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.blockButton]} onPress={handleBlockUser}>
              <FontAwesome name="ban" size={16} color="#FFFFFF" />
              <Text style={styles.buttonText}>Block User</Text>
            </Pressable>
          </View>

          <View style={styles.formContainer}>
            <TextInputField label="Custom Display Name" value={customDisplayName} onChangeText={setCustomDisplayName} placeholder={displayName} />
            <TextInputAreaField height={100} label="Personal Note (Private)" descriptionLimit={150} value={personalNote} onChangeText={setPersonalNote} placeholder="Add a personal note about this friend..." />

            {hasChanges && (
              <Pressable style={styles.saveButton} onPress={handleSaveNotes}>
                <Text style={styles.saveButtonText}>Save Notes</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
export default FriendsProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16.67,
    borderWidth: 4.71,
    borderColor: "#ffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C0335",
    fontFamily: "Nunito_700Bold",
  },
  formContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: "#330065",
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
  actionContainer: {
    width: "100%",
    paddingBottom: 40,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C0335",
    fontFamily: "Nunito_700Bold",
    marginBottom: 12,
  },

  button: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  removeButton: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    backgroundColor: "transparent",
    height: 35,
    borderRadius: 120,
  },
  removeButtonText: {
    color: "#FF3B30",
  },
  blockButton: {
    backgroundColor: "#FF3B30",
    height: 35,
    borderRadius: 120,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
});
