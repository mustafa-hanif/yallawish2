import React, { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./style";

interface ActionBarProps {}
export default function ActionBar({}: ActionBarProps) {
  const [isSortAndFilterModal, setIsSortAndFilterModal] = useState(false);

  return (
    <View style={styles.actionBarContainer}>
      <View style={styles.sortAndFilterContainer}>
        <View style={styles.selectedSortAndFilterContainer}>
          <Text style={styles.sortByText}>Sort By:</Text>
          <Text style={styles.selectedSortValue}>Date Created (Default)</Text>
        </View>
        <View>
          <Pressable style={styles.sortAndFilterButton}>
            <View>
              <Image source={require("@/assets/images/filterIcon.png")} />
            </View>
            <View>
              <Text style={styles.sortAndFilterButtonText}>Sort & Filter</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor={"#626262"} />
        <View style={styles.iconContainer}>
          <Image style={styles.searchIcon} source={require("@/assets/images/search.png")} />
        </View>
      </View>
      <View>
        <Text style={styles.selectedListText}>All Lists</Text>
      </View>
    </View>
  );
}
