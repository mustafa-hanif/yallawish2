import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

export default function ViewCircleGroupInfo() {
  const createBy = "You";
  const members = 24;
  return (
    <View style={styles.container}>
      <View style={styles.bodyItem}>
        <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/users.png")} />
        <Text style={styles.bodyItemText}>Created By: {createBy}</Text>
      </View>

      <View style={styles.bodyItem}>
        <Image style={styles.bodyItemImage} resizeMode="contain" source={require("@/assets/images/calendar.png")} />
        <Text style={styles.bodyItemText}>Members: {members}</Text>
      </View>
    </View>
  );
}
