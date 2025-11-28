import { inspirationBoards } from "@/constants/Home";
import React from "react";
import { Image, Text, View } from "react-native";
import InspirationBoardCard from "./InspirationBoardCard";
import { styles } from "./style";

export function InspirationBoards() {
  return (
    <View style={styles.section}>
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>Inspiration boards</Text>
        </View>
        <View>
          <Image style={{ tintColor: "black" }} source={require("@/assets/images/chevronRight.png")} resizeMode="contain" />
        </View>
      </View>
      <View style={styles.inspiration}>{inspirationBoards?.map((item) => <InspirationBoardCard item={item} key={item?.id} />)}</View>
    </View>
  );
}
