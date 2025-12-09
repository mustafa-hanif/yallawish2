import ActionBar from "@/components/wishlists/ActionBar";
import WishListing from "@/components/wishlists/Listing";
import NoListFound from "@/components/wishlists/NoListFound";
import Tabs from "@/components/wishlists/Tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlists = () => {
  const { user } = useUser();
  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");
  console.log("myLists", myLists);
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  const [currentTab, setCurrentTab] = useState<string>("my-events");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>("default");
  const [filterBy, setFilterBy] = useState<string | null>("upcomingEvents");

  const [appliedSortBy, setAppliedSortBy] = useState<string | null>("default");
  const [appliedFilterBy, setAppliedFilterBy] = useState<string | null>("upcomingEvents");

  const [search, setSearch] = useState("");

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
  const wishList = myLists;
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
          {wishList && wishList?.length ? (
            <>
              <ActionBar appliedSortBy={appliedSortBy} setAppliedSortBy={setAppliedSortBy} appliedFilterBy={appliedFilterBy} setAppliedFilterBy={setAppliedFilterBy} search={search} setSearch={setSearch} handleToggleModal={handleToggleModal} />
              <WishListing wishList={searchList(myLists as any[])} />
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
                { key: "default", label: "Default" },
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
