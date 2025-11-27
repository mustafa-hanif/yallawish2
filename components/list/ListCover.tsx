import { styles } from "@/styles/addGiftStyles";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  imageUri?: string | null;
  overlayText?: string;
  occasion?: string
};

export const ListCover: React.FC<Props> = ({ imageUri, overlayText, occasion }) => {

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

// const occasionColor: Record<string, string> = {
//     birthday: '#FFF6D2',
//     wedding: "#FFE0E0",
//     'baby-shower': '#F0F9F0',
//     graduation: '#D9F3FF',
//     'new-home' : '#F5E8D5',
//     'retirement': '#FFEBCC',
//     'no-occasion' : '#F4F4F4',
//     'other' : '#E9E9E9'
//   }
