import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface WishListCardProps {
  item: { _creationTime: number; _id: string; coverPhotoUri: string | null; created_at: string; eventDate: string; note: string | null; occasion: string; password: string; privacy: string; requiresPassword: boolean; shippingAddress: string; title: string; updated_at: string; user_id: string; totalItems: number; totalClaimed: number };
}
export default function WishListCard({ item }: WishListCardProps) {
  console.log("\n =============== item",item, "=============== item =================== \n")
  const id = item?._id;
  const title = item?.title || "Raghavendra Suryadev Birthday";
  const date = item?.eventDate || "-----------";
  const totalItems = item?.totalItems || 2;
  const purchasedItems = item?.totalClaimed || 0;
  const percentage = Math.round((purchasedItems / totalItems) * 100);
  const occasion = item?.occasion || "birthday";

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

  return (
    <Pressable style={styles.card} onPress={() => handlePress(id)}>
      <View style={styles.cardHeader}>
        <Image style={styles.cardIcon} resizeMode="contain" source={occasionIcon} />
        <Text>2</Text>
      </View>
      {/* <View style={styles.content}> */}
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
      {/* </View> */}
      <View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${percentage}%` }]} />
        </View>
        <View>
          <Text style={styles.progressText}>{percentage}% Completed</Text>
        </View>
      </View>
    </Pressable>
  );
}
