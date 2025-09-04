import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  children?: React.ReactNode;
};

export const InfoBox: React.FC<Props> = ({ children }) => (
  <View style={styles.infoBox}>
    <Ionicons name="information-circle-outline" size={24} color="#3B0076" />
    <Text style={styles.infoText}>{children}</Text>
    <Ionicons name="close" size={24} color="#3B0076" />
  </View>
);
