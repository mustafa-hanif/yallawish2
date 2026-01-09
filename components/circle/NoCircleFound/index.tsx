import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

export default function NoCircleFound() {
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("@/assets/images/noCircleFound.png")} />
      </View>
      <View>
        <Image source={require("@/assets/images/noCircletFound.png")} />
      </View>
      <View>
        <Text style={styles.title}>Your Circle Lives Here</Text>
      </View>
      <View>
        <Text style={styles.description}>{"Start your first circle and make gifting\neasier for every occasions"}</Text>
      </View>
      <View>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Create your first circle</Text>
        </Pressable>
      </View>
    </View>
  );
}
