import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TextInputField } from "@/components/TextInputField";
import { Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FormData {}

const CreateCircleStep2 = () => {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [formData, setFormData] = useState<FormData>({});

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const membersArray = Array.from({ length: 10 });

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleContinue = () => {
    router.push({ pathname: "/create-circle-success" });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient colors={["#330065", "#45018ad7"]} style={styles.header} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>Assign Admins</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <ProgressIndicator activeSteps={3} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Who’s in charge?</Text>
            <Text style={styles.sectionDescription}>Admins can invite new members, approve, edit and manage circle settings</Text>
          </View>
          <View style={styles.ownerContainer}>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerImageContainer}>
                <Image style={styles.ownerImage} source={{ uri: "https://images.ctfassets.net/xjcz23wx147q/iegram9XLv7h3GemB5vUR/0345811de2da23fafc79bd00b8e5f1c6/Max_Rehkopf_200x200.jpeg" }} />
              </View>
              <View>
                <Text style={styles.ownerName}>You (Owner)</Text>
                <Text style={styles.ownerRole}>Super Admin</Text>
              </View>
            </View>
            <View>
              <Fontisto name="locked" size={24} color="#ABABAB" />
            </View>
          </View>
          <View style={styles.searchContainer}>
            <TextInputField label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} />
          </View>
          <View>
            {membersArray.map((_, index) => (
              <View style={[styles.memberItem, index === membersArray.length - 1 && { borderBottomWidth: 0 }]} key={index}>
                <View style={styles.infoContainer}>
                  <View style={styles.memberProfileAndInitial}>
                    <Text style={styles.nameInitials}>WS</Text>
                  </View>
                  <View>
                    <Text style={styles.memberName}>Will Smith</Text>
                    <Text style={styles.memberEmail}>will.smith@gmail.com</Text>
                  </View>
                </View>
                <Switch
                  //   value={true}
                  // onValueChange={setRequirePassword}
                  trackColor={{ false: "#78788029", true: "#34C759" }}
                  thumbColor="#FFFFFF"
                  // disabled={!isSelected}
                />
                {/* <View style={styles.checkButton}><Feather name="check" size={15} color="#3B0076" /></View> */}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomButtons}>
        <Pressable
          style={[
            styles.continueButton,
            // !isFormValid && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          // disabled={!isFormValid}
        >
          <Text style={styles.continueButtonText}>Finish Circle Setup</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateCircleStep2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 108,
    justifyContent: "flex-end",
  },
  headerContent: {
    paddingHorizontal: 16,
  },

  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  backButton: {},
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#0F0059",
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 10,
    lineHeight: 28,
  },
  sectionDescription: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#AEAEB2",
  },
  ownerContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#AEAEB2",
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
  },
  ownerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  ownerName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 16,
  },
  ownerRole: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#AEAEB2",
    lineHeight: 20,
  },

  continueButton: {
    height: 56,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
  },
  memberItem: {
    padding: 15.32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.96,
    borderColor: "#AEAEB2",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 7.66,
    alignItems: "center",
  },
  memberProfileAndInitial: {
    backgroundColor: "#A2845E",
    width: 45.95,
    height: 45.95,
    borderRadius: 7.66,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInitials: {
    color: "#ffff",
    fontSize: 15.32,
    fontFamily: "Nunito_900Black",
  },
  memberName: {
    fontSize: 15.32,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  memberEmail: {
    fontSize: 11.49,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
});
