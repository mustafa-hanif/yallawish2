import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  privacy: "shared" | "private" | string;
  loading?: boolean;
  onFilterPress?: () => void;
  address?: string | null;
  shareCount?: number; // number of explicit shares; 0 implies public when privacy === 'shared'
};

export const ActionsBar: React.FC<Props> = ({ privacy, loading, onFilterPress, address, shareCount }) => {
  const [showAddress, setShowAddress] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const onCopy = async () => {
    if (!address) return;
    try {
      await Clipboard.setStringAsync(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { }
  };

  const isShared = privacy === "shared";
  const isPublic = isShared && (shareCount ?? 0) === 0;
  const title = loading ? "Loading..." : isShared ? (isPublic ? "Public" : "Shared") : "Private";
  const desc = loading
    ? "Fetching privacy"
    : isShared
      ? (isPublic ? "Anyone with the link" : "Only people you choose")
      : "Only you can see this";
  const iconName = isShared ? (isPublic ? "globe-outline" : "people-outline") : "lock-closed-outline";

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.privacyContainer}>
        <Ionicons name={iconName as any} size={24} color="#1C0335" />
        <View>
          <Text style={styles.privacyStatus}>{title}</Text>
          <Text style={styles.privacyDesc}>{desc}</Text>
        </View>
        <Ionicons name="settings-outline" size={16} color="#1C0335" />
      </View>
      <View style={styles.actionButtons}>
        <Pressable style={styles.iconButton} onPress={() => setShowAddress(true)}>
          <Ionicons name="location-outline" size={24} color="#1C0335" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onFilterPress}>
          <Ionicons name="filter-outline" size={24} color="#1C0335" />
        </Pressable>
      </View>

      {/* Address Modal */}
      <Modal visible={showAddress} transparent animationType="fade" onRequestClose={() => setShowAddress(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", padding: 20, justifyContent: "center" }} onPress={() => setShowAddress(false)}>
          <Pressable style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, gap: 16, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } }} onPress={(e) => e.stopPropagation()}>
            <Text style={{ color: "#1C0335", fontSize: 18, lineHeight: 26, fontFamily: "Nunito_700Bold" }}>
              {address || "No address provided"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={onCopy} disabled={!address} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: "#3B0076" }}>
                <Text style={{ color: "#1C0335", fontFamily: "Nunito_700Bold", fontSize: 16 }}>{copied ? "Copied!" : "Copy address"}</Text>
                <Ionicons name="copy-outline" size={20} color="#1C0335" />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
