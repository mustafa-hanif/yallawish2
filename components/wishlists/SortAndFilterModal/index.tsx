import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";
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
  const { height } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Derive filters for the current tab: hide "Archived" on community-events
  const filters = currentTab === "community-events" ? filterArray.filter((f) => f.key !== "archived") : filterArray;

  // If switching to community tab while "archived" is selected, clear it
  useEffect(() => {
    if (currentTab === "community-events" && filterBy === "archived") {
      // Reset to a safe default available on community tab
      setFilterBy("allList");
    }
  }, [currentTab, filterBy, setFilterBy]);

  useEffect(() => {
    if (showSortSheet) {
      translateY.setValue(height);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 650,
          easing: Easing.bezier(0.2, 0.9, 0.2, 1),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSortSheet, height, translateY, backdropOpacity]);

  const handleCloseWithAnimation = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 420,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: height,
        duration: 600,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) handleToggleModal();
    });
  };

  return (
    <Modal visible={showSortSheet} transparent animationType="none" onRequestClose={handleToggleModal}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={handleCloseWithAnimation} />
      </Animated.View>
      <Animated.View style={[styles.sortSheetContainer, { transform: [{ translateY }] }]}>
        <Pressable onPress={handleCloseWithAnimation}>
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
      </Animated.View>
    </Modal>
  );
}
