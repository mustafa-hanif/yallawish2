import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

export default function CircleCard() {
  const handleViewCircle = () => router.push("/view-circle");
  const numberOfMembers = 10;
  const numberOfList = 25;
  const nextEvent = "15 Aug";

  return (
    <View style={styles.container}>
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
    </View>
  );
}
