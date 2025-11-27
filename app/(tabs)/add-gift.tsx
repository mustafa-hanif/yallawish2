import { RibbonHeader } from "@/components/RibbonHeader";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, InfoBox, ListCover } from "@/components/list";
import type { GiftItem as GiftItemType } from "@/components/list/GiftItemCard";
import { api } from "@/convex/_generated/api";
import { desktopStyles, styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from "expo-router";
import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'newest' | 'oldest';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'priceAsc', label: 'Price: Low to High' },
  { key: 'priceDesc', label: 'Price: High to Low' },
  { key: 'newest', label: 'Newest' },
  { key: 'oldest', label: 'Oldest' },
];

const DESKTOP_BREAKPOINT = 1024;
const FALLBACK_COVER = require("@/assets/images/nursery.png");

const getPrivacyDisplay = (privacy: string, loading: boolean, shareCount?: number) => {
  if (loading) {
    return {
      label: "Loading...",
      description: "Fetching privacy",
      icon: "lock-closed-outline" as const,
    };
  }
  const isShared = privacy === "shared";
  const isPublic = isShared && (shareCount ?? 0) === 0;
  if (isShared) {
    return {
      label: isPublic ? "Public" : "Shared",
      description: isPublic ? "Anyone with the link" : "Only people you choose",
      icon: isPublic ? ("globe-outline" as const) : ("people-outline" as const),
    };
  }
  return {
    label: "Private",
    description: "Only you can see this",
    icon: "lock-closed-outline" as const,
  };
};

