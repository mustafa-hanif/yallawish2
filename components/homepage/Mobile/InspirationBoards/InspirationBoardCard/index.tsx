import React from "react";
import { Image, ImageProps, Text, View } from "react-native";
import { styles } from "./style";

interface InspirationBoardCardProps {
  item: {
    title?: string;
    subtitle?: string;
    image?: ImageProps;
  };
}
export default function InspirationBoardCard({ item }: InspirationBoardCardProps) {
  const { title = "", subtitle = "", image } = item;
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <View>
          <Text numberOfLines={3} style={styles.title}>
            {title}
          </Text>
        </View>
        <View>
          <Text numberOfLines={3} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
      <Image style={styles.image} source={image} resizeMode="cover" />
    </View>
  );
}
