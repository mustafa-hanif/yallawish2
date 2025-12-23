import { ResponsiveAuthLayout } from "@/components/ResponsiveAuthLayout";
import { Divider, SocialButton } from "@/components/auth";
import { authCardStyles as styles } from "@/styles/authCardStyles";
import { useOAuth } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Platform, Text, View } from "react-native";

export default function Page() {
  const router = useRouter();
  const { addToList, returnTo } = useLocalSearchParams<{
    addToList?: string;
    returnTo?: string;
  }>();
  const decodedReturnTo = returnTo
    ? decodeURIComponent(String(returnTo))
    : undefined;
  const { startOAuthFlow: startGoogle } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });

  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  let actionParam: string | undefined;
  if (returnTo) {
    try {
      const parsedReturnTo = new URL(returnTo, "http://www.example.com");
      actionParam = parsedReturnTo.searchParams.get("action") ?? undefined;
    } catch (parseError) {
      console.warn(
        "Invalid returnTo URL, falling back to default action",
        parseError
      );
      actionParam = undefined;
    }
  }

  const isBuy = String(actionParam ?? "").toLowerCase() === "buy";
  const heroTitle = isBuy
    ? "Sign up to make this gift count"
    : "Gifting made \n personal.";
  const heroSubtitle = isBuy
    ? "Buy the perfect gift from this list or even create your own to share with friends and family."
    : "Build lists for yourself or someone you love and make every gift count.";
  const cardTitle = isBuy
    ? "Sign in to make this gift count"
    : "Welcome to YallaWish";
  const cardSubtitle = isBuy
    ? "Sign in to claim this gift and keep everyone in sync."
    : "Sign in to discover gift ideas and manage your wishlists effortlessly.";

  const onGoogle = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startGoogle();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo
        ? (decodedReturnTo as any)
        : "/profile-setup";
      router.replace(target);
    }
  };

  const onApple = async () => {
    const { createdSessionId, setActive: setActiveOAuth } = await startApple();
    if (createdSessionId) {
      await setActiveOAuth?.({ session: createdSessionId });
      const target = decodedReturnTo
        ? (decodedReturnTo as any)
        : "/profile-setup";
      router.replace(target);
    }
  };

  return (
    <ResponsiveAuthLayout
      showHero={!isDesktop}
      heroTitle={heroTitle}
      heroSubtitle={heroSubtitle}
      mobileScrollViewStyle={{ paddingBottom: 0 }}
      mobileLogoHeaderStyle={{ marginTop: 40, marginBottom: 20 }}
      showAnimation
    >
      <View
        style={[
          styles.formContainer,
          isDesktop
            ? styles.formContainerDesktop
            : [styles.formContainerMobile, { paddingBottom: 20 }],
        ]}
      >
        {isDesktop && (
          <>
            <Text style={[styles.welcomeTitle, styles.welcomeTitleDesktop]}>
              {cardTitle}
            </Text>
            <Text style={[styles.cardSubtitle, styles.cardSubtitleDesktop]}>
              {cardSubtitle}
            </Text>
          </>
        )}

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
          <View style={[styles.socialStack, { marginTop: 50 }]}>
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

        <Divider text={isDesktop ? "Or continue with" : "OR"} tone="card" />

        <SocialButton
          onPress={() =>
            router.push({
              pathname: "/(auth)/",
              params: {
                mode: "signup",
                ...(addToList ? { addToList: String(addToList) } : {}),
                ...(decodedReturnTo
                  ? { returnTo: encodeURIComponent(decodedReturnTo) }
                  : {}),
                ...(actionParam ? { action: actionParam } : {}),
              },
            })
          }
          icon={<Image source={require("@/assets/images/mail.png")} />}
          label="Continue with Email"
        />
      </View>
    </ResponsiveAuthLayout>
  );
}
