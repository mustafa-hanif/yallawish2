import { RibbonHeader } from "@/components/RibbonHeader";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, InfoBox, ListCover } from "@/components/list";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { Ionicons } from "@expo/vector-icons";
import { useAction, useMutation, useQuery } from "convex/react";
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from 'react-native-webview';

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
  const giftItems = Array.isArray(items) ? [...items] : [];

  // Sort & Filter state
  type SortOption = 'default' | 'priceAsc' | 'priceDesc' | 'newest' | 'oldest';
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterClaimed, setFilterClaimed] = useState(false);
  const [filterUnclaimed, setFilterUnclaimed] = useState(false);

  // Derived displayed items
  let displayedItems = giftItems;
  if (filterClaimed && !filterUnclaimed) {
    displayedItems = displayedItems.filter((i: any) => (i.claimed ?? 0) >= (i.quantity ?? 1));
  } else if (filterUnclaimed && !filterClaimed) {
    displayedItems = displayedItems.filter((i: any) => (i.claimed ?? 0) < (i.quantity ?? 1));
  }
  try {
    displayedItems = [...displayedItems].sort((a: any, b: any) => {
      const aPrice = parseFloat(a.price) || 0; const bPrice = parseFloat(b.price) || 0;
      const ad = a.created_at || ""; const bd = b.created_at || "";
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
  const DESCRIPTION_LIMIT = 400;
  const canSave = !!listId && (link.trim().length > 0 || name.trim().length > 0) && quantity > 0 && !saving;

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
    if (!search.trim()) return;
    const q = encodeURIComponent(search.trim());
    const url = `https://www.google.com/search?q=${q}&tbm=shop`;
    setBrowserUrl(url);
    setCurrentBrowserUrl(url);
    // Hide sheet while browsing
    setShowSheet(false);
    setShowBrowser(true);
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


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      <HeaderBar title={title} onBack={handleBack} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover imageUri={coverUri} overlayText={formatEventDate((list?.eventDate ?? undefined) as string | undefined)} />

        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} />
        </View>

        <ActionsBar privacy={privacy} loading={loading} onFilterPress={() => setShowSortSheet(true)} address={(list?.shippingAddress as string | undefined) ?? null} shareCount={shareCount} />

        <View style={styles.addGiftSection}>
          {displayedItems.length > 0 ? (
            <>
              {displayedItems.map((item: any) => (
                <GiftItemCard key={item._id} item={item} />
              ))}
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
              {listId && (
                <Text style={{ textAlign: 'center', color: '#8E8E93' }}>Working on list: {String(listId)}</Text>
              )}
            </>
          )}
        </View>

        <InfoBox>
          To learn more on how to add gifts from web browser, <Text style={styles.linkText}>click here</Text>
        </InfoBox>
      </ScrollView>

      <FooterBar lastUpdated="Last updated: July 15, 2025 | 08:00PM" onShare={handleShare} onManage={handleManageList} />
      {/** Bottom Sheet **/}
      <Modal visible={showSheet} transparent animationType="none" onRequestClose={closeSheet}>
        <Pressable style={styles.backdrop} onPress={closeSheet} />
        <Animated.View style={[styles.sheetContainer, { transform: [{ translateY }] }]}>
          <Pressable onPress={closeSheet}>
            <View style={styles.sheetHandle} />
          </Pressable>
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
                <TextInput value={search} onChangeText={setSearch} style={styles.input} autoCapitalize="none" autoCorrect={false} placeholder="Search products" returnKeyType="search" onSubmitEditing={openSearchBrowser} />
                <Pressable onPress={openSearchBrowser}>
                  <Ionicons name="search-outline" size={20} color="#1C0335" />
                </Pressable>
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Desired quantity</Text>
              <View style={styles.qtyRow}>
                <Pressable onPress={decQty} style={styles.qtyBtn}><Text style={styles.qtyBtnText}>–</Text></Pressable>
                <Text style={styles.qtyValue}>{String(quantity).padStart(2, '0')}</Text>
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
            <Pressable style={[styles.saveBtn, (!canSave) && styles.saveBtnDisabled]} onPress={handleSave} disabled={!canSave}>
              <Text style={[styles.saveBtnText, (!canSave) && styles.saveBtnTextDisabled]}>{saving ? 'Saving...' : 'Save'}</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
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
                  {tempFilterClaimed && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
                </View>
                <Text style={styles.radioLabel}>Claimed</Text>
              </Pressable>
              <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed(v => !v)}>
                <View style={[styles.checkboxBox, tempFilterUnclaimed && styles.checkboxBoxActive]}>
                  {tempFilterUnclaimed && <Ionicons name="checkmark" size={20} color="#FFFFFF" />}
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
