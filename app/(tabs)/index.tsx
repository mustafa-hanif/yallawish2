import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import directus from "@/provider/sdkprovider";
import { readItems } from "@directus/sdk";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity } from "react-native";

// Sample product data - you can replace this with your actual data
const sampleProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "$999",
    category: "Electronics",
    emoji: "📱",
  },
  {
    id: 2,
    name: "MacBook Air",
    price: "$1299",
    category: "Electronics",
    emoji: "💻",
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: "$249",
    category: "Electronics",
    emoji: "🎧",
  },
  {
    id: 4,
    name: "Nike Air Max",
    price: "$150",
    category: "Fashion",
    emoji: "👟",
  },
  { id: 5, name: "Coffee Maker", price: "$89", category: "Home", emoji: "☕" },
  {
    id: 6,
    name: "Gaming Chair",
    price: "$299",
    category: "Gaming",
    emoji: "🪑",
  },
  {
    id: 7,
    name: "Smart Watch",
    price: "$399",
    category: "Electronics",
    emoji: "⌚",
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: "$79",
    category: "Electronics",
    emoji: "🔊",
  },
];

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  emoji: string;
}

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const backgroundColor = useThemeColor({}, "background");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    // Try to fetch products from Directus, fallback to sample data
    const fetchProducts = async () => {
      try {
        const response = await directus.request(
          readItems("products", {
            fields: [{ category: ["title"] }, { wishlists: ["*"] }],
          })
        );
        console.log("Fetched products:", response);
        // If you have real data, map it to the Product interface format
        // For now, we'll keep using sample data but you can uncomment the line below
        // setProducts(mappedResponse);
      } catch (error) {
        console.log("Using sample data - Directus not available:", error);
        // Ensure we have sample data loaded
        setProducts(sampleProducts);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateWishlist = () => {
    Alert.alert(
      "Create Wishlist",
      "This will open the wishlist creation screen",
      [{ text: "OK" }]
    );
  };

  const handleProductSelect = (product: Product) => {
    Alert.alert(
      "Add to Wishlist",
      `Do you want to add ${product.name} to your wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: () => console.log(`Added ${product.name} to wishlist`),
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { borderColor: tintColor + "20" }]}
      onPress={() => handleProductSelect(item)}
    >
      <ThemedView style={styles.productContent}>
        <ThemedText style={styles.productEmoji}>{item.emoji}</ThemedText>
        <ThemedView style={styles.productInfo}>
          <ThemedText type="defaultSemiBold" style={styles.productName}>
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.productCategory, { color: tintColor }]}>
            {item.category}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.productPrice}>
            {item.price}
          </ThemedText>
        </ThemedView>
        <Ionicons name="add-circle-outline" size={24} color={tintColor} />
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          🎁 YallaWish
        </ThemedText>
        <ThemedText
          style={[styles.headerSubtitle, { color: textColor + "80" }]}
        >
          Create your dream wishlist
        </ThemedText>
      </ThemedView>

      {/* Create Button */}
      <TouchableOpacity
        style={[styles.createButton, { backgroundColor: tintColor }]}
        onPress={handleCreateWishlist}
      >
        <Ionicons name="add" size={24} color="white" />
        <ThemedText style={styles.createButtonText}>
          Create New Wishlist
        </ThemedText>
      </TouchableOpacity>

      {/* Products Section */}
      <ThemedView style={styles.productsSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Choose Products to Add
        </ThemedText>
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  productsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  productEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
  },
});
