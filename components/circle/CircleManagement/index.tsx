import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./style";

export default function CircleManagement() {
  return (
    <LinearGradient colors={["#F6F0FF", "#FFFFFF"]} style={styles.container}>
      <View>
        <Text style={styles.title}>Circle Management</Text>
        <Text style={styles.description}>Manage all your gifting circles</Text>
      </View>
      <View>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="user-friends" size={12} color="black" />
        </View>
      </View>
    </LinearGradient>
  );
}
