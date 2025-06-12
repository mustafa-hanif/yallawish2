import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

// Categories for browsing
const categories = [
  { id: 1, name: "Electronics", emoji: "📱", count: 156 },
  { id: 2, name: "Fashion", emoji: "👕", count: 243 },
  { id: 3, name: "Home & Garden", emoji: "🏠", count: 89 },
  { id: 4, name: "Sports", emoji: "⚽", count: 127 },
  { id: 5, name: "Books", emoji: "📚", count: 78 },
  { id: 6, name: "Gaming", emoji: "🎮", count: 95 },
  { id: 7, name: "Beauty", emoji: "💄", count: 134 },
  { id: 8, name: "Toys", emoji: "🧸", count: 67 },
];

// Featured products
const featuredProducts = [
  { id: 1, name: "Latest iPhone", price: "$999", image: "📱", rating: 4.8 },
  { id: 2, name: "Designer Shoes", price: "$299", image: "👟", rating: 4.6 },
  { id: 3, name: "Smart Watch", price: "$399", image: "⌚", rating: 4.7 },
  { id: 4, name: "Gaming Laptop", price: "$1599", image: "💻", rating: 4.9 },
];

interface Category {
  id: number;
  name: string;
  emoji: string;
  count: number;
}

interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
}

export default function BrowseScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const handleCategoryPress = (category: Category) => {
    Alert.alert(
      category.name,
      `Browse ${category.count} products in ${category.name}`,
      [{ text: "OK" }]
    );
  };

  const handleProductPress = (product: FeaturedProduct) => {
    Alert.alert(
      product.name,
      `Price: ${product.price}\nRating: ${product.rating}/5`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add to Wishlist",
          onPress: () => console.log(`Added ${product.name} to wishlist`),
        },
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { borderColor: tintColor + "20" }]}
      onPress={() => handleCategoryPress(item)}
    >
      <ThemedText style={styles.categoryEmoji}>{item.emoji}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.categoryName}>
        {item.name}
      </ThemedText>
      <ThemedText style={[styles.categoryCount, { color: tintColor }]}>
        {item.count} items
      </ThemedText>
    </TouchableOpacity>
  );

  const renderFeaturedProduct = ({ item }: { item: FeaturedProduct }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { borderColor: tintColor + "20" }]}
      onPress={() => handleProductPress(item)}
    >
      <ThemedText style={styles.featuredImage}>{item.image}</ThemedText>
      <ThemedView style={styles.featuredInfo}>
        <ThemedText type="defaultSemiBold" style={styles.featuredName}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.featuredPrice}>{item.price}</ThemedText>
        <ThemedView style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <ThemedText style={styles.rating}>{item.rating}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          🔍 Browse Products
        </ThemedText>

        {/* Search Bar */}
        <ThemedView
          style={[styles.searchContainer, { borderColor: tintColor + "30" }]}
        >
          <Ionicons
            name="search"
            size={20}
            color={tintColor}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search for products..."
            placeholderTextColor={textColor + "60"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
      </ThemedView>

      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
            {/* Categories Section */}
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Categories
              </ThemedText>
              <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.categoryRow}
              />
            </ThemedView>

            {/* Featured Products Section */}
            <ThemedView style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Featured Products
              </ThemedText>
            </ThemedView>
          </>
        }
        data={featuredProducts}
        renderItem={renderFeaturedProduct}
        keyExtractor={(item) => item.id.toString()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
  },
  featuredCard: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  featuredImage: {
    fontSize: 40,
    marginRight: 16,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredName: {
    fontSize: 16,
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
});
