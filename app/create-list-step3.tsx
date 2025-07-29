import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

type PrivacyOption = "private" | "shared" | null;

export default function CreateListStep3() {
  const [selectedOption, setSelectedOption] = useState<PrivacyOption>(null);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    console.log("Continue with option:", selectedOption);
    router.push("/add-gift");
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressInactive]} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
      </View>
    </View>
  );

  const OptionCard = ({
    option,
    icon,
    title,
    description,
    isSelected,
  }: {
    option: PrivacyOption;
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
  }) => (
    <Pressable
      style={[
        styles.optionCard,
        isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
      ]}
      onPress={() => setSelectedOption(option)}
    >
      <View style={styles.optionContent}>
        <View style={styles.checkboxContainer}>
          <View
            style={[
              styles.checkbox,
              isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>

        <View style={styles.optionHeader}>
          {icon}
          <Text style={styles.optionTitle}>{title}</Text>
        </View>

        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </Pressable>
  );

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
              <Text style={styles.headerTitle}>Create List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ProgressIndicator />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Who can see this list?</Text>

        <View style={styles.optionsContainer}>
          <OptionCard
            option="private"
            icon={
              <Ionicons name="lock-closed-outline" size={40} color="#1C0335" />
            }
            title="Private"
            description="Only visible to you — perfect for personal planning or surprise gifts."
            isSelected={selectedOption === "private"}
          />

          <OptionCard
            option="shared"
            icon={<Ionicons name="globe-outline" size={40} color="#1C0335" />}
            title="Shared"
            description="Share your wishlist with the world (or just your WhatsApp group)."
            isSelected={selectedOption === "shared"}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[
            styles.button,
            !selectedOption ? styles.buttonDisabled : styles.buttonPrimary,
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonPrimaryText}>Yalla! Let’s add gifts</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleBack}
        >
          <Text style={styles.buttonSecondaryText}>Back</Text>
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
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    width: screenWidth - 32,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressActive: {
    backgroundColor: "#45018A",
  },
  progressInactive: {
    backgroundColor: "#DDD7E4",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    height: 171,
  },
  optionCardSelected: {
    borderColor: "#1C0335",
  },
  optionCardUnselected: {
    borderColor: "#AEAEB2",
  },
  optionContent: {
    position: "relative",
  },
  checkboxContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#3B0076",
  },
  checkboxUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#AEAEB2",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 24,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 24,
  },
  optionDescription: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
    lineHeight: 24,
    marginRight: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 34, // For home indicator
    paddingTop: 16,
    gap: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#3B0076",
  },
  buttonDisabled: {
    backgroundColor: "#D1D1D6",
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
