import { useOAuth } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function Page() {
  const router = useRouter();
  const { addToList, returnTo } = useLocalSearchParams<{ addToList?: string; returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

  // "/gift-detail?listId=j974cp5qz4j7ey0k6wb4jzsxx97nedqk&itemId=jx7bts36hd0kk40vbd0ex8882x7ng36s&action=buy"

  let _returnTo = new URL(`http://www.example.com${returnTo}`);
  const action = _returnTo.searchParams.get("action");
  const isBuy = String(action ?? "").toLowerCase() === "buy";
  const heroTitle = isBuy ? "Sign up to make this gift count" : "This one’s going\non your list!";
  const heroSubtitle = isBuy
    ? "Buy the perfect gift from this list or even create your own to share with friends and family."
    : "Buy the perfect gift from this list or even create your own to share with friends and family.";

  const onGoogle = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startGoogle();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/";
      router.replace(target);
    }
  };

  const onApple = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startApple();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/";
      router.replace(target);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/onboard_image.jpg")}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, overflow: "hidden" }}
      imageStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      resizeMode="cover"
    >
      {/* Purple overlay bounded to screen */}
      <View
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(44, 12, 84, 0.85)" }}
        pointerEvents="none"
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ minHeight: SCREEN_HEIGHT, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24 }}
        >
          {/* Header / Logo */}
          <View style={{ alignItems: "center", marginBottom: 48 }}>
            <Image source={require("@/assets/images/yallawish_logo.png")} style={{ width: 148, height: 28, resizeMode: "contain" }} />
          </View>

          {/* Hero Copy */}
          <View style={{ paddingHorizontal: 8, marginBottom: 28 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 32, lineHeight: 38, fontFamily: "Nunito_700Bold", textAlign: "center" }}>
              {heroTitle}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 12, fontFamily: "Nunito_400Regular" }}>
              {heroSubtitle}
            </Text>
          </View>

          {/* Actions */}
          <View style={{ gap: 14 }}>
            {/* Google */}
            <Pressable onPress={onGoogle} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <AntDesign name="google" size={20} color="#4285F4" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Google</Text>
              </View>
            </Pressable>

            {/* Apple */}
            <Pressable onPress={onApple} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <AntDesign name="apple1" size={22} color="#000000" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Apple</Text>
              </View>
            </Pressable>

            {/* Divider */}
            <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
              <Text style={{ marginHorizontal: 10, color: "rgba(255,255,255,0.85)", fontFamily: "Nunito_600SemiBold" }}>OR</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
            </View>

            {/* Email navigates to Sign Up */}
            <Pressable onPress={() => router.push({ pathname: "/sign-up", params: { ...(addToList ? { addToList: String(addToList) } : {}), ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}), ...(action ? { action: String(action) } : {}) } })} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <Ionicons name="mail-outline" size={20} color="#1F1235" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Email</Text>
              </View>
            </Pressable>
          </View>

          {/* Spacer */}
          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
