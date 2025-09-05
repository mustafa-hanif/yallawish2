import { useSignUp } from "@clerk/clerk-expo";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const { addToList, returnTo } = useLocalSearchParams<{ addToList?: string; returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const showAddToList = !!addToList && String(addToList).toLowerCase() !== "false";
  const ctaLabel = showAddToList ? "Add to list" : "Sign up";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [marketing, setMarketing] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<(string | null)[]>([]);

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          mobile,
          marketing,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (typeof err === "object" && err !== null && "errors" in err && Array.isArray((err as any).errors)) {
        setError((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setError(["An unknown error occurred."]);
      }
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const target = decodedReturnTo ? (decodedReturnTo as any) : "/";
        router.replace(target);
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
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

  if (pendingVerification) {
    return (
      <ImageBackground
        source={require("@/assets/images/onboard_image.jpg")}
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        imageStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
        resizeMode="cover"
      >
        <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(44, 12, 84, 0.6)" }} />
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ minHeight: SCREEN_HEIGHT, padding: 20, justifyContent: "center" }}>
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Image source={require("@/assets/images/yallawish_logo.png")} style={{ width: 148, height: 28, resizeMode: "contain" }} />
            </View>
            <View style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 16 }}>
              <Text style={{ color: "#FFFFFF", fontSize: 24, fontFamily: "Nunito_700Bold", textAlign: "center", marginBottom: 12 }}>Verify your email</Text>
              <TextInput
                style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: "#FFFFFF", fontFamily: "Nunito_400Regular" }}
                value={code}
                placeholder="Enter your verification code"
                placeholderTextColor="rgba(255,255,255,0.6)"
                onChangeText={setCode}
              />
              <Pressable onPress={onVerifyPress} style={{ marginTop: 14, backgroundColor: "#6DF0CB", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}>
                <Text style={{ color: "#1A1A2E", fontFamily: "Nunito_700Bold", fontSize: 16 }}>Verify</Text>
              </Pressable>
              {error.length > 0 && (
                <View style={{ marginTop: 12 }}>
                  {error.map((e, i) => (
                    <Text key={i} style={{ color: "#FFB4B4", fontFamily: "Nunito_400Regular" }}>{e}</Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("@/assets/images/onboard_image.jpg")}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, overflow: "hidden" }}
      imageStyle={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      resizeMode="cover"
    >
      {/* Purple overlay */}
      <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(44, 12, 84, 0.85)" }} />
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
                <View style={{ backgroundColor: "#FFFFFF", borderRadius: 999, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, alignItems: "center", paddingVertical: 10 }}>
                  <Text style={{ color: "#3D1B6A", fontFamily: "Nunito_700Bold", fontSize: 16 }}>Sign-up</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Link href={{ pathname: "/log-in", params: { ...(showAddToList ? { addToList: String(addToList) || "1" } : {}), ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}) } }} asChild>
                  <Pressable style={{ borderRadius: 999, alignItems: "center", paddingVertical: 10 }}>
                    <Text style={{ color: "#2E1A4F", fontFamily: "Nunito_700Bold", fontSize: 16, opacity: 0.85 }}>Login</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>

          {/* Hero */}
          <View style={{ paddingHorizontal: 8, marginBottom: 20 }}>
            <Text style={{ color: "#FFFFFF", fontSize: 32, lineHeight: 38, textAlign: "center", fontFamily: "Nunito_700Bold" }}>Sign up to save{"\n"}this gift</Text>
            <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 24, textAlign: "center", marginTop: 12, fontFamily: "Nunito_400Regular" }}>
              Add it to your list now and start creating your own to share with friends and family.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 14 }}>
            <TextInput
              style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular" }}
              value={firstName}
              placeholder="First Name*"
              placeholderTextColor="rgba(255,255,255,0.6)"
              onChangeText={setFirstName}
            />
            <TextInput
              style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular" }}
              value={lastName}
              placeholder="Last Name*"
              placeholderTextColor="rgba(255,255,255,0.6)"
              onChangeText={setLastName}
            />

            {/* WhatsApp row */}
            <View style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 0, flexDirection: "row", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 12 }}>
                <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_700Bold" }}>+971</Text>
                <View style={{ width: 8 }} />
                <View style={{ width: 1, height: 18, backgroundColor: "rgba(255,255,255,0.35)" }} />
              </View>
              <TextInput
                style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 8, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular" }}
                value={mobile}
                placeholder="WhatsApp Number"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                onChangeText={setMobile}
              />
            </View>

            <TextInput
              style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.35)", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_400Regular" }}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email*"
              placeholderTextColor="rgba(255,255,255,0.6)"
              keyboardType="email-address"
              onChangeText={setEmailAddress}
            />

            {/* Marketing checkbox */}
            <Pressable onPress={() => setMarketing(v => !v)} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_400Regular" }}>Signup for marketing emails</Text>
              <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: "rgba(255,255,255,0.6)", alignItems: "center", justifyContent: "center", backgroundColor: marketing ? "#FFFFFF" : "transparent" }}>
                {marketing && <Ionicons name="checkmark" size={16} color="#3D1B6A" />}
              </View>
            </Pressable>

            {/* Password with eye */}
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

            {/* CTA */}
            <Pressable onPress={onSignUpPress} style={{ backgroundColor: "#FFFFFF", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 6 }}>
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
            <Pressable style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
              <View style={{ position: "relative", width: "100%", minHeight: 24, justifyContent: "center" }}>
                <AntDesign name="google" size={20} color="#4285F4" style={{ position: "absolute", left: 0 }} />
                <Text style={{ fontSize: 16, color: "#1F1235", textAlign: "center", fontFamily: "Nunito_700Bold" }}>Continue with Google</Text>
              </View>
            </Pressable>
            <Pressable style={{ backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 }}>
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
