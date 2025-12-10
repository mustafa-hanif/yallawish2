import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

interface WishListCardProps {
  item: {
    _creationTime: number;
    _id: string;
    coverPhotoUri: string | null;
    created_at: string;
    eventDate: string;
    note: string | null;
    occasion: string;
    password: string;
    privacy: string;
    requiresPassword: boolean;
    shippingAddress: string;
    title: string;
    updated_at: string;
    user_id: string;
    totalItems: number;
    totalClaimed: number;
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileImageUrl: string | null;
      contactEmail: string;
    };
  };
}
export default function WishListCard({ item }: WishListCardProps) {
  const [isBottomSheet, setIsBottomSheet] = useState(false);

  const id = item?._id;
  const title = item?.title || "Raghavendra Suryadev Birthday";
  const date = item?.eventDate || "-----------";
  const totalItems = item?.totalItems ?? 0;
  const purchasedItems = item?.totalClaimed ?? 0;
  const percentage = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0;
  const occasion = item?.occasion || "birthday";
  const user = item?.creator || null;

  const occasionObj = {
    birthday: require("@/assets/images/birthday3.png"),
    wedding: require("@/assets/images/wedding3.png"),
    "baby-shower": require("@/assets/images/babyShower3.png"),
    graduation: require("@/assets/images/graduation3.png"),
    "new-home": require("@/assets/images/houseWarming3.png"),
    retirement: require("@/assets/images/retirement3.png"),
    "no-occasion": require("@/assets/images/other3.png"),
    other: require("@/assets/images/other3.png"),
  };
  const occasionIcon = occasionObj?.[occasion];

  const handlePress = (id: string) => router.push({ pathname: "/view-list", params: { listId: String(id) } });
  const handleLongPress = () => setIsBottomSheet(true);

  const profileInitials = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    if (name) {
      return (
        name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || "YW"
      );
    }

    const email = user?.contactEmail ?? "";
    if (email) {
      const letters = email
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
      return letters || "YW";
    }

    return "YW";
  }, [user?.firstName, user?.lastName, user?.contactEmail]);

  const quickActions = [
    { title: "Archive", icon: require("@/assets/images/archiveList.png") },
    { title: "Duplicate", icon: require("@/assets/images/duplicateList.png") },
    { title: "Edit", icon: require("@/assets/images/customize.png") },
    { title: "Delete", icon: require("@/assets/images/deleteList.png") },
  ];
  return (
    <>
      <Pressable style={styles.card} onPress={() => handlePress(id)} onLongPress={handleLongPress}>
        <View style={styles.cardHeader}>
          <Image style={styles.cardIcon} resizeMode="contain" source={occasionIcon} />
          <View style={styles.profile}>{user?.profileImageUrl ? <Image resizeMode="cover" style={styles.profileImageUrl} source={{ uri: user.profileImageUrl }} /> : <Text style={styles.profileInitials}>{profileInitials}</Text>}</View>
        </View>
        <View style={styles.titleContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
        </View>
        <View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View>
          <Text style={styles.totalItems}>
            Total Items:
            <Text style={styles.totalIteNumber}>{totalItems}</Text>
          </Text>
        </View>
        <View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${percentage}%` }]} />
          </View>
          <View>
            <Text style={styles.progressText}>{percentage}% Completed</Text>
          </View>
        </View>
      </Pressable>
      <Modal visible={isBottomSheet} transparent animationType="fade" onRequestClose={() => setIsBottomSheet(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsBottomSheet(false)} />
        <View style={styles.sheetContainer}>
          <Pressable onPress={() => setIsBottomSheet(false)}>
            <View style={styles.sheetHandle} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              {quickActions?.map((action) => (
                <Pressable key={action.title} style={styles.actionButton}>
                  <Image source={action.icon} resizeMode="contain" />
                  <View>
                    <Text style={styles.actionLabel}>{action.title}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
