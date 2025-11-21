import { styles } from "@/styles/addGiftStyles";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  onBack?: () => void;
};

export const HeaderBar: React.FC<Props> = ({ title, onBack }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient colors={["#330065", "#45018ad7"]} style={styles.header} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }} style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              {onBack ? (
                <Pressable onPress={onBack} style={styles.backButton}>
                  <Image source={require("@/assets/images/backArrow.png")} />
                </Pressable>
              ) : null}
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};
