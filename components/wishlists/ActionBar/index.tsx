import React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./style";

interface ActionBarProps {
  handleToggleModal: () => void;
  search: string;
  setSearch: () => void;
}

export default function ActionBar({ search, setSearch, handleToggleModal }: ActionBarProps) {
  return (
    <View style={styles.actionBarContainer}>
      <View style={styles.sortAndFilterContainer}>
        <View>
          <View style={styles.selectedSortAndFilterContainer}>
            <Text style={styles.sortByText}>Sort By:</Text>
            <Text style={styles.selectedSortValue}>Date Created (Default)</Text>
          </View>
        </View>

        <View>
          <Pressable style={styles.sortAndFilterButton} onPress={handleToggleModal}>
            <Image source={require("@/assets/images/filterIcon.png")} />
          </Pressable>
        </View>
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput value={search} onChange={setSearch} style={styles.searchInput} placeholder="Search" placeholderTextColor={"#626262"} />
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
