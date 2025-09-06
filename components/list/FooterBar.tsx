import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  lastUpdated?: string;
  onShare?: () => void;
  onManage?: () => void;
  manageLabel?: string;
  viewMode?: boolean;
};

export const FooterBar: React.FC<Props> = ({ lastUpdated, onShare, onManage, manageLabel = "Manage List", viewMode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(16, 16 + insets.bottom), zIndex: 1000 }]}>
      {lastUpdated && <Text style={styles.lastUpdated}>{lastUpdated}</Text>}
      {!viewMode ? (
        <View>
          <Pressable
            style={[
              styles.button,
              styles.buttonSecondary,
              { marginBottom: 15 },
            ]}
            onPress={onShare}
          >
            <Text style={styles.buttonSecondaryText}>Share</Text>
            <Ionicons name="share-outline" size={20} color="#3B0076" />
          </Pressable>
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={onManage}>
            <Text style={styles.buttonPrimaryText}>{manageLabel}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};
