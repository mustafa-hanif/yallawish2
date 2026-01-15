import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "../../ui/BottomSheet";
import { styles } from "./style";

interface SortAndFilterProps {
  showSortSheet: boolean;
  handleToggleModal: () => void;
  sortBy: string | null;
  setSortBy: (key: string) => void;
  filterBy: string | null;
  setFilterBy: (key: string) => void;
  handlePressApply: () => void;
  currentTab?: string;
}

const sortArray = [
  { key: "default", label: "Date Created (Default)" },
  { key: "dateOfEvent", label: "Date of Event" },
  { key: "alphabetically", label: "Alphabetically" },
  { key: "percentage", label: "List Completion %" },
  { key: "totalItems", label: "Total Items" },
];

const filterArray = [
  { key: "allList", label: "All Lists" },
  { key: "archived", label: "Archived" },
  { key: "pastEvents", label: "Past Events" },
  { key: "upcomingEvents", label: "Upcoming Events" },
  { key: "completed", label: "Completed" },
  { key: "inComplete", label: "Incomplete" },
];

export default function SortAndFilterModal({ currentTab, showSortSheet, handleToggleModal, sortBy, setSortBy, filterBy, setFilterBy, handlePressApply }: SortAndFilterProps) {
  // Derive filters for the current tab: hide "Archived" on community-events
  const filters = currentTab === "community-events" ? filterArray.filter((f) => f.key !== "archived") : filterArray;

  // If switching to community tab while "archived" is selected, clear it
  useEffect(() => {
    if (currentTab === "community-events" && filterBy === "archived") {
      // Reset to a safe default available on community tab
      setFilterBy("allList");
    }
  }, [currentTab, filterBy, setFilterBy]);

  return (
    <BottomSheet isVisible={showSortSheet} onClose={handleToggleModal}>
      <ScrollView contentContainerStyle={styles.sortSheetContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sortSheetTitle}>Sort & Filter</Text>
        <View style={styles.sortDivider} />

        <View style={styles.sortSection}>
          <View style={styles.sortSectionHeader}>
            <Text style={styles.sortSectionTitle}>Sort by</Text>
            <Ionicons name="chevron-down" size={20} color="#1C0335" />
          </View>
          {sortArray.map((o) => (
            <Pressable key={o.key} style={styles.radioRow} onPress={() => setSortBy(o.key)}>
              <View style={[styles.radioOuter, sortBy === o.key && styles.radioOuterActive]}>{sortBy === o.key && <View style={styles.radioInner} />}</View>
              <Text style={styles.radioLabel}>{o.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sortSection}>
          <View style={styles.sortSectionHeader}>
            <Text style={styles.sortSectionTitle}>Filter by</Text>
            <Ionicons name="chevron-down" size={20} color="#1C0335" />
          </View>
          {filters.map((o) => (
            <Pressable key={o.key} style={styles.radioRow} onPress={() => setFilterBy(o.key)}>
              <View style={[styles.radioOuter, filterBy === o.key && styles.radioOuterActive]}>{filterBy === o.key && <View style={styles.radioInner} />}</View>
              <Text style={styles.radioLabel}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sortScrollSpacer} />
      </ScrollView>

      <View style={styles.applyBarWrapper}>
        <Pressable style={styles.applyBtnFull} onPress={handlePressApply}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
