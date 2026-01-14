import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface FriendsSectionHeaderProps {
  title: string;
  count: number;
  currentTab: string;
}

export default function FriendsSectionHeader({ title, count, currentTab }: FriendsSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        {currentTab === "friends" && (
          <Pressable style={styles.button}>
            <AntDesign name="plus" size={20} color="#1C1C1C" />
            <Text style={styles.buttonTitle}>Add</Text>
          </Pressable>
        )}
        {currentTab === "requests" && (
          <>
            <Pressable style={[styles.button, { backgroundColor: "#34C759" }]}>
              <Text style={[styles.buttonTitle, { color: "#FFFFFF" }]}>Accept All</Text>
            </Pressable>

            <Pressable style={[styles.button, { backgroundColor: "#FF3B30" }]}>
              <Text style={[styles.buttonTitle, { color: "#FFFFFF" }]}>Decline All</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