export default function AddGift() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const list = useQuery(api.products.getListById, {
    listId: listId as any,
  });
  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");
  const seedItem = useMutation(api.products.seedDummyListItem as any);

  useEffect(() => {
    if (listId && Array.isArray(items) && items.length === 0) {
      seedItem({ list_id: listId as any }).catch(() => { });
    }
  }, [items, listId, seedItem]);

  // All list items
  const giftItems: GiftItemType[] = useMemo(() => (Array.isArray(items) ? [...items] : []), [items]);

  // Sort & Filter state
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterClaimed, setFilterClaimed] = useState(false);
  const [filterUnclaimed, setFilterUnclaimed] = useState(false);

  // Derived displayed items
  let displayedItems: GiftItemType[] = giftItems;
  if (filterClaimed && !filterUnclaimed) {
    displayedItems = displayedItems.filter((i) => (i.claimed ?? 0) >= (i.quantity ?? 1));
  } else if (filterUnclaimed && !filterClaimed) {
    displayedItems = displayedItems.filter((i) => (i.claimed ?? 0) < (i.quantity ?? 1));
  }
  try {
    displayedItems = [...displayedItems].sort((a, b) => {
      const aPrice = parseFloat(String(a.price ?? 0)) || 0;
      const bPrice = parseFloat(String(b.price ?? 0)) || 0;
      const ad = (a as any)?.created_at || "";
      const bd = (b as any)?.created_at || "";
      switch (sortBy) {
        case 'priceAsc': return aPrice - bPrice;
        case 'priceDesc': return bPrice - aPrice;
        case 'newest': return bd.localeCompare(ad);
        case 'oldest': return ad.localeCompare(bd);
        default: return 0;
      }
    });
  } catch { }
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
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const availability = useMemo<"all" | "claimed" | "unclaimed">(() => {
    if (filterClaimed && !filterUnclaimed) return "claimed";
    if (filterUnclaimed && !filterClaimed) return "unclaimed";
    return "all";
  }, [filterClaimed, filterUnclaimed]);

  const handleAvailabilityChange = useCallback((value: "all" | "claimed" | "unclaimed") => {
    switch (value) {
      case "claimed":
        setFilterClaimed(true);
        setFilterUnclaimed(false);
        break;
      case "unclaimed":
        setFilterClaimed(false);
        setFilterUnclaimed(true);
        break;
      default:
        setFilterClaimed(false);
        setFilterUnclaimed(false);
        break;
    }
  }, [setFilterClaimed, setFilterUnclaimed]);

  const totals = useMemo(() => {
    return giftItems.reduce(
      (acc, item) => {
        const quantity = Number(item.quantity ?? 1);
        const claimed = Number(item.claimed ?? 0);
        acc.totalItems += 1;
        acc.totalQuantity += quantity;
        acc.claimedUnits += Math.min(quantity, claimed);
        if (claimed >= quantity) {
          acc.fullyClaimed += 1;
        } else if (claimed > 0) {
          acc.claimedCount += 1;
        } else {
          acc.unclaimedCount += 1;
        }
        return acc;
      },
      { totalItems: 0, totalQuantity: 0, fullyClaimed: 0, claimedCount: 0, unclaimedCount: 0, claimedUnits: 0 }
    );
  }, [giftItems]);

  const eventDateStr = (list?.eventDate as string | undefined) ?? undefined;
  const formattedEventDate = formatEventDate(eventDateStr);
  const daysToGoText = useMemo(() => {
    if (!eventDateStr) return null;
    const parts = eventDateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
    const [yyyy, mm, dd] = parts;
    const eventDate = new Date(yyyy, (mm ?? 1) - 1, dd ?? 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = eventDate.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (Number.isNaN(diffDays)) return null;
    if (diffDays > 1) return `${String(diffDays).padStart(2, "0")} days to go`;
    if (diffDays === 1) return "1 day to go";
    if (diffDays === 0) return "Event is today";
    return "Event passed";
  }, [eventDateStr]);

  const lastUpdatedLabel = "Last updated: July 15, 2025 | 08:00PM";
  const listIdString = listId ? String(listId) : undefined;

  const handleOpenGift = useCallback((item: GiftItemType) => {
    router.push({
      pathname: "/gift-detail",
      params: {
        itemId: String(item._id),
        ...(listIdString ? { listId: listIdString } : {}),
      },
    });
  }, [listIdString]);

  const handleBack = () => { router.back(); };

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
  const [saving, setSaving] = useState(false);
  // In-sheet browser state
  const [showBrowser, setShowBrowser] = useState(false);
  const [browserUrl, setBrowserUrl] = useState<string | null>(null); // initial search url
  const [currentBrowserUrl, setCurrentBrowserUrl] = useState<string | null>(null); // updated as user navigates
  // Sort & Filter sheet visibility
  const [showSortSheet, setShowSortSheet] = useState(false);
  // Temp draft selections while sheet open
  const [tempSortBy, setTempSortBy] = useState<SortOption>('default');
  const [tempFilterClaimed, setTempFilterClaimed] = useState(false);
  const [tempFilterUnclaimed, setTempFilterUnclaimed] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);

  const openSortSheet = useCallback(() => {
    setTempSortBy(sortBy);
    setTempFilterClaimed(filterClaimed);
    setTempFilterUnclaimed(filterUnclaimed);
    setShowSortSheet(true);
  }, [filterClaimed, filterUnclaimed, sortBy]);

  useEffect(() => {
    if (!showSortSheet) {
      setTempSortBy(sortBy);
      setTempFilterClaimed(filterClaimed);
      setTempFilterUnclaimed(filterUnclaimed);
    }
  }, [showSortSheet, sortBy, filterClaimed, filterUnclaimed]);

  useEffect(() => {
    if (link.trim().length === 0) {
      setIsUrlValid(true);
      return;
    }
    // Only validate if it looks like a URL (starts with http:// or https://)
    // Keywords without http/https prefix are considered valid
    const trimmedLink = link.trim();
    if (trimmedLink.startsWith("http://") || trimmedLink.startsWith("https://")) {
      setIsUrlValid(validateUrl(link));
    } else {
      // It's a keyword, not a URL, so it's valid
      setIsUrlValid(true);
    }
  }, [link]);

  const DESCRIPTION_LIMIT = 400;
  const canSave = !!listId && (link.trim().length > 0 || name.trim().length > 0) && quantity > 0 && !saving && (link.trim().length === 0 || isUrlValid); ;

  const validateUrl = (value: string) => {
    const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
    return urlPattern.test(value.trim());
  };

  const handleAddGift = () => setShowSheet(true);
  const closeSheet = () => setShowSheet(false);
  const incQty = useCallback(() => setQuantity(q => Math.min(99, q + 1)), []);
  const decQty = useCallback(() => setQuantity(q => Math.max(1, q - 1)), []);
  const resetForm = () => { setLink(""); setSearch(""); setQuantity(1); setPrice(""); setName(""); setDescription(""); setImageUrl(null); setScrapeError(null); };
  const handleCancel = () => { closeSheet(); resetForm(); };
  const createItem = useMutation(api.products.createListItem as any);
  const handleSave = async () => {
    if (!canSave || !listId) return;
    try {
      setSaving(true);
      await createItem({
        list_id: listId as any,
        name: name || link, // fallback
        description: description || null,
        image_url: imageUrl || null,
        quantity,
        price: price || null,
        currency: 'AED',
        buy_url: link || null,
      });
    } catch (e) {
      console.warn('Failed to save gift', e);
    } finally {
      setSaving(false);
      closeSheet();
      resetForm();
    }
  };

  const openSearchBrowser = () => {
    // On web, use the link input value; on mobile, use the search field
    const searchQuery = Platform.OS === "web" ? link.trim() : search.trim();
    if (!searchQuery) return;
    
    const q = encodeURIComponent(searchQuery);
    const url = `https://www.google.com/search?q=${q}&tbm=shop`;
    
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // On web, open in a new tab
      window.open(url, "_blank");
    } else {
      // On mobile, use WebView modal
      setBrowserUrl(url);
      setCurrentBrowserUrl(url);
      // Hide sheet while browsing
      setShowSheet(false);
      setShowBrowser(true);
    }
  };

  const handleBrowserAdd = async () => {
    if (!currentBrowserUrl) return;
    // Set link field then trigger scrape (will auto-scrape due to effect)
    setLink(currentBrowserUrl);
    setShowBrowser(false);
    // Reopen sheet so user can confirm/edit
    setTimeout(() => setShowSheet(true), 60);
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

  const handleShare = async () => {
    try {
      if (!listId) return;
      let url = '';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const origin = window.location?.origin || '';
        const qs = `listId=${encodeURIComponent(String(listId))}`;
        url = `${origin}/view-list?${qs}`;
        // copy to clipboard
        await navigator.clipboard.writeText(url).catch(() => { });
      } else {
        url = Linking.createURL('view-list', {
          queryParams: { listId: String(listId) },
        });
      }

      await Share.share({ message: url, url });
    } catch (e) {
      console.warn('Share failed', e);
    }
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
  const shares = useQuery(api.products.getListShares as any, listId ? ({ list_id: listId } as any) : "skip");
  const shareCount = Array.isArray(shares) ? shares.length : undefined;
  const address = (list?.shippingAddress as string | undefined) ?? null;
  const ribbonSubtitle = subtitle || formattedEventDate || "";
  const occasion = list?.occasion || ""

  const layout = isDesktop ? (
    <DesktopLayout
      title={title}
      subtitle={subtitle}
      ribbonSubtitle={ribbonSubtitle}
      coverUri={coverUri}
      formattedEventDate={formattedEventDate}
      daysToGo={daysToGoText}
      totals={totals}
      totalItemsCount={giftItems.length}
      availability={availability}
      onAvailabilityChange={handleAvailabilityChange}
      sortBy={sortBy}
      onSelectSort={setSortBy}
      displayedItems={displayedItems}
      onAddGift={handleAddGift}
      onShare={handleShare}
      onManage={handleManageList}
      onOpenGift={handleOpenGift}
      privacy={privacy}
      shareCount={shareCount}
      loading={loading}
      address={address}
      lastUpdated={lastUpdatedLabel}
      occasion={occasion}
    />
  ) : (
    <MobileLayout
      title={title}
      subtitle={ribbonSubtitle}
      coverUri={coverUri}
      overlayText={formattedEventDate}
      displayedItems={displayedItems}
      onAddGift={handleAddGift}
      onOpenSortSheet={openSortSheet}
      listId={listIdString}
      onShare={handleShare}
      onManage={handleManageList}
      handleBack={handleBack}
      privacy={privacy}
      loading={loading}
      shareCount={shareCount}
      address={address}
      lastUpdated={lastUpdatedLabel}
      occasion={occasion}
      tempSortBy={tempSortBy}
      tempFilterClaimed={tempFilterClaimed}
      tempFilterUnclaimed={tempFilterUnclaimed}
    />
  );

  return (
    <View style={isDesktop ? desktopStyles.container : styles.container}>
      {layout}
      {/** Bottom Sheet / Modal **/}
      <Modal visible={showSheet} transparent animationType={isDesktop ? "fade" : "none"} onRequestClose={closeSheet}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />
        {isDesktop ? (
          <View style={desktopStyles.modalContainer}>
            <View style={desktopStyles.modalContent}>
              {/* Header */}
              <View style={desktopStyles.modalHeader}>
                <Text style={desktopStyles.modalTitle}>Add a Gift</Text>
                <Pressable onPress={closeSheet} style={desktopStyles.modalCloseButton}>
                  <Ionicons name="close" size={24} color="#8E8EA9" />
                </Pressable>
              </View>

              <ScrollView contentContainerStyle={desktopStyles.modalScrollContent} showsVerticalScrollIndicator={false}>
                {/* Web Link Section */}
                <View style={desktopStyles.modalFieldGroup}>
                  <Text style={desktopStyles.modalFieldLabel}>Web Link</Text>
                  <View style={desktopStyles.modalInputRow}>
                    <TextInput
                      value={link}
                      onChangeText={setLink}
                      style={desktopStyles.modalInput}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      placeholder="Type, paste or search"
                      placeholderTextColor="#8E8EA9"
                    />
                    <Pressable onPress={openSearchBrowser} style={desktopStyles.modalSearchButton}>
                      <Text style={desktopStyles.modalSearchButtonText}>Search via</Text>
                      <View style={desktopStyles.googleLogo}>
                        <Text style={desktopStyles.googleG}>G</Text>
                      </View>
                    </Pressable>
                  </View>
                  {!isUrlValid && link.trim().length > 0 && (
                    <Text style={desktopStyles.modalErrorText}>Invalid URL</Text>
                  )}
                  {scrapeError && <Text style={desktopStyles.modalErrorText}>{scrapeError}</Text>}
                  {scraping && <Text style={desktopStyles.modalScrapingText}>Loading...</Text>}
                </View>

                {/* Product Image and Details Row */}
                <View style={desktopStyles.modalProductRow}>
                  {/* Image Section */}
                  <View style={desktopStyles.modalImageContainer}>
                    {imageUrl ? (
                      <View style={desktopStyles.modalImageWrapper}>
                        <Image source={{ uri: imageUrl }} style={desktopStyles.modalProductImage} resizeMode="contain" />
                        <Pressable style={desktopStyles.modalImageEditButton}>
                          <Ionicons name="image-outline" size={20} color="#3B0076" />
                        </Pressable>
                      </View>
                    ) : (
                      <View style={desktopStyles.modalImagePlaceholder}>
                        <Ionicons name="image-outline" size={48} color="#D1D1D6" />
                      </View>
                    )}
                  </View>

                  {/* Price and Quantity Section */}
                  <View style={desktopStyles.modalPriceQtyColumn}>
                    <View style={desktopStyles.modalFieldGroup}>
                      <Text style={desktopStyles.modalFieldLabel}>Price of gift</Text>
                      <TextInput
                        value={price}
                        onChangeText={setPrice}
                        style={desktopStyles.modalPriceInput}
                        keyboardType="decimal-pad"
                        placeholder="AED 0.00"
                        placeholderTextColor="#8E8EA9"
                      />
                    </View>
                    <View style={desktopStyles.modalFieldGroup}>
                      <Text style={desktopStyles.modalFieldLabel}>Quantity</Text>
                      <View style={desktopStyles.modalQtyRow}>
                        <Pressable onPress={decQty} style={desktopStyles.modalQtyButton}>
                          <Text style={desktopStyles.modalQtyButtonText}>–</Text>
                        </Pressable>
                        <Text style={desktopStyles.modalQtyValue}>{String(quantity).padStart(2, '0')}</Text>
                        <Pressable onPress={incQty} style={desktopStyles.modalQtyButton}>
                          <Text style={desktopStyles.modalQtyButtonText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Name of Gift */}
                <View style={desktopStyles.modalFieldGroup}>
                  <Text style={desktopStyles.modalFieldLabel}>Name of Gift</Text>
                  <View style={desktopStyles.modalInputRow}>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      style={desktopStyles.modalInput}
                      placeholder="Enter gift name"
                      placeholderTextColor="#8E8EA9"
                    />
                    <Ionicons name="pencil-outline" size={20} color="#AEAEB2" />
                  </View>
                </View>

                {/* Description */}
                <View style={desktopStyles.modalFieldGroup}>
                  <Text style={desktopStyles.modalFieldLabel}>Description</Text>
                  <View style={desktopStyles.modalTextareaWrapper}>
                    <TextInput
                      placeholder="Prefer color white, size medium etc"
                      value={description}
                      onChangeText={t => t.length <= DESCRIPTION_LIMIT && setDescription(t)}
                      style={desktopStyles.modalTextarea}
                      multiline
                      placeholderTextColor="#8E8EA9"
                    />
                    <Text style={desktopStyles.modalCharCount}>{description.length}/100</Text>
                  </View>
                </View>
              </ScrollView>

              {/* Footer Buttons */}
              <View style={desktopStyles.modalFooter}>
                <Pressable style={desktopStyles.modalCancelButton} onPress={handleCancel}>
                  <Text style={desktopStyles.modalCancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[desktopStyles.modalSaveButton, (!canSave) && desktopStyles.modalSaveButtonDisabled]}
                  onPress={handleSave}
                  disabled={!canSave}
                >
                  <Text style={[desktopStyles.modalSaveButtonText, (!canSave) && desktopStyles.modalSaveButtonTextDisabled]}>
                    {saving ? 'Saving...' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : (
          <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
            <Pressable style={{backgroundColor:'#FFFF', borderWidth:0}} onPress={closeSheet}>
              <View style={styles.sheetHandle} />
            </Pressable>
            <ScrollView contentContainerStyle={{...styles.sheetContent, paddingHorizontal:0, gap:0}} showsVerticalScrollIndicator={false}>
              <View style={{ padding:16, gap: 20, backgroundColor:'#ffff'}}>
                <Text style={styles.sheetTitle}> Add a gift item</Text>

                <TextInputField
                  label="Add a web link"
                  value={link}
                  onChangeText={setLink} 
                  icon={<Image source={require("@/assets/images/externalLink.png")} />}
                  keyboardType="url"
                  placeholder="https://"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={[ ...(!isUrlValid && link.trim().length > 0 ? ["Invalid URL"]: []), ...(scrapeError ? [String(scrapeError)]: []) ]}

                />
                <View style={styles.orDivider}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.orLine} />
                </View>

                 <TextInputField
                  label="Search via Google"
                  value={search}
                  onChangeText={setSearch} 
                  placeholder="Search products"
                  icon={<Pressable onPress={openSearchBrowser}><Image source={require("@/assets/images/search.png")} /></Pressable>}
                />

              </View>
              <View style={{ padding:16, paddingTop:24,  gap: 20}}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Desired quantity</Text>
                  <View style={styles.qtyRow}>
                    <Pressable onPress={decQty} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>–</Text></Pressable>
                    <Text style={styles.qtyValue}>{String(quantity).padStart(2, '0')}</Text>
                    <Pressable onPress={incQty} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></Pressable>
                  </View>
                </View>
                <TextInputField
                  label="Price of gift"
                  value={price}
                  onChangeText={setPrice} 
                  keyboardType="decimal-pad" 
                  inputLabelContainerStyle={{backgroundColor:'#F2F2F7'}}
                />

                <TextInputField
                  label="Name of gift"
                  value={name}
                  onChangeText={setName}
                  inputLabelContainerStyle={{backgroundColor:'#F2F2F7'}}
                  icon={<Image source={require("@/assets/images/Edit.png")} />}
                />
               
                <TextInputAreaField 
                  label="Description (optional)"
                  placeholder="Prefer white, size M."
                  value={description}
                  onChangeText={t => t.length <= DESCRIPTION_LIMIT && setDescription(t)}
                  inputLabelContainerStyle={{backgroundColor:'#F2F2F7'}}
                  descriptionLimit={DESCRIPTION_LIMIT}
                  
                />
                <Pressable style={[styles.saveBtn, (!canSave) && styles.saveBtnDisabled]} onPress={handleSave} disabled={!canSave}>
                  <Text style={[styles.saveBtnText, (!canSave) && styles.saveBtnTextDisabled]}>{saving ? 'Saving...' : 'Save'}</Text>
                </Pressable>
                <Pressable style={styles.cancelBtn} onPress={handleCancel}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </Animated.View>
        )}
      </Modal>
      {/* Product search browser modal */}
      <Modal visible={showBrowser} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setShowBrowser(false)}>
        <View style={styles.browserModalContainer}>
          <View style={styles.browserHeader}>
            <Pressable style={styles.browserHeaderBtn} onPress={() => { setShowBrowser(false); setTimeout(() => setShowSheet(true), 60); }}>
              <Ionicons name="chevron-back" size={24} color="#1C0335" />
            </Pressable>
            <Text style={styles.browserTitle} numberOfLines={1}>{currentBrowserUrl?.replace(/^https?:\/\//, '')}</Text>
            <Pressable style={styles.browserHeaderBtn} onPress={() => setShowBrowser(false)}>
              <Ionicons name="close" size={24} color="#1C0335" />
            </Pressable>
          </View>
          {browserUrl && (
            <WebView
              source={{ uri: browserUrl }}
              onNavigationStateChange={(nav) => setCurrentBrowserUrl(nav.url)}
              startInLoadingState
              style={styles.webview}
            />
          )}
          <SafeAreaView edges={['bottom']} style={styles.browserActionBarWrapper}>
            <Pressable style={styles.browserActionBar} onPress={handleBrowserAdd}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.browserActionBarText}>Add Product</Text>
            </Pressable>
          </SafeAreaView>
        </View>
      </Modal>
      {/* Sort & Filter Bottom Sheet (designed) */}
      <Modal visible={showSortSheet} transparent animationType="fade" onRequestClose={() => setShowSortSheet(false)}>
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
                { key: 'default', label: 'Default' },
                { key: 'priceAsc', label: 'Price Lowest - Highest' },
                { key: 'priceDesc', label: 'Price Highest - Lowest' },
                { key: 'newest', label: 'Most Recent to Oldest' },
                { key: 'oldest', label: 'Oldest to Most Recent' },
              ].map(o => (
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
              <Pressable style={styles.radioRow} onPress={() => setTempFilterClaimed(v => !v)}>
                <View style={[styles.checkboxBox, tempFilterClaimed && styles.checkboxBoxActive]}>
                  {tempFilterClaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}
                </View>
                <Text style={styles.radioLabel}>Claimed</Text>
              </Pressable>
              <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed(v => !v)}>
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
    </View>
  );
}

type Totals = {
  totalItems: number;
  totalQuantity: number;
  fullyClaimed: number;
  claimedCount: number;
  unclaimedCount: number;
  claimedUnits: number;
};

type MobileLayoutProps = {
  title: string;
  subtitle: string;
  coverUri?: string;
  overlayText: string;
  displayedItems: GiftItemType[];
  onAddGift: () => void;
  onOpenSortSheet: () => void;
  listId?: string;
  onShare: () => void;
  onManage: () => void;
  handleBack: () => void;
  privacy: string;
  loading: boolean;
  shareCount?: number;
  address?: string | null;
  lastUpdated: string;
  occasion?: string
  tempSortBy?: string
  tempFilterClaimed?: boolean
  tempFilterUnclaimed?: boolean
};

function MobileLayout({
  title,
  subtitle,
  coverUri,
  overlayText,
  displayedItems,
  onAddGift,
  onOpenSortSheet,
  listId,
  onShare,
  onManage,
  handleBack,
  privacy,
  loading,
  shareCount,
  address,
  lastUpdated,
  occasion,
  tempSortBy,
  tempFilterClaimed,
  tempFilterUnclaimed,
}: MobileLayoutProps) {
  return (
    <>
      <HeaderBar title={title} onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover imageUri={coverUri} overlayText={overlayText} occasion={occasion}/>

        <View style={styles.listInfoContainer}>
          <RibbonHeader occasion={occasion} title={title} subtitle={subtitle} />
        </View>

        <ActionsBar
          privacy={privacy}
          loading={loading}
          onFilterPress={onOpenSortSheet}
          address={address}
          shareCount={shareCount}
        />
        {displayedItems.length > 0 ? (
          <SelectedFilter tempSortBy={String(tempSortBy)} tempFilterClaimed={Boolean(tempFilterClaimed)} tempFilterUnclaimed={Boolean(tempFilterUnclaimed)}/>
        ) : null}
        
        <View style={styles.addGiftSection}>
          {displayedItems.length > 0 ? (
            <>
              {displayedItems.map((item, index) => (
                <Fragment key={item._id}>
                  {index !== 0 ? <View style={styles.giftDivider} /> : null}
                  <GiftItemCard title={title} item={item} />
                  
                </Fragment>
              ))}
              <Pressable style={styles.addMoreButton} onPress={onAddGift}>
                <Ionicons name="add" size={20} color="#3B0076" />
                <Text style={styles.addMoreButtonText}>Add more gifts</Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.addYourFirstGift}>
              <Text style={styles.addGiftTitle}>  Add your first gift item</Text>
              <Pressable style={styles.addGiftButton} onPress={onAddGift}>
                <Ionicons name="add" size={24} color="#3B0076" />
                <Text style={styles.addGiftButtonText}>Add a gift</Text>
              </Pressable>
            </View>
          )}
        </View>

        <InfoBox>
          To learn more on how to add gifts from web browser, <Text style={styles.linkText}>click here</Text>
        </InfoBox>
      </ScrollView>

      <FooterBar lastUpdated={lastUpdated} onShare={onShare} onManage={onManage} />
    </>
  );
}

