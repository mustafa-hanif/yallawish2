import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";
type category = {
  title?: string;
  icon?: any;
  accent?: string;
};
interface CategoryItemProps {
  item: [category, category];
}
export default function CategoryItem({ item = [] }: CategoryItemProps) {
  console.log("CategoryItem", item);
  return (
    <View style={styles.container}>
      {item.map((category) => {
        const borderColor = category?.color;
        return (
          <View style={[styles.card, { borderColor }]} key={String(category?.id)}>
            <Image style={styles.icon} source={category.icon} resizeMode="center" />
            <Text style={styles.name}>{category?.name}</Text>
          </View>
        );
      })}
    </View>
  );
}
