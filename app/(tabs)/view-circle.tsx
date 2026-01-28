import CircleBanner from "@/components/circle/CircleBanner";
import SectionHeader from "@/components/circle/SectionHeader";
import ViewCircleGroupInfo from "@/components/circle/ViewCircleGroupInfo";
import DeleteConfirmation from "@/components/DeleteConfirmationModal";
import Header from "@/components/Header";
import WishListCard from "@/components/wishlists/WishListCard";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const ViewCircle = () => {
  const { returnTo, circleId } = useLocalSearchParams<{ returnTo?: string; circleId?: string }>();
  const { userId } = useAuth();
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  // Mutation for removing members
  const removeGroupMember = useMutation(api.products.removeGroupMember);

  // Fetch circle details
  const circle = useQuery(api.products.getGroupById, circleId && userId ? { group_id: circleId as any, user_id: userId } : "skip");

  // Fetch circle members with profiles
  const members = useQuery(api.products.getGroupMembers, circleId ? { group_id: circleId as any } : "skip");

  // Fetch owner profile
  const ownerProfile = useQuery(api.products.getUserProfileByUserId, circle?.owner_id ? { user_id: circle.owner_id } : "skip");

  // Fetch lists shared with this circle
  const listShares = useQuery(api.products.getListsByGroup, circleId ? { group_id: circleId as any } : "skip");

  const isLoading = circle === undefined || members === undefined;

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handlePressAddNew = () => {
    router.push({
      pathname: "/create-list-step1",
      params: { circleId },
    });
  };

  // Get member initials helper
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

  // Handle remove member button press
  const handleRemoveMember = (memberUserId: string, memberName: string) => {
    setMemberToRemove(memberUserId);
    setShowRemoveModal(true);
  };

  // Confirm member removal
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
    } catch (error) {
      console.error("Failed to remove member:", error);
      setShowRemoveModal(false);
      setMemberToRemove(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="View Circle" handleBack={handleBack} />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#3B0076" size="large" />
          <Text style={styles.loadingText}>Loading circle details...</Text>
        </View>
      ) : !circle ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Circle not found</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <CircleBanner coverPhotoUri={circle.coverPhotoUri} title={circle.name} />
          <ViewCircleGroupInfo createdBy={circle.isOwner ? "You" : ownerProfile?.displayName || ownerProfile?.firstName || "Unknown"} memberCount={circle.memberCount || 0} />
          <SectionHeader title="Occasions" count={listShares?.length || 0} buttonTitle={"Add New"} buttonAction={handlePressAddNew} />
          <View style={styles.section}>
            <FlatList scrollEnabled={false} columnWrapperStyle={styles.listColumnWrapperStyle} contentContainerStyle={styles.listContentContainerStyle} showsVerticalScrollIndicator={false} numColumns={2} key={2} data={listShares || []} renderItem={({ item }) => <WishListCard item={item} />} keyExtractor={(item) => String(item._id)} />
          </View>
          <SectionHeader title="Members" count={members?.length || 0} buttonTitle={"Invite"} />
          <View>
            <FlatList
              scrollEnabled={false}
              data={members || []}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={[styles.memberItem, index === (members?.length || 0) - 1 && { borderBottomWidth: 0 }]} key={index}>
                    <View style={styles.memberProfileAndInitial}>{item.profile?.profileImageUrl ? <Image source={{ uri: item.profile.profileImageUrl }} style={styles.profileImage} /> : <Text style={styles.nameInitials}>{getMemberInitials(item)}</Text>}</View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName} numberOfLines={1}>
                        {item.profile?.displayName || item.profile?.firstName || "Unknown"}
                      </Text>
                      <Text style={styles.memberEmail} numberOfLines={1}>
                        {item.profile?.contactEmail || "No email"}
                      </Text>
                    </View>
                    {item.is_admin ? (
                      <View style={styles.adminBadgeContainer}>
                        <View style={styles.adminBadge}>
                          <Text style={styles.adminBadgeText}>ADMIN</Text>
                        </View>
                        {circle.isOwner && item.user_id !== circle.owner_id && (
                          <Pressable style={styles.removeButton} onPress={() => handleRemoveMember(item.user_id, item.profile?.displayName || item.profile?.firstName || "this member")}>
                            <Entypo name="circle-with-cross" size={24} color="#3B0076" />
                          </Pressable>
                        )}
                      </View>
                    ) : circle.isOwner && item.user_id !== circle.owner_id ? (
                      <Pressable style={styles.removeButton} onPress={() => handleRemoveMember(item.user_id, item.profile?.displayName || item.profile?.firstName || "this member")}>
                        <Entypo name="circle-with-cross" size={24} color="#3B0076" />
                      </Pressable>
                    ) : null}
                  </View>
                );
              }}
            />
          </View>
          <View style={styles.footer}>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Invite Members</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}
      <DeleteConfirmation visible={showRemoveModal} text={"Are you sure you want to\nremove this member from the circle?"} onCancel={() => setShowRemoveModal(false)} onDelete={confirmRemoveMember} deleteButtonText="Remove" />
    </View>
  );
};

export default ViewCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#1C0335",
  },
  listContentContainerStyle: {
    gap: 8,
    paddingBottom: 16,
  },
  listColumnWrapperStyle: {
    gap: 8,
  },
  section: {
    paddingHorizontal: 10.5,
  },
  footer: {
    paddingTop: 57,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#330065",
    borderRadius: 8,
    alignItems: "center",
    height: 56,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    lineHeight: 19,
    letterSpacing: -0.02,
  },
  memberItem: {
    padding: 15.32,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 0.96,
    borderColor: "#AEAEB2",
  },
  memberProfileAndInitial: {
    backgroundColor: "#A2845E",
    width: 48,
    height: 48,
    borderRadius: 7.66,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 7.66,
  },
  memberInfo: {
    flex: 1,
    marginHorizontal: 8,
  },
  nameInitials: {
    color: "#FFFFFF",
    fontSize: 15.32,
    fontFamily: "Nunito_900Black",
  },
  memberName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  memberEmail: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
  adminBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  adminBadge: {
    backgroundColor: "#4CD964",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 0.5,
  },
  removeButton: {
    padding: 4,
  },
});
