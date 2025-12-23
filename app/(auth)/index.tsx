import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { Divider, SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

type AuthMode = "login" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setActiveSignIn,
  } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });
  const { addToList, returnTo, mode } = useLocalSearchParams<{
    addToList?: string;
    returnTo?: string;
    mode?: string;
  }>();

  const decodedReturnTo = returnTo
    ? decodeURIComponent(String(returnTo))
    : undefined;
  const showAddToList =
    !!addToList && String(addToList).toLowerCase() !== "false";

  // State for tab switching
  const [activeTab, setActiveTab] = React.useState<AuthMode>(
    mode === "signup" ? "signup" : "login"
  );

  // Login states
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [showLoginPassword, setShowLoginPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<(string | null)[]>([]);

  // Signup states
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [showSignupPassword, setShowSignupPassword] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [marketing, setMarketing] = React.useState(false);
  const [signupError, setSignupError] = React.useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  const isLogin = activeTab === "login";
  const ctaLabel = showAddToList
    ? isLogin
      ? "Add to list"
      : "Add to list"
    : isLogin
      ? "Log in"
      : "Sign up";

  const heroTitle = isLogin ? "Welcome Back!" : "Sign up to save \n this gift";
  const heroSubtitle = isLogin
    ? "Log in to shop from this list and keep track of your own."
    : "Add it to your list now and start creating your own to share with friends and family.";

  const onGoogle = React.useCallback(async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startGoogle();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/(tabs)";
      router.replace(target);
    }
  }, [startGoogle, decodedReturnTo, router]);

  const onApple = React.useCallback(async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startApple();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo ? (decodedReturnTo as any) : "/(tabs)";
      router.replace(target);
    }
  }, [startApple, decodedReturnTo, router]);

  const onSignInPress = React.useCallback(async () => {
    if (!signInLoaded) return;
    setLoginError([]);
    try {
      const result = await signIn.create({
        identifier: loginEmail,
        password: loginPassword,
      });
      if (result.status === "complete") {
        await setActiveSignIn?.({ session: result.createdSessionId });
        const target = decodedReturnTo ? (decodedReturnTo as any) : "/(tabs)";
        router.replace(target);
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setLoginError((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setLoginError(["An unknown error occurred."]);
      }
    }
  }, [
    signInLoaded,
    signIn,
    loginEmail,
    loginPassword,
    setActiveSignIn,
    decodedReturnTo,
    router,
  ]);

  const onSignUpPress = React.useCallback(async () => {
    if (!signUpLoaded || isLoading) return;

    if (!signupEmail.trim()) {
      setSignupError(["Please enter your email address."]);
      return;
    }
    if (!signupPassword.trim()) {
      setSignupError(["Please enter a password."]);
      return;
    }

    setIsLoading(true);
    setSignupError([]);

    try {
      await signUp.create({
        emailAddress: signupEmail.trim(),
        password: signupPassword,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        unsafeMetadata: {
          marketing,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push({
        pathname: "/verify-otp",
        params: {
          email: signupEmail.trim(),
          ...(showAddToList ? { addToList: String(addToList) || "1" } : {}),
          ...(decodedReturnTo
            ? { returnTo: encodeURIComponent(decodedReturnTo) }
            : {}),
        },
      });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        Array.isArray((err as any).errors)
      ) {
        setSignupError((err as any).errors.map((e: any) => e.longMessage));
      } else {
        setSignupError(["An unknown error occurred."]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    signUpLoaded,
    isLoading,
    signupEmail,
    signupPassword,
    firstName,
    lastName,
    marketing,
    signUp,
    router,
    showAddToList,
    addToList,
    decodedReturnTo,
  ]);

  const TabUI = () => (
    <View
      style={[
        styles.segmentedControl,
        isDesktop
          ? styles.segmentedControlDesktop
          : styles.segmentedControlMobile,
      ]}
    >
      <View style={styles.segmentedOption}>
        <Pressable
          onPress={() => setActiveTab("signup")}
          style={{
            ...(activeTab === "signup"
              ? styles.segmentedActive
              : styles.segmentedInactive),
            ...(!isDesktop
              ? activeTab === "signup"
                ? styles.segmentedActiveMobile
                : styles.segmentedInactiveMobile
              : {}),
          }}
        >
          <Text
            style={[
              activeTab === "signup"
                ? styles.segmentedActiveText
                : styles.segmentedInactiveText,
              !isDesktop
                ? activeTab === "signup"
                  ? styles.segmentedActiveTextMobile
                  : styles.segmentedInactiveTextMobile
                : {},
            ]}
          >
            Signup
          </Text>
        </Pressable>
      </View>
      <View style={styles.segmentedOption}>
        <Pressable
          onPress={() => setActiveTab("login")}
          style={{
            ...(activeTab === "login"
              ? styles.segmentedActive
              : styles.segmentedInactive),
            ...(!isDesktop
              ? activeTab === "login"
                ? styles.segmentedActiveMobile
                : styles.segmentedInactiveMobile
              : {}),
          }}
        >
          <Text
            style={[
              activeTab === "login"
                ? styles.segmentedActiveText
                : styles.segmentedInactiveText,
              !isDesktop
                ? activeTab === "login"
                  ? styles.segmentedActiveTextMobile
                  : styles.segmentedInactiveTextMobile
                : {},
            ]}
          >
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const LoginForm = React.useMemo(
    () => (
      <>
        {isDesktop && (
          <Text style={[styles.welcomeTitle, styles.welcomeTitleDesktop]}>
            Welcome Back!
          </Text>
        )}

        <View style={styles.fieldsStack}>
          <TextInput
            style={[
              styles.input,
              isDesktop && styles.inputDesktop,
              !isDesktop ? styles.inputMobile : {},
            ]}
            autoCapitalize="none"
            value={loginEmail}
            placeholder={isDesktop ? "Email address" : "Email"}
            placeholderTextColor="#FFFFFF66"
            keyboardType="email-address"
            onChangeText={setLoginEmail}
          />

          <View style={styles.passwordField}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              value={loginPassword}
              placeholder="Password"
              placeholderTextColor="#FFFFFF66"
              secureTextEntry={!showLoginPassword}
              onChangeText={setLoginPassword}
            />
            <Pressable
              onPress={() => setShowLoginPassword((v) => !v)}
              style={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={
                showLoginPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showLoginPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="rgba(255,255,255,0.85)"
              />
            </Pressable>
          </View>

          {!isDesktop && (
            <Pressable
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.forgotLinkMobile}>Forgot password?</Text>
            </Pressable>
          )}
        </View>

        {isDesktop && (
          <Pressable
            onPress={() => {}}
            style={styles.forgotLinkWrapper}
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
          >
            <Text style={styles.forgotLink}>Forgot password?</Text>
          </Pressable>
        )}

        <SocialButton
          onPress={onSignInPress}
          icon={null}
          label={ctaLabel}
          variant={isDesktop ? "primary" : "default"}
        />

        {loginError.length > 0 && (
          <View style={styles.errorContainer}>
            {loginError.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}
      </>
    ),
    [
      isDesktop,
      loginEmail,
      loginPassword,
      showLoginPassword,
      loginError,
      ctaLabel,
      onSignInPress,
    ]
  );

  const SignupForm = React.useMemo(
    () => (
      <>
        {isDesktop && (
          <Text style={[styles.welcomeTitle, styles.welcomeTitleDesktop]}>
            Welcome to YallaWish
          </Text>
        )}

        <View style={styles.fieldsStack}>
          <View style={[styles.nameRow, isDesktop && styles.nameRowDesktop]}>
            <TextInput
              style={[
                styles.input,
                styles.inputField,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              value={firstName}
              placeholder={isDesktop ? "First name" : "First Name"}
              placeholderTextColor="#FFFFFF66"
              onChangeText={(text) => {
                setFirstName(text);
                if (signupError.length > 0) setSignupError([]);
              }}
            />
            <TextInput
              style={[
                styles.input,
                styles.inputField,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              value={lastName}
              placeholder={isDesktop ? "Last name" : "Last Name"}
              placeholderTextColor="#FFFFFF66"
              onChangeText={(text) => {
                setLastName(text);
                if (signupError.length > 0) setSignupError([]);
              }}
            />
          </View>

          <TextInput
            style={[
              styles.input,
              isDesktop && styles.inputDesktop,
              !isDesktop ? styles.inputMobile : {},
            ]}
            autoCapitalize="none"
            value={signupEmail}
            placeholder={isDesktop ? "Email address" : "Email"}
            placeholderTextColor="#FFFFFF66"
            keyboardType="email-address"
            onChangeText={(text) => {
              setSignupEmail(text);
              if (signupError.length > 0) setSignupError([]);
            }}
          />
          <View style={styles.passwordField}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                isDesktop && styles.inputDesktop,
                !isDesktop ? styles.inputMobile : {},
              ]}
              value={signupPassword}
              placeholder="Password"
              placeholderTextColor="#FFFFFF66"
              secureTextEntry={!showSignupPassword}
              onChangeText={(text) => {
                setSignupPassword(text);
                if (signupError.length > 0) setSignupError([]);
              }}
              onSubmitEditing={onSignUpPress}
              returnKeyType="done"
            />
            <Pressable
              onPress={() => setShowSignupPassword((v) => !v)}
              style={styles.passwordToggle}
              accessibilityRole="button"
              accessibilityLabel={
                showSignupPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showSignupPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="rgba(255,255,255,0.85)"
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => setMarketing((v) => !v)}
          style={styles.checkboxRow}
        >
          <View
            style={[styles.checkboxBox, marketing && styles.checkboxBoxChecked]}
          >
            {marketing && (
              <Ionicons name="checkmark" size={14} color="#1B0A3A" />
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            I agree, by signing up the{" "}
            <Text style={styles.termsLink}>Terms &amp; Policy</Text>
          </Text>
        </Pressable>

        <SocialButton
          onPress={onSignUpPress}
          icon={null}
          label={isLoading ? "Signing up..." : ctaLabel}
          variant={isDesktop ? "primary" : "default"}
        />

        {signupError.length > 0 && (
          <View style={styles.errorContainer}>
            {signupError.map((e, i) => (
              <Text key={i} style={styles.errorText}>
                {e}
              </Text>
            ))}
          </View>
        )}
      </>
    ),
    [
      isDesktop,
      firstName,
      lastName,
      signupEmail,
      signupPassword,
      showSignupPassword,
      signupError,
      marketing,
      isLoading,
      ctaLabel,
      onSignUpPress,
    ]
  );

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      mobileLogoHeaderStyle={{ marginTop: 20, marginBottom: 10 }}
      tabs={<TabUI />}
    >
      <View
        style={[
          styles.formContainer,
          isDesktop ? styles.formContainerDesktop : styles.formContainerMobile,
        ]}
      >
        {/* Desktop tabs are rendered inside the form container */}
        {isDesktop ? <TabUI /> : null}

        {/* Form content */}
        {isLogin ? LoginForm : SignupForm}

        <Divider
          text={isDesktop ? "Or continue with" : "OR"}
          tone="card"
          marginVertical={isDesktop ? 16 : 8}
        />

        {isDesktop ? (
          <View style={styles.socialRowDesktop}>
            <SocialButton
              onPress={onGoogle}
              icon={<AntDesign name="google" size={24} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Google"
            />
            {/* <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-facebook" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Facebook"
            /> */}
            <SocialButton
              onPress={onApple}
              icon={<AntDesign name="apple" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with Apple"
            />
            1
            {/* <SocialButton
              onPress={() => {}}
              icon={<Ionicons name="logo-whatsapp" size={26} color="#FFFFFF" />}
              variant="icon"
              accessibilityLabel="Continue with WhatsApp"
            /> */}
          </View>
        ) : (
          <View style={styles.socialStack}>
            <SocialButton
              onPress={onGoogle}
              icon={
                <Image source={require("@/assets/images/googleIcon.png")} />
              }
              label="Continue with Google"
            />
            <SocialButton
              onPress={onApple}
              icon={<Image source={require("@/assets/images/appleIcon.png")} />}
              label="Continue with Apple"
            />
          </View>
        )}
      </View>
    </ResponsiveAuthLayout>
  );
}
