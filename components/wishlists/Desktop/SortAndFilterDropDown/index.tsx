import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, ScrollView, Text, View } from "react-native";
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

export default function SortAndFilterDropDown({ currentTab, showSortSheet, handleToggleModal, sortBy, setSortBy, filterBy, setFilterBy, handlePressApply }: SortAndFilterProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [sortExpanded, setSortExpanded] = useState(true);
  const [filterExpanded, setFilterExpanded] = useState(true);

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
      scaleAnim.setValue(0.95);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [showSortSheet, scaleAnim, opacityAnim]);

  if (!showSortSheet) return null;

  if (!showSortSheet) return null;

  return (
    <>
      
      <Animated.View 
        style={[
          styles.dropdownContainer, 
          { 
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
        onBlur={handleToggleModal}
      >
        <ScrollView 
          contentContainerStyle={styles.dropdownContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Sort Section */}
          <View style={styles.sortSection}>
            <Pressable 
              style={styles.sortSectionHeader} 
              onPress={() => setSortExpanded(!sortExpanded)}
            >
              <Text style={styles.sortSectionTitle}>Sort by</Text>
              <Ionicons 
                name={!sortExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#1C0335" 
              />
            </Pressable>
            {sortExpanded && sortArray.map((o) => (
              <Pressable key={o.key} style={styles.radioRow} onPress={() => setSortBy(o.key)}>
                <View style={[styles.radioOuter, sortBy === o.key && styles.radioOuterActive]}>
                  {sortBy === o.key && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{o.label}</Text>
              </Pressable>
            ))}
          </View>


          {/* Filter Section */}
          <View style={styles.sortSection}>
            <Pressable 
              style={styles.sortSectionHeader} 
              onPress={() => setFilterExpanded(!filterExpanded)}
            >
              <Text style={styles.sortSectionTitle}>Filter by</Text>
              <Ionicons 
                name={!filterExpanded ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#1C0335" 
              />
            </Pressable>
            {filterExpanded && filters.map((o) => (
              <Pressable key={o.key} style={styles.radioRow} onPress={() => setFilterBy(o.key)}>
                <View style={[styles.radioOuter, filterBy === o.key && styles.radioOuterActive]}>
                  {filterBy === o.key && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{o.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Apply Button */}
          <Pressable style={styles.applyBtn} onPress={handlePressApply}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </>
  );
}
