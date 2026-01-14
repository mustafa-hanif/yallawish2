import { Entypo, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

export default function RequestItem() {
  return (
    <View style={styles.container}>
      <View>
        <Image source={{ uri: "https://htmlstream.com/preview/unify-v2.6.1/assets/img-temp/400x450/img5.jpg" }} style={styles.image} />
      </View>
      <View>
        <Text style={styles.name}>Adam Sandlers</Text>
        <Text style={styles.email}>willy_silly@gmail.com</Text>
        <View style={styles.buttonContainer}>
          <Pressable>
            <FontAwesome name="check-circle" size={24} color="#34C759" />
          </Pressable>
          <Pressable>
            <Entypo name="circle-with-cross" size={24} color="#FF3B30" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
