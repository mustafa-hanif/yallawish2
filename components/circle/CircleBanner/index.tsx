import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "./style";

interface CircleBannerProps {
  coverPhotoUri?: string | null;
  title: string;
}

export default function CircleBanner({ coverPhotoUri, title }: CircleBannerProps) {
  return (
    <View style={styles.container}>
      {coverPhotoUri ? <Image source={{ uri: coverPhotoUri }} style={styles.headerImage} /> : <View style={[styles.headerImage, { backgroundColor: "#D1D1D6" }]} />}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}
