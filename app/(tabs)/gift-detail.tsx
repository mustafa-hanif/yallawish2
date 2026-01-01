import type { GiftItem as GiftItemType } from "@/components/list/GiftItemCard";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { api } from "@/convex/_generated/api";
import { styles as listStyles } from "@/styles/addGiftStyles";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Image, Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  useWindowDimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const occasionObj = {
  birthday: {
    id: "birthday",
    title: "Birthday",
    borderColor: "#FC0",
    icon: "gift",
    mobileIcon: require("@/assets/images/birthdayIcon.png"),
    backgroundColor: "#FFF6D2",
  },
  wedding: {
    id: "wedding",
    title: "Wedding",
    borderColor: "#FF3B30",
    icon: "heart",
    mobileIcon: require("@/assets/images/weddingIcon.png"),
    backgroundColor: "#FFE0E0",
  },
  "baby-shower": {
    id: "baby-shower",
    title: "Baby Shower",
    borderColor: "#91DA93",
    icon: "person",
    mobileIcon: require("@/assets/images/babyShowerIcon.png"),
    backgroundColor: "#F0F9F0",
  },
  graduation: {
    id: "graduation",
    title: "Graduation",
    borderColor: "#32ADE6",
    icon: "school",
    mobileIcon: require("@/assets/images/graduationIcon.png"),
    backgroundColor: "#D9F3FF",
  },
  "new-home": {
    id: "new-home",
    title: "New Home",
    borderColor: "#A2845E",
    icon: "home",
    mobileIcon: require("@/assets/images/newHomeIcon.png"),
    backgroundColor: "#F5E8D5",
  },
  retirement: {
    id: "retirement",
    title: "Retirement",
    borderColor: "#FF9500",
    icon: "person",
    mobileIcon: require("@/assets/images/retirementIcon.png"),
    backgroundColor: "#FFEBCC",
  },
  "no-occasion": {
    id: "no-occasion",
    title: "No Occasion",
    borderColor: "#4D4D4D",
    icon: "document-text",
    mobileIcon: require("@/assets/images/noOccasionIcon.png"),
    backgroundColor: "#F4F4F4",
  },
  other: {
    id: "other",
    title: "Other",
    borderColor: "#D1D1D6",
    icon: "gift",
    mobileIcon: require("@/assets/images/otherIcon.png"),
    backgroundColor: "#E9E9E9",
  },
};

type StoreOption = "suggested" | "custom";

const NOTE_LIMIT = 400;
const DESKTOP_BREAKPOINT = 1024;
const FALLBACK_IMAGE = require("@/assets/images/nursery.png");

const COLORS = {
  background: "#FFFFFF",
  surface: "#F7F3FB",
  deepPurple: "#330065",
  purple: "#3B0076",
  accent: "#F2994A",
  textPrimary: "#1C0335",
  textSecondary: "#6B5E7E",
  border: "#AEAEB2",
};

function formatPrice(price: unknown, currency?: string): string | null {
  if (price == null) return null;
  const numeric = typeof price === "number" ? price : Number.parseFloat(String(price));
  if (!Number.isFinite(numeric)) {
    return typeof price === "string" ? price : null;
  }
  const cur = currency || "AED";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(numeric);
  } catch {
    return `${cur} ${numeric.toFixed(2)}`;
  }
}

