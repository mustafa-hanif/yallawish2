import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

interface WishListCardProps {}
export default function WishListCard({ item }: WishListCardProps) {
  const title = item?.title || "Raghavendra Suryadev Birthday";
  const date = item?.date || "Dec 27, 2026";
  const totalItems = item?.totalItems || 2;
  const purchasedItems = item?.claimedItems || 0;
  const percentage = Math.round((purchasedItems / totalItems) * 100);
  const occasion = item?.occasionType || "birthday";

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
  return (
    <View style={styles.card}>
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
    </View>
  );
}
