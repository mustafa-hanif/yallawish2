import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

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
  const iconName = isShared ? (isPublic ? require("@/assets/images/publicIcon.png") : require("@/assets/images/myPeopleIcon.png")) : require("@/assets/images/privateIcon.png");

  return (
    <>
    <View style={styles.actionsContainer}>
      <View style={styles.privacyContainer}>
        <Image source={iconName} resizeMode="contain" style={{ width:24, height: 24 }}/>
        <View>
          <Text style={styles.privacyStatus}>{title}</Text>
          <Text style={styles.privacyDesc}>{desc}</Text>
        </View>
        <Ionicons style={{alignSelf:'flex-end'}} name="settings-sharp" size={18} color="#007AFF" />
      </View>
      <View style={styles.actionButtons}>
        <Pressable style={{...styles.iconButton, ...(showAddress && {backgroundColor:'#3B0076'})}} onPress={() => setShowAddress(true)}>
          <Image style={showAddress && { tintColor: 'white' }}  source={require("@/assets/images/locationPin.png")} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onFilterPress}>
          <Image source={require("@/assets/images/filtersLines.png")} />
        </Pressable>
      </View>
      
      {/* Address Modal */}
      <Modal visible={showAddress} transparent animationType="fade" onRequestClose={() => setShowAddress(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", padding: 20, justifyContent: "center",  }} onPress={() => setShowAddress(false)}>
          <Pressable style={{ borderWidth:1, borderColor:'#1C0335', backgroundColor: "#FFFFFF", borderRadius: 8, padding: 16, gap: 16, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 8 } }} onPress={(e) => e.stopPropagation()}>
            <Text style={{ color: "#1C0335", fontSize: 16, lineHeight: 26, fontFamily: "Nunito_700Bold" }}>
              {address || "No address provided"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Pressable onPress={onCopy} disabled={!address} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 9, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: "#3B0076" }}>
                <Text style={{ color: "#1C0335", fontFamily: "Nunito_700Bold", fontSize: 12 }}>{copied ? "Copied!" : "Copy address"}</Text>
                <Ionicons name="copy-outline" size={20} color="#1C0335" />
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
    <View style={styles.sectionSeparator} />
    </>
  );
};
