import { styles } from "@/styles/addGiftStyles";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export type GiftItem = {
  _id: string;
  name: string;
  image_url?: string | null;
  quantity: number;
  claimed: number;
  price?: string | number | null;
  buy_url?: string | null;
};

type Props = {
  item: GiftItem;
  onPress?: (item: GiftItem) => void;
};

export const GiftItemCard: React.FC<Props> = ({ item, onPress }) => {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const pct = Math.min(100, Math.max(0, (item.claimed / Math.max(1, item.quantity)) * 100));
  const truncate = (text: string, len: number) => (text.length > len ? text.slice(0, len - 1) + "…" : text);
  const goDetail = () => {
    if (onPress) return onPress(item);
    router.push({ pathname: "/gift-detail", params: { itemId: String(item._id), ...(listId ? { listId: String(listId) } : {}) } });
  };
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemImageWrap}>{item.image_url ? <Image source={{ uri: item.image_url }} style={styles.itemImage} /> : <View style={[styles.itemImage, { backgroundColor: "#EEE" }]} />}</View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{truncate(item.name, 38)}</Text>
        <View style={{ flexDirection: "row", justifyContent: "flex-start", gap: 8, alignItems: "center" }}>
          <Text style={styles.itemQuantity}>
            Quantity: <Text style={styles.itemQuantityValue}>{item.quantity}</Text>
          </Text>
          <View style={styles.claimBadgeWrap}>
            <View style={styles.claimBadge}>
              <Text style={styles.claimBadgeText}>{item.claimed} Claimed</Text>
            </View>
          </View>
        </View>
        <View style={styles.priceRow}>
          {item.price != null && <Text style={styles.itemPrice}>AED {item.price}</Text>}
          {item.buy_url ? (
            <Pressable onPress={goDetail}>
              <Text style={styles.buyNow}>Buy Now</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>
      </View>
    </View>
  );
};
