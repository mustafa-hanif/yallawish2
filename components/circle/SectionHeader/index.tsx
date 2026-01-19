import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface SectionHeaderProps {
  title: string;
  count: number;
  buttonTitle: string;
  buttonAction?: () => void;
}

export default function SectionHeader({ title, count, buttonTitle, buttonAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{count}</Text>
        </View>
      </View>
      <View>
        <Pressable style={styles.button} onPress={buttonAction}>
          <AntDesign name="plus" size={20} color="#1C1C1C" />
          <Text style={styles.buttonTitle}>{buttonTitle}</Text>
        </Pressable>
      </View>
    </View>
  );
}
