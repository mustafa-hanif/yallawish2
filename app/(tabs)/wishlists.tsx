import ActionBar from "@/components/wishlists/ActionBar";
import WishListing from "@/components/wishlists/Listing";
import NoListFound from "@/components/wishlists/NoListFound";
import Tabs from "@/components/wishlists/Tabs";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlists = () => {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  const [currentTab, setCurrentTab] = useState<string>("my-events");

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const wishList = [
    {
      id: "event-001",
      title: "Raghavendra Suryadev Birthday",
      date: "Dec 27, 2026",
      totalItems: 2,
      claimedItems: 1, // Random claimed value
      occasionType: "birthday",
    },
    {
      id: "event-002",
      title: "Sister’s Wedding",
      date: "Jan 13, 2027",
      totalItems: 6,
      claimedItems: 4, // Random claimed value
      occasionType: "wedding",
    },
    {
      id: "event-003",
      title: "John's Wedding",
      date: "Jun 01, 2029",
      totalItems: 2,
      claimedItems: 1, // Random claimed value
      occasionType: "wedding",
    },
    {
      id: "event-004",
      title: "Sara’s Graduation",
      date: "Oct 02, 2026",
      totalItems: 12,
      claimedItems: 8, // Random claimed value
      occasionType: "graduation",
    },
    {
      id: "event-005",
      title: "Grandfather’s Engagement",
      date: "Nov 23, 2025",
      totalItems: 10,
      claimedItems: 6, // Random claimed value
      occasionType: "other",
    },
    {
      id: "event-006",
      title: "Raghavendra Suryadev Wedding",
      date: "Aug 14, 2026",
      totalItems: 2,
      claimedItems: 1, // Random claimed value
      occasionType: "wedding",
    },
    {
      id: "event-007",
      title: "Alice's Baby Shower",
      date: "Mar 10, 2027",
      totalItems: 15,
      claimedItems: 8, // Random claimed value
      occasionType: "baby-shower",
    },
    {
      id: "event-008",
      title: "David's Retirement",
      date: "Dec 05, 2025",
      totalItems: 10,
      claimedItems: 5, // Random claimed value
      occasionType: "retirement",
    },
    {
      id: "event-009",
      title: "New Home Celebration",
      date: "May 18, 2026",
      totalItems: 8,
      claimedItems: 3, // Random claimed value
      occasionType: "new-home",
    },
    {
      id: "event-010",
      title: "Emma's Graduation",
      date: "Jun 15, 2026",
      totalItems: 12,
      claimedItems: 6, // Random claimed value
      occasionType: "graduation",
    },
    {
      id: "event-011",
      title: "Chris's Wedding Anniversary",
      date: "Sep 07, 2027",
      totalItems: 8,
      claimedItems: 4, // Random claimed value
      occasionType: "wedding",
    },
    {
      id: "event-012",
      title: "Sophia's Birthday Bash",
      date: "Oct 10, 2027",
      totalItems: 10,
      claimedItems: 7, // Random claimed value
      occasionType: "birthday",
    },
    {
      id: "event-013",
      title: "Michael’s Baby Shower",
      date: "Apr 04, 2027",
      totalItems: 18,
      claimedItems: 10, // Random claimed value
      occasionType: "baby-shower",
    },
    {
      id: "event-014",
      title: "Jack's New Home",
      date: "Feb 12, 2026",
      totalItems: 10,
      claimedItems: 5, // Random claimed value
      occasionType: "new-home",
    },
    {
      id: "event-015",
      title: "Sophie's Retirement Party",
      date: "Nov 15, 2026",
      totalItems: 14,
      claimedItems: 9, // Random claimed value
      occasionType: "retirement",
    },
    {
      id: "event-016",
      title: "Mason's Wedding",
      date: "Jul 07, 2028",
      totalItems: 18,
      claimedItems: 12, // Random claimed value
      occasionType: "wedding",
    },
    {
      id: "event-017",
      title: "Liam’s Graduation Ceremony",
      date: "Dec 01, 2026",
      totalItems: 16,
      claimedItems: 10, // Random claimed value
      occasionType: "graduation",
    },
    {
      id: "event-018",
      title: "Olivia's New Home Party",
      date: "Aug 23, 2027",
      totalItems: 13,
      claimedItems: 8, // Random claimed value
      occasionType: "new-home",
    },
    {
      id: "event-019",
      title: "Charlotte's Birthday Celebration",
      date: "Jan 29, 2026",
      totalItems: 5,
      claimedItems: 3, // Random claimed value
      occasionType: "birthday",
    },
    {
      id: "event-020",
      title: "Henry’s Wedding Anniversary",
      date: "Mar 14, 2027",
      totalItems: 18,
      claimedItems: 15, // Random claimed value
      occasionType: "wedding",
    },
  ];

  return (
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
        {wishList ? (
          <>
            <ActionBar />
            <WishListing wishList={wishList} />
          </>
        ) : (
          <NoListFound currentTab={currentTab} />
        )}
      </View>
      <View style={styles.bottomButtons}>
        <Pressable style={styles.backButtonBottom}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    </View>
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
  bottomButtons: {
    padding: 16,
  },
  backButtonBottom: {
    height: 56,
    borderWidth: 1,
    borderColor: "#3B0076",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#3B0076",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    lineHeight: 16,
  },
});
