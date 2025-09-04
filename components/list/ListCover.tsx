import { styles } from "@/styles/addGiftStyles";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  imageUri?: string | null;
  overlayText?: string;
};

export const ListCover: React.FC<Props> = ({ imageUri, overlayText }) => {
  return (
    <View style={styles.coverContainer}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.coverImage} />
      ) : (
        <Image source={require("@/assets/images/nursery.png")} style={styles.coverImage} />
      )}
      <View style={styles.coverOverlay}>{!!overlayText && <Text style={styles.daysToGo}>{overlayText}</Text>}</View>
    </View>
  );
};
