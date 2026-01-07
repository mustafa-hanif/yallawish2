import AddGiftModal from "@/components/list/AddGiftModal";
import { getDaysToGoText } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Plus, PlusCircle, Trash2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Image, ImageBackground, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

interface GiftItem {
  _id: string;
  name: string;
  image_url?: string;
  price: number;
  quantity: number;
  claimed?: number;
  buy_url?: string;
  color?: string;
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
  type SortOption = "default" | "priceAsc" | "priceDesc" | "newest" | "oldest";

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
  const [showAddGift, setShowAddGift] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);

  // Sort & Filter state
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filterClaimed, setFilterClaimed] = useState(false);
  const [filterUnclaimed, setFilterUnclaimed] = useState(false);

  // Temp state used inside modal before applying
  const [tempSortBy, setTempSortBy] = useState<SortOption>(sortBy);
  const [tempFilterClaimed, setTempFilterClaimed] = useState(filterClaimed);
  const [tempFilterUnclaimed, setTempFilterUnclaimed] = useState(filterUnclaimed);

  // Derived items based on filters and sort
  const visibleItems = useMemo(() => {
    let result = [...(items || [])];

    // Availability filters
    const claimedOn = filterClaimed;
    const unclaimedOn = filterUnclaimed;

    if (claimedOn && !unclaimedOn) {
      result = result.filter((it) => (it.claimed ?? 0) > 0);
    } else if (!claimedOn && unclaimedOn) {
      result = result.filter((it) => (it.claimed ?? 0) === 0);
    } // both on or both off -> no filter

    // Sorting
    switch (sortBy) {
      case "priceAsc":
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "newest":
      case "oldest":
        // If timestamp fields exist in future (e.g., createdAt), implement here.
        // For now, keep default ordering.
        break;
      case "default":
      default:
        break;
    }
    return result;
  }, [items, sortBy, filterClaimed, filterUnclaimed]);

  const handleQuantityChange = (itemId: string, currentQty: number, increment: boolean) => {
    const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    onUpdateQuantity?.(itemId, newQty);
  };

  const openItemModal = (item: GiftItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const closeItemModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
  };

  const viewAtStore = async () => {
    if (!selectedItem?.buy_url) return;
    try {
      // Prefer native Linking for cross-platform
      const { Linking } = require("react-native");
      await Linking.openURL(selectedItem.buy_url);
    } catch (e) {
      console.warn("Failed to open store URL", e);
    }
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
            <View style={{ overflow: "hidden", flexDirection: "row", alignItems: "center", gap: 16 }}>
              <View>
                <Image resizeMode="contain" style={{ width: 56, height: 65 }} source={require("@/assets/images/baloons.png")} />
              </View>
              <View style={{  maxWidth: 550, }}>
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
            <View style={{flexDirection:'row', alignItems:'center', gap:12}}>
              {currentTab === "my-events" && (
              <Pressable
                style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}
                onPress={() => setShowAddGift(true)}
              >
                <PlusCircle size={20} color="#36006C" />
                <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 16, color: "#421A95" }}>
                  Add more items
                </Text>
              </Pressable>
              )}
              <Pressable style={styles.sortAndFilterButton}  
                onPress={() => {
                setTempSortBy(sortBy);
                setTempFilterClaimed(filterClaimed);
                setTempFilterUnclaimed(filterUnclaimed);
                setShowSortSheet(true);
              }}>
                <Image style={styles.filterIcon} source={require("@/assets/images/filterIcon.png")} />
                <Text style={styles.sortAndFilterText}>Sort & Filter</Text>
              </Pressable>
            </View>

        </View>
      </View>
      {/* Items Section */}
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 10, paddingTop: 24, gap: 24 }}
          data={visibleItems}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View key={item._id} style={styles.giftCard}>
                <Pressable style={styles.giftCardContent} onPress={() => openItemModal(item)}>
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
                </Pressable>

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
      {/* Sort & Filter Modal */}
      <Modal
        visible={showSortSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortSheet(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setShowSortSheet(false)} />
        <View style={styles.sortSheetContainer}>
          <Pressable onPress={() => setShowSortSheet(false)}>
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
              {[
                { key: "default", label: "Default" },
                { key: "priceAsc", label: "Price Lowest - Highest" },
                { key: "priceDesc", label: "Price Highest - Lowest" },
                { key: "newest", label: "Most Recent to Oldest" },
                { key: "oldest", label: "Oldest to Most Recent" },
              ].map((o) => (
                <Pressable key={o.key} style={styles.radioRow} onPress={() => setTempSortBy(o.key as SortOption)}>
                  <View style={[styles.radioOuter, tempSortBy === o.key && styles.radioOuterActive]}>
                    {tempSortBy === o.key && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.radioLabel}>{o.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.sortSection}>
              <View style={styles.sortSectionHeader}>
                <Text style={styles.sortSectionTitle}>Filter by Availability</Text>
                <Ionicons name="chevron-down" size={20} color="#1C0335" />
              </View>

              <Pressable style={styles.radioRow} onPress={() => setTempFilterClaimed((v) => !v)}>
                <View style={[styles.checkboxBox, tempFilterClaimed && styles.checkboxBoxActive]}>
                  {tempFilterClaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                </View>
                <Text style={styles.radioLabel}>Claimed</Text>
              </Pressable>

              <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed((v) => !v)}>
                <View style={[styles.checkboxBox, tempFilterUnclaimed && styles.checkboxBoxActive]}>
                  {tempFilterUnclaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                </View>
                <Text style={styles.radioLabel}>Unclaimed</Text>
              </Pressable>
            </View>

            <View style={styles.sortScrollSpacer} />
          </ScrollView>

          <View style={styles.applyBarWrapper}>
            <Pressable
              style={styles.applyBtnFull}
              onPress={() => {
                setSortBy(tempSortBy);
                setFilterClaimed(tempFilterClaimed);
                setFilterUnclaimed(tempFilterUnclaimed);
                setShowSortSheet(false);
              }}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Add Gift Modal */}
      <AddGiftModal
        visible={showAddGift}
        onClose={() => setShowAddGift(false)}
        listId={String(list._id)}
        onSaved={() => setShowAddGift(false)}
      />

      {/* Item Quick View Modal */}
      <Modal
        visible={showItemModal}
        transparent
        animationType="fade"
        onRequestClose={closeItemModal}
      >
        {/* Backdrop that receives outside clicks */}
        <Pressable
          onPress={closeItemModal}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#00000055" }}
        />
        {/* Content container ignores outside clicks so backdrop handles them */}
        <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, justifyContent: "center", alignItems: "center", padding: 16 }}>
          <View style={{ width: '90%', maxWidth: "95%", borderRadius: 16, backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 4 }}>
            <View style={{ padding: 24, flexDirection: "row", gap: 20 }}>
              <View style={{ borderWidth: 0.01, borderColor:'#cebfbfff', width: 269, height: 262, borderRadius: 12, overflow: "hidden", backgroundColor: "#F6F6F6" }}>
                {selectedItem?.image_url ? (
                  <Image source={{ uri: selectedItem.image_url }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1 }} />
                )}
              </View>
              <View style={{ flex: 1 , justifyContent:'center'}}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  {(() => {
                    let host: string | null = null;
                    try {
                      host = selectedItem?.buy_url ? new URL(selectedItem.buy_url).hostname.replace("www.", "") : null;
                    } catch {}
                    return host ? <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 11, color: "#7A7A7A", textTransform: "lowercase" }}>{host}</Text> : null;
                  })()}
                </View>
                <Text numberOfLines={1} style={{ fontFamily: "Nunito_700Bold", fontSize: 24, color: "#1A0034", marginTop: 4 }}>{selectedItem?.name}</Text>
                <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 32, color: "#00A0FF", marginTop: 6 }}>AED {Number(selectedItem?.price || 0).toFixed(2)}</Text>
                <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
                  {selectedItem?.color ? (
                    <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 18, color: "#1C0335" }}>Color: {selectedItem.color}</Text>
                  ) : null}
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 18, color: "#1C0335" }}>Desired: {selectedItem?.quantity ?? 0}</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 18, color: "#1C0335" }}>Purchased: {selectedItem?.claimed ?? 0}</Text>
                </View>

                <View style={{ marginTop: 18 }}>
                  <Pressable
                    disabled={!selectedItem?.buy_url}
                    onPress={viewAtStore}
                    style={{ opacity: selectedItem?.buy_url ? 1 : 0.6, alignSelf: "flex-start", paddingVertical: 10, paddingHorizontal: 28, borderRadius: 100, backgroundColor: "#36006C" }}
                  >
                    <Text style={{ fontFamily: "Nunito_700Bold", fontSize: 16, color: "#FFFFFF" }}>View at store</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
     
    </View>
  );
}
