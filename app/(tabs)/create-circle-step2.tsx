import Header from "@/components/Header";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo, Feather } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const CreateCircleStep2 = () => {
  const { returnTo, name, description, coverPhotoUri, coverPhotoStorageId } = useLocalSearchParams<{
    returnTo?: string;
    name?: string;
    description?: string;
    coverPhotoUri?: string;
    coverPhotoStorageId?: string;
  }>();
  const { userId } = useAuth();
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [showFriendSection, setShowFriendSection] = useState(true);

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  // Fetch friends from user_connections
  const friendsData = useQuery(api.products.getMyFriends, userId ? { user_id: userId } : "skip");
  const isLoadingFriends = friendsData === undefined;

  // Filter friends based on search text
  const filteredFriends = useMemo(() => {
    if (!friendsData) return [];
    if (!searchText.trim()) return friendsData;

    const searchLower = searchText.toLowerCase();
    return friendsData.filter((friend) => {
      const displayName = friend.profile?.displayName || "";
      const email = friend.profile?.contactEmail || "";
      const firstName = friend.profile?.firstName || "";
      const lastName = friend.profile?.lastName || "";
      return displayName.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower) || firstName.toLowerCase().includes(searchLower) || lastName.toLowerCase().includes(searchLower);
    });
  }, [friendsData, searchText]);

  // Get initials from name
  const getInitials = (profile: any) => {
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";
    const displayName = profile?.displayName || "";

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

  const toggleFriendSelection = (friendUserId: string) => {
    setSelectedFriends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(friendUserId)) {
        newSet.delete(friendUserId);
      } else {
        newSet.add(friendUserId);
      }
      return newSet;
    });
  };

  const clearAllSelections = () => {
    setSelectedFriends(new Set());
  };

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleContinue = () => {
    // if (selectedFriends.size === 0) return;

    router.push({
      pathname: "/create-circle-step3",
      params: {
        name: name || "",
        description: description || "",
        coverPhotoUri: coverPhotoUri || "",
        coverPhotoStorageId: coverPhotoStorageId || "",
        selectedFriendIds: JSON.stringify(Array.from(selectedFriends)),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Add Members" handleBack={handleBack} />

      <ProgressIndicator activeSteps={2} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Pressable style={[styles.expandableButton, showFriendSection && styles.expandableButtonActive]} onPress={() => setShowFriendSection(!showFriendSection)}>
          <View style={styles.expandableContent}>
            <Image source={require("@/assets/images/users.png")} />
            <Text style={styles.expandableText}>Add YallaWish Friends</Text>
          </View>
          <View>
            <Entypo name={showFriendSection ? "chevron-up" : "chevron-down"} size={24} color="#1C0335" />
          </View>
        </Pressable>
        {showFriendSection && (
          <View style={styles.expandableSection}>
            <View style={styles.expandableSearchSection}>
              <TextInputField label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} value={searchText} onChangeText={setSearchText} />
              <View style={styles.selectedAndClearContainer}>
                <Text style={styles.selectedText}>{selectedFriends.size} friends selected</Text>
                {selectedFriends.size > 0 && (
                  <Pressable onPress={clearAllSelections}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </Pressable>
                )}
              </View>
            </View>
            <View>
              {isLoadingFriends ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#3B0076" size="large" />
                  <Text style={styles.loadingText}>Loading friends...</Text>
                </View>
              ) : filteredFriends && filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => {
                  const friendUserId = friend.connection.requester_id === userId ? friend.connection.receiver_id : friend.connection.requester_id;
                  const isSelected = selectedFriends.has(friendUserId);
                  const displayName = friend.profile?.displayName || `${friend.profile?.firstName || ""} ${friend.profile?.lastName || ""}`.trim() || "Unknown";
                  const email = friend.profile?.contactEmail || "";
                  const initials = getInitials(friend.profile);
                  const profileImage = friend.profile?.profileImageUrl;

                  return (
                    <Pressable key={friendUserId} style={[styles.friendItem, index === filteredFriends.length - 1 && { borderBottomWidth: 0 }]} onPress={() => toggleFriendSelection(friendUserId)}>
                      <View style={styles.infoContainer}>
                        <View style={styles.friendProfileAndInitial}>{profileImage ? <Image source={{ uri: profileImage }} style={styles.profileImage} /> : <Text style={styles.nameInitials}>{initials}</Text>}</View>
                        <View>
                          <Text style={styles.friendName}>{displayName}</Text>
                          {email && <Text style={styles.friendEmail}>{email}</Text>}
                        </View>
                      </View>
                      <View style={[styles.checkButton, isSelected && styles.checkButtonActive]}>{isSelected && <Feather name="check" size={15} color="#ffffff" />}</View>
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>{searchText ? "No friends found matching your search" : "You don't have any YallaWish friends yet"}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        {/* Invite New Friends Section - Disabled for now */}
        <Pressable style={[styles.expandableButton, { borderRadius: 0, borderTopWidth: 0, borderBottomWidth: 0, opacity: 0.5 }]} disabled>
          <View style={styles.expandableContent}>
            <Image source={require("@/assets/images/users.png")} />
            <Text style={styles.expandableText}>Invite New Friends (Coming Soon)</Text>
          </View>
        </Pressable>
      </ScrollView>
      <View style={styles.bottomButtons}>
        <Pressable style={[styles.continueButton]} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Done</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateCircleStep2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  expandableButton: {
    height: 60,
    padding: 15.32,
    gap: 9.57,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expandableContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expandableText: {
    color: "#1C0335",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  expandableButtonActive: {
    borderBottomColor: "transparent",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  expandableSection: {
    paddingTop: 24,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: "#AEAEB2",
  },
  expandableSearchSection: {
    paddingHorizontal: 15.32,
  },
  selectedAndClearContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15.32,
  },
  selectedText: {
    color: "#1C0335",
    fontSize: 15.23,
    fontFamily: "Nunito_700Bold",
  },
  clearText: {
    color: "#AEAEB2",
    fontSize: 15.23,
    fontFamily: "Nunito_700Bold",
  },
  friendItem: {
    padding: 15.32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.96,
    borderColor: "#AEAEB2",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 7.66,
    alignItems: "center",
  },
  friendProfileAndInitial: {
    backgroundColor: "#A2845E",
    width: 45.95,
    height: 45.95,
    borderRadius: 7.66,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInitials: {
    color: "#ffff",
    fontSize: 15.32,
    fontFamily: "Nunito_900Black",
  },
  friendName: {
    fontSize: 15.32,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  friendEmail: {
    fontSize: 11.49,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderColor: "#AEAEB2",
    borderWidth: 1,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonActive: {
    backgroundColor: "#3B0076",
    borderColor: "#3B0076",
  },
  profileImage: {
    width: 45.95,
    height: 45.95,
    borderRadius: 7.66,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#8E8E93",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#8E8E93",
    textAlign: "center",
  },
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
  },
  continueButton: {
    height: 56,
    backgroundColor: "#34C759",
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
  addSelectedFriendsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  addSelectedFriendsButton: {
    height: 56,
    backgroundColor: "#6FFFF6",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  addSelectedFriendsButtonText: {
    color: "#3B0076",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  primaryButton: {
    height: 56,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffff",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
