import React from "react";
import { FlatList, View } from "react-native";
import WishListCard from "../WishListCard";
import { styles } from "./style";

export default function WishListing({ wishList = [] }) {
  return (
    <View style={styles.container}>
      <FlatList
        columnWrapperStyle={styles.columnWrapperStyle}
        contentContainerStyle={styles.contentContainerStyle}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        key={2}
        data={wishList}
        renderItem={({ item }) => <WishListCard item={item} />}
        keyExtractor={(item) => String(item.id)}
      />
    </View>
  );
}
