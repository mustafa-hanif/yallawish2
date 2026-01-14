import Header from "@/components/Header";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { TextInputField } from "@/components/TextInputField";
import { Entypo, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface FormData {}

const CreateCircleStep2 = () => {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const [formData, setFormData] = useState<FormData>({});

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const friendsArray = Array.from({ length: 10 });
  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleContinue = () => {
    router.push({ pathname: "/create-circle-step3" });
  };
  return (
    <View style={styles.container}>
      <Header title="Add Members" handleBack={handleBack} />

      <ProgressIndicator activeSteps={2} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Pressable style={[styles.expandableButton, true && styles.expandableButtonActive]}>
          <View style={styles.expandableContent}>
            <Image source={require("@/assets/images/users.png")} />
            <Text style={styles.expandableText}>Add Existing Friends</Text>
          </View>
          <View>
            <Entypo name="chevron-down" size={24} color="#1C0335" />
          </View>
        </Pressable>
        <View style={styles.expandableSection}>
          <View style={styles.expandableSearchSection}>
            <TextInputField label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} />
            <View style={styles.selectedAndClearContainer}>
              <Text style={styles.selectedText}>0 friends selected</Text>
              <Text style={styles.clearText}>Clear All</Text>
            </View>
          </View>
          <View>
            {friendsArray.map((_, index) => (
              <View style={[styles.friendItem, index === friendsArray.length - 1 && { borderBottomWidth: 0 }]} key={index}>
                <View style={styles.infoContainer}>
                  <View style={styles.friendProfileAndInitial}>
                    <Text style={styles.nameInitials}>WS</Text>
                  </View>
                  <View>
                    <Text style={styles.friendName}>Will Smith</Text>
                    <Text style={styles.friendEmail}>will.smith@gmail.com</Text>
                  </View>
                </View>
                <View style={styles.checkButton}>{/* <Feather name="check" size={15} color="#3B0076" /> */}</View>
              </View>
            ))}
            <View style={styles.addSelectedFriendsContainer}>
              <Pressable
                style={[
                  styles.addSelectedFriendsButton,
                  // !isFormValid && styles.continueButtonDisabled,
                ]}
                // disabled={!isFormValid}
              >
                <Feather name="check" size={24} color="#3B0076" />
                <Text style={styles.addSelectedFriendsButtonText}>Add selected friends</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Pressable style={[styles.expandableButton, true && { borderRadius: 0, borderTopWidth: 0, borderBottomWidth: 0 }]}>
          <View style={styles.expandableContent}>
            <Image source={require("@/assets/images/users.png")} />
            <Text style={styles.expandableText}>Invite New Friends</Text>
          </View>
          <View>
            <Entypo name="chevron-down" size={24} color="#1C0335" />
          </View>
        </Pressable>
        <View style={styles.expandableSection}>
          <View style={styles.expandableSearchSection}>
            <TextInputField label="Email Address or Phone Number" icon={<Image source={require("@/assets/images/search.png")} />} />
          </View>
          <View>
            <View style={styles.addSelectedFriendsContainer}>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Send invite and add to circle</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <Pressable style={[styles.expandableButton, true && { borderRadius: 0, borderTopWidth: 0, borderBottomWidth: 0 }]}>
          <View style={styles.expandableContent}>
            <Image source={require("@/assets/images/users.png")} />
            <Text style={styles.expandableText}>Share invite link</Text>
          </View>
          <View>
            <Entypo name="chevron-down" size={24} color="#1C0335" />
          </View>
        </Pressable>
        <View style={[styles.expandableSection, { borderBottomEndRadius: 8, borderBottomStartRadius: 8 }]}>
          <View>
            <View style={styles.addSelectedFriendsContainer}>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Copy link to clipboard</Text>
              </Pressable>
            </View>
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
          <Text style={styles.continueButtonText}>Done</Text>
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

  scrollView: {
    flex: 1,
    paddingHorizontal: 8,
  },
  expandableButton: {
    height: 60,
    padding: 15.32,
    gap: 9.57,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expandableContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expandableText: {
    color: "#1C0335",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  expandableButtonActive: {
    borderBottomColor: "transparent",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  expandableSection: {
    paddingTop: 24,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: "#AEAEB2",
  },
  expandableSearchSection: {
    paddingHorizontal: 15.32,
  },
  selectedAndClearContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15.32,
  },
  selectedText: {
    color: "#1C0335",
    fontSize: 15.23,
    fontFamily: "Nunito_700Bold",
  },
  clearText: {
    color: "#AEAEB2",
    fontSize: 15.23,
    fontFamily: "Nunito_700Bold",
  },
  friendItem: {
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
  friendProfileAndInitial: {
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
  friendName: {
    fontSize: 15.32,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  friendEmail: {
    fontSize: 11.49,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
  checkButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderColor: "#AEAEB2",
    borderWidth: 1,
    backgroundColor: "#ffff",
    justifyContent: "center",
    alignItems: "center",
  },
  checkButtonActive: {
    backgroundColor: "#3B0076",
    borderColor: "#3B0076",
  },
  bottomButtons: {
    paddingHorizontal: 16,
    gap: 16,
    paddingVertical: 16,
  },
  continueButton: {
    height: 56,
    backgroundColor: "#34C759",
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
  addSelectedFriendsContainer: {
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  addSelectedFriendsButton: {
    height: 56,
    backgroundColor: "#6FFFF6",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  addSelectedFriendsButtonText: {
    color: "#3B0076",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
  primaryButton: {
    height: 56,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffff",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
  },
});
