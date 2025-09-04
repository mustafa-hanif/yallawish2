import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });
  const { addToList } = useLocalSearchParams<{ addToList?: string }>();
  const showAddToList = !!addToList && String(addToList).toLowerCase() !== "false";
  const ctaLabel = showAddToList ? "Add to list" : "Log in";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<(string | null)[]>([]);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

  const onGoogle = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startGoogle();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      router.replace("/");
    }
  };

  const onApple = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startApple();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      router.replace("/");
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      const result = await signIn.create({ identifier: emailAddress, password });
      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (typeof err === "object" && err !== null && "errors" in err && Array.isArray((err as any).errors)) {
        setError((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setError(["An unknown error occurred."]);
      }
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/onboard_image.jpg")}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, overflow: "hidden" }}
      imageStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      resizeMode="cover"
    >
      {/* Purple overlay */}
      <View style={{ position: "absolute", inset: 0 as any, backgroundColor: "rgba(44, 12, 84, 0.85)" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ minHeight: SCREEN_HEIGHT, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 }}>
          {/* Logo */}
          <View style={{ alignItems: "center", marginBottom: 16 }}>
            <Image source={require("@/assets/images/yallawish_logo.png")} style={{ width: 148, height: 28, resizeMode: "contain" }} />
          </View>

          {/* Segmented toggle */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View style={{ flexDirection: "row", backgroundColor: "rgba(255,255,255,0.75)", borderRadius: 999, padding: 6, width: "100%" }}>
              <View style={{ flex: 1 }}>
                <Link href={{ pathname: "/sign-up", params: showAddToList ? { addToList: String(addToList) || "1" } : undefined }} asChild>
                  <Pressable style={{ borderRadius: 999, alignItems: "center", paddingVertical: 10 }}>
                    <Text style={{ color: "#2E1A4F", fontFamily: "Nunito_700Bold", fontSize: 16, opacity: 0.85 }}>Sign-up</Text>
                  </Pressable>
                </Link>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: "#FFFFFF", borderRadius: 999, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, alignItems: "center", paddingVertical: 10 }}>
                  <Text style={{ color: "#3D1B6A", fontFamily: "Nunito_700Bold", fontSize: 16 }}>Login</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Hero */}
          <View style={{ paddingHorizontal: 8, marginBottom: 20 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 40, lineHeight: 44, textAlign: "center", fontFamily: "Nunito_700Bold" }}>Welcome Back!</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, lineHeight: 26, textAlign: "center", marginTop: 12, fontFamily: "Nunito_400Regular" }}>
              Log in to shop from this list and keep track of your own.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 14 }}>
            <TextInput
              style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular" }}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />

            <View style={{ position: "relative" }}>
              <TextInput
                style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular", paddingRight: 48 }}
                value={password}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.6)"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 16, top: 14, padding: 6 }}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="rgba(255,255,255,0.85)" />
              </Pressable>
            </View>

            <View style={{ marginTop: -4 }}>
              <Text style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Nunito_600SemiBold" }}>Forgot password?</Text>
            </View>

            {/* CTA */}
            <Pressable onPress={onSignInPress} style={{ backgroundColor: "#FFFFFF", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 6 }}>
              <Text style={{ color: "#3D1B6A", fontFamily: "Nunito_700Bold", fontSize: 16 }}>{ctaLabel}</Text>
            </Pressable>
          </View>

          {/* OR divider */}
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 18 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
            <Text style={{ marginHorizontal: 10, color: "rgba(255,255,255,0.85)", fontFamily: "Nunito_600SemiBold" }}>OR</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.25)" }} />
          </View>

          {/* Social buttons */}
          <View style={{ gap: 14 }}>
            <Pressable onPress={onGoogle} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <AntDesign name="google" size={20} color="#4285F4" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Google</Text>
              </View>
            </Pressable>
            <Pressable onPress={onApple} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <AntDesign name="apple1" size={22} color="#000000" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Apple</Text>
              </View>
            </Pressable>
          </View>

          {/* Errors */}
          {error.length > 0 && (
            <View style={{ marginTop: 12 }}>
              {error.map((e, i) => (
                <Text key={i} style={{ color: "#FFB4B4", fontFamily: "Nunito_400Regular" }}>{e}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
