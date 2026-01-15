import { RibbonHeader } from "@/components/RibbonHeader";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, ListCover, PasswordGate } from "@/components/list";
import BottomSheet from "@/components/ui/BottomSheet";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { formatLastUpdated, getDaysToGoText } from "@/utils";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import * as Linking from "expo-linking";
import { Redirect, useLocalSearchParams, usePathname } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, Modal, Platform, Pressable, Share, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const DESKTOP_BREAKPOINT = 1024;

export default function ViewList() {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;

  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const { isSignedIn, userId } = useAuth();
  const pathname = usePathname();
  const list = useQuery(api.products.getListById, { listId: listId as any });
  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");
  const requestPassword = useMutation(api.products.requestListPassword);
  const shares = useQuery(api.products.getListShares as any, listId ? ({ list_id: listId } as any) : "skip");
  const loading = !list;

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";
  const shareCount = Array.isArray(shares) ? shares.length : undefined;
  const occasion = list?.occasion || "";
  const creator = list?.creator || null;

  const daysToGoText = useMemo(() => {
    return getDaysToGoText(list?.eventDate);
  }, [list?.eventDate]);

  // Password gate
  const requiresPassword: boolean = Boolean((list as any)?.requiresPassword);
  const [unlocked, setUnlocked] = useState(false);

  // Sort & Filter sheet state
  type SortOption = "default" | "priceAsc" | "priceDesc" | "newest" | "oldest";
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [tempSortBy, setTempSortBy] = useState<SortOption>("default");
  const [filterClaimed, setFilterClaimed] = useState(false);
  const [filterUnclaimed, setFilterUnclaimed] = useState(false);
  const [tempFilterClaimed, setTempFilterClaimed] = useState(false);
  const [tempFilterUnclaimed, setTempFilterUnclaimed] = useState(false);

  // Enforce private access: only owner may view
  if (list && privacy === "private") {
    const isOwner = userId && list.user_id && String(userId) === String(list.user_id);
    const qs = listId ? `?listId=${encodeURIComponent(String(listId))}` : "";
    const returnTo = `${pathname}${qs}`;
    if (!isSignedIn) {
      // Redirect unauthenticated users to sign-in, preserving returnTo
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
      // Signed-in but not the owner: show simple private notice
      return (
        <View style={styles.container}>
          <HeaderBar title="Private List" />
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito_700Bold",
                color: "#1C0335",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              This list is private and only visible to its owner.
            </Text>
          </View>
        </View>
      );
    }
  }

  if (requiresPassword && !unlocked) {
    return (
      <PasswordGate
        title={title}
        listId={listId ?? null}
        requiresPassword={requiresPassword}
        passwordValue={(list as any)?.password ?? null}
        onUnlocked={() => setUnlocked(true)}
        onRequestPassword={async (data) => {
          try {
            if (!listId) return;
            await requestPassword({
              list_id: listId as any,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            } as any);
          } catch (e) {
            console.error("Failed to submit password request", e);
          }
        }}
      />
    );
  }

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
    const [y, m, d] = parts;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1);
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

  const handleShare = async () => {
    try {
      if (!listId) return;
      let url = "";
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const origin = window.location?.origin || "";
        const qs = `listId=${encodeURIComponent(String(listId))}`;
        url = `${origin}/view-list?${qs}`;
      } else {
        url = Linking.createURL("view-list", {
          queryParams: { listId: String(listId) },
        });
      }
      await Share.share({ message: url, url });
    } catch (e) {
      console.warn("Share failed", e);
    }
  };

  const lastUpdatedLabel = `Last updated: ${formatLastUpdated(list?.updated_at)}`;

  const visibleItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    let arr = [...items];

    // Availability filters
    if (filterClaimed && !filterUnclaimed) {
      arr = arr.filter((i: any) => (i.claimed ?? 0) > 0);
    } else if (!filterClaimed && filterUnclaimed) {
      arr = arr.filter((i: any) => (i.claimed ?? 0) === 0);
    }

    // Sorting
    switch (sortBy) {
      case "priceAsc":
        arr.sort((a: any, b: any) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "priceDesc":
        arr.sort((a: any, b: any) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "newest":
        arr.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        arr.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        break;
    }

    return arr;
  }, [items, sortBy, filterClaimed, filterUnclaimed]);

  return (
    <View style={styles.container}>
      <HeaderBar title={title} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover occasion={occasion} imageUri={coverUri} overlayText={String(daysToGoText || "")} creator={creator} />
        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} occasion={occasion} />
        </View>
        <ActionsBar sortby={sortBy} filterClaimed={filterClaimed} filterUnclaimed={filterUnclaimed} onFilterPress={() => setShowSortSheet(true)} isViewMode privacy={privacy} loading={loading} address={(list?.shippingAddress as string | undefined) ?? null} shareCount={shareCount} />

        <View style={styles.addGiftSection}>{Array.isArray(visibleItems) && visibleItems.length > 0 ? visibleItems.map((item: any) => <GiftItemCard swipe={false} key={item._id} item={item} />) : <Text style={{ textAlign: "center", color: "#8E8E93" }}>No gifts yett.</Text>}</View>

        {/* <InfoBox>
          View only mode. Ask the list owner to share edit access if you need to add items.
        </InfoBox> */}
      </ScrollView>

      {isDesktop ? (
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
                  { key: "default", label: "Default" },
                  { key: "priceAsc", label: "Price Lowest - Highest" },
                  { key: "priceDesc", label: "Price Highest - Lowest" },
                  { key: "newest", label: "Most Recent to Oldest" },
                  { key: "oldest", label: "Oldest to Most Recent" },
                ].map((o) => (
                  <Pressable key={o.key} style={styles.radioRow} onPress={() => setTempSortBy(o.key as SortOption)}>
                    <View style={[styles.radioOuter, tempSortBy === o.key && styles.radioOuterActive]}>{tempSortBy === o.key && <View style={styles.radioInner} />}</View>
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
                  <View style={[styles.checkboxBox, tempFilterClaimed && styles.checkboxBoxActive]}>{tempFilterClaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}</View>
                  <Text style={styles.radioLabel}>Claimed</Text>
                </Pressable>
                <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed((v) => !v)}>
                  <View style={[styles.checkboxBox, tempFilterUnclaimed && styles.checkboxBoxActive]}>{tempFilterUnclaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}</View>
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
      ) : (
        <BottomSheet isVisible={showSortSheet} onClose={() => setShowSortSheet(false)}>
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
                  <View style={[styles.radioOuter, tempSortBy === o.key && styles.radioOuterActive]}>{tempSortBy === o.key && <View style={styles.radioInner} />}</View>
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
                <View style={[styles.checkboxBox, tempFilterClaimed && styles.checkboxBoxActive]}>{tempFilterClaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}</View>
                <Text style={styles.radioLabel}>Claimed</Text>
              </Pressable>
              <Pressable style={styles.radioRow} onPress={() => setTempFilterUnclaimed((v) => !v)}>
                <View style={[styles.checkboxBox, tempFilterUnclaimed && styles.checkboxBoxActive]}>{tempFilterUnclaimed && <Ionicons name="checkmark" size={10} color="#FFFFFF" />}</View>
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
        </BottomSheet>
      )}

      <FooterBar viewMode lastUpdated={lastUpdatedLabel} onShare={handleShare} onManage={() => {}} manageLabel="Close" />
    </View>
  );
}
