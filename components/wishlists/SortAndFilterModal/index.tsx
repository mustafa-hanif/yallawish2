import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

interface SortAndFilterProps {
  showSortSheet: boolean;
  handleToggleModal: () => void;
  sortBy: string | null;
  setSortBy: (key: string) => void;
  filterBy: string | null;
  setFilterBy: (key: string) => void;
  handlePressApply: () => void;
}

const sortArray = [
  { key: "default", label: "Date Created (Default)" },
  { key: "dateOfEvent", label: "Date of Event" },
  { key: "alphabetically", label: "Alphabetically" },
  { key: "percentage", label: "List Completion %" },
  { key: "totalItems", label: "Total Items" },
];

const filterArray = [
  { key: "pastEvents", label: "Past Events" },
  { key: "upcomingEvents", label: "Upcoming Events" },
  { key: "completed", label: "Completed" },
  { key: "inComplete", label: "Incomplete" },
];

export default function SortAndFilterModal({ showSortSheet, handleToggleModal, sortBy, setSortBy, filterBy, setFilterBy, handlePressApply }: SortAndFilterProps) {
  return (
    <Modal visible={showSortSheet} transparent animationType="fade" onRequestClose={handleToggleModal}>
      <Pressable style={styles.backdrop} onPress={handleToggleModal} />
      <View style={styles.sortSheetContainer}>
        <Pressable onPress={handleToggleModal}>
          <View style={styles.sortSheetHandle} />
        </Pressable>
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
            {filterArray.map((o) => (
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
      </View>
    </Modal>
  );
}
