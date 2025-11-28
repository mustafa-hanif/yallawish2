import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

export function MeetGenie() {
  return (
    <View style={styles.section}>
      <LinearGradient colors={["#330065", "#2C277A", "#03ffee3a"]} locations={[0.4, 0.8, 1]} style={styles.gradientSectionMobile}>
        <View style={styles.pillContainer}>
          <Text style={styles.pillText}>
            <Text style={styles.pillItalicText}>AI</Text> POWERED
          </Text>
        </View>
        <View style={styles.mainContainer}>
          <View>
            <Text style={styles.title}>Meet Genie!</Text>
          </View>
          <View>
            <Image source={require("@/assets/images/chevronRight.png")} resizeMode="contain" />
          </View>
        </View>
        <View>
          <Text style={styles.description}>
            Let our smart assistant suggest the perfect registry items based on your lifestyle, preferences, and needs —<Text style={styles.boldDescription}> saving you time and guesswork!</Text>
          </Text>
        </View>
        <View>
          <Image style={styles.image} source={require("@/assets/images/robot.png")} resizeMode="contain" />
        </View>
      </LinearGradient>
    </View>
  );
}
