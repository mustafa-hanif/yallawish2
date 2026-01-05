import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface ActionBarProps {
  handleToggleModal: () => void;
  count?: number;
}

export default function ListsControlPanel({ count = 0, handleToggleModal }: ActionBarProps) {
  return (
    <View style={styles.listsControlPanelContainer}>
      <View style={styles.listCountContainer}>
        <Text style={styles.dropDownText}>All Lists</Text>
        <View style={styles.count}>
          <Text style={styles.countText}>{count}</Text>
        </View>
      </View>
      <View>
        <Pressable style={styles.sortAndFilterButton} onPress={handleToggleModal}>
          <Image style={styles.filterIcon} source={require("@/assets/images/filterIcon.png")} />
          <Text style={styles.sortAndFilterText}>Sort & Filter</Text>
        </Pressable>
      </View>
    </View>
  );
}
