import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

interface ViewCircleGroupInfoProps {
  createdBy: string;
  memberCount: number;
}

export default function ViewCircleGroupInfo({ createdBy, memberCount }: ViewCircleGroupInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.bodyItem}>
        <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/users.png")} />
        <Text style={styles.bodyItemText}>Created By: {createdBy}</Text>
      </View>

      <View style={styles.bodyItem}>
        <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/calendar.png")} />
        <Text style={styles.bodyItemText}>Members: {memberCount}</Text>
      </View>
    </View>
  );
}