type DesktopLayoutProps = {
  title: string;
  subtitle: string;
  ribbonSubtitle: string;
  coverUri?: string;
  formattedEventDate: string;
  daysToGo: string | null;
  totals: Totals;
  totalItemsCount: number;
  availability: "all" | "claimed" | "unclaimed";
  onAvailabilityChange: (value: "all" | "claimed" | "unclaimed") => void;
  sortBy: SortOption;
  onSelectSort: (value: SortOption) => void;
  displayedItems: GiftItemType[];
  onAddGift: () => void;
  onShare: () => void;
  onManage: () => void;
  onOpenGift: (item: GiftItemType) => void;
  privacy: string;
  shareCount?: number;
  loading: boolean;
  address?: string | null;
  lastUpdated: string;
  occasion?: string
};

function DesktopLayout({
  title,
  subtitle,
  ribbonSubtitle,
  coverUri,
  formattedEventDate,
  daysToGo,
  totals,
  totalItemsCount,
  availability,
  onAvailabilityChange,
  sortBy,
  onSelectSort,
  displayedItems,
  onAddGift,
  onShare,
  onManage,
  onOpenGift,
  privacy,
  shareCount,
  loading,
  address,
  lastUpdated,
  occasion
}: DesktopLayoutProps) {
  const privacyDisplay = getPrivacyDisplay(privacy, loading, shareCount);
  const availabilityOptions: { value: "all" | "claimed" | "unclaimed"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "claimed", label: "Claimed" },
    { value: "unclaimed", label: "Unclaimed" },
  ];
  const availabilityLabel = availabilityOptions.find((opt) => opt.value === availability)?.label ?? "All";
  const sortLabel = SORT_OPTIONS.find((opt) => opt.key === sortBy)?.label ?? "Default";
  const visibilityText = React.useMemo(() => {
    if (loading) return "Loading privacy";
    if (privacy === "shared") {
      return (shareCount ?? 0) === 0 ? "Visible to Everyone" : "Visible to My People";
    }
    if (privacy === "public") return "Visible to Everyone";
    return "Only Me";
  }, [loading, privacy, shareCount]);
  const [showAvailabilityMenu, setShowAvailabilityMenu] = React.useState(false);
  const [showSortMenu, setShowSortMenu] = React.useState(false);

  return (
    <SafeAreaView style={desktopStyles.safeArea} edges={Platform.OS === "web" ? [] : ["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={desktopStyles.scrollContent}>
        <View style={desktopStyles.maxWidth}>
          <View style={desktopStyles.topBar}>
            <Text style={desktopStyles.breadcrumbText}>
              Home / My List / <Text style={desktopStyles.breadcrumbCurrent}>{title}</Text>
            </Text>
            <View style={desktopStyles.topActions}>
              <Pressable style={desktopStyles.manageButton} onPress={onManage}>
                <Ionicons name="settings-outline" size={18} color="#3B0076" />
                <Text style={desktopStyles.manageButtonText}>Manage List</Text>
              </Pressable>
              <Pressable style={desktopStyles.addButton} onPress={onAddGift}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={desktopStyles.addButtonText}>Add a Gift</Text>
              </Pressable>
            </View>
          </View>

          <View style={desktopStyles.heroCardWrapper}>
            <View style={desktopStyles.heroCard}>
              <Image source={coverUri ? { uri: coverUri } : FALLBACK_COVER} style={desktopStyles.heroImage} />
              <View style={desktopStyles.heroOverlay}>
                <Pressable style={desktopStyles.changeCoverButton} onPress={onManage}>
                  <Text style={desktopStyles.changeCoverText}>Change cover photo</Text>
                </Pressable>
              </View>
            </View>
            <View style={desktopStyles.ribbonContainer}>
              <RibbonHeader
                occasion={occasion}
                title={title}
                subtitle={[ribbonSubtitle, daysToGo].filter(Boolean).join(" - ")}
              />
            </View>
          </View>

          {/* Gift Stats Cards */}
          <View style={desktopStyles.statsRow}>
            <LinearGradient
              colors={["#3B0076", "#5A00B8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={desktopStyles.statCard}
            >
              <Text style={desktopStyles.statCardLabel}>Total Items</Text>
              <Text style={desktopStyles.statCardValue}>{totalItemsCount}</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#1F6F4A", "#2A8F5F"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={desktopStyles.statCard}
            >
              <Text style={desktopStyles.statCardLabel}>All Claimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.fullyClaimed}</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#F2994A", "#FFB366"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={desktopStyles.statCard}
            >
              <Text style={desktopStyles.statCardLabel}>Items Claimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.claimedCount}</Text>
            </LinearGradient>
            <LinearGradient
              colors={["#4D4D4D", "#666666"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={desktopStyles.statCard}
            >
              <Text style={desktopStyles.statCardLabel}>Items Unclaimed</Text>
              <Text style={desktopStyles.statCardValue}>{totals.unclaimedCount}</Text>
            </LinearGradient>
          </View>

          <View style={desktopStyles.controlsRow}>
            <Pressable style={desktopStyles.visibilityTrigger} onPress={onManage}>
              <Ionicons name={privacyDisplay.icon === "globe-outline" ? "eye-outline" : privacyDisplay.icon} size={18} color="#3B0076" />
              <Text style={desktopStyles.visibilityText}>{visibilityText}</Text>
              <Ionicons name="chevron-down" size={16} color="#3B0076" />
            </Pressable>

            <View style={desktopStyles.filterCluster}>
              <View style={desktopStyles.filterGroup}>
                <Text style={desktopStyles.filterLabel}>Availability:</Text>
                <Pressable
                  style={desktopStyles.filterButton}
                  onPress={() => setShowAvailabilityMenu(true)}
                >
                  <Text style={desktopStyles.filterButtonText}>{availabilityLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#3B0076" />
                </Pressable>
              </View>
              <View style={desktopStyles.filterGroup}>
                <Text style={desktopStyles.filterLabel}>Sort</Text>
                <Pressable
                  style={desktopStyles.filterButton}
                  onPress={() => setShowSortMenu(true)}
                >
                  <Text style={desktopStyles.filterButtonText}>{sortLabel}</Text>
                  <Ionicons name="chevron-down" size={14} color="#3B0076" />
                </Pressable>
              </View>
            </View>

            <Pressable style={desktopStyles.shareLink} onPress={onShare}>
              <Ionicons name="share-social-outline" size={18} color="#3B0076" />
              <Text style={desktopStyles.shareLinkText}>Share List</Text>
            </Pressable>
          </View>

          <View style={desktopStyles.sectionDivider} />

          {!!address && (
            <View style={desktopStyles.addressNotice}>
              <Ionicons name="location-outline" size={18} color="#3B0076" />
              <Text style={desktopStyles.addressText} numberOfLines={1}>
                {address}
              </Text>
            </View>
          )}

          <View style={desktopStyles.listSummaryRow}>
            <View style={desktopStyles.listSummaryLeft}>
              <Text style={desktopStyles.listSummaryLabel}>Total items in list:</Text>
              <View style={desktopStyles.listSummaryBadge}>
                <Text style={desktopStyles.listSummaryBadgeText}>{totalItemsCount}</Text>
              </View>
            </View>
            <Pressable style={desktopStyles.summaryShare} onPress={onShare}>
              <Text style={desktopStyles.summaryShareText}>Share List</Text>
              <Ionicons name="share-social-outline" size={16} color="#3B0076" />
            </Pressable>
          </View>

          <View style={desktopStyles.sectionDivider} />

          <View style={desktopStyles.itemsColumn}>
            {displayedItems.length > 0 ? (
              displayedItems.map((item, index) => (
                <DesktopGiftItemRow key={item._id} item={item} onPress={onOpenGift} index={index} />
              ))
            ) : (
              <View style={desktopStyles.emptyState}>
                <Text style={desktopStyles.emptyTitle}>No gifts yet</Text>
                <Text style={desktopStyles.emptySubtitle}>
                  Start adding items to make this list shine.
                </Text>
                <Pressable style={desktopStyles.addButtonSecondary} onPress={onAddGift}>
                  <Ionicons name="add" size={18} color="#3B0076" />
                  <Text style={desktopStyles.addButtonSecondaryText}>Add a gift</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Text style={desktopStyles.lastUpdated}>{lastUpdated}</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showAvailabilityMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvailabilityMenu(false)}
      >
        <Pressable style={desktopStyles.menuBackdrop} onPress={() => setShowAvailabilityMenu(false)}>
          <View style={desktopStyles.menuCard}>
            {availabilityOptions.map((option) => (
              <Pressable
                key={option.value}
                style={desktopStyles.menuRow}
                onPress={() => {
                  setShowAvailabilityMenu(false);
                  onAvailabilityChange(option.value);
                }}
              >
                <Text style={desktopStyles.menuLabel}>{option.label}</Text>
                {availability === option.value && (
                  <Ionicons name="checkmark" size={18} color="#3B0076" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <Pressable style={desktopStyles.menuBackdrop} onPress={() => setShowSortMenu(false)}>
          <View style={desktopStyles.menuCard}>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={desktopStyles.menuRow}
                onPress={() => {
                  setShowSortMenu(false);
                  onSelectSort(option.key);
                }}
              >
                <Text style={desktopStyles.menuLabel}>{option.label}</Text>
                {sortBy === option.key && (
                  <Ionicons name="checkmark" size={18} color="#3B0076" />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

type DesktopGiftItemRowProps = {
  item: GiftItemType;
  onPress: (item: GiftItemType) => void;
  index: number;
};

function DesktopGiftItemRow({ item, onPress, index }: DesktopGiftItemRowProps) {
  const quantity = Math.max(1, Number(item.quantity ?? 1));
  const claimed = Math.max(0, Number(item.claimed ?? 0));
  const claimedPct = Math.min(100, Math.round((claimed / quantity) * 100));
  const isSoldOut = claimed >= quantity;
  const hasClaims = claimed > 0 && !isSoldOut;
  const statusLabel = isSoldOut ? "All Claimed" : hasClaims ? `${claimed} Claimed` : "Unclaimed";
  const badgeStyle = isSoldOut
    ? desktopStyles.statusBadgeSuccess
    : hasClaims
      ? desktopStyles.statusBadgeWarning
      : desktopStyles.statusBadgeNeutral;
  const badgeTextStyle = isSoldOut
    ? desktopStyles.statusBadgeSuccessText
    : hasClaims
      ? desktopStyles.statusBadgeWarningText
      : desktopStyles.statusBadgeNeutralText;
  const quantityLabel = String(quantity).padStart(2, "0");
  let currencyLabel = "AED";

  if (typeof item.price === "string") {
    const match = item.price.trim().match(/^([A-Za-z]{3})/);
    if (match && match[1]) {
      currencyLabel = match[1].toUpperCase();
    }
  }

  const formatPriceNumber = (value: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return value.toFixed(2);
    }
  };

  let formattedPrice: string | null = null;
  if (item.price != null && item.price !== "") {
    if (typeof item.price === "number" && Number.isFinite(item.price)) {
      formattedPrice = formatPriceNumber(item.price);
    } else if (typeof item.price === "string") {
      const numericPart = item.price.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
      const parsed = Number(numericPart);
      if (!Number.isNaN(parsed) && numericPart.length > 0) {
        formattedPrice = formatPriceNumber(parsed);
      } else {
        formattedPrice = item.price.trim().replace(/^([A-Za-z]{3})\s*/, "");
      }
    }
  }

  return (
    <View style={desktopStyles.itemRow}>
      <View style={desktopStyles.itemIndexBubble}>
        <Text style={desktopStyles.itemIndexText}>{String(index + 1).padStart(2, "0")}</Text>
      </View>
      <View style={desktopStyles.itemImageWrapper}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={desktopStyles.itemImage} />
        ) : (
          <View style={desktopStyles.itemImagePlaceholder} />
        )}
      </View>
      <View style={desktopStyles.itemDetails}>
        <View style={desktopStyles.itemHeaderRow}>
          <View style={desktopStyles.itemTitleBlock}>
            <Text style={desktopStyles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            {item.description && (
              <Text style={desktopStyles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <View style={desktopStyles.itemActionsColumn}>
            <Pressable
              style={[desktopStyles.buyButton, isSoldOut && desktopStyles.buyButtonDisabled]}
              onPress={() => onPress(item)}
              disabled={isSoldOut}
            >
              <Text
                style={[desktopStyles.buyButtonText, isSoldOut && desktopStyles.buyButtonTextDisabled]}
              >
                Buy Now
              </Text>
            </Pressable>
            <Pressable style={desktopStyles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color="#E54848" />
            </Pressable>
          </View>
        </View>

        <View style={desktopStyles.itemMetaRow}>
          {formattedPrice && (
            <View style={desktopStyles.priceRow}>
              <Text style={desktopStyles.priceCurrency}>{currencyLabel}</Text>
              <Text style={desktopStyles.priceText}>{formattedPrice}</Text>
            </View>
          )}
          <Text style={desktopStyles.quantityText}>Quantity: {quantityLabel}</Text>
          <View style={[desktopStyles.statusBadge, badgeStyle]}>
            <Text style={[desktopStyles.statusBadgeText, badgeTextStyle]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={desktopStyles.progressTrack}>
          <View style={[desktopStyles.progressFill, { width: `${claimedPct}%` }]} />
        </View>
      </View>
    </View>
  );
}


function SelectedFilter({ tempSortBy, tempFilterClaimed, tempFilterUnclaimed}:{
  tempSortBy: string, tempFilterClaimed: boolean, tempFilterUnclaimed: boolean
  }) {
  let availabilityValue = 'All'
  if(tempFilterClaimed === false && tempFilterUnclaimed === false){
    availabilityValue = 'All'
  }
  else if(tempFilterClaimed === true && tempFilterUnclaimed === true){
    availabilityValue = 'All'
  }
  else if(tempFilterClaimed === true && tempFilterUnclaimed === false){
    availabilityValue = 'Claimed'
  }

  else if(tempFilterClaimed === false && tempFilterUnclaimed === true){
    availabilityValue = 'UnClaimed'
  }


  return (
    <View style={styles.selectedFilterContainer}>
      <View style={styles.filterItem}>
        <Image source={require("@/assets/images/sortIcon.png")}/>
        <View style={styles.filterContent}>
          <Text style={styles.filterTitle}>Sort:</Text>
          <Text style={styles.filterValue}>{String(tempSortBy)}</Text>
        </View>
      </View>
        <View style={styles.filterItem}>
        <Image source={require("@/assets/images/availabilityIcon.png")}/>
        <View style={styles.filterContent}>
          <Text style={styles.filterTitle}>Availability:</Text>
          <Text style={styles.filterValue}>{availabilityValue}</Text>
        </View>
      </View>
    </View>
  );
}
