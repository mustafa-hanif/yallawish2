import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

export default function CircleBanner() {
  const title = "The Celebration Crew";

  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://festive-deer-706.convex.cloud/api/storage/fee43c85-a348-45b6-a135-db9b6d34e9e9" }} style={styles.headerImage} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}
