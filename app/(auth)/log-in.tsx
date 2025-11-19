import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { Divider, SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });
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
  const heroSubtitle = "Log in to shop from this list and keep track of your own.";

  const onGoogle = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startGoogle();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/profile-setup";
      router.replace(target);
    }
  };

  const onApple = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startApple();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/profile-setup";
      router.replace(target);
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError([]);
    try {
      const result = await signIn.create({ identifier: emailAddress, password });
      if (result.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        const target = decodedReturnTo ? (decodedReturnTo as any) : "/profile-setup";
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

    const TabUI = () => (
    <View style={[styles.segmentedControl, isDesktop ? styles.segmentedControlDesktop: styles.segmentedControlMobile]}>
      <View style={styles.segmentedOption}>
        <Link
          href={{
            pathname: "/sign-up",
            params: {
              ...(showAddToList ? { addToList: String(addToList) || "1" } : {}),
              ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}),
            },
          }}
          asChild
        >
          <Pressable style={{...styles.segmentedInactive, ...(!isDesktop ? styles.segmentedInactiveMobile : {})}}>
            <Text style={[styles.segmentedInactiveText, !isDesktop ? styles.segmentedInactiveTextMobile : {}]}>Signup</Text>
          </Pressable>
        </Link>
      </View>
      <View style={styles.segmentedOption}>
        <View style={{...styles.segmentedActive, ...(!isDesktop ? styles.segmentedActiveMobile : {})}}>
          <Text style={[styles.segmentedActiveText, !isDesktop ? styles.segmentedActiveTextMobile : {}]}>Login</Text>
        </View>
      </View>
    </View>
  );

  
  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      mobileLogoHeaderStyle={{ marginTop: 20, marginBottom: 20 }}
      tabs={<TabUI />}
    >
      <View
        style={[
          styles.formContainer,
          // isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
          isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
        ]}
      >
        {isDesktop ? <TabUI /> : null}

        {isDesktop && (<Text
          style={[
            styles.welcomeTitle,
            isDesktop && styles.welcomeTitleDesktop,
          ]}
        >
          Welcome Back!
        </Text>)}
        

        <View style={styles.fieldsStack}>
          <TextInput
            style={[styles.input, isDesktop && styles.inputDesktop , !isDesktop ? styles.inputMobile : {}]}
            autoCapitalize="none"
            value={emailAddress}
            placeholder={isDesktop ? "Email address" : "Email"}
             placeholderTextColor="#FFFFFF66"
            keyboardType="email-address"
            onChangeText={setEmailAddress}
          />

          <View style={styles.passwordField}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {}
              ]}
              value={password}
              placeholder="Password"
              placeholderTextColor="#FFFFFF66"
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              style={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="rgba(255,255,255,0.85)"
              />
            </Pressable>
          </View>
          {
          !isDesktop ?
            <Pressable
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotLinkMobile}>Forgot password?</Text>
            </Pressable>
          : null
          }
        </View>
        {
        isDesktop ?
          <Pressable
            onPress={() => {}}
            style={styles.forgotLinkWrapper}
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.forgotLink}>Forgot password?</Text>
          </Pressable>
        : null
         }
        


        <SocialButton
          onPress={onSignInPress}
          icon={null}
          label={ctaLabel}
          variant={isDesktop? "primary" : "default"}
        />

        {error.length > 0 && (
          <View style={styles.errorContainer}>
            {error.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}

        <Divider text={isDesktop ? "Or continue with" : "OR" } tone="card" marginVertical={isDesktop ? 16 : 8} />

        {isDesktop ? (
          <View style={styles.socialRowDesktop}>
            <SocialButton
              onPress={onGoogle}
              icon={<AntDesign name="google" size={24} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Google"
            />
            <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-facebook" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Facebook"
            />
            <SocialButton
              onPress={onApple}
              icon={<AntDesign name="apple" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Apple"
            />
            <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with WhatsApp"
            />
          </View>
        ) : (
          <View style={styles.socialStack}>
            <SocialButton
              onPress={onGoogle}
               icon={<Image source={require('@/assets/images/googleIcon.png')} />}
              label="Continue with Google"
            />
            <SocialButton
              onPress={onApple}
              icon={<Image source={require('@/assets/images/appleIcon.png')} />}
              label="Continue with Apple"
            />
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
