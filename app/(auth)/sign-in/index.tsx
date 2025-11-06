import { Images } from "@/assets/images";
import { Divider } from "@/components/Divider";
import { SocialButton } from "@/components/SocialButton";
import { labels } from "@/lng/english";
import { useOAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StatusBar, Text, View } from "react-native";
import { style } from "./style";

const { logo, splash, google, apple, mail } = Images;
export default function Page() {
  const router = useRouter();
  const { addToList, returnTo } = useLocalSearchParams<{ addToList?: string; returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;
  const { startOAuthFlow: startGoogle } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startApple } = useOAuth({ strategy: "oauth_apple" });

  // "/gift-detail?listId=j974cp5qz4j7ey0k6wb4jzsxx97nedqk&itemId=jx7bts36hd0kk40vbd0ex8882x7ng36s&action=buy"

  let _returnTo = new URL(`http://www.example.com${returnTo}`);
  const action = _returnTo.searchParams.get("action");
  const isBuy = String(action ?? "").toLowerCase() === "buy";
  const heroTitle = isBuy ? "Sign up to make this gift count" : labels.giftingMadePersonal;
  const heroSubtitle = isBuy ? "Buy the perfect gift from this list or even create your own to share with friends and family." : labels.splashText;

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

  const handleClickContinueWithEmail = () => router.push({ pathname: "/sign-up", params: { ...(addToList ? { addToList: String(addToList) } : {}), ...(decodedReturnTo ? { returnTo: encodeURIComponent(decodedReturnTo) } : {}), ...(action ? { action: String(action) } : {}) } });

  const social = [
    {
      id: "1",
      icon: google,
      label: labels.continueWithGoogle,
      onPress: onGoogle,
    },
    {
      id: "2",
      icon: apple,
      label: labels.continueWithApple,
      onPress: onApple,
    },
  ];

  return (
    <>
      <StatusBar hidden translucent animated />
      <ImageBackground resizeMode="cover" source={splash} style={style.container}>
        <View style={style.headerSection}>
          <Image source={logo} style={style.logo} />
        </View>
        <View style={style.contentSection}>
          <View style={style.textSection}>
            <View>
              <Text style={style.mainHeading}>{heroTitle}</Text>
            </View>
            <View>
              <Text style={style.splashText}>{heroSubtitle}</Text>
            </View>
          </View>
          <View style={style.socialContainer}>
            {social?.map((socialItem) => <SocialButton key={socialItem?.id} onPress={socialItem?.onPress} label={socialItem?.label} icon={socialItem?.icon} />)}
            <Divider text={labels.or} marginVertical={40} />
            <SocialButton onPress={handleClickContinueWithEmail} label={labels?.continueWithEmail} icon={mail} />
          </View>
        </View>
        <View style={{ height: 24 }} />
      </ImageBackground>
    </>
  );
}
