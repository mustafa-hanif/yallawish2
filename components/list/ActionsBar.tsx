import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  privacy: "shared" | "private" | string;
  loading?: boolean;
  onFilterPress?: () => void;
};

export const ActionsBar: React.FC<Props> = ({ privacy, loading, onFilterPress }) => {
  return (
    <View style={styles.actionsContainer}>
      <View style={styles.privacyContainer}>
        <Ionicons name={privacy === "shared" ? "globe-outline" : "lock-closed-outline"} size={24} color="#1C0335" />
        <View>
          <Text style={styles.privacyStatus}>{loading ? "Loading..." : privacy === "shared" ? "Shared" : "Private"}</Text>
          <Text style={styles.privacyDesc}>{loading ? "Fetching privacy" : privacy === "shared" ? "Only people with link" : "Only you can see this"}</Text>
        </View>
        <Ionicons name="settings-outline" size={16} color="#1C0335" />
      </View>
      <View style={styles.actionButtons}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="location-outline" size={24} color="#1C0335" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onFilterPress}>
          <Ionicons name="filter-outline" size={24} color="#1C0335" />
        </Pressable>
      </View>
    </View>
  );
};
