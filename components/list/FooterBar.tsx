import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  lastUpdated?: string;
  onShare?: () => void;
  onManage?: () => void;
  manageLabel?: string;
  viewMode?: boolean;
};

export const FooterBar: React.FC<Props> = ({ lastUpdated, onShare, onManage, manageLabel = "Manage List", viewMode }) => (
  <View style={styles.footer}>
    {lastUpdated && <Text style={styles.lastUpdated}>{lastUpdated}</Text>}
    {!viewMode ? <View><Pressable style={[styles.button, styles.buttonSecondary]} onPress={onShare}>
      <Text style={styles.buttonSecondaryText}>Share</Text>
      <Ionicons name="share-outline" size={20} color="#3B0076" />
    </Pressable>
      <Pressable style={[styles.button, styles.buttonPrimary]} onPress={onManage}>
        <Text style={styles.buttonPrimaryText}>{manageLabel}</Text>
      </Pressable></View> : null}
  </View>
);
