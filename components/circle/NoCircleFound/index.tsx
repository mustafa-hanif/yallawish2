import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface NoCircleFoundProps {
  searchText: string;
  isCreateList?: boolean;
}
export default function NoCircleFound({ searchText, isCreateList = false }: NoCircleFoundProps) {
  const handleCreateCircle = () => router.push("/create-circle-step1");
  return (
    <View style={styles.container}>
      <View>{isCreateList ? <Text style={styles.noCircleFound}>No circles found :(</Text> : <Image source={require("@/assets/images/noCircleFound.png")} />}</View>
      <View>
        <Image style={isCreateList ? styles.smImage : undefined} source={require("@/assets/images/noCircletFound.png")} />
      </View>
      <View>
        <Text style={styles.title}>{isCreateList ? "Add a new circle" : searchText?.length > 0 ? `No circles found` : "Your Circle Lives Here"}</Text>
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
