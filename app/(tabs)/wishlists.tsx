import ActionBar from "@/components/wishlists/ActionBar";
import DeleteConfirmation from "@/components/wishlists/DeleteConfirmationModal";
import WishListing from "@/components/wishlists/Listing";
import NoListFound from "@/components/wishlists/NoListFound";
import Tabs from "@/components/wishlists/Tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlists = () => {
  const { user } = useUser();
  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");
  const communityLists = useQuery(api.products.getCommunityLists, user?.id ? { exclude_user_id: user.id } : "skip");
  const deleteList = useMutation(api.products.deleteList);
  
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const pathname = usePathname();

  const [currentTab, setCurrentTab] = useState<string>("my-events");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>("default");
  const [filterBy, setFilterBy] = useState<string | null>(null);

  const [appliedSortBy, setAppliedSortBy] = useState<string | null>("default");
  const [appliedFilterBy, setAppliedFilterBy] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [deleteListId, setDeleteListId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTab("my-events");
  }, [pathname]);

  useEffect(() => {
    setShowSortSheet(false);
    setSortBy("default");
    setFilterBy(null);
    setAppliedSortBy("default");
    setAppliedFilterBy(null);
    setSearch("");
  }, [currentTab]);

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const handleToggleModal = () => setShowSortSheet((prev) => !prev);

  const searchList = (arr: any[] = []) => {
    const q = search.trim().toLowerCase();
    if (!q) return arr;
    return arr.filter((item) => item.title.toLowerCase().includes(q));
  };

  const handleClickApply = () => {
    setAppliedSortBy(sortBy);
    setAppliedFilterBy(filterBy);
    handleToggleModal();
  };
  const wishList = currentTab === "community-events" ? communityLists : myLists;

  const sortedWishList = useMemo(() => {
    const arr = Array.isArray(wishList) ? [...wishList] : [];
    const key = appliedSortBy;
    if (!arr.length) return arr;
    if (!key || key === "default") return arr;

    if (key === "dateOfEvent") {
      return arr.sort((a: any, b: any) => {
        const da = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
        const db = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
        return da - db;
      });
    }

    if (key === "alphabetically") {
      return arr.sort((a: any, b: any) => String(a.title || "").localeCompare(String(b.title || "")));
    }

    if (key === "percentage") {
      return arr.sort((a: any, b: any) => {
        const pa = a?.totalItems ? (a.totalClaimed || 0) / a.totalItems : 0;
        const pb = b?.totalItems ? (b.totalClaimed || 0) / b.totalItems : 0;
        return pb - pa; // higher completion first
      });
    }

    if (key === "totalItems") {
      return arr.sort((a: any, b: any) => (b.totalItems || 0) - (a.totalItems || 0));
    }

    return arr;
  }, [wishList, appliedSortBy]);

  const filteredWishList = useMemo(() => {
    const arr = Array.isArray(sortedWishList) ? [...sortedWishList] : [];
    const key = appliedFilterBy;
    if (!arr.length) return arr;
    if (!key) return arr;

    const now = Date.now();

    if (key === "pastEvents") {
      return arr
        .filter((item: any) => {
          const t = item?.eventDate ? new Date(item.eventDate).getTime() : (item?._creationTime ?? 0);
          return t < now;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return tb - ta; // newest past first
        });
    }

    if (key === "upcomingEvents") {
      return arr
        .filter((item: any) => {
          const t = item?.eventDate ? new Date(item.eventDate).getTime() : (item?._creationTime ?? 0);
          return t >= now;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return ta - tb; // soonest first
        });
    }

    if (key === "completed") {
      return arr
        .filter((item: any) => {
          const total = item?.totalItems || 0;
          const claimed = item?.totalClaimed || 0;
          return total > 0 && claimed >= total;
        })
        .sort((a: any, b: any) => {
          const ta = a?.eventDate ? new Date(a.eventDate).getTime() : (a?._creationTime ?? 0);
          const tb = b?.eventDate ? new Date(b.eventDate).getTime() : (b?._creationTime ?? 0);
          return tb - ta; // recent completed first
        });
    }

    if (key === "inComplete") {
      return arr
        .filter((item: any) => {
          const left = (item?.totalItems || 0) - (item?.totalClaimed || 0);
          return left > 0;
        })
        .sort((a: any, b: any) => {
          const la = (a?.totalItems || 0) - (a?.totalClaimed || 0);
          const lb = (b?.totalItems || 0) - (b?.totalClaimed || 0);
          return lb - la; // most items left first
        });
    }

    return arr;
  }, [sortedWishList, appliedFilterBy]);

  const handleSelectDelete = (listId: string) => setDeleteListId(listId);
  const handleDeleteList = async (listId: string | null) => {
    await deleteList({ listId: listId as any });
    setDeleteListId(null);
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        <LinearGradient colors={["#330065", "#45018ad7"]} style={styles.header} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.headerContent}>
              <View style={styles.navigation}>
                <Pressable onPress={handleBack} style={styles.backButton}>
                  <Image source={require("@/assets/images/backArrow.png")} />
                </Pressable>
                <Text style={styles.headerTitle}>Wishlists</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
        <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <View style={styles.content}>
          {filteredWishList && filteredWishList?.length ? (
            <>
              <ActionBar appliedSortBy={appliedSortBy} setAppliedSortBy={setAppliedSortBy} appliedFilterBy={appliedFilterBy} setAppliedFilterBy={setAppliedFilterBy} search={search} setSearch={setSearch} handleToggleModal={handleToggleModal} />
              <WishListing wishList={searchList(filteredWishList as any[])} onSelectDelete={handleSelectDelete} />
            </>
          ) : (
            <NoListFound currentTab={currentTab} />
          )}
        </View>
      </View>
      <Modal visible={showSortSheet} transparent animationType="fade" onRequestClose={handleToggleModal}>
        <Pressable style={styles.backdrop} onPress={handleToggleModal} />
        <View style={styles.sortSheetContainer}>
          <Pressable onPress={handleToggleModal}>
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
                { key: "default", label: "Date Created (Default)" },
                { key: "dateOfEvent", label: "Date of Event" },
                { key: "alphabetically", label: "Alphabetically" },
                { key: "percentage", label: "List Completion %" },
                { key: "totalItems", label: "Total Items" },
              ].map((o) => (
                <Pressable key={o.key} style={styles.radioRow} onPress={() => setSortBy(o.key)}>
                  <View style={[styles.radioOuter, sortBy === o.key && styles.radioOuterActive]}>{sortBy === o.key && <View style={styles.radioInner} />}</View>
                  <Text style={styles.radioLabel}>{o.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.sortSection}>
              <View style={styles.sortSectionHeader}>
                <Text style={styles.sortSectionTitle}>Filter by</Text>
                <Ionicons name="chevron-down" size={20} color="#1C0335" />
              </View>
              {[
                { key: "pastEvents", label: "Past Events" },
                { key: "upcomingEvents", label: "Upcoming Events" },
                { key: "completed", label: "Completed" },
                { key: "inComplete", label: "Incomplete" },
              ].map((o) => (
                <Pressable key={o.key} style={styles.radioRow} onPress={() => setFilterBy(o.key)}>
                  <View style={[styles.radioOuter, filterBy === o.key && styles.radioOuterActive]}>{filterBy === o.key && <View style={styles.radioInner} />}</View>
                  <Text style={styles.radioLabel}>{o.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.sortScrollSpacer} />
          </ScrollView>
          <View style={styles.applyBarWrapper}>
            <Pressable style={styles.applyBtnFull} onPress={handleClickApply}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <DeleteConfirmation visible={!!deleteListId} onCancel={() => setDeleteListId(null)} onDelete={() => handleDeleteList(deleteListId)} />
    </>
  );
};

export default Wishlists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 108,
    justifyContent: "flex-end",
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
  backButton: {},
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  sortSheetContainer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#FFFFFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: "80%" },

  sortSheetHandle: { width: 64, height: 6, borderRadius: 3, backgroundColor: "#C7C7CC", alignSelf: "center", marginTop: 12 },

  sortSheetContent: { paddingBottom: 32, paddingHorizontal: 32, paddingTop: 8, gap: 24 },
  sortSheetTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#1C0335", textAlign: "center", marginTop: 24 },
  sortDivider: { height: 1, backgroundColor: "#E5E5EA" },
  sortSection: { gap: 12 },
  sortSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  sortSectionTitle: { fontSize: 20, fontFamily: "Nunito_900Black", color: "#1C0335" },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 22, paddingVertical: 8 },
  radioOuter: { width: 24, height: 24, borderRadius: 22, borderWidth: 2, borderColor: "#D5D2DA", alignItems: "center", justifyContent: "center" },
  radioOuterActive: { borderColor: "#360068", backgroundColor: "#360068" },
  radioInner: { width: 10, height: 10, borderRadius: 9, backgroundColor: "#ffff" },
  radioLabel: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#1C1C1C" },
  checkboxBox: { width: 24, height: 24, borderRadius: 22, borderWidth: 2, borderColor: "#D5D2DA", alignItems: "center", justifyContent: "center" },
  checkboxBoxActive: { borderColor: "#360068", backgroundColor: "#360068" },
  applyBarWrapper: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E5E5EA" },
  applyBtnFull: { backgroundColor: "#360068", height: 56, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  applyBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_700Bold" },
  sortScrollSpacer: { height: 120 },
});
