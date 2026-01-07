import { getDaysToGoText } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { FlatList, Image, ImageBackground, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface GiftItem {
  _id: string;
  name: string;
  image_url?: string;
  price: number;
  quantity: number;
  claimed?: number;
}

interface ListDetailsProps {
  list: {
    _id: string;
    title: string;
    occasion?: string;
    shippingAddress?: string;
    coverPhotoUri?: string;
  };
  items: GiftItem[];
  onRemoveItem?: (itemId: string) => void;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  currentTab?: string;
}

export default function ListDetails({  list, items, onRemoveItem, onUpdateQuantity, currentTab }: ListDetailsProps) {
  const loading = false;
  const privacy = "shared";
  const address = list.shippingAddress || null;
  const shareCount = 0;
  const isShared = privacy === "shared";
  const isPublic = isShared && (shareCount ?? 0) === 0;
  const title = loading ? "Loading..." : isShared ? (isPublic ? "Public" : "Shared") : "Private";
  const desc = loading ? "Fetching privacy" : isShared ? (isPublic ? "Anyone with the link" : "Only people you choose") : "Only you can see this";
  const date = getDaysToGoText(list?.eventDate) || "Sat, June 24, 2026";
  const iconName = isShared ? (isPublic ? require("@/assets/images/publicIcon.png") : require("@/assets/images/myPeopleIcon.png")) : require("@/assets/images/privateIcon.png");
  const image_url = list.coverPhotoUri || null;
  const totalItems = items?.length || 0;

  const handleQuantityChange = (itemId: string, currentQty: number, increment: boolean) => {
    const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    onUpdateQuantity?.(itemId, newQty);
  };

  const handlePressEditDetails = () => {
     router.push({ pathname: "/create-list-step2", params: { listId: String(list._id) } })
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={image_url ? { uri: image_url } : require("@/assets/images/nursery.png")} resizeMode="cover" style={styles.header}>
        <LinearGradient colors={["#58a7f6ff", "#5db0c2dd"]} style={styles.header} locations={[0, 0.9]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
          <View style={{ paddingHorizontal: 12, paddingTop: 24, paddingBottom: 10 }}>
            <View style={styles.privacyContainer}>
              <Image source={iconName} resizeMode="contain" style={{ width: 24, height: 24 }} />
              <View>
                <Text style={styles.privacyStatus}>{title}</Text>
                <Text style={styles.privacyDesc}>{desc}</Text>
              </View>
              {currentTab === "my-events" && (
                <Pressable style={{ alignSelf: "flex-end" }}>
                  <Ionicons name="settings-sharp" size={18} color="#007AFF" />
                </Pressable>
              )}
            </View>
          </View>

          <View style={{ width: "100%", flexDirection: "row", gap: 21, justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 25, borderTopWidth: 0.4, borderBottomWidth: 0.4, borderColor: "#7E7E7E" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View>
                <Image resizeMode="contain" style={{ width: 56, height: 65 }} source={require("@/assets/images/baloons.png")} />
              </View>
              <View>
                <Text numberOfLines={1} style={styles.listTitle}>
                  {list.title}
                </Text>
                <Text style={styles.eventDate}>{date}</Text>
              </View>
            </View>
            {currentTab === "my-events" && (
              <View>
                <Pressable onPress={handlePressEditDetails} style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15.5, borderColor: "#1C1C1C", borderWidth: 1 }}>
                  <Image source={require("@/assets/images/edit.svg")} />
                  <Text>Edit Details</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.eventDetails}>
            <View style={[styles.detailRow]}>
              <View style={styles.detailContent}>
                <View>
                  <Image resizeMode="contain" style={{ width: 24, height: 24 }} source={require("@/assets/images/occasion.svg")} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Occasion</Text>
                  <Text style={styles.detailValue}>{list.occasion || "Anniversary"}</Text>
                </View>
              </View>
              <View style={styles.detailContent}>
                <View>
                  <Image resizeMode="contain" style={{ width: 24, height: 24 }} source={require("@/assets/images/location.svg")} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{address || "Sharjah, UAE"}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View>
        <View style={styles.itemsHeader}>
          <View style={styles.totalItemsBadge}>
            <Text style={styles.totalItemsText}>Total Items</Text>
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>{totalItems}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Items Section */}
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 10, paddingTop: 24, gap: 24 }}
          data={items}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View key={item._id} style={styles.giftCard}>
                <View style={styles.giftCardContent}>
                  <Image resizeMode="cover" source={{ uri: item.image_url || "https://via.placeholder.com/80" }} style={styles.giftImage} />

                  <View style={styles.giftInfo}>
                    <Text numberOfLines={1} style={styles.giftName}>
                      {item.name}
                    </Text>
                    <Text style={styles.giftPrice}>AED {Number(item.price || 0).toFixed(2)}</Text>

                    <View style={styles.quantityControl}>
                      <Text style={styles.quantityLabel}>Quantity</Text>
                      <View style={styles.quantitySelector}>
                        <Pressable style={styles.quantityButton} onPress={() => handleQuantityChange(item._id, item.quantity, false)}>
                          <Trash2 size={14} color="#421A95" />
                        </Pressable>

                        <Text style={styles.quantityValue}>{item.quantity}</Text>

                        <Pressable style={styles.quantityButton} onPress={() => handleQuantityChange(item._id, item.quantity, true)}>
                          <Plus size={14} color="#421A95" />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>

                {currentTab === "my-events" && (
                  <Pressable style={styles.removeButton} onPress={() => onRemoveItem?.(item._id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </Pressable>
                )}
              </View>
            );
          }}
        />
      </View>
     
    </View>
  );
}