function extractHost(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function storeLabelFromHost(host: string | null): string {
  if (!host) return "Seller";
  const segment = host.split(".")[0] ?? host;
  if (!segment) return host;
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function ownerNameFromTitle(title?: string | null): string {
  if (!title) return "Recipient";
  const match = title.match(/^(.+?)'s\b/i);
  if (match && match[1]) return match[1];
  return title;
}

function buildReturnTo(pathname: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export default function GiftDetail() {
  const { itemId, listId, action, eventTitle } = useLocalSearchParams<{
    itemId?: string;
    listId?: string;
    action?: string;
    eventTitle?: string
  }>();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const item = useQuery(
    api.products.getListItemById,
    itemId ? ({ itemId: itemId as any } as any) : "skip"
  ) as GiftItemType | undefined | null;
  const list = useQuery(
    api.products.getListById,
    listId ? ({ listId: listId as any } as any) : "skip"
  ) as any;
  const listItems = useQuery(
    api.products.getListItems as any,
    listId ? ({ list_id: listId } as any) : "skip"
  ) as GiftItemType[] | undefined;

  const purchase = useMutation(api.products.purchaseListItem as any);
  const createItem = useMutation(api.products.createListItem as any);

  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  const returnTo = useMemo(
    () =>
      buildReturnTo(pathname, {
        itemId: itemId ? String(itemId) : undefined,
        listId: listId ? String(listId) : undefined,
        action: action ? String(action) : undefined,
      }),
    [pathname, itemId, listId, action]
  );

  const goToSignIn = useCallback(() => {
    router.push({
      pathname: "/sign-in",
      params: { returnTo: encodeURIComponent(returnTo) },
    });
  }, [returnTo]);

  useEffect(() => {
    if (action === "want" && !isSignedIn) {
      goToSignIn();
    }
  }, [action, isSignedIn, goToSignIn]);

  const buyUrl = item && item.buy_url ? String(item.buy_url) : undefined;
  const host = useMemo(() => extractHost(buyUrl), [buyUrl]);
  const storeDisplayName = useMemo(() => storeLabelFromHost(host), [host]);
  const priceLabel = useMemo(() => formatPrice(item?.price, "AED"), [item?.price]);
  const listTitle = list?.title ?? "Gift List";
  const ownerName = useMemo(
    () => ownerNameFromTitle(list?.title as string | null),
    [list?.title]
  );

  const totalQuantity = Math.max(1, Number(item?.quantity ?? 1));
  const claimed = Math.max(0, Number(item?.claimed ?? 0));
  const available = Math.max(0, totalQuantity - claimed);
  const maxQuantity = available > 0 ? available : totalQuantity;

  const [marked, setMarked] = useState(() => action === "buy");
  useEffect(() => {
    if (action === "buy") {
      setMarked(true);
    }
  }, [action]);

  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (available > 0) {
      setQty((current) => Math.min(Math.max(1, current), available));
    } else {
      setQty(1);
    }
  }, [available]);

  const inc = useCallback(
    () => setQty((current) => Math.min(current + 1, maxQuantity)),
    [maxQuantity]
  );
  const dec = useCallback(() => setQty((current) => Math.max(1, current - 1)), []);

  const [deliveredTo, setDeliveredTo] = useState<"recipient" | "me">("recipient");
  const [note, setNote] = useState("");
  const [storeOption, setStoreOption] = useState<StoreOption>(() =>
    buyUrl ? "suggested" : "custom"
  );
  const [storeName, setStoreName] = useState<string>(() =>
    buyUrl ? storeDisplayName : ""
  );
  useEffect(() => {
    if (storeOption === "suggested") {
      setStoreName(storeDisplayName);
    }
  }, [storeOption, storeDisplayName]);
  useEffect(() => {
    if (!buyUrl) {
      setStoreOption("custom");
    }
  }, [buyUrl]);
  const [orderNumber, setOrderNumber] = useState("");
  const [showCopySheet, setShowCopySheet] = useState(false);
  const [showLeaving, setShowLeaving] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [showBuyNowForm, setShowBuyNowForm] = useState(false);

  useEffect(() => {
    if (action === "want" && isSignedIn) {
      setShowCopySheet(true);
    }
  }, [action, isSignedIn]);

  useEffect(() => {
    if (!showLeaving) return;
    setCountdown(5);
  }, [showLeaving]);

  useEffect(() => {
    if (!showLeaving) return;
    if (countdown <= 0) {
      if (buyUrl) {
        Linking.openURL(buyUrl);
        setCountdown(5)
      }
      setShowLeaving(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [showLeaving, countdown, buyUrl]);

  const handleMarkedChange = useCallback(
    (value: boolean) => {
      if (value && !isSignedIn) {
        goToSignIn();
        return;
      }
      setMarked(value);
    },
    [isSignedIn, goToSignIn]
  );

  const onBack = useCallback(() => {
    router.back();
  }, []);

  const onBuyNow = useCallback(() => {
    if (!buyUrl) return;
    if (!isSignedIn) {
      goToSignIn();
      return;
    }
    if (isDesktop) {
      setShowBuyNowForm(true);
      setMarked(true);
    } else {
      setShowLeaving(true);
    }
  }, [buyUrl, isSignedIn, goToSignIn, isDesktop]);

  const onIWantThisToo = useCallback(() => {
    if (!isSignedIn) {
      goToSignIn();
      return;
    }
    setShowCopySheet(true);
  }, [isSignedIn, goToSignIn]);

  const hasStoreName =
    storeOption === "suggested" || storeName.trim().length > 0;

  const canSubmit =
    marked &&
    !submitting &&
    Boolean(listId) &&
    Boolean(itemId) &&
    available > 0 &&
    qty > 0 &&
    qty <= maxQuantity &&
    hasStoreName;

  const onSubmit = useCallback(async () => {
    if (!listId || !itemId) return;
    if (!marked) return;
    if (!isSignedIn) {
      goToSignIn();
      return;
    }
    if (available <= 0) return;
    if (storeOption === "custom" && !storeName.trim()) return;

    try {
      setSubmitting(true);
      await purchase({
        list_id: listId as any,
        item_id: itemId as any,
        quantity: qty,
        deliveredTo,
        note: note.trim() ? note.trim() : null,
        storeName:
          storeOption === "suggested"
            ? storeDisplayName
            : storeName.trim() || null,
        orderNumber: orderNumber.trim() || null,
        buyer_user_id: userId ?? null,
        buyer_name: user?.fullName ?? user?.firstName ?? null,
        buyer_email: user?.primaryEmailAddress?.emailAddress ?? null,
      } as any);
      if (isDesktop) {
        setShowBuyNowForm(false);
      }
      router.replace({
        pathname: "/purchase-success",
        params: listId ? { listId: String(listId) } : undefined,
      });
    } catch (error) {
      console.warn("Failed to record purchase", error);
    } finally {
      setSubmitting(false);
    }
  }, [
    listId,
    itemId,
    marked,
    isSignedIn,
    goToSignIn,
    available,
    storeOption,
    storeName,
    storeDisplayName,
    purchase,
    qty,
    deliveredTo,
    note,
    orderNumber,
    userId,
    user,
    router,
    isDesktop,
  ]);

  const currentItemId = item ? String((item as any)._id) : itemId ? String(itemId) : "";
  const moreItems = useMemo<GiftItemType[]>(() => {
    if (!Array.isArray(listItems)) return [];
    return (listItems as any[])
      .filter((entry) => String(entry._id) !== currentItemId)
      .slice(0, isDesktop ? 4 : 3) as GiftItemType[];
  }, [listItems, currentItemId, isDesktop]);

  const onSelectItem = useCallback(
    (targetId: string) => {
      router.replace({
        pathname: "/gift-detail",
        params: {
          itemId: targetId,
          ...(listId ? { listId: String(listId) } : {}),
        },
      });
    },
    [listId]
  );

  const onSeeAll = useCallback(() => {
    if (!listId) return;
    router.push({ pathname: "/view-list", params: { listId: String(listId) } });
  }, [listId]);

  const handleCopy = useCallback(
    async (targetListIds: string[]) => {
      if (!item) return false;
      try {
        for (const target of targetListIds) {
          await createItem({
            list_id: target as any,
            name: item.name,
            description: item.description ?? null,
            image_url: item.image_url ?? null,
            quantity: 1,
            price: item.price ?? null,
            currency: "AED",
            buy_url: item.buy_url ?? null,
          } as any);
        }
        return true;
      } catch (error) {
        console.warn("Failed to copy gift item", error);
        return false;
      }
    },
    [item, createItem]
  );

  if (item === undefined) {
    return (
      <View style={listStyles.container}>
        <View style={sharedStyles.loadingContainer}>
          <Text style={sharedStyles.loadingText}>Loading gift details…</Text>
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={listStyles.container}>
        <View style={sharedStyles.loadingContainer}>
          <Text style={sharedStyles.loadingText}>Gift not found.</Text>
        </View>
      </View>
    );
  }

  const layout = isDesktop ? (
    <DesktopLayout
      item={item}
      price={priceLabel}
      listTitle={listTitle}
      buyUrl={buyUrl}
      marked={marked}
      onToggleMarked={handleMarkedChange}
      qty={qty}
      inc={inc}
      dec={dec}
      maxQuantity={maxQuantity}
      deliveredTo={deliveredTo}
      setDeliveredTo={setDeliveredTo}
      note={note}
      setNote={(value) => setNote(value.slice(0, NOTE_LIMIT))}
      storeOption={storeOption}
      setStoreOption={setStoreOption}
      storeDisplayName={storeDisplayName}
      storeName={storeName}
      setStoreName={setStoreName}
      orderNumber={orderNumber}
      setOrderNumber={setOrderNumber}
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      onBack={onBack}
      onBuyNow={onBuyNow}
      onIWantThisToo={onIWantThisToo}
      ownerName={ownerName}
      host={host ?? "the seller"}
      moreItems={moreItems}
      onSelectItem={onSelectItem}
      onSeeAll={onSeeAll}
      available={available}
      submitting={submitting}
      showBuyNowForm={showBuyNowForm}
      onCloseBuyNowForm={() => setShowBuyNowForm(false)}
    />
  ) : (
    <MobileLayout
      item={item}
      price={priceLabel}
      buyUrl={buyUrl}
      marked={marked}
      onToggleMarked={handleMarkedChange}
      qty={qty}
      inc={inc}
      dec={dec}
      maxQuantity={maxQuantity}
      deliveredTo={deliveredTo}
      setDeliveredTo={setDeliveredTo}
      note={note}
      setNote={(value) => setNote(value.slice(0, NOTE_LIMIT))}
      storeOption={storeOption}
      setStoreOption={setStoreOption}
      storeDisplayName={storeDisplayName}
      storeName={storeName}
      setStoreName={setStoreName}
      orderNumber={orderNumber}
      setOrderNumber={setOrderNumber}
      canSubmit={canSubmit}
      onSubmit={onSubmit}
      onBack={onBack}
      onBuyNow={onBuyNow}
      onIWantThisToo={onIWantThisToo}
      ownerName={ownerName}
      moreItems={moreItems}
      onSelectItem={onSelectItem}
      onSeeAll={onSeeAll}
      available={available}
      submitting={submitting}
      eventTitle={eventTitle}
    />
  );

  const shouldShowCopySheet = Boolean(showCopySheet && isSignedIn);

  if (list && list.privacy === "private") {
    const isOwner =
      userId && list.user_id && String(list.user_id) === String(userId);
    if (!isSignedIn) {
      return (
        <Redirect
          href={{
            pathname: "/sign-in",
            params: { returnTo: encodeURIComponent(returnTo) },
          }}
        />
      );
    }
    if (!isOwner) {
      return (
        <View style={listStyles.container}>
          <View style={sharedStyles.loadingContainer}>
            <Text style={sharedStyles.privateTitle}>Private List</Text>
            <Text style={sharedStyles.privateBody}>
              Only the list owner can view these gift details.
            </Text>
          </View>
        </View>
      );
    }
  }

  return (
    <View style={isDesktop ? desktopStyles.root : mobileStyles.root}>
      {layout}

      <Modal
        visible={showLeaving}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLeaving(false)}
      >
        <Pressable onPress={() => setShowLeaving(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
            <Pressable onPress={() => setShowLeaving(false)}>
              <View style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2DAF0', marginBottom: 12 }} />
            </Pressable>
            <Text style={{ color: '#1C0335', fontSize: 38, fontFamily: 'Nunito_900Black', textAlign: 'center' }}>Leaving Yallawish</Text>
            <Text style={{ color: '#1C0335', textAlign: 'center', marginTop: 8 , fontFamily:'Nunito_700Bold'}}>
              You’re about to visit the seller’s site. After buying, come back and <Text style={{textDecorationLine:'underline'}}>mark this gift as purchased.</Text>
            </Text>
            <View style={modalStyles.redirectContainer}>
              <Text style={modalStyles.redirectLabel}>Redirecting to</Text>
              <Text style={modalStyles.redirectHost}>{host ?? "the seller"}</Text>
              <View style={{flexDirection:'row' , alignItems:'center', justifyContent:'center', gap:8}}>
                <Text style={modalStyles.redirectLabel}>You’ll be redirected in </Text>
                <Image source={require("@/assets/images/redirected.png")}/>
              </View>
              <Text style={modalStyles.countdown}>{countdown}s</Text>
            </View>
            <View style={modalStyles.buttonStack}>
              <Pressable
                onPress={() => {
                  if (buyUrl) Linking.openURL(buyUrl);
                  setShowLeaving(false);
                }}
                style={[modalStyles.primaryButton, !buyUrl && modalStyles.disabledButton]}
                disabled={!buyUrl}
              >
                <Text style={modalStyles.primaryButtonText}>Proceed Now</Text>
              </Pressable>
              <Pressable
                onPress={() => setShowLeaving(false)}
                style={modalStyles.secondaryButton}
              >
                <Text style={modalStyles.secondaryButtonText}>Stay Here</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <CopyToMyListSheet
        visible={shouldShowCopySheet}
        onClose={() => setShowCopySheet(false)}
        userId={userId ?? null}
        item={item}
        onAdd={handleCopy}
        onCreateNewList={() => {
          router.push({
            pathname: "/create-list-step1",
            params: { returnTo: encodeURIComponent(returnTo) },
          });
        }}
      />
    </View>
  );
}

type MobileLayoutProps = {
  item: GiftItemType;
  price: string | null;
  buyUrl?: string;
  marked: boolean;
  onToggleMarked: (value: boolean) => void;
  qty: number;
  inc: () => void;
  dec: () => void;
  maxQuantity: number;
  deliveredTo: "recipient" | "me";
  setDeliveredTo: (value: "recipient" | "me") => void;
  note: string;
  setNote: (value: string) => void;
  storeOption: StoreOption;
  setStoreOption: (value: StoreOption) => void;
  storeDisplayName: string;
  storeName: string;
  setStoreName: (value: string) => void;
  orderNumber: string;
  setOrderNumber: (value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
  onBack: () => void;
  onBuyNow: () => void;
  onIWantThisToo: () => void;
  ownerName: string;
  moreItems: GiftItemType[];
  onSelectItem: (id: string) => void;
  onSeeAll: () => void;
  available: number;
  submitting: boolean;
  eventTitle?: string
};

const MobileLayout: React.FC<MobileLayoutProps> = ({
  item,
  price,
  buyUrl,
  marked,
  onToggleMarked,
  qty,
  inc,
  dec,
  maxQuantity,
  deliveredTo,
  setDeliveredTo,
  note,
  setNote,
  storeOption,
  setStoreOption,
  storeDisplayName,
  storeName,
  setStoreName,
  orderNumber,
  setOrderNumber,
  canSubmit,
  onSubmit,
  onBack,
  onBuyNow,
  onIWantThisToo,
  ownerName,
  moreItems,
  onSelectItem,
  onSeeAll,
  available,
  submitting,
  eventTitle
}) => {
  const remainingChars = Math.max(0, NOTE_LIMIT - note.length);

  return (
    <View style={mobileStyles.container}>
        <LinearGradient
          colors={["#330065", "#45018ad7"]}
          locations={[0, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 2 }}
          style={mobileStyles.header}
        >
          <SafeAreaView edges={["top"]}>
            <View style={mobileStyles.headerContent}>
              <View style={mobileStyles.navigation}>
                <Pressable onPress={onBack} style={mobileStyles.backButton}>
                  <Image source={require("@/assets/images/backArrow.png")} />
                </Pressable>
                <Text style={mobileStyles.headerTitle} numberOfLines={1}>{eventTitle || item.name}</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ParallaxScrollView 
          headerHeight={211}
          contentPadding={0}
          gap={0}
          scrollContainerStyle={mobileStyles.scrollContent}
          contentStyle={mobileStyles.scrollBackgroundColor}
          headerImage={<Image source={item.image_url ? { uri: item.image_url } : FALLBACK_IMAGE} style={mobileStyles.productImage} resizeMode="cover" />
          
        }>
          <View style={mobileStyles.productCard}>
            <Text style={mobileStyles.productTitle}>{item.name}</Text>
            {price && <Text style={mobileStyles.productPrice}>{price}</Text>}

            <Text style={mobileStyles.productMeta}>
              Quantity: <Text>{String(item.quantity ?? 1).padStart(2, "0")}</Text>
            </Text>
            {item.description && (
              <Text numberOfLines={2} style={mobileStyles.productDescription}>
                Description: {item.description}
              </Text>
            )}

            <View style={mobileStyles.actionRow}>
              <Pressable style={mobileStyles.secondaryButton} onPress={onIWantThisToo}>
                <Text style={mobileStyles.secondaryButtonText}>I want this too</Text>
              </Pressable>
              <Pressable style={[mobileStyles.primaryButton, !buyUrl && mobileStyles.primaryButtonDisabled]} onPress={onBuyNow} disabled={!buyUrl}>
                <Text style={mobileStyles.primaryButtonText}>Buy now</Text>
              </Pressable>
            </View>
            {available <= 0 && <Text style={mobileStyles.notice}>This gift has already been fully claimed.</Text>}
          </View>
          <View style={mobileStyles.section}>
            <View style={{...mobileStyles.sectionCard, ...(!marked && { paddingBottom : 0 })}}>
              <View style={mobileStyles.didYouBuyThisGiftContainer}>
                <Text style={mobileStyles.didYouBuyThisGiftText}>Did you buy this gift?</Text>
              </View>
              {!marked && <View style={mobileStyles.didYouBuyThisGiftSeparator} />}
              
              <View style={mobileStyles.switchRow}>
                <Text style={mobileStyles.sectionTitle}>Mark as purchased</Text>
                <Switch value={marked} onValueChange={onToggleMarked} trackColor={{ false: "#D7CEE9", true: "#7C3AED" }} thumbColor="#FFFFFF" />
              </View>
              {marked && <View style={mobileStyles.didYouBuyThisGiftSeparator} />}
              {marked && (
                <View style={mobileStyles.markAsPurchasedSection}>
                  <Text style={mobileStyles.sectionLabel}>I bought</Text>
                  <View style={mobileStyles.stepper}>
                    <Pressable onPress={dec} disabled={qty <= 1} style={[mobileStyles.stepperButton, qty <= 1 && mobileStyles.stepperButtonDisabled]}>
                      <Text style={mobileStyles.stepperButtonText}>−</Text>
                    </Pressable>
                    <Text style={mobileStyles.stepperValue}>{String(qty).padStart(2, "0")}</Text>
                    <Pressable onPress={inc} disabled={qty >= maxQuantity} style={[mobileStyles.stepperButton, qty >= maxQuantity && mobileStyles.stepperButtonDisabled]}>
                      <Text style={mobileStyles.stepperButtonText}>+</Text>
                    </Pressable>
                  </View>

                  <Text style={mobileStyles.sectionLabel}>Delivered to</Text>
                  <View style={mobileStyles.radioGroup}>
                    <Pressable onPress={() => setDeliveredTo("recipient")} style={mobileStyles.radioRow}>
                      <Text style={mobileStyles.radioLabel}>{ownerName}</Text>
                      <View style={[mobileStyles.radioOuter, deliveredTo === "recipient" && mobileStyles.radioOuterActive]}>
                        {deliveredTo === "recipient" && <View style={mobileStyles.radioInnerActive} />}
                        </View>
                    </Pressable>
                    <Pressable onPress={() => setDeliveredTo("me")} style={mobileStyles.radioRow}>
                      <Text style={mobileStyles.radioLabel}>My home</Text>
                      <View style={[mobileStyles.radioOuter, deliveredTo === "me" && mobileStyles.radioOuterActive]}>{deliveredTo === "me" && <View style={mobileStyles.radioInnerActive} />}</View>
                    </Pressable>
                  </View>

                  <Text style={mobileStyles.sectionLabel}>Add a note</Text>
                  <View style={mobileStyles.noteField}>
                    <TextInput value={note} onChangeText={setNote} placeholder="Here’s a little gift to make your day better! 🎉" placeholderTextColor="#B1A6C4" multiline style={[mobileStyles.noteInput, {verticalAlign:"top", paddingTop:0}]} />
                    <Text style={mobileStyles.charCounter}>
                      {remainingChars}/{NOTE_LIMIT}
                    </Text>
                  </View>

                  <Text style={{...mobileStyles.sectionLabel, ...mobileStyles.didYouBuyThisGiftText}}>Where did you buy this?</Text>
                  <View style={mobileStyles.storeRow}>
                    <Pressable onPress={() => setStoreOption("suggested")} disabled={!buyUrl} style={[mobileStyles.storeOption, !buyUrl && mobileStyles.storeOptionDisabled]}>
                      <View style={[mobileStyles.radioOuter,storeOption === "suggested" && mobileStyles.radioOuterActive]}>{storeOption === "suggested" && <View style={mobileStyles.radioInnerActive} />}</View>
                      <Text style={[mobileStyles.storeOptionText, storeOption === "suggested" && mobileStyles.storeOptionTextActive]}>{storeDisplayName.toUpperCase()}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setStoreOption("custom");
                        if (!storeName || storeName === storeDisplayName) {
                          setStoreName("");
                        }
                      }}
                      style={[mobileStyles.storeOption, storeOption === "custom"]}
                    >
                      <View style={[mobileStyles.radioOuter, storeOption === "custom" && mobileStyles.radioOuterActive]}>{storeOption === "custom" && <View style={mobileStyles.radioInnerActive} />}</View>
                      <Text style={[mobileStyles.storeOptionText, storeOption === "custom" && mobileStyles.storeOptionTextActive]}>Another store</Text>
                    </Pressable>
                  </View>


                </View>
              )}
            </View>
            {
              marked && (
                <>
                  {storeOption === "custom" && (
                    <View style={mobileStyles.inputField}>
                      <Text style={mobileStyles.inputLabel}>Store Name</Text>
                      <View style={mobileStyles.inputWrapper}>
                        <TextInput
                          value={storeName}
                          onChangeText={setStoreName}
                          placeholder="Macy’s"
                          placeholderTextColor="#1C03351A"
                          style={mobileStyles.textInput}
                        />
                      </View>
                    </View>
                  )}

                  <View style={mobileStyles.inputField}>
                    <Text style={mobileStyles.inputLabel}>Order Number (if known)</Text>
                    <View style={mobileStyles.inputWrapper}>
                      <TextInput
                        value={orderNumber}
                        onChangeText={setOrderNumber}
                        placeholder="#123456789"
                        placeholderTextColor="#1C03351A"
                        style={mobileStyles.textInput}
                      />
                    </View>
                  </View>
                </>
              )
            }
          </View>
          {moreItems.length > 0 ? <View style={{height:4, backgroundColor:'#EFECF266'}} />  : null}
          
          {moreItems.length > 0 && (
            <View>
              <View style={{paddingHorizontal:16, paddingVertical: 24}}>
                <Text style={mobileStyles.moreTitle}>More items in this list</Text>
              </View>
              <ScrollView horizontal style={{paddingLeft:16, paddingVertical: 20}} contentContainerStyle={{gap:10}} >
                {moreItems?.map((entry) => (
                  <View key={String(entry._id)} style={mobileStyles.moreCard}>
                    <Image source={entry.image_url ? { uri: entry.image_url } : FALLBACK_IMAGE} style={mobileStyles.moreImage} resizeMode="cover" />
                    <View  style={mobileStyles.moreContent}>
                      <Text numberOfLines={2} style={mobileStyles.moreName}>{entry.name}</Text>
                      <View style={{flexDirection:'row' , justifyContent:'space-between'}}>
                        {entry.price != null && <Text style={mobileStyles.morePrice}>{formatPrice(entry.price, "") ?? ""}</Text>}
                        <Text style={mobileStyles.moreMeta}> {Number(entry.claimed ?? 0)} of {Number(entry.quantity ?? 1)} claimed </Text>
                      </View>
                    </View>
                     <Pressable style={[mobileStyles.moreItemsCardBuyNowButton]} onPress={() => onSelectItem(String(entry._id))}>
                      <Text style={mobileStyles.moreItemsCardBuyNowButtonText}>Buy Now</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>

              <Pressable style={mobileStyles.seeAll} onPress={onSeeAll}>
                <Text style={mobileStyles.seeAllText}>See all</Text>
              </Pressable>
            </View>
          )}

          <View style={{ height: 16 }} />
        </ParallaxScrollView>


      <View style={mobileStyles.submitBar}>
        <Pressable
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[
            mobileStyles.submitButton,
            (!canSubmit || submitting) && mobileStyles.submitButtonDisabled,
          ]}
        >
          <Text style={mobileStyles.submitButtonText}>
            {submitting ? "Submitting…" : "Submit"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

type DesktopLayoutProps = {
  item: GiftItemType;
  price: string | null;
  listTitle: string;
  buyUrl?: string;
  marked: boolean;
  onToggleMarked: (value: boolean) => void;
  qty: number;
  inc: () => void;
  dec: () => void;
  maxQuantity: number;
  deliveredTo: "recipient" | "me";
  setDeliveredTo: (value: "recipient" | "me") => void;
  note: string;
  setNote: (value: string) => void;
  storeOption: StoreOption;
  setStoreOption: (value: StoreOption) => void;
  storeDisplayName: string;
  storeName: string;
  setStoreName: (value: string) => void;
  orderNumber: string;
  setOrderNumber: (value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
  onBack: () => void;
  onBuyNow: () => void;
  onIWantThisToo: () => void;
  ownerName: string;
  host: string;
  moreItems: GiftItemType[];
  onSelectItem: (id: string) => void;
  onSeeAll: () => void;
  available: number;
  submitting: boolean;
  showBuyNowForm: boolean;
  onCloseBuyNowForm: () => void;
};

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  item,
  price,
  listTitle,
  buyUrl,
  marked,
  onToggleMarked,
  qty,
  inc,
  dec,
  maxQuantity,
  deliveredTo,
  setDeliveredTo,
  note,
  setNote,
  storeOption,
  setStoreOption,
  storeDisplayName,
  storeName,
  setStoreName,
  orderNumber,
  setOrderNumber,
  canSubmit,
  onSubmit,
  onBack,
  onBuyNow,
  onIWantThisToo,
  ownerName,
  host,
  moreItems,
  onSelectItem,
  onSeeAll,
  available,
  submitting,
  showBuyNowForm,
  onCloseBuyNowForm,
}) => {
  const remainingChars = Math.max(0, NOTE_LIMIT - note.length);

  if (showBuyNowForm) {
    return (
      <SafeAreaView style={desktopStyles.safeArea} edges={Platform.OS === "web" ? [] : ["top"]}>
        <ScrollView contentContainerStyle={desktopStyles.scrollContent}>
          <View style={desktopStyles.maxWidth}>
            <View style={desktopStyles.breadcrumbRow}>
              <Pressable style={desktopStyles.backPill} onPress={onCloseBuyNowForm}>
                <Ionicons name="chevron-back" size={18} color={COLORS.purple} />
                <Text style={desktopStyles.backPillText}>Back</Text>
              </Pressable>
              <Text style={desktopStyles.breadcrumbText}>
                Home / {listTitle} / Buy Now
              </Text>
            </View>

            <View style={desktopStyles.buyNowColumns}>
              <View style={desktopStyles.productSectionColumn}>
                <View style={desktopStyles.productImageContainer}>
                  <Image
                    source={item.image_url ? { uri: item.image_url } : FALLBACK_IMAGE}
                    style={desktopStyles.productImage}
                    resizeMode="contain"
                  />
                </View>
                <View style={desktopStyles.productBody}>
                  <View style={desktopStyles.productInfo}>
                    <Text style={desktopStyles.productTitle}>{item.name}</Text>
                    {price && <Text style={desktopStyles.productPrice}>{price}</Text>}
                    <Text style={desktopStyles.productMeta}>
                      Quantity: {String(item.quantity ?? 1).padStart(2, "0")}
                    </Text>
                    {item.description && (
                      <Text style={desktopStyles.productDescription}>{item.description}</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={desktopStyles.purchaseFormCard}>
                <Text style={desktopStyles.formTitle}>Please fill-up the details below</Text>

                <View style={desktopStyles.fieldBlock}>
                  <Text style={desktopStyles.fieldLabel}>I bought</Text>
                  <View style={desktopStyles.stepper}>
                    <Pressable
                      onPress={dec}
                      disabled={qty <= 1}
                      style={[
                        desktopStyles.stepperButton,
                        qty <= 1 && desktopStyles.stepperButtonDisabled,
                      ]}
                    >
                      <Text style={desktopStyles.stepperButtonText}>−</Text>
                    </Pressable>
                    <Text style={desktopStyles.stepperValue}>
                      {String(qty).padStart(2, "0")}
                    </Text>
                    <Pressable
                      onPress={inc}
                      disabled={qty >= maxQuantity}
                      style={[
                        desktopStyles.stepperButton,
                        qty >= maxQuantity && desktopStyles.stepperButtonDisabled,
                      ]}
                    >
                      <Text style={desktopStyles.stepperButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={desktopStyles.fieldBlock}>
                  <Text style={desktopStyles.fieldLabel}>Delivered to</Text>
                  <View style={desktopStyles.radioGroup}>
                    <Pressable
                      onPress={() => setDeliveredTo("recipient")}
                      style={desktopStyles.radioOption}
                    >
                      <View
                        style={[
                          desktopStyles.radioOuter,
                          deliveredTo === "recipient" && desktopStyles.radioOuterActive,
                        ]}
                      >
                        {deliveredTo === "recipient" && <View style={desktopStyles.radioInner} />}
                      </View>
                      <Text style={desktopStyles.radioLabel}>{ownerName}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setDeliveredTo("me")}
                      style={desktopStyles.radioOption}
                    >
                      <View
                        style={[
                          desktopStyles.radioOuter,
                          deliveredTo === "me" && desktopStyles.radioOuterActive,
                        ]}
                      >
                        {deliveredTo === "me" && <View style={desktopStyles.radioInner} />}
                      </View>
                      <Text style={desktopStyles.radioLabel}>My home</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={desktopStyles.fieldBlock}>
                  <Text style={desktopStyles.fieldLabel}>Add a note</Text>
                  <View style={desktopStyles.noteField}>
                    <TextInput
                      value={note}
                      onChangeText={setNote}
                      placeholder="Here's a little gift to make your day better! 🎉"
                      placeholderTextColor="#B1A6C4"
                      multiline
                      style={desktopStyles.noteInput}
                    />
                    <Text style={desktopStyles.charCounter}>
                      {remainingChars}/{NOTE_LIMIT}
                    </Text>
                  </View>
                </View>

                <View style={desktopStyles.fieldBlock}>
                  <Text style={desktopStyles.fieldLabel}>Where did you buy this?</Text>
                  <View style={desktopStyles.storeRow}>
                    <Pressable
                      onPress={() => setStoreOption("suggested")}
                      disabled={!buyUrl}
                      style={[
                        desktopStyles.storeOption,
                        storeOption === "suggested" && desktopStyles.storeOptionActive,
                        !buyUrl && desktopStyles.storeOptionDisabled,
                      ]}
                    >
                      <Text
                        style={[
                          desktopStyles.storeOptionText,
                          storeOption === "suggested" && desktopStyles.storeOptionTextActive,
                        ]}
                      >
                        {storeDisplayName.toUpperCase()}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setStoreOption("custom");
                        if (!storeName || storeName === storeDisplayName) {
                          setStoreName("");
                        }
                      }}
                      style={[
                        desktopStyles.storeOption,
                        storeOption === "custom" && desktopStyles.storeOptionActive,
                      ]}
                    >
                      <Text
                        style={[
                          desktopStyles.storeOptionText,
                          storeOption === "custom" && desktopStyles.storeOptionTextActive,
                        ]}
                      >
                        Another store
                      </Text>
                    </Pressable>
                  </View>
                  {storeOption === "custom" && (
                    <View style={desktopStyles.inputField}>
                      <Text style={desktopStyles.inputLabel}>Store name</Text>
                      <View style={desktopStyles.inputWrapper}>
                        <TextInput
                          value={storeName}
                          onChangeText={setStoreName}
                          placeholder="Macy's"
                          placeholderTextColor="#B1A6C4"
                          style={desktopStyles.textInput}
                        />
                      </View>
                    </View>
                  )}
                </View>

                <View style={desktopStyles.fieldBlock}>
                  <Text style={desktopStyles.inputLabel}>Order number (if known)</Text>
                  <View style={desktopStyles.inputWrapper}>
                    <TextInput
                      value={orderNumber}
                      onChangeText={setOrderNumber}
                      placeholder="#123456789"
                      placeholderTextColor="#B1A6C4"
                      style={desktopStyles.textInput}
                    />
                  </View>
                </View>

                <View style={desktopStyles.formActions}>
                  <Pressable style={desktopStyles.backButton} onPress={onCloseBuyNowForm}>
                    <Text style={desktopStyles.backButtonText}>Back</Text>
                  </Pressable>
                  <Pressable
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    style={[
                      desktopStyles.submitButton,
                      (!canSubmit || submitting) && desktopStyles.submitButtonDisabled,
                    ]}
                  >
                    <Text style={desktopStyles.submitButtonText}>
                      {submitting ? "Submitting…" : "Submit"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={desktopStyles.safeArea} edges={Platform.OS === "web" ? [] : ["top"]}>
      <ScrollView contentContainerStyle={desktopStyles.scrollContent}>
        <View style={desktopStyles.maxWidth}>
          <View style={desktopStyles.breadcrumbRow}>
            <Pressable style={desktopStyles.backPill} onPress={onBack}>
              <Ionicons name="chevron-back" size={18} color={COLORS.purple} />
              <Text style={desktopStyles.backPillText}>Back</Text>
            </Pressable>
            <Text style={desktopStyles.breadcrumbText}>
              Home / {listTitle} / Gift detail
            </Text>
          </View>

          <View style={desktopStyles.columns}>
            <View style={desktopStyles.productSection}>
              <View style={desktopStyles.productImageContainer}>
                <Image
                  source={item.image_url ? { uri: item.image_url } : FALLBACK_IMAGE}
                  style={desktopStyles.productImage}
                  resizeMode="contain"
                />
              </View>
              <View style={desktopStyles.productBody}>
                <View style={desktopStyles.productInfo}>
                  <Text style={desktopStyles.productTitle}>{item.name}</Text>
                  {price && <Text style={desktopStyles.productPrice}>{price}</Text>}
                  <Text style={desktopStyles.productMeta}>
                    Quantity: {String(item.quantity ?? 1).padStart(2, "0")}
                  </Text>
                  {item.description && (
                    <Text style={desktopStyles.productDescription}>{item.description}</Text>
                  )}
                </View>
                <View style={desktopStyles.productActions}>
                  <Pressable
                    onPress={onBuyNow}
                    disabled={!buyUrl}
                    style={[
                      desktopStyles.primaryButton,
                      !buyUrl && desktopStyles.primaryButtonDisabled,
                    ]}
                  >
                    <Text style={desktopStyles.primaryButtonText}>Buy now</Text>
                  </Pressable>
                  <Pressable style={desktopStyles.secondaryButton} onPress={onIWantThisToo}>
                    <Text style={desktopStyles.secondaryButtonText}>I want this too</Text>
                  </Pressable>
                </View>
                {available <= 0 && (
                  <Text style={desktopStyles.notice}>
                    This gift has already been fully claimed.
                  </Text>
                )}
              </View>
            </View>
          </View>

          {moreItems.length > 0 && (
            <View style={desktopStyles.moreSection}>
              <View style={desktopStyles.moreHeader}>
                <Text style={desktopStyles.moreTitle}>More items in this list</Text>
                <Pressable onPress={onSeeAll}>
                  <Text style={desktopStyles.moreSeeAll}>See all</Text>
                </Pressable>
              </View>
              <View style={desktopStyles.moreGrid}>
                {moreItems.map((entry) => (
                  <Pressable
                    key={String(entry._id)}
                    onPress={() => onSelectItem(String(entry._id))}
                    style={desktopStyles.moreCard}
                  >
                    <Image
                      source={entry.image_url ? { uri: entry.image_url } : FALLBACK_IMAGE}
                      style={desktopStyles.moreImage}
                      resizeMode="cover"
                    />
                    <View style={desktopStyles.moreBody}>
                      <Text style={desktopStyles.moreName}>{entry.name}</Text>
                      {entry.price != null && (
                        <Text style={desktopStyles.morePrice}>
                          {formatPrice(entry.price, "AED") ?? ""}
                        </Text>
                      )}
                      <Text style={desktopStyles.moreMeta}>
                        {Number(entry.claimed ?? 0)} of {Number(entry.quantity ?? 1)} claimed
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type CopyToMyListSheetProps = {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
  item: GiftItemType | null;
  onAdd: (targetListIds: string[]) => Promise<boolean>;
  onCreateNewList: () => void;
};

const CopyToMyListSheet: React.FC<CopyToMyListSheetProps> = ({
  visible,
  onClose,
  userId,
  item,
  onAdd,
  onCreateNewList,
}) => {
  const myLists = useQuery(
    api.products.getMyLists,
    userId ? ({ user_id: userId } as any) : "skip"
  ) as any[] | undefined;
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelected([]);
      setSaving(false);
    }
  }, [visible]);

  if (!visible || !item) return null;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    try {
      setSaving(true);
      const ok = await onAdd(selected);
      if (ok) {
        setSelected([]);
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const lists = myLists ?? [];
  const loading = myLists === undefined;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, maxHeight: '80%' }}>
          <Pressable onPress={onClose}>
            <View style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2DAF0', marginBottom: 12 }} />
          </Pressable>
          <Text style={{ color: '#1C0335', fontSize: 24, fontFamily: 'Nunito_700Bold' }}>Copy Item to your list</Text>
          <Text style={{ color: '#1C0335', marginTop: 6 , fontFamily: 'Nunito_400Regular'}}>Choose a list to add this item to</Text>

          <ScrollView  showsVerticalScrollIndicator={false}  style={sheetStyles.list} contentContainerStyle={{ paddingBottom: 16 }}>
            {loading ? (
              <View style={sheetStyles.emptyState}>
                <Text style={sheetStyles.emptyStateText}>Loading your lists…</Text>
              </View>
            ) : lists.length === 0 ? (
              <View style={sheetStyles.emptyState}>
                <Text style={sheetStyles.emptyStateText}>You don’t have any lists yet.</Text>
              </View>
            ) : (
              lists.map((entry) => {
                const occasion =  entry?.occasion ? occasionObj[String(entry?.occasion)] : occasionObj["birthday"]
                const id = String(entry._id);
                const checked = selected.includes(id);
                return (
                  <Pressable
                    key={id}
                    onPress={() => toggle(id)}
                    style={{...sheetStyles.listItem, borderLeftWidth:4, borderColor: occasion?.borderColor}}
                  >
                    <View style={sheetStyles.listLeft}>
                      <View style={sharedStyles.occasionIconContainer}>
                        <Image source={occasion.mobileIcon}/>
                      </View>
                      <View style={{width:'70%'}}>
                        <Text numberOfLines={1} style={sheetStyles.listTitle}>{entry.title || "Untitled list"}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        sheetStyles.checkbox,
                        checked && sheetStyles.checkboxChecked,
                      ]}
                    >
                      {checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>

          <View style={sheetStyles.actions}>
            <Pressable
              onPress={handleAdd}
              disabled={selected.length === 0 || saving}
              style={[
                sheetStyles.primary,
                (selected.length === 0 || saving) && sheetStyles.primaryDisabled,
              ]}
            >
              <Text style={sheetStyles.primaryText}>
                {saving ? "Adding…" : "Add to selected lists"}
              </Text>
            </Pressable>
            <Pressable onPress={onCreateNewList} style={sheetStyles.secondary}>
              <Text style={sheetStyles.secondaryText}>Create a new list</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const sharedStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  privateTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  privateBody: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  occasionIconContainer: {
    paddingHorizontal: 16,
  },
}) as Record<string, any>;

const mobileStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    minHeight: 108,
    justifyContent:'flex-end'
    // paddingBottom: 16,
  },
   headerContent: {
    paddingHorizontal: 16,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  
  backButton: {
  },
  headerTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
  },
  scrollContent: {
    paddingBottom: 32,
    backgroundColor: "#FFFFFF",
  },
  scrollBackgroundColor : {
    backgroundColor: "#FFFFFF",
  },
  productCard: {
    backgroundColor: COLORS.background,
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 211,
    backgroundColor: COLORS.surface,
  },
  productTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 23,
    letterSpacing: 0
  },
  productPrice: {
    color: '#1C0335',
    fontFamily: "Nunito_900Black",
    fontSize: 16,
    marginTop: 23,
  },
  productMeta: {
    color: '#007AFF',
    fontFamily: "Nunito_700Bold",
    marginTop: 16,
    fontSize: 14
  },

  productDescription: {
    color: '#8E8E93',
    marginTop: 16,
    lineHeight: 22,
    fontFamily: "Nunito_500Medium",
    letterSpacing: -0.1,
    fontSize: 13
  },
  actionRow: {
    flexDirection: "row",
    gap: 7.52,
    marginTop: 32,
  },
  primaryButton: {
    flex: 1,
    height: 60,
    borderRadius: 7.52,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 60,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 15.04,
  },
  notice: {
    marginTop: 14,
    color: COLORS.accent,
    fontFamily: "Nunito_600SemiBold",
  },
  section: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  sectionCard: {
    backgroundColor: "#F8F7FA",
    borderRadius: 8,
    paddingBottom: 20,
  },
  didYouBuyThisGiftContainer: {
    // backgroundColor:'red'
    paddingVertical: 16
  },
  didYouBuyThisGiftText: {
    textAlign:'center',
    color: '#1C1C1C',
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
  },
  didYouBuyThisGiftSeparator: {backgroundColor:'#FFFFFF' , height:3 },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
  },
  markAsPurchasedSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionLabel: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_600SemiBold",
    marginTop: 18,
    marginBottom: 8,
  },
  stepper: {
    backgroundColor:'#F2F2F7',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 56,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
  },
  stepperValue: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
  },
  radioGroup: {
    gap: 14,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between',
    gap: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    backgroundColor:"#ffff",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: COLORS.purple,
    backgroundColor: COLORS.purple,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: COLORS.purple,
  },
  radioInnerActive: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#ffff',
  },
  radioLabel: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 16
  },
  noteField: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 14,
    minHeight: 110,
    
  },
  noteInput: {
    color: COLORS.textPrimary,
    minHeight: 60,
    fontFamily: "Nunito_500Medium",
  },
  charCounter: {
    textAlign: "right",
    color: "#B1A6C4",
    marginTop: 6,
  },
  storeRow: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  storeOption: {
    flex: 1,
    height: 90.9,
    borderRadius: 8.08,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    rowGap: 10
  },
  storeOptionActive: {
    borderColor: COLORS.purple,
    backgroundColor: "#ECE6FF",
  },
  storeOptionDisabled: {
    opacity: 0.4,
  },
  storeOptionText: {
    fontSize: 16,
    color: '#1C1C1C',
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  storeOptionTextActive: {
    color: COLORS.purple,
  },
  inputField: {
    marginTop: 16,
  },
  inputLabel: {
    color:  '#AEAEB2',
    fontFamily: "Nunito_500Medium",
    marginBottom: 6,
    fontSize: 16
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
    justifyContent: "center",
    // backgroundColor: COLORS.background,
  },
  textInput: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_500Medium",
  },

  moreTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 17.49,
  },
  moreCard: {

     backgroundColor: "#ffffff",
      borderRadius: 8.16,
      padding: 8,
      alignItems: "center",
      gap: 14,
      // iOS shadow
      shadowColor: "#000000",
      shadowOpacity: 0.1,  
      shadowRadius: 19.73,
      shadowOffset: { width: 0, height: 0 },

      // Android shadow
      elevation: 8,       
      width: 175,
  },
  moreImage: {
    width: '100%',
    height: 88.07,
    borderRadius: 8.16,
    backgroundColor: COLORS.surface,
  },
  moreContent: {
    flex: 1,
    gap: 8.16,
  },
  moreName: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_400Regular",
    fontSize: 14.08,
  },
  morePrice: {
    color: '#1C0335',
    fontFamily: "Nunito_700Bold",
    fontSize: 11.37,
  },
  moreItemsCardBuyNowButton: {
    width:'100%',
    backgroundColor:'#007AFF',
    borderRadius: 5.1,
    height: 43,
    justifyContent:'center',
    alignItems:'center'
  },
  moreItemsCardBuyNowButtonText:{
    fontFamily: "Nunito_700Bold",
    fontSize: 16.32,
    color:'#ffff'
  },
  moreMeta: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_400Regular",
    fontSize: 10,
  },
  seeAll: {
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  seeAllText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
  },
  submitBar: {
    padding: 16,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: "#EDE4FF",
    backgroundColor: COLORS.background,
  },
  submitButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
}) as Record<string, any>;

const desktopStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    alignItems: "center",
  },
  maxWidth: {
    width: "100%",
    maxWidth: 1120,
    paddingHorizontal: 32,
    paddingTop: 32,
    alignSelf: "center",
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ECE4FF",
  },
  backPillText: {
    color: COLORS.purple,
    fontFamily: "Nunito_600SemiBold",
  },
  breadcrumbText: {
    flex: 1,
    textAlign: "right",
    marginLeft: 16,
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
  },
  columns: {
    width: "100%",
  },
  buyNowColumns: {
    flexDirection: "row",
    gap: 32,
    alignItems: "flex-start",
    width: "100%",
  },
  purchaseFormCard: {
    flex: 1,
    flexShrink: 0,
    padding: 32,
    minWidth: 400,
  },
  formTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    marginBottom: 24,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    justifyContent: "space-between",
  },
  backButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    minWidth: 100,
  },
  backButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  productSection: {
    flexDirection: "row",
    gap: 32,
    alignItems: "flex-start",
    flex: 1,
    minWidth: 0,
  },
  productSectionColumn: {
    flexDirection: "column",
    gap: 24,
    alignItems: "flex-start",
    flex: 1,
    minWidth: 0,
  },
  productImageContainer: {
    width: 400,
    height: 400,
    flexShrink: 1,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 300,
    maxWidth: 400,
    alignSelf: "stretch",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productBody: {
    flex: 1,
    gap: 24,
    justifyContent: "flex-start",
    minWidth: 200,
    paddingLeft: 0,
    flexShrink: 1,
  },
  productInfo: {
    gap: 0,
    flex: 1,
  },
  productTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 28,
    lineHeight: 36,
    marginTop: 82,
    marginBottom: 4,
  },
  productPrice: {
    color: COLORS.accent,
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    marginBottom: 8,
  },
  productMeta: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 16,
    marginBottom: 12,
  },
  productDescription: {
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    marginBottom: 4,
  },
  productActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    width: "100%",
  },
  primaryButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 214,
    flex: 1,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  secondaryButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    maxWidth: 214,
    flex: 1,
  },
  secondaryButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  detailCard: {
    width: 400,
    flexShrink: 0,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: 28,
    shadowColor: "#200A40",
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  detailTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 26,
  },
  detailSubtitle: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
    marginTop: 6,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#F4EEFF",
  },
  toggleButtonActive: {
    borderColor: COLORS.purple,
    backgroundColor: "#E8DEFF",
  },
  toggleButtonText: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_600SemiBold",
  },
  toggleButtonTextActive: {
    color: COLORS.purple,
  },
  fieldBlock: {
    marginTop: 20,
  },
  fieldLabel: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_600SemiBold",
    marginBottom: 10,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 60,
    gap: 16,
  },
  stepperButton: {
    width: 46,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EEE6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
  },
  stepperValue: {
    flex: 1,
    textAlign: "center",
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: COLORS.purple,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple,
  },
  radioLabel: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_600SemiBold",
  },
  noteField: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    backgroundColor: COLORS.background,
  },
  noteInput: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_500Medium",
    minHeight: 80,
  },
  charCounter: {
    color: "#B1A6C4",
    textAlign: "right",
    marginTop: 8,
  },
  storeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  storeOption: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  storeOptionActive: {
    borderColor: COLORS.purple,
    backgroundColor: "#ECE4FF",
  },
  storeOptionDisabled: {
    opacity: 0.4,
  },
  storeOptionText: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
  },
  storeOptionTextActive: {
    color: COLORS.purple,
  },
  inputField: {
    marginTop: 14,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontFamily: "Nunito_500Medium",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  textInput: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_500Medium",
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    minWidth: 100,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
  notice: {
    marginTop: 14,
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
  },
  moreSection: {
    marginTop: 40,
    gap: 20,
  },
  moreHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  moreTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
  },
  moreSeeAll: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
  },
  moreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  moreCard: {
    flexBasis: "48%",
    maxWidth: "48%",
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#15072C",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  moreImage: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  moreBody: {
    marginTop: 12,
    gap: 6,
  },
  moreName: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  morePrice: {
    color: COLORS.accent,
    fontFamily: "Nunito_700Bold",
  },
  moreMeta: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
    fontSize: 13,
  },
}) as Record<string, any>;

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
  },
  handle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E2DAF0",
    marginBottom: 18,
  },
  sheetTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    textAlign: "center",
  },
  sheetBody: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  redirectContainer: {
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  redirectLabel: {
    color: '#1C0335',
    fontFamily: "Nunito_700Bold",
    fontSize: 19.6
  },
  redirectHost: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
  },
  countdown: {
    color: '#1C0335',
    fontFamily: "Nunito_700Bold",
    fontSize: 39.2,
  },
  buttonStack: {
    marginTop: 22,
    gap: 16,
  },
  primaryButton: {
    height: 56,
    borderRadius: 7.29,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 14.5,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 7.29,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 14.5,
  },
}) as Record<string, any>;

const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: "80%",
  },
  handle: {
    alignSelf: "center",
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#E2DAF0",
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
    marginTop: 6,
  },
  list: {
    marginTop: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  listAccent: {
    width: 6,
    height: 32,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  listTitle: {
    color: COLORS.textPrimary,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: COLORS.purple,
    borderColor: COLORS.purple,
  },
  emptyState: {
    paddingVertical: 20,
  },
  emptyStateText: {
    color: COLORS.textSecondary,
    fontFamily: "Nunito_500Medium",
  },
  actions: {
    gap: 12,
    paddingTop: 16
  },
  primary: {
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  secondary: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  secondaryText: {
    color: COLORS.purple,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
}) as Record<string, any>;
