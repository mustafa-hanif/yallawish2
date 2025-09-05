import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  onBack?: () => void;
};

export const HeaderBar: React.FC<Props> = ({ title, onBack }) => {
  return (
    <LinearGradient colors={["#330065", "#6600CB"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.headerContent}>
          <View style={styles.navigation}>
            {onBack ? <Pressable onPress={onBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable> : null}
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};
