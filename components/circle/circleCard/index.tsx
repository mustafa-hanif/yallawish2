import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import DeleteConfirmation from "../../DeleteConfirmationModal";
import BottomSheet from "../../ui/BottomSheet";
import { styles } from "./style";

interface CircleCardProps {
  circle?: {
    _id: any;
    name: string;
    description?: string | null;
    coverPhotoUri?: string | null;
    owner_id: string;
    memberCount?: number;
    occasionCount?: number;
    nextEventDate?: string | null;
    totalGiftItems?: number;
    isArchived?: boolean;
    isOwner?: boolean;
    isAdmin?: boolean;
  };
  ownerProfile?: {
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    profileImageUrl?: string | null;
  } | null;
}

export default function CircleCard({ circle, ownerProfile }: CircleCardProps) {
  const { userId } = useAuth();
  const [isBottomSheet, setIsBottomSheet] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showArchiveConfirmation, setShowArchiveConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const deleteGroup = useMutation(api.products.deleteGroup);
  const toggleGroupArchived = useMutation(api.products.toggleGroupArchivedForUser);
  const leaveGroup = useMutation(api.products.leaveGroup);

  // Get owner initials
  const getOwnerInitials = () => {
    if (!ownerProfile) return "??";
    const firstName = ownerProfile.firstName || "";
    const lastName = ownerProfile.lastName || "";
    const displayName = ownerProfile.displayName || "";

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

  const handleViewCircle = () => {
    if (circle?._id) {
      router.push({
        pathname: "/view-circle",
        params: { circleId: circle._id },
      });
    }
  };

  const handleLongPress = () => {
    setIsBottomSheet(true);
  };

  const handleDeleteCircle = async () => {
    try {
      if (circle?._id) {
        await deleteGroup({ group_id: circle._id });
        setShowDeleteConfirmation(false);
        setIsBottomSheet(false);
        // Optionally navigate back or refresh
      }
    } catch (error) {
      console.error("Failed to delete circle:", error);
    }
  };

  const handleArchiveCircle = async () => {
    try {
      if (circle?._id && userId) {
        await toggleGroupArchived({
          group_id: circle._id,
          user_id: userId,
        });
        setShowArchiveConfirmation(false);
        setIsBottomSheet(false);
      }
    } catch (error) {
      console.error("Failed to toggle archive:", error);
    }
  };

  const handleExitCircle = async () => {
    try {
      if (circle?._id && userId) {
        await leaveGroup({
          group_id: circle._id,
          user_id: userId,
        });
        setShowExitConfirmation(false);
        setIsBottomSheet(false);
        // Navigate back to circles list
        router.push("/circle");
      }
    } catch (error: any) {
      console.error("Failed to leave circle:", error);
      // Show error alert to user
      alert(error?.message || "Failed to leave circle. Please try again.");
      setShowExitConfirmation(false);
    }
  };

  const handleActionPress = async (actionTitle: string) => {
    if (actionTitle === "Delete Circle") {
      setIsBottomSheet(false);
      setShowDeleteConfirmation(true);
    } else if (actionTitle === "Archive Circle" || actionTitle === "Unarchive Circle") {
      setIsBottomSheet(false);
      setShowArchiveConfirmation(true);
    } else if (actionTitle === "Exit Circle") {
      setIsBottomSheet(false);
      setShowExitConfirmation(true);
    } else if (actionTitle === "Edit Circle") {
      router.push({
        pathname: "/edit-circle",
        params: { circleId: circle?._id },
      });
      setIsBottomSheet(false);
    }
    // Handle other actions here
  };

  // Define actions based on user role
  const isOwnerOrAdmin = circle?.isOwner || circle?.isAdmin;

  const quickActions = isOwnerOrAdmin
    ? [
        { title: "Edit Circle", icon: require("@/assets/images/Edit.png") },
        { title: "Invite Members", icon: require("@/assets/images/inviteMembers.png") },
        { title: "Copy share link", icon: require("@/assets/images/copyShareLink.png") },
        {
          title: circle?.isArchived ? "Unarchive Circle" : "Archive Circle",
          icon: require("@/assets/images/archiveList.png"),
        },
        { title: "Delete Circle", icon: require("@/assets/images/deleteList.png") },
      ]
    : [
        { title: "Invite Members", icon: require("@/assets/images/inviteMembers.png") },
        { title: "Copy share link", icon: require("@/assets/images/copyShareLink.png") },
        {
          title: circle?.isArchived ? "Unarchive Circle" : "Archive Circle",
          icon: require("@/assets/images/archiveList.png"),
        },
        { title: "Exit Circle", icon: require("@/assets/images/archiveList.png") },
      ];

  // Format next event date
  const formatEventDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No events";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${day} ${month}`;
  };

  const numberOfMembers = circle?.memberCount || 0;
  const numberOfGiftItems = circle?.totalGiftItems || 0;
  const nextEvent = formatEventDate(circle?.nextEventDate);
  const numberOfOccasions = circle?.occasionCount || 0;
  const isArchived = circle?.isArchived || false;
  const statusText = isArchived ? "Archived" : "Active";
  const statusBackgroundColor = isArchived ? "#8E8E93" : "#4CD964";

  return (
    <>
      <Pressable style={styles.container} onLongPress={handleLongPress}>
        <View style={styles.header}>
          {circle?.coverPhotoUri ? <Image source={{ uri: circle.coverPhotoUri }} style={styles.headerImage} /> : <View style={[styles.headerImage, { backgroundColor: "#D1D1D6" }]} />}
          <View style={styles.headerContent}>
            <View style={styles.headerContentTop}>
              <View style={styles.circleOccasions}>
                <Text numberOfLines={1} style={styles.circleOccasionsText}>
                  {numberOfOccasions} Occasions
                </Text>
              </View>
              <View style={[styles.circleStatus, { backgroundColor: statusBackgroundColor }]}>
                <Text numberOfLines={1} style={styles.circleStatusText}>
                  {statusText}
                </Text>
              </View>
            </View>
            <View style={styles.headerContentBottom}>
              <View style={styles.circleAdminInitials}>{ownerProfile?.profileImageUrl ? <Image source={{ uri: ownerProfile.profileImageUrl }} style={{ width: "100%", height: "100%", borderRadius: 8 }} /> : <Text style={styles.circleAdminInitialsText}>{getOwnerInitials()}</Text>}</View>
              <View style={{ flex: 1, maxWidth: "85%" }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.circleTitle}>
                  {circle?.name || "Untitled Circle"}
                </Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.circleDescription}>
                  {circle?.description || "No description"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyItem}>
            <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/users.png")} />
            <Text style={styles.bodyItemText}>{numberOfMembers}</Text>
          </View>
          <View style={styles.bodyItem}>
            <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/gift.png")} />
            <Text style={styles.bodyItemText}>{numberOfGiftItems}</Text>
          </View>
          <View style={styles.bodyItem}>
            <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/calendar.png")} />
            <Text style={styles.bodyItemText}>Next: {nextEvent}</Text>
          </View>
          <View>
            <Image resizeMode="contain" source={require("@/assets/images/noListFoundUsers.png")} style={styles.members} />
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.footer}>
          <Pressable style={styles.primaryButton} onPress={handleViewCircle}>
            <Text style={styles.primaryButtonText}>View Circle</Text>
          </Pressable>
        </View>
      </Pressable>
      <BottomSheet height={isOwnerOrAdmin ? 550 : 450} isVisible={isBottomSheet} onClose={() => setIsBottomSheet(false)}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetTitle}>Manage Circle</Text>
          <View style={styles.actionsContainer}>
            {quickActions?.map((action) => (
              <Pressable key={action.title} style={[styles.actionButton]} onPress={() => handleActionPress(action.title)}>
                <View style={[styles.actionIconContainer, action.title === "Delete Circle" ? { backgroundColor: "#FFF0F0" } : {}]}>
                  <Image style={[styles.icon, action.title === "Delete Circle" ? { tintColor: "#FF3B30" } : {}]} source={action.icon} resizeMode="contain" />
                </View>
                <View>
                  <Text style={[styles.actionLabel, action.title === "Delete Circle" ? { color: "#FF3B30" } : {}]}>{action.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </BottomSheet>
      <DeleteConfirmation visible={showDeleteConfirmation} text={"Are you sure you want to\ndelete this circle?"} onCancel={() => setShowDeleteConfirmation(false)} onDelete={handleDeleteCircle} />
      <DeleteConfirmation iconSource={circle?.isArchived ? require("@/assets/images/unarchiveList.png") : require("@/assets/images/archiveList.png")} deleteButtonText={circle?.isArchived ? "Unarchive" : "Archive"} deleteButtonColor={"#8E8E93"} visible={showArchiveConfirmation} text={`Are you sure you want to\n${circle?.isArchived ? "unarchive" : "archive"} this circle?`} onCancel={() => setShowArchiveConfirmation(false)} onDelete={handleArchiveCircle} />
      <DeleteConfirmation iconSource={require("@/assets/images/archiveList.png")} deleteButtonText="Leave" visible={showExitConfirmation} text={"Are you sure you want to\nleave this circle?"} onCancel={() => setShowExitConfirmation(false)} onDelete={handleExitCircle} />
    </>
  );
}
