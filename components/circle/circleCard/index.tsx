import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

export default function CircleCard() {
  const [isBottomSheet, setIsBottomSheet] = useState(false);

  const handleViewCircle = () => router.push("/view-circle");
  const handleLongPress = () => {
    setIsBottomSheet(true);
  };

  const quickActions = [
    { title: "Edit Circle", icon: require("@/assets/images/Edit.png") },
    { title: "Invite Members", icon: require("@/assets/images/inviteMembers.png") },
    { title: "Copy share link", icon: require("@/assets/images/copyShareLink.png") },
    { title: "Archive Circle", icon: require("@/assets/images/archiveList.png") },
    { title: "Exit Circle", icon: require("@/assets/images/archiveList.png") },
    { title: "Delete Circle", icon: require("@/assets/images/deleteList.png") },
  ];

  const numberOfMembers = 10;
  const numberOfList = 25;
  const nextEvent = "15 Aug";

  return (
    <>
      <Pressable style={styles.container} onLongPress={handleLongPress}>
        <View style={styles.header}>
          <Image source={{ uri: "https://festive-deer-706.convex.cloud/api/storage/fee43c85-a348-45b6-a135-db9b6d34e9e9" }} style={styles.headerImage} />
          <View style={styles.headerContent}>
            <View style={styles.headerContentTop}>
              <View style={styles.circleOccasions}>
                <Text style={styles.circleOccasionsText}>3 Occasions</Text>
              </View>
              <View style={styles.circleStatus}>
                <Text style={styles.circleStatusText}>Active</Text>
              </View>
            </View>
            <View style={styles.headerContentBottom}>
              <View style={styles.circleAdminInitials}>
                <Text style={styles.circleAdminInitialsText}>HK</Text>
              </View>
              <View>
                <Text style={styles.circleTitle}>APACS Class of 2023</Text>
                <Text style={styles.circleDescription}>Manage all your gifting circles hash hasyhfs...</Text>
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
            <Text style={styles.bodyItemText}>{numberOfList}</Text>
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
      <Modal visible={isBottomSheet} transparent animationType="slide" onRequestClose={() => setIsBottomSheet(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsBottomSheet(false)} />
        <View style={styles.sheetContainer}>
          <Pressable onPress={() => setIsBottomSheet(false)}>
            <View style={styles.sheetHandle} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetTitle}>Manage Circle</Text>
            <View style={styles.actionsContainer}>
              {quickActions?.map((action) => (
                <Pressable key={action.title} style={[styles.actionButton]}>
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
        </View>
      </Modal>
    </>
  );
}
