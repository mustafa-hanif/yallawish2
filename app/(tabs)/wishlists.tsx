import ActionBar from "@/components/wishlists/ActionBar";
import WishListing from "@/components/wishlists/Listing";
import NoListFound from "@/components/wishlists/NoListFound";
import Tabs from "@/components/wishlists/Tabs";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Wishlists = () => {
  const { user } = useUser();
  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");

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
        {myLists && myLists?.length ? (
          <>
            <ActionBar />
            <WishListing wishList={myLists} />
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
