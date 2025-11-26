import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Image, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const DESKTOP_BREAKPOINT = 1024;

const COLORS = {
  background: "#FFFFFF",
  surface: "#F7F3FB",
  lightPurple: "#F8F4FF",
  purple: "#3B0076",
  deepPurple: "#2C0C54",
  textPrimary: "#1C0335",
  textSecondary: "#6B5E7E",
};

export default function PurchaseSuccess() {
  const { listId } = useLocalSearchParams<{ name?: string; listId?: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
  const { user } = useUser();
  const confettiRef = useRef<any>(null);

  const buyerName = user?.fullName || user?.firstName || "there";

  const onSendAnnouncement = () => {
    // TODO: integrate announcement flow
    // For now, return to list if available
    if (listId) router.replace({ pathname: "/view-list", params: { listId: String(listId) } });
    else router.replace("/");
  };
  const onPurchaseAnother = () => {
    if (listId) router.replace({ pathname: "/view-list", params: { listId: String(listId) } });
    else router.replace("/");
  };
  const onCreateList = () => {
    router.replace("/create-list-step1");
  };

  if (isDesktop) {
    return (
      <View style={desktopStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ConfettiCannon ref={confettiRef} count={120} origin={{ x: width / 2, y: -10 }} fadeOut autoStart fallSpeed={3000} explosionSpeed={450} />
        <SafeAreaView style={desktopStyles.safeArea}>
          <View style={desktopStyles.header}>
            <Image source={require("@/assets/images/yallawish_logo.png")} style={desktopStyles.logo} />
          </View>

          <ScrollView contentContainerStyle={desktopStyles.scrollContent}>
            <View style={desktopStyles.content}>
              {/* Gift Illustration */}
              <View style={desktopStyles.illustrationContainer}>
                <Image source={require("@/assets/images/thankyou.png")} style={desktopStyles.illustration} resizeMode="contain" />
              </View>

              <Text style={desktopStyles.heading}>Thank You {buyerName}!</Text>
              <Text style={desktopStyles.subtext}>Your gift is on its way - and it's going to make someone's day!</Text>

              <View style={desktopStyles.buttonContainer}>
                <Pressable onPress={onSendAnnouncement} style={desktopStyles.primaryButton}>
                  <Ionicons name="megaphone" size={20} color="#FFFFFF" />
                  <Text style={desktopStyles.primaryButtonText}>Send a gift announcement</Text>
                </Pressable>
                <Pressable onPress={onPurchaseAnother} style={desktopStyles.secondaryButton}>
                  <Ionicons name="gift" size={20} color={COLORS.purple} />
                  <Text style={desktopStyles.secondaryButtonText}>Purchase another gift</Text>
                </Pressable>
              </View>

              <View style={desktopStyles.bottomSection}>
                <View style={desktopStyles.bottomTextContainer}>
                  <Text style={desktopStyles.bottomText}>Wasn't that easy?</Text>
                  <Text style={desktopStyles.bottomTextBold}>Make Gifting Fun & Easy for Your Friends & Family</Text>
                </View>
                <Pressable onPress={onCreateList} style={desktopStyles.createButton}>
                  <Text style={desktopStyles.createButtonText}>Create My List</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={mobileStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <ConfettiCannon ref={confettiRef} count={120} origin={{ x: 200, y: -10 }} fadeOut autoStart fallSpeed={3000} explosionSpeed={450} />
      <SafeAreaView style={mobileStyles.safeArea}>
        <View>
          <Image source={require("@/assets/images/giftBox.png")} resizeMode="contain" />
        </View>
        <View>
          <Text style={mobileStyles.heading}>THANK YOU {"\n"} {(String(buyerName)?.split(" ")?.[0].toUpperCase())}</Text>
          <Text style={mobileStyles.subtext}>{"Your gift is on its way – and it's going\nto make someones's day!"}</Text>
        </View>
        <View style={{ marginVertical: 15 }}>
          <Image resizeMode="contain" source={require("@/assets/images/successIcon.png")} />
        </View>
        <View style={mobileStyles.buttonContainer}>
          <Pressable onPress={onSendAnnouncement} style={mobileStyles.button}>
            <Text style={mobileStyles.buttonText}>Send a gift announcement</Text>
          </Pressable>
          <Pressable onPress={onPurchaseAnother} style={mobileStyles.button}>
            <Text style={mobileStyles.buttonText}>Purchase another gift</Text>
          </Pressable>
        </View>
        <View>
          <Text style={mobileStyles.bottomHeading}>Wasn't that easy?</Text>
          <Text style={mobileStyles.bottomText}>{`Make Gifting Fun\n& Easy for Your\nFriends & Family`}</Text>
        </View>
        <View style={{ width: "100%", marginTop: 10 }}>
          <Pressable onPress={onCreateList} style={mobileStyles.createButton}>
            <Text style={mobileStyles.createButtonText}>Create My List</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const mobileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47075C",
  },
  safeArea: {
    flex: 1,
    gap: 14,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
  },

  heading: {
    color: "#FFFFFF",
    fontFamily: "Nunito_900Black",
    fontSize: 30,
    textAlign: "center",
  },
  subtext: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    textAlign: "center",
    marginTop: 14,
  },

  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BA52FF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  bottomHeading: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 24,
    textAlign: "center",
  },
  bottomText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_900Black",
    fontSize: 25,
    textAlign: "center",
    marginTop: 20,
  },
  createButton: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    backgroundColor: "#FF00C8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
});

const desktopStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 48,
    paddingTop: 24,
    paddingBottom: 16,
  },
  logo: {
    width: 150,
    height: 30,
    resizeMode: "contain",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 48,
  },
  content: {
    alignItems: "center",
    maxWidth: 600,
    width: "100%",
    paddingHorizontal: 32,
  },
  illustrationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  illustration: {
    width: 200,
    height: 200,
  },
  heading: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 42,
    textAlign: "center",
    marginBottom: 16,
  },
  subtext: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 48,
    alignItems: "center",
  },
  primaryButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    maxWidth: 273,
    width: "100%",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.purple,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
    maxWidth: 273,
    width: "100%",
  },
  secondaryButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  bottomSection: {
    width: 730,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 20,
    padding: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
  },
  bottomTextContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  bottomText: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  bottomTextBold: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
  createButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    minWidth: 200,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
});
