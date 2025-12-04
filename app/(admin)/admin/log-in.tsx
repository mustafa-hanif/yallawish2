import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { Dimensions, Platform, Pressable, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { addToList, returnTo } = useLocalSearchParams<{ addToList?: string; returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const showAddToList = !!addToList && String(addToList).toLowerCase() !== "false";
  const ctaLabel = showAddToList ? "Add to list" : "Log in";

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<(string | null)[]>([]);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  const heroTitle = "Welcome Back!";
  const heroSubtitle = "";

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      const result = await signIn.create({ identifier: emailAddress, password });
      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        const target = decodedReturnTo ? (decodedReturnTo as any) : "/(tabs)";
        router.replace(target);
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
    <ResponsiveAuthLayout showHero={!isDesktop} heroTitle={heroTitle} heroSubtitle={heroSubtitle} mobileLogoHeaderStyle={{ marginTop: 20, marginBottom: 20 }}>
      <View style={[styles.formContainer, isDesktop ? styles.formContainerDesktop : styles.formContainerMobile]}>
        {isDesktop && <Text style={[styles.welcomeTitle, isDesktop && styles.welcomeTitleDesktop]}>Welcome Back!</Text>}

        <View style={styles.fieldsStack}>
          <TextInput style={[styles.input, isDesktop && styles.inputDesktop, !isDesktop ? styles.inputMobile : {}]} autoCapitalize="none" value={emailAddress} placeholder={isDesktop ? "Email address" : "Email"} placeholderTextColor="#FFFFFF66" keyboardType="email-address" onChangeText={setEmailAddress} />

          <View style={styles.passwordField}>
            <TextInput style={[styles.input, styles.passwordInput, isDesktop && styles.inputDesktop, !isDesktop ? styles.inputMobile : {}]} value={password} placeholder="Password" placeholderTextColor="#FFFFFF66" secureTextEntry={!showPassword} onChangeText={setPassword} />
            <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.passwordToggle} accessibilityRole="button" accessibilityLabel={showPassword ? "Hide password" : "Show password"}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="rgba(255,255,255,0.85)" />
            </Pressable>
          </View>
        </View>

        <SocialButton onPress={onSignInPress} icon={null} label={ctaLabel} variant={isDesktop ? "primary" : "default"} />

        {error.length > 0 && (
          <View style={styles.errorContainer}>
            {error.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
