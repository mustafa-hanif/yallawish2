import { useIsFocused } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Image, Pressable, StatusBar, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

const CreateCircleSuccess = () => {
  const confettiRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (isFocused) {
      confettiRef.current?.start?.();
    }
  }, [isFocused]);

  const handleContinue = () => {
    router.push({ pathname: "/circle" });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <ConfettiCannon ref={confettiRef} count={20} origin={{ x: width / 2, y: -10 }} fadeOut autoStart={false} fallSpeed={3000} explosionSpeed={450} />
      <View style={styles.content}>
        <Image resizeMode="contain" source={require("@/assets/images/circleSuccess.png")} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Your Circle is Ready</Text>
          <Text style={styles.description}>Woohoo! You’ve successfully created your circle. Time to share wishes and make memories</Text>
        </View>
        <View>
          <Pressable style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Go to My Circle</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CreateCircleSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 32,
    paddingHorizontal: 25,
  },
  textContainer: {
    rowGap: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: "Nunito_900Black",
    color: "#330065",
    lineHeight: 44,
    textAlign: "center",
  },
  description: {
    paddingHorizontal: 37,
    fontSize: 18,
    fontFamily: "Nunito_400Regular",
    color: "#330065",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#6FFFF6",
    height: 56,
    width: 229,
    borderRadius: 8.2,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    fontSize: 16.41,
    fontFamily: "Nunito_700Bold",
    color: "#1C1C1C",
    lineHeight: 16.41,
  },
});
