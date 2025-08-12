import { RibbonHeader } from "@/components/RibbonHeader";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGift() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const list = useQuery(api.products.getListById, {
    listId: listId as any,
  });

  // Format YYYY-MM-DD to a friendly date like: Mon, Aug 11, 2025
  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
    const [y, m, d] = parts;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1); // local time to avoid TZ shift
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddGift = () => {
    // Navigate to add gift flow
    console.log("Add a gift to list:", listId);
  };

  const handleShare = () => {
    console.log("Share list", listId);
  };

  const handleManageList = () => {
    console.log("Manage list", listId);
  };

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      <LinearGradient
        colors={["#330065", "#6600CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <Image
              source={require("@/assets/images/c880529f92a902eb188e079575f79246e2c24c5c.png")}
              style={styles.coverImage}
            />
          )}
          <View style={styles.coverOverlay}>
            <Text style={styles.daysToGo}>{formatEventDate((list?.eventDate ?? undefined) as string | undefined)}</Text>
          </View>
        </View>

        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} />
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.privacyContainer}>
            <Ionicons name={privacy === "shared" ? "globe-outline" : "lock-closed-outline"} size={24} color="#1C0335" />
            <View>
              <Text style={styles.privacyStatus}>
                {privacy === "shared" ? "Shared" : "Private"}
              </Text>
              <Text style={styles.privacyDesc}>
                {privacy === "shared" ? "Only people with link" : "Only you can see this"}
              </Text>
            </View>
            <Ionicons name="settings-outline" size={16} color="#1C0335" />
          </View>
          <View style={styles.actionButtons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="location-outline" size={24} color="#1C0335" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="filter-outline" size={24} color="#1C0335" />
            </Pressable>
          </View>
        </View>

        <View style={styles.addGiftSection}>
          <Text style={styles.addGiftTitle}>Add your first gift item</Text>
          <Pressable style={styles.addGiftButton} onPress={handleAddGift}>
            <Ionicons name="add" size={24} color="#3B0076" />
            <Text style={styles.addGiftButtonText}>Add a gift</Text>
          </Pressable>
          {listId && (
            <Text style={{ textAlign: "center", color: "#8E8E93" }}>
              Working on list: {String(listId)}
            </Text>
          )}
        </View>

        <View className="infoBox" style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#3B0076"
          />
          <Text style={styles.infoText}>
            To learn more on how to add gifts from web browser,{" "}
            <Text style={styles.linkText}>click here</Text>
          </Text>
          <Ionicons name="close" size={24} color="#3B0076" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Last updated: July 15, 2025 | 08:00PM
        </Text>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleShare}
        >
          <Text style={styles.buttonSecondaryText}>Share</Text>
          <Ionicons name="share-outline" size={20} color="#3B0076" />
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleManageList}
        >
          <Text style={styles.buttonPrimaryText}>Manage List</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  scrollContent: {
    paddingBottom: 200, // Space for footer
  },
  coverContainer: {
    height: 145,
    width: "100%",
  },
  coverImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 23, 0, 0.32)",
    justifyContent: "center",
    alignItems: "center",
  },
  daysToGo: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 40,
  },
  listInfoContainer: {
    marginTop: -40,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#AEAEB2",
  },
  privacyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  privacyStatus: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  privacyDesc: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: "#1C0335",
    borderRadius: 20,
    padding: 8,
  },
  addGiftSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  addGiftTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  addGiftButton: {
    height: 134,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  addGiftButtonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
  },
  infoBox: {
    backgroundColor: "#F5EDFE",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#0062FF",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#D1D1D6",
  },
  lastUpdated: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: "#3B0076",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#3B0076",
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },
  buttonSecondaryText: {
    color: "#3B0076",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },
});
