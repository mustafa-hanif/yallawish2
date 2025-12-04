// import { Ionicons } from '@expo/vector-icons';
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Dimensions, Image, ImageBackground, Pressable, StatusBar, Text, TextInput, View } from "react-native";
// import { Image, Pressable, Text, TextInput, View } from 'react-native';

export type PasswordGateProps = {
  title?: string;
  listId?: string | null;
  requiresPassword: boolean;
  passwordValue?: string | null; // actual password if checking client-side
  onUnlocked: () => void;
  onRequestPassword?: (data: { listId?: string | null; firstName: string; lastName: string; email: string }) => void;
};

export function PasswordGate({ title, listId, requiresPassword, passwordValue, onUnlocked, onRequestPassword }: PasswordGateProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
  const [unlocked, setUnlocked] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const ownerName = useMemo(() => {
    const t = (title ?? "").trim();
    const m = t.match(/^(.+?)'s\b/i);
    return m && m[1] ? m[1] : "";
  }, [title]);

  const tryUnlock = () => {
    if (!requiresPassword) {
      setUnlocked(true);
      onUnlocked?.();
      return;
    }
    if (passwordValue && password && String(passwordValue) === String(password)) {
      setUnlocked(true);
      setPwdError(null);
      onUnlocked?.();
    } else {
      setPwdError("Wrong password");
    }
  };

  if (!requiresPassword || unlocked) return null;

  return (
    <>
      <ImageBackground source={require("@/assets/images/onboard_image.png")} style={{ width: SCREEN_WIDTH, height: "100%", overflow: "hidden", paddingVertical: 24, paddingHorizontal: 16, gap: 51 }} imageStyle={{ width: SCREEN_WIDTH, height: "100%" }} resizeMode="cover">
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Image source={require("@/assets/images/yallawish_logo.png")} style={{ width: 158, height: 38, resizeMode: "contain" }} />
        </View>
        <View style={{ justifyContent: "flex-end", paddingHorizontal: 15, paddingBottom: 16, height: 626, backgroundColor: "#32194b97", width: "100%", borderColor: "#6A3D9C", borderWidth: 0.98, borderRadius: 20.23 }}>
          {!showRequest ? (
            <View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image source={require("@/assets/images/baloons.png")} resizeMode="center" />
              </View>
              <View>
                <Text numberOfLines={1} style={{ color: "#FFFFFF", fontFamily: "Nunito_700Bold", fontSize: 40, textAlign: "center" }}>
                  {ownerName || "This list"}
                </Text>
                <View style={{ alignSelf: "center", marginTop: 16, borderRadius: 4, borderWidth: 1, borderColor: "#6B21A8", paddingVertical: 12, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="gift-outline" size={18} color="#FFCC00" />
                  <Text numberOfLines={1} style={{ fontSize: 19.6, color: "#E9D5FF", fontFamily: "Nunito_700Bold" }}>
                    {title}
                  </Text>
                </View>
                <Text style={{ fontSize: 19.6, fontFamily: "Nunito_700Bold", color: "#FFFFFF", textAlign: "center", marginTop: 16, marginBottom: 8 }}>Requires a password</Text>

                <View style={{ marginTop: 21 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: pwdError ? "#FF4D4F" : "#FFFFFF", borderRadius: 8, paddingHorizontal: 12, height: 56 }}>
                    <TextInput value={password} onChangeText={setPassword} placeholder="Password*" placeholderTextColor="rgba(255,255,255,0.5)" secureTextEntry={!showPwd} style={{ flex: 1, color: "#FFFFFF" }} />
                    <Pressable onPress={() => setShowPwd((v) => !v)}>
                      <Ionicons name={showPwd ? "eye" : "eye-off"} size={20} color="#FFFFFF66" />
                    </Pressable>
                  </View>
                  {pwdError && <Text style={{ color: "#FF4D4F", marginTop: 4, fontSize: 16, fontFamily: "Nunito_700Bold" }}>{pwdError}</Text>}
                </View>
                <Pressable onPress={tryUnlock} style={{ marginTop: 16, height: 56, borderRadius: 8, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#330065", fontFamily: "Nunito_700Bold", fontSize: 14.58 }}>View the Gift List</Text>
                </Pressable>

                <Pressable onPress={() => setShowRequest(true)} style={{ marginTop: 18, alignItems: "center" }}>
                  <Text style={{ color: "#FFFFFF", textDecorationLine: "underline", fontFamily: "Nunito_700Bold", fontSize: 16 }}>I don’t have the password</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image style={{ width: 79, height: 91 }} source={require("@/assets/images/baloons.png")} resizeMode="center" />
              </View>
              <View>
                <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_700Bold", fontSize: 24, textAlign: "center", marginBottom: 8 }}>{"Add details to request\npassword"}</Text>
                <View style={{ marginTop: 16 }}>
                  <View style={{ borderWidth: 1, borderColor: "#FFFFFF", borderRadius: 8, paddingHorizontal: 12, height: 56, justifyContent: "center" }}>
                    <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: "#FFFFFF" }} />
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <View style={{ borderWidth: 1, borderColor: "#FFFFFF", borderRadius: 8, paddingHorizontal: 12, height: 56, justifyContent: "center" }}>
                    <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: "#FFFFFF" }} />
                  </View>
                </View>
                <View style={{ marginTop: 16 }}>
                  <View style={{ borderWidth: 1, borderColor: "#FFFFFF", borderRadius: 8, paddingHorizontal: 12, height: 56, justifyContent: "center" }}>
                    <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: "#FFFFFF" }} />
                  </View>
                </View>
                <Pressable onPress={() => onRequestPassword?.({ listId, firstName, lastName, email })} style={{ marginTop: 16, height: 56, borderRadius: 8, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#2C0C54", fontFamily: "Nunito_700Bold", fontSize: 14.58 }}>Request Password</Text>
                </Pressable>
                <Pressable onPress={() => setShowRequest(false)} style={{ marginTop: 18, alignItems: "center" }}>
                  <Text style={{ color: "#FFFFFF", textDecorationLine: "underline", fontFamily: "Nunito_700Bold", fontSize: 16 }}>I have the password</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </>
  );
}
