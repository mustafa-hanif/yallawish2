import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { RibbonHeader } from "@/components/RibbonHeader";
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
  const handleBack = () => {
    router.back();
  };

  const handleAddGift = () => {
    // Navigate to add gift flow
    console.log("Add a gift");
  };

  const handleShare = () => {
    console.log("Share list");
  };

  const handleManageList = () => {
    console.log("Manage list");
  };

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
              <Text style={styles.headerTitle}>Bilal's Birthday</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image
            source={require("@/assets/images/c880529f92a902eb188e079575f79246e2c24c5c.png")}
            style={styles.coverImage}
          />
          <View style={styles.coverOverlay}>
            <Text style={styles.daysToGo}>4 days to go</Text>
          </View>
        </View>

        <View style={styles.listInfoContainer}>
          <RibbonHeader 
            title="Bilal's Birthday" 
            subtitle="Bilal's 36th birthday bash!" 
          />
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.privacyContainer}>
            <Ionicons name="globe-outline" size={24} color="#1C0335" />
            <View>
              <Text style={styles.privacyStatus}>Shared</Text>
              <Text style={styles.privacyDesc}>Only people with link</Text>
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
        </View>

        <View style={styles.infoBox}>
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
