import { topPicks } from "@/constants/Home";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import PickCard from "./PickCard";
import { styles } from "./style";

export function TopPicksForYou() {
  return (
    <View style={styles.section}>
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>Top picks for you...</Text>
        </View>
        <View>
          <Image style={{ tintColor: "black" }} source={require("@/assets/images/chevronRight.png")} resizeMode="contain" />
        </View>
      </View>
      <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flatList} horizontal data={topPicks} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <PickCard pickItem={item} />} />
    </View>
  );
}
