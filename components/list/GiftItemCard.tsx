import { styles } from "@/styles/addGiftStyles";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export type GiftItem = {
  _id: string;
  name: string;
  image_url?: string | null;
  quantity: number;
  claimed: number;
  price?: string | number | null;
  currency?: string | null;
  buy_url?: string | null;
  description?: string | null;
  title?: string | null;
};

type Props = {
  item: GiftItem;
  onPress?: (item: GiftItem) => void;
  onDelete?: (itemId: string) => void;
  title?: string | null;
  swipe?: boolean;
  isOwner?: boolean;
};

const SWIPE_WIDTH = 130;

export const GiftItemCard: React.FC<Props> = ({ title, item, onPress, onDelete, swipe = true, isOwner }) => {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const swipeableRef = React.useRef<any>(null);
  const pct = Math.min(100, Math.max(0, (item.claimed / Math.max(1, item.quantity)) * 100));
  const truncate = (text: string, len: number) => (text.length > len ? text.slice(0, len - 1) + "…" : text);
  const goDetail = () => {
    if (onPress) return onPress(item);
    router.push({
      pathname: "/gift-detail",
      params: {
        itemId: String(item._id),
        ...(listId ? { listId: String(listId) } : {}),
        ...(title ? { eventTitle: String(title) } : {}),
      },
    });
  };

  const viewStore = async () => {
    try {
      // Prefer native Linking for cross-platform
      const { Linking } = require("react-native");
      await Linking.openURL(item.buy_url);
    } catch (e) {
      console.warn("Failed to open store URL", e);
    }
  };

  const isSoldOut = Number(item.claimed ?? 0) >= Number(item.quantity ?? 1);

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const translateX = dragX.interpolate({
      inputRange: [-SWIPE_WIDTH, 0],
      outputRange: [0, SWIPE_WIDTH],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          width: SWIPE_WIDTH,
          justifyContent: "center",
          alignItems: "center",
          opacity,
          transform: [{ translateX }],
        }}
      >
        <Pressable
          style={[styles.rightAction]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.(String(item._id));
          }}
        >
          <View>
            <Image source={require("../../assets/images/deleteList.png")} style={styles.rightActionIcon} />
          </View>
          <Text style={styles.rightActionText}>Delete</Text>
        </Pressable>
      </Animated.View>
    );
  };
  return (
    <Swipeable ref={swipeableRef} overshootRight={false} renderRightActions={renderRightActions} enabled={swipe} friction={1} overshootFriction={8} rightThreshold={40} useNativeAnimations={true}>
      <View style={styles.itemCard}>
        <View style={styles.itemImageWrap}>{item.image_url ? <Image source={{ uri: item.image_url }} style={styles.itemImage} /> : <View style={[styles.itemImage, { backgroundColor: "#EEE" }]} />}</View>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{truncate(item.name, 38)}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Text style={styles.itemQuantity}>
              Quantity: <Text style={styles.itemQuantityValue}>{item.quantity}</Text>
            </Text>
            <View style={styles.claimBadgeWrap}>
              {isSoldOut ? (
                <View style={styles.claimBadgeGrey}>
                  <Text style={styles.claimBadgeGreyText}>Claimed</Text>
                </View>
              ) : (
                <View style={styles.claimBadge}>
                  <Text style={styles.claimBadgeText}>{item.claimed} Claimed</Text>
                </View>
              )}
            </View>
          </View>
          <View style={[styles.priceRow, { justifyContent: "space-between" }]}>
            {item.price != null ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* <Image resizeMode="contain" style={{ width: 16, height: 16 }} source={require("@/assets/images/dirham.png")} /> */}
                <Text style={styles.itemPrice}>
                  {item.currency || "AED"} {item.price}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <Pressable onPress={isOwner ? viewStore : isSoldOut ? undefined : goDetail} disabled={isSoldOut}>
              <Text style={[styles.buyNow, isSoldOut && styles.buyNowDisabled]}>{isOwner ? "View on store" : "Buy Now"}</Text>
            </Pressable>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
        </View>
      </View>
    </Swipeable>
  );
};
