import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface NoCircleFoundProps {
  searchText: string;
}
export default function NoCircleFound({ searchText }: NoCircleFoundProps) {
  const handleCreateCircle = () => router.push("/create-circle-step1");
  return (
    <View style={styles.container}>
      <View>
        <Image source={require("@/assets/images/noCircleFound.png")} />
      </View>
      <View>
        <Image source={require("@/assets/images/noCircletFound.png")} />
      </View>
      <View>
        <Text style={styles.title}>{searchText?.length > 0 ? `No circles found` : "Your Circle Lives Here"}</Text>
      </View>
      {searchText.length === 0 && (
        <>
          <View>
            <Text style={styles.description}>{"Start your first circle and make gifting\neasier for every occasions"}</Text>
          </View>
          <View>
            <Pressable style={styles.button} onPress={handleCreateCircle}>
              <Text style={styles.buttonText}>Create your first circle</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
