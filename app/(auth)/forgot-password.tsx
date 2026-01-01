import { SocialButton } from "@/components/auth";
import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useSignIn } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  const handleSendCode = async () => {
    if (!isLoaded || !email) return;

    try {
      setLoading(true);
      setError("");
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setEmailSent(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to send code");
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded || !code || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Attempt the password reset with the code
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        // Sign the user in with the new session
        await setActive({ session: result.createdSessionId });
        Alert.alert("Success", "Password reset successfully!");
        router.replace("/");
      } else {
        setError("Password reset incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to reset password");
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  const heroTitle = emailSent
    ? "Password reset email sent"
    : "Forgot password?";
  const heroSubtitle = emailSent
    ? ""
    : "Enter your email and we'll send you a reset code";

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      mobileLogoHeaderStyle={{ marginTop: 20, marginBottom: 20 }}
    >
      <View
        style={[
          styles.formContainer,
          isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
        ]}
      >
        {isDesktop && (
          <>
            <Text
              style={[
                styles.welcomeTitle,
                isDesktop && styles.welcomeTitleDesktop,
              ]}
            >
              {emailSent ? "Reset your password" : "Forgot password?"}
            </Text>
            {/* <Text
              style={[
                styles.cardSubtitle,
                isDesktop && styles.cardSubtitleDesktop,
              ]}
            >
              {emailSent
                ? "Enter the code we sent to your email"
                : "Enter your email and we'll send you a reset code"}
            </Text> */}
          </>
        )}

        {!emailSent ? (
          <View style={styles.fieldsStack}>
            <TextInput
              style={[
                styles.input,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              placeholder={isDesktop ? "Email address" : "Email"}
              placeholderTextColor="#FFFFFF66"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <SocialButton
              icon={<AntDesign name="mail" size={24} color="#330065" />}
              label={loading ? "Sending..." : "Send Reset Code"}
              variant="default"
              style={{ backgroundColor: "#03FFEE" }}
              onPress={handleSendCode}
              disabled={loading || !email}
            />

            <Pressable
              onPress={() => router.replace("/(auth)?mode=sign-up")}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text
                  style={{
                    color: isDesktop ? "#FFFFFF" : "#FFFFFF",
                    fontSize: isDesktop ? 14 : 16,
                    fontFamily: "Nunito_600SemiBold",
                  }}
                >
                  No Account?
                </Text>
                <Text
                  style={{
                    color: isDesktop ? "#FFF" : "#03FFEE",
                    fontSize: isDesktop ? 14 : 16,
                    fontFamily: "Nunito_600SemiBold",
                  }}
                >
                  Sign up
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => router.push("/log-in")}
              style={{ marginTop: 0, alignItems: "center" }}
            >
              <Text
                style={{
                  color: isDesktop ? "#FFF" : "#03FFEE",
                  fontSize: isDesktop ? 14 : 16,
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Remember your password?
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.fieldsStack}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={[
                  styles.cardSubtitle,
                  isDesktop && styles.cardSubtitleDesktop,
                  !isDesktop && {
                    color: "#FFFFFF",
                    fontSize: 24,
                    fontFamily: "Nunito_400Regular",
                    textAlign: "center",
                  },
                ]}
              >
                We sent an reset code to email to
              </Text>
              <Text
                style={[
                  styles.cardSubtitle,
                  isDesktop && styles.cardSubtitleDesktop,
                  !isDesktop && {
                    color: "#03FFEE",
                    fontSize: 24,
                    fontFamily: "Nunito_400Regular",
                    marginBottom: 16,
                    textAlign: "center",
                  },
                ]}
              >
                {email}
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#FFFFFF66"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
              autoCapitalize="none"
            />

            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  isDesktop && styles.inputDesktop,
                  !isDesktop ? styles.inputMobile : {},
                ]}
                value={password}
                placeholder="New password"
                placeholderTextColor="#FFFFFF66"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.passwordToggle}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="rgba(255,255,255,0.85)"
                />
              </Pressable>
            </View>

            <View style={{ position: "relative" }}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  isDesktop && styles.inputDesktop,
                  !isDesktop ? styles.inputMobile : {},
                ]}
                value={confirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#FFFFFF66"
                secureTextEntry={!showConfirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowConfirmPassword((v) => !v)}
                style={styles.passwordToggle}
                accessibilityRole="button"
                accessibilityLabel={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="rgba(255,255,255,0.85)"
                />
              </Pressable>
            </View>

            {error ? (
              <Text
                style={{
                  color: "#FF6B6B",
                  fontSize: 14,
                  fontFamily: "Nunito_600SemiBold",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {error}
              </Text>
            ) : null}

            <SocialButton
              icon={<AntDesign name="check" size={24} color="#330065" />}
              label={loading ? "Resetting..." : "Reset Password"}
              variant="default"
              style={{ backgroundColor: "#03FFEE", marginTop: 8 }}
              onPress={handleResetPassword}
              disabled={loading || !code || !password || !confirmPassword}
            />

            <Pressable
              onPress={() => setEmailSent(false)}
              style={{ marginTop: 16, alignItems: "center" }}
            >
              <Text
                style={{
                  color: isDesktop ? "#FFF" : "#03FFEE",
                  fontSize: isDesktop ? 14 : 16,
                  fontFamily: "Nunito_600SemiBold",
                }}
              >
                Use a different email
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
