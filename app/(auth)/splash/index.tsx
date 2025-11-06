import { Images } from "@/assets/images";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, ImageBackground } from "react-native";
import { style } from "./style";

const { splash, logo } = Images;

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // const timer = setTimeout(() => router.replace("/(auth)/sign-in"), 3000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar hidden translucent animated />
      <ImageBackground resizeMode="cover" source={splash} style={style.container}>
        <Image source={logo} />
      </ImageBackground>
    </>
  );
}
