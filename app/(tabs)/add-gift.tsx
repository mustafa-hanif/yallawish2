import { RibbonHeader } from "@/components/RibbonHeader";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGift() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const list = useQuery(api.products.getListById, {
    listId: listId as any,
  });
  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");
  const seedItem = useMutation(api.products.seedDummyListItem as any);

  useEffect(() => {
    if (listId && Array.isArray(items) && items.length === 0) {
      seedItem({ list_id: listId as any }).catch(() => {});
    }
  }, [items, listId, seedItem]);

  const firstItem = Array.isArray(items) ? items[0] : undefined;
  // @ts-ignore generated after adding convex action
  const scrape = useAction((api as any).scrape.productMetadata);

  // Format YYYY-MM-DD to a friendly date like: Mon, Aug 11, 2025
  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
    const [y, m, d] = parts;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1); // local time to avoid TZ shift
    try {
      return new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Bottom sheet + form state
  const [showSheet, setShowSheet] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current; // 0 hidden,1 visible
  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: showSheet ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [showSheet, sheetAnim]);
  const translateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  const [link, setLink] = useState("");
  const [search, setSearch] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const DESCRIPTION_LIMIT = 400;
  const canSave = (link.trim().length > 0 || name.trim().length > 0) && quantity > 0;

  const handleAddGift = () => setShowSheet(true);
  const closeSheet = () => setShowSheet(false);
  const incQty = useCallback(() => setQuantity(q => Math.min(99, q + 1)), []);
  const decQty = useCallback(() => setQuantity(q => Math.max(1, q - 1)), []);
  const resetForm = () => { setLink(""); setSearch(""); setQuantity(1); setPrice(""); setName(""); setDescription(""); setImageUrl(null); setScrapeError(null); };
  const handleCancel = () => { closeSheet(); resetForm(); };
  const handleSave = () => {
    if (!canSave) return;
    console.log("Saving gift", { link, search, quantity, price, name, description, imageUrl, listId });
    closeSheet();
    resetForm();
  };

  // Scrape on link change (debounced)
  useEffect(() => {
    if (!link || !/^https?:\/\//i.test(link)) return; // not a full URL yet
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        setScraping(true);
        setScrapeError(null);
        const meta = await scrape({ url: link });
        if (cancelled) return;
        if (meta.ok) {
          if (!name && meta.title) setName(meta.title);
          if (!price && meta.price) setPrice(meta.price);
            if (meta.image) setImageUrl(meta.image);
        } else {
          setScrapeError(meta.error || "Could not extract data");
        }
      } catch (e: any) {
        if (!cancelled) setScrapeError(e.message);
      } finally {
        if (!cancelled) setScraping(false);
      }
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link]);

  const handleShare = () => {
    console.log("Share list", listId);
  };

  const handleManageList = () => {
    if (!listId) return;
    router.push({ pathname: "/manage-list", params: { listId: String(listId) } });
  };

  const loading = !list; // simple loading flag

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";

  const truncate = (text: string, len: number) => (text.length > len ? text.slice(0, len - 1) + "…" : text);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      <LinearGradient
        colors={["#330065", "#6600CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <Image
              source={require("@/assets/images/c880529f92a902eb188e079575f79246e2c24c5c.png")}
              style={styles.coverImage}
            />
          )}
          <View style={styles.coverOverlay}>
            <Text style={styles.daysToGo}>{formatEventDate((list?.eventDate ?? undefined) as string | undefined)}</Text>
          </View>
        </View>

        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} />
        </View>

        <View style={styles.actionsContainer}>
          <View style={styles.privacyContainer}>
            <Ionicons name={privacy === "shared" ? "globe-outline" : "lock-closed-outline"} size={24} color="#1C0335" />
            <View>
              <Text style={styles.privacyStatus}>
                {loading ? "Loading..." : privacy === "shared" ? "Shared" : "Private"}
              </Text>
              <Text style={styles.privacyDesc}>
                {loading ? "Fetching privacy" : privacy === "shared" ? "Only people with link" : "Only you can see this"}
              </Text>
            </View>
            <Ionicons name="settings-outline" size={16} color="#1C0335" />
          </View>
          <View style={styles.actionButtons}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="location-outline" size={24} color="#1C0335" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="filter-outline" size={24} color="#1C0335" />
            </Pressable>
          </View>
        </View>

        <View style={styles.addGiftSection}>
          {firstItem ? (
            <>
              <View style={styles.itemCard}>
                <View style={styles.itemImageWrap}>
                  {firstItem.image_url ? (
                    <Image source={{ uri: firstItem.image_url }} style={styles.itemImage} />
                  ) : (
                    <View style={[styles.itemImage, { backgroundColor: '#EEE' }]} />
                  )}
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{truncate(firstItem.name, 38)}</Text>
                  <Text style={styles.itemQuantity}>Quantity: <Text style={styles.itemQuantityValue}>{firstItem.quantity}</Text></Text>
                  <View style={styles.claimBadgeWrap}>
                    <View style={styles.claimBadge}> 
                      <Text style={styles.claimBadgeText}>{firstItem.claimed} Claimed</Text>
                    </View>
                    <Pressable style={styles.itemChevron}>
                      <Ionicons name="chevron-forward" size={20} color="#1C0335" />
                    </Pressable>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>AED {firstItem.price}</Text>
                    {firstItem.buy_url && (
                      <Pressable>
                        <Text style={styles.buyNow}>Buy Now</Text>
                      </Pressable>
                    )}
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${(firstItem.claimed/firstItem.quantity)*100}%` }]} />
                  </View>
                </View>
              </View>
              <Pressable style={styles.addMoreButton} onPress={handleAddGift}>
                <Ionicons name="add" size={20} color="#3B0076" />
                <Text style={styles.addMoreButtonText}>Add more gifts</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.addGiftTitle}>Add your first gift item</Text>
              <Pressable style={styles.addGiftButton} onPress={handleAddGift}>
                <Ionicons name="add" size={24} color="#3B0076" />
                <Text style={styles.addGiftButtonText}>Add a gift</Text>
              </Pressable>
            </>
          )}
          {listId && !firstItem && (
            <Text style={{ textAlign: "center", color: "#8E8E93" }}>
              Working on list: {String(listId)}
            </Text>
          )}
        </View>

  <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#3B0076"
          />
          <Text style={styles.infoText}>
            To learn more on how to add gifts from web browser,{" "}
            <Text style={styles.linkText}>click here</Text>
          </Text>
          <Ionicons name="close" size={24} color="#3B0076" />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.lastUpdated}>
          Last updated: July 15, 2025 | 08:00PM
        </Text>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleShare}
        >
          <Text style={styles.buttonSecondaryText}>Share</Text>
          <Ionicons name="share-outline" size={20} color="#3B0076" />
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleManageList}
        >
          <Text style={styles.buttonPrimaryText}>Manage List</Text>
        </Pressable>
      </View>
      {/** Bottom Sheet **/}
      <Modal visible={showSheet} transparent animationType="none" onRequestClose={closeSheet}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}> 
          <View style={styles.sheetHandle} />
          <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetTitle}>Add a gift item</Text>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Add a web link</Text>
              <View style={styles.inputRow}>
                <TextInput value={link} onChangeText={setLink} style={styles.input} autoCapitalize="none" autoCorrect={false} keyboardType="url" placeholder="https://" />
                {scraping ? <Text style={styles.scrapeStatus}>…</Text> : <Ionicons name="open-outline" size={20} color="#7A6F88" />}
              </View>
              {scrapeError && <Text style={styles.errorText}>{scrapeError}</Text>}
            </View>
            <View style={styles.orDivider}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Search via Google</Text>
              <View style={styles.inputRow}>
                <TextInput value={search} onChangeText={setSearch} style={styles.input} autoCapitalize="none" autoCorrect={false} />
                <Ionicons name="search-outline" size={20} color="#1C0335" />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Desired quantity</Text>
              <View style={styles.qtyRow}>
                <Pressable onPress={decQty} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>–</Text></Pressable>
                <Text style={styles.qtyValue}>{String(quantity).padStart(2,'0')}</Text>
                <Pressable onPress={incQty} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Price of gift</Text>
              <View style={styles.inputRow}>
                <TextInput value={price} onChangeText={setPrice} style={styles.input} keyboardType="decimal-pad" />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name of gift</Text>
              <View style={styles.inputRow}>
                <TextInput value={name} onChangeText={setName} style={styles.input} />
                <Ionicons name="pencil-outline" size={20} color="#1C0335" />
              </View>
              {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.previewImage} />
              )}
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Description (optional)</Text>
              <View style={[styles.inputRow, styles.textareaWrapper]}>
                <TextInput
                  placeholder="Prefer white, size M."
                  value={description}
                  onChangeText={t => t.length <= DESCRIPTION_LIMIT && setDescription(t)}
                  style={[styles.input, styles.textarea]}
                  multiline
                />
                <Text style={styles.charCount}>{DESCRIPTION_LIMIT - description.length}</Text>
              </View>
            </View>
            <Pressable style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]} onPress={handleSave} disabled={!canSave}>
              <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>Save</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}
