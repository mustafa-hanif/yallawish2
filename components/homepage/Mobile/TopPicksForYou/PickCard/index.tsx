import React from "react";
import { Image, ImageProps, Text, View } from "react-native";
import { styles } from "./style";

interface PickCardProps {
  pickItem?: {
    name?: string;
    subtitle?: string;
    image?: ImageProps;
  };
}
export default function PickCard({ pickItem }: PickCardProps) {
  const { name = "", subtitle = "", image } = pickItem;
  return (
    <View style={styles.card}>
      <View>
        <Image style={styles.image} source={image} resizeMode="cover" />
      </View>
      <View style={styles.content}>
        <View style={styles.titleSubTitleContainer}>
          <View>
            <Text numberOfLines={1} style={styles.title}>
              {name}
            </Text>
          </View>
          <View>
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          {/* <Image style={styles.currency} source={require("@/assets/images/dirham.png")} resizeMode="contain" /> */}
          <Text style={styles.price}>AED 325.32</Text>
        </View>
      </View>
    </View>
  );
}
