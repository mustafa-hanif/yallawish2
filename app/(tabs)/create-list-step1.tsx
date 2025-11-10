import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 1024;

type ListOption = "myself" | "someone-else" | null;

type OptionConfig = {
  id: Exclude<ListOption, null>;
  title: string;
  description: string;
  icon: (color: string, size: number) => React.ReactNode;
};

const STEP_ITEMS = ["Who is this list for?", "Giftlist Details", "Who can see this list?"];

const OPTION_CONFIG: OptionConfig[] = [
  {
    id: "myself",
    title: "Myself",
    description: "Build a wish list for your own celebrations, milestones, or just a treat for yourself!",
    icon: (color, size) => <Ionicons name="person-outline" size={size} color={color} />,
  },
  {
    id: "someone-else",
    title: "Someone else",
    description: "Make a list on behalf of your kids, pets, spouse, parents, or anyone special.",
    icon: (color, size) => <Ionicons name="people-outline" size={size} color={color} />,
  },
];

type LayoutProps = {
  selectedOption: ListOption;
  onSelect: (option: ListOption) => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function CreateListStep1() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  const [selectedOption, setSelectedOption] = useState<ListOption>("myself");
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const handleSelect = (option: ListOption) => setSelectedOption(option);

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleContinue = () => {
    if (!selectedOption) return;
    const params = encodedReturnTo ? { returnTo: encodedReturnTo } : undefined;
    if (selectedOption === "someone-else") {
      if (params) {
        router.push({ pathname: "/select-profile", params });
      } else {
        router.push("/select-profile");
      }
    } else if (params) {
      router.push({ pathname: "/create-list-step2", params });
    } else {
      router.push("/create-list-step2");
    }
  };

  if (isDesktop) {
    return (
      <DesktopLayout
        selectedOption={selectedOption}
        onSelect={handleSelect}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <MobileLayout
      selectedOption={selectedOption}
      onSelect={handleSelect}
      onBack={handleBack}
      onContinue={handleContinue}
    />
  );
}

function DesktopLayout({ selectedOption, onSelect, onBack, onContinue }: LayoutProps) {
  return (
    <SafeAreaView style={styles.desktopSafeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.desktopWrapper}>
        <View style={styles.desktopSidebar}>
          <Pressable onPress={onBack} style={styles.desktopBackLink}>
            <Ionicons name="chevron-back" size={20} color="#4B0082" />
            <Text style={styles.desktopBackText}>Back</Text>
          </Pressable>
          <Text style={styles.desktopTitle}>Create Gift List</Text>
          <Text style={styles.desktopSubtitle}>
            To create your gift list, please provide the following details:
          </Text>
          <View style={styles.stepList}>
            {STEP_ITEMS.map((label, index) => {
              const isActive = index === 0;
              return (
                <View key={label} style={styles.stepItem}>
                  <View style={styles.stepIndicator}>
                    <View
                      style={[
                        styles.stepNumberCircle,
                        isActive ? styles.stepNumberCircleActive : styles.stepNumberCircleInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumberText,
                          isActive ? styles.stepNumberTextActive : styles.stepNumberTextInactive,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>
                    {index < STEP_ITEMS.length - 1 && <View style={styles.stepConnector} />}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive ? styles.stepLabelActive : styles.stepLabelInactive,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <View style={styles.desktopContent}>
          <ScrollView
            contentContainerStyle={styles.desktopContentScroll}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.desktopSectionHeading}>Who is this list for?</Text>
            <Text style={styles.desktopSectionDescription}>
              Select who you are creating this gift list for to personalise the experience.
            </Text>
            <View style={styles.desktopOptionsRow}>
              {OPTION_CONFIG.map((config) => (
                <DesktopOptionCard
                  key={config.id}
                  config={config}
                  selected={selectedOption === config.id}
                  onPress={() => onSelect(config.id)}
                />
              ))}
            </View>
            <View style={styles.desktopActions}>
              <Pressable onPress={onBack} style={styles.desktopSecondaryButton}>
                <Text style={styles.desktopSecondaryButtonText}>Back</Text>
              </Pressable>
              <Pressable
                onPress={onContinue}
                disabled={!selectedOption}
                style={[
                  styles.desktopPrimaryButton,
                  !selectedOption && styles.desktopPrimaryButtonDisabled,
                ]}
              >
                <Text style={styles.desktopPrimaryButtonText}>Continue</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

type DesktopOptionCardProps = {
  config: OptionConfig;
  selected: boolean;
  onPress: () => void;
};

function DesktopOptionCard({ config, selected, onPress }: DesktopOptionCardProps) {
  const iconColor = selected ? "#330065" : "#4B0082";
  return (
    <Pressable
      onPress={onPress}
      style={[styles.desktopOptionCard, selected && styles.desktopOptionCardSelected]}
    >
      <View style={styles.desktopOptionHeader}>
        <View style={styles.desktopOptionTitleRow}>
          {config.icon(iconColor, 32)}
          <Text style={styles.desktopOptionTitle}>{config.title}</Text>
        </View>
        <View
          style={[
            styles.desktopSelectionIndicator,
            selected && styles.desktopSelectionIndicatorSelected,
          ]}
        >
          {selected && <View style={styles.desktopSelectionIndicatorDot} />}
        </View>
      </View>
      <Text style={styles.desktopOptionDescription}>{config.description}</Text>
    </Pressable>
  );
}

function MobileLayout({ selectedOption, onSelect, onBack, onContinue }: LayoutProps) {
  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
      </View>
    </View>
  );

  const renderOptionCard = (config: OptionConfig) => {
    const isSelected = selectedOption === config.id;
    return (
      <Pressable
        key={config.id}
        style={[styles.optionCard, isSelected ? styles.optionCardSelected : styles.optionCardUnselected]}
        onPress={() => onSelect(config.id)}
      >
        <View style={styles.optionContent}>
          <View style={styles.checkboxContainer}>
            <View
              style={[styles.checkbox, isSelected ? styles.checkboxSelected : styles.checkboxUnselected]}
            >
              {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
          </View>
          <View style={styles.optionHeader}>
            {config.icon("#1C0335", 40)}
            <Text style={styles.optionTitle}>{config.title}</Text>
          </View>
          <Text style={styles.optionDescription}>{config.description}</Text>
        </View>
      </Pressable>
    );
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
            <View style={styles.statusBar}>
              <Text style={styles.timeText}>12:48</Text>
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={16} color="#FFFFFF" />
                <Ionicons name="wifi" size={16} color="#FFFFFF" />
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryFill} />
                </View>
              </View>
            </View>
            <View style={styles.navigation}>
              <Pressable onPress={onBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>Create List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <ProgressIndicator />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Make a list for</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>{OPTION_CONFIG.map(renderOptionCard)}</View>
          <View style={styles.continueContainer}>
            <Pressable
              style={[styles.continueButton, !selectedOption && styles.continueButtonDisabled]}
              onPress={onContinue}
              disabled={!selectedOption}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 44,
    paddingTop: 10,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  batteryIcon: {
    width: 22,
    height: 11,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 2,
    padding: 1,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 1,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
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
    marginBottom: 40,
  },
  optionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    paddingBottom: 24,
  },
  optionCardSelected: {
    backgroundColor: "#F5EDFE",
    borderColor: "#1C0335",
  },
  optionCardUnselected: {
    backgroundColor: "#FFFFFF",
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
  continueContainer: {
    marginBottom: 24,
    paddingBottom: 100,
  },
  continueButton: {
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#AEAEB2",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
  desktopSafeArea: {
    flex: 1,
    backgroundColor: "#F8F5FF",
  },
  desktopWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  desktopSidebar: {
    width: 320,
    paddingVertical: 56,
    paddingHorizontal: 48,
    backgroundColor: "#FBF8FF",
    borderRightWidth: 1,
    borderRightColor: "#E7DCF6",
  },
  desktopBackLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  desktopBackText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  desktopTitle: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
    marginBottom: 12,
  },
  desktopSubtitle: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#4A3B66",
    lineHeight: 24,
    marginBottom: 40,
  },
  stepList: {
    gap: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  stepIndicator: {
    alignItems: "center",
    position: "relative",
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberCircleActive: {
    borderColor: "#4B0082",
    backgroundColor: "#F5EDFF",
  },
  stepNumberCircleInactive: {
    borderColor: "#D8C9F6",
    backgroundColor: "#FFFFFF",
  },
  stepNumberText: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  stepNumberTextActive: {
    color: "#4B0082",
  },
  stepNumberTextInactive: {
    color: "#8E8EA9",
  },
  stepConnector: {
    position: "absolute",
    top: 44,
    left: 19,
    width: 2,
    height: 48,
    backgroundColor: "#E7DCF6",
  },
  stepLabel: {
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
    flex: 1,
  },
  stepLabelActive: {
    color: "#330065",
  },
  stepLabelInactive: {
    color: "#8E8EA9",
  },
  desktopContent: {
    flex: 1,
    paddingHorizontal: 64,
    paddingVertical: 56,
  },
  desktopContentScroll: {
    flexGrow: 1,
    paddingBottom: 56,
  },
  desktopSectionHeading: {
    fontSize: 32,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
  },
  desktopSectionDescription: {
    marginTop: 12,
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    color: "#4A3B66",
    maxWidth: 560,
    lineHeight: 26,
  },
  desktopOptionsRow: {
    marginTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  desktopOptionCard: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E3DAF6",
    backgroundColor: "#FFFFFF",
    padding: 28,
  },
  desktopOptionCardSelected: {
    borderColor: "#4B0082",
    backgroundColor: "#F5EDFF",
    shadowColor: "#330065",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  desktopOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  desktopOptionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  desktopOptionTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#330065",
  },
  desktopOptionDescription: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#4A3B66",
    lineHeight: 24,
  },
  desktopSelectionIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D8C9F6",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  desktopSelectionIndicatorSelected: {
    borderColor: "#4B0082",
  },
  desktopSelectionIndicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4B0082",
  },
  desktopActions: {
    marginTop: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  desktopSecondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4B0082",
    backgroundColor: "#FFFFFF",
  },
  desktopSecondaryButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#4B0082",
  },
  desktopPrimaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 8,
    backgroundColor: "#4B0082",
  },
  desktopPrimaryButtonDisabled: {
    backgroundColor: "#CDB8EC",
  },
  desktopPrimaryButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
});
