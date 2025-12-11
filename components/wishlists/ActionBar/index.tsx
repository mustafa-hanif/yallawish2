import React from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./style";

interface ActionBarProps {
  handleToggleModal: () => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  appliedSortBy: string | null;
  setAppliedSortBy: React.Dispatch<React.SetStateAction<string | null>>;
  appliedFilterBy: string | null;
  setAppliedFilterBy: React.Dispatch<React.SetStateAction<string | null>>;
  count?: number;
}

const sortByObj: Record<string, string> = {
  default: "Default",
  dateOfEvent: "Date of Event",
  alphabetically: "Alphabetically",
  percentage: "List Completion %",
  totalItems: "Total Items",
};
const filterByObj: Record<string, string> = {
  pastEvents: "Past Events",
  upcomingEvents: "Upcoming Events",
  completed: "Completed",
  inComplete: "Incomplete",
};

export default function ActionBar({ count = 0, search, setSearch, handleToggleModal, appliedSortBy, setAppliedSortBy, appliedFilterBy, setAppliedFilterBy }: ActionBarProps) {
  const handleRemoveSortBy = () => setAppliedSortBy(null);
  const handleRemoveFilterBy = () => setAppliedFilterBy(null);

  return (
    <View style={styles.actionBarContainer}>
      <View style={styles.sortAndFilterContainer}>
        <View style={styles.filterButtons}>
          {appliedSortBy ? (
            <View style={styles.selectedSortAndFilterContainer}>
              <Text style={styles.selectedSortValue}>{sortByObj?.[appliedSortBy]}</Text>
              <Pressable onPress={handleRemoveSortBy}>
                <Image source={require("@/assets/images/cross.png")} resizeMode="contain" />
              </Pressable>
            </View>
          ) : null}
          {appliedFilterBy ? (
            <View style={styles.selectedSortAndFilterContainer}>
              <Text style={styles.selectedSortValue}>{filterByObj?.[appliedFilterBy]}</Text>
              <Pressable onPress={handleRemoveFilterBy}>
                <Image source={require("@/assets/images/cross.png")} resizeMode="contain" />
              </Pressable>
            </View>
          ) : null}
        </View>
        <View>
          <Pressable style={styles.sortAndFilterButton} onPress={handleToggleModal}>
            <Image source={require("@/assets/images/filterIcon.png")} />
          </Pressable>
        </View>
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput value={search} onChangeText={(t) => setSearch(t)} style={styles.searchInput} placeholder="Search" placeholderTextColor={"#626262"} />
        <View style={styles.iconContainer}>
          <Image style={styles.searchIcon} source={require("@/assets/images/search.png")} />
        </View>
      </View>
      <View>
        <View style={styles.listCountContainer}>
          <Text style={styles.dropDownText}>All Lists</Text>
          <View style={styles.count}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
