import Header from "@/components/Header";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Fontisto } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";

const CreateCircleStep3 = () => {
  const { returnTo, name, description, coverPhotoUri, coverPhotoStorageId, selectedFriendIds } = useLocalSearchParams<{
    returnTo?: string;
    name?: string;
    description?: string;
    coverPhotoUri?: string;
    coverPhotoStorageId?: string;
    selectedFriendIds?: string;
  }>();
  const { userId } = useAuth();
  const { user } = useUser();
  const [adminUserIds, setAdminUserIds] = useState<Set<string>>(new Set());
  const [searchText, setSearchText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  // Parse selected friend IDs
  const memberUserIds = useMemo(() => {
    try {
      return selectedFriendIds ? JSON.parse(selectedFriendIds) : [];
    } catch {
      return [];
    }
  }, [selectedFriendIds]);

  // Fetch all friends to get their profile data
  const friendsData = useQuery(api.products.getMyFriends, userId ? { user_id: userId } : "skip");
  const createGroupMutation = useMutation(api.products.createGroup);

  // Filter to only show selected members
  const selectedMembers = useMemo(() => {
    if (!friendsData) return [];
    return friendsData.filter((friend) => {
      const friendUserId = friend.connection.requester_id === userId ? friend.connection.receiver_id : friend.connection.requester_id;
      return memberUserIds.includes(friendUserId);
    });
  }, [friendsData, memberUserIds, userId]);

  // Apply search filter
  const filteredMembers = useMemo(() => {
    if (!searchText.trim()) return selectedMembers;
    const searchLower = searchText.toLowerCase();
    return selectedMembers.filter((friend) => {
      const displayName = friend.profile?.displayName || "";
      const email = friend.profile?.contactEmail || "";
      const firstName = friend.profile?.firstName || "";
      const lastName = friend.profile?.lastName || "";
      return displayName.toLowerCase().includes(searchLower) || email.toLowerCase().includes(searchLower) || firstName.toLowerCase().includes(searchLower) || lastName.toLowerCase().includes(searchLower);
    });
  }, [selectedMembers, searchText]);

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

  const toggleAdmin = (memberUserId: string) => {
    setAdminUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberUserId)) {
        newSet.delete(memberUserId);
      } else {
        newSet.add(memberUserId);
      }
      return newSet;
    });
  };

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleContinue = async () => {
    if (!userId || !name) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    try {
      setIsCreating(true);

      // Create the group with members and admins
      const groupId = await createGroupMutation({
        owner_id: userId,
        name,
        description: description || undefined,
        coverPhotoUri: coverPhotoUri || undefined,
        coverPhotoStorageId: coverPhotoStorageId || undefined,
        member_user_ids: memberUserIds,
        admin_user_ids: Array.from(adminUserIds),
      });

      // Navigate to success screen
      router.push({ pathname: "/create-circle-success" });
    } catch (error) {
      console.error("Failed to create circle:", error);
      Alert.alert("Error", "Failed to create circle. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <View style={styles.container}>
      <Header title="Assign Admins" handleBack={handleBack} />
      <ProgressIndicator activeSteps={3} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {selectedMembers.length > 0 ? (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Who’s in charge?</Text>
              <Text style={styles.sectionDescription}>Admins can invite new members, approve, edit and manage circle settings</Text>
            </View>
          ) : (
            <View style={[styles.ownerInfo, styles.ownerInfoContainer]}>
              <View style={[styles.ownerImageContainer, styles.ownerImageWrapper]}>
                <Image style={styles.adminBadge} source={require("@/assets/images/adminOnlyMember.png")} />

                {user?.imageUrl ? (
                  <Image style={[styles.ownerImage, styles.ownerImageRounded]} source={{ uri: user.imageUrl }} />
                ) : (
                  <View style={[styles.ownerImageContainer, styles.fallbackAvatar]}>
                    <Text style={styles.nameInitials}>
                      {getInitials({
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        displayName: user?.fullName,
                      })}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.ownerTextContainer}>
                <Text style={[styles.sectionTitle, styles.sectionTitleTight]}>Assign Admins</Text>
                <Text style={styles.sectionDescription}>
                  Since there are no members in this circle yet, <Text style={styles.highlight}>you are the only Admin.</Text>
                </Text>
              </View>
            </View>
          )}
          <View style={styles.ownerContainer}>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerImageContainer}>
                {user?.imageUrl ? (
                  <Image style={styles.ownerImage} source={{ uri: user.imageUrl }} />
                ) : (
                  <View style={[styles.ownerImageContainer, { backgroundColor: "#3B0076" }]}>
                    <Text style={styles.nameInitials}>{getInitials({ firstName: user?.firstName, lastName: user?.lastName, displayName: user?.fullName })}</Text>
                  </View>
                )}
              </View>
              <View>
                <Text style={styles.ownerName}>You (Owner)</Text>
                <Text style={styles.ownerRole}>Super Admin</Text>
              </View>
            </View>
            <View>
              <Fontisto name="locked" size={24} color="#ABABAB" />
            </View>
          </View>
          <View style={styles.searchContainer}>
            <TextInputField label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} value={searchText} onChangeText={setSearchText} />
          </View>
          <View>
            {!friendsData ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#3B0076" size="large" />
                <Text style={styles.loadingText}>Loading members...</Text>
              </View>
            ) : filteredMembers.length > 0 ? (
              filteredMembers.map((friend, index) => {
                const memberUserId = friend.connection.requester_id === userId ? friend.connection.receiver_id : friend.connection.requester_id;
                const isAdmin = adminUserIds.has(memberUserId);
                const displayName = friend.profile?.displayName || `${friend.profile?.firstName || ""} ${friend.profile?.lastName || ""}`.trim() || "Unknown";
                const email = friend.profile?.contactEmail || "";
                const initials = getInitials(friend.profile);
                const profileImage = friend.profile?.profileImageUrl;

                return (
                  <View style={[styles.memberItem, index === filteredMembers.length - 1 && { borderBottomWidth: 0 }]} key={memberUserId}>
                    <View style={styles.infoContainer}>
                      <View style={styles.memberProfileAndInitial}>{profileImage ? <Image source={{ uri: profileImage }} style={styles.profileImage} /> : <Text style={styles.nameInitials}>{initials}</Text>}</View>
                      <View>
                        <Text style={styles.memberName}>{displayName}</Text>
                        {email && <Text style={styles.memberEmail}>{email}</Text>}
                      </View>
                    </View>
                    <Switch value={isAdmin} onValueChange={() => toggleAdmin(memberUserId)} trackColor={{ false: "#78788029", true: "#34C759" }} thumbColor="#FFFFFF" />
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{searchText ? "No members found matching your search" : "No members selected"}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomButtons}>
        <Pressable style={[styles.continueButton, isCreating && styles.continueButtonDisabled]} onPress={handleContinue} disabled={isCreating}>
          {isCreating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.continueButtonText}>Finish Circle Setup</Text>}
        </Pressable>
      </View>
    </View>
  );
};

export default CreateCircleStep3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 10,
    lineHeight: 28,
  },
  sectionDescription: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#AEAEB2",
  },
  ownerContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#AEAEB2",
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  ownerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ownerName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 16,
  },
  ownerRole: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#AEAEB2",
    lineHeight: 20,
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
  },
  memberItem: {
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
  memberProfileAndInitial: {
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
  memberName: {
    fontSize: 15.32,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  memberEmail: {
    fontSize: 11.49,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
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
  highlight: {
    color: "#1C1C1C",
  },
  ownerInfoContainer: {
    padding: 16,
    width: "100%",
  },

  // Profile image outer container
  ownerImageWrapper: {
    width: 88,
    height: 88,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: "visible",
    position: "relative",
  },

  // Admin badge image
  adminBadge: {
    position: "absolute",
    top: -28,
    right: -28,
    zIndex: 1,
  },

  // Owner image rounded
  ownerImageRounded: {
    borderRadius: 16,
  },

  // Fallback avatar container
  fallbackAvatar: {
    backgroundColor: "#3B0076",
  },

  // Text content container
  ownerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },

  sectionTitleTight: {
    marginBottom: 2,
  },
});
