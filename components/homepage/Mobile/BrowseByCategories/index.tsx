import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import CategoryItem from "./CategoryItem";
import { styles } from "./style";

interface BrowseByCategoriesProp {}

const categories = [
  [
    { id: 1, name: "Wedding", icon: require("@/assets/images/weddingIcon.png"), color: "#FF3B30" },
    { id: 4, name: "Graduation", icon: require("@/assets/images/graduationIcon.png"), color: "#32ADE6" },
  ],
  [
    { id: 3, name: "Birthday", icon: require("@/assets/images/cake.png"), color: "#FFCC00" },
    { id: 2, name: "Baby Shower", icon: require("@/assets/images/babyShowerIcon1.png"), color: "#00C7BE" },
  ],
  [
    { id: 6, name: "New Home", icon: require("@/assets/images/newHomeIcon.png"), color: "#5856D6" },
    { id: 7, name: "Retirement", icon: require("@/assets/images/retirementIcon1.png"), color: "#FF9500" },
  ],
  [
    { id: 5, name: "Bridal Shower", icon: require("@/assets/images/bridalShower2.png"), color: "#AF52DE" },
    { id: 8, name: "Other", icon: require("@/assets/images/otherIcon.png"), color: "#A2845E" },
  ],
];

export function BrowseByCategories({}: BrowseByCategoriesProp) {
  const flatListRef = useRef(null);
  const [scrollingDirection, setScrollingDirection] = useState("forward");

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollingDirection === "forward") {
        flatListRef?.current.scrollToEnd({ offset: 3, animated: true });
        setScrollingDirection("backward");
      } else {
        // Scroll back to the start
        flatListRef?.current.scrollToOffset({ offset: 2, animated: true });
        setScrollingDirection("forward");
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [scrollingDirection]);

  return (
    <View style={styles.section}>
      <View>
        <Text style={styles.title}>Browse by categories</Text>
      </View>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.flatList}
        horizontal
        data={categories} // Ensure this is an array of categories
        renderItem={({ item }) => <CategoryItem item={item} />}
        scrollEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
