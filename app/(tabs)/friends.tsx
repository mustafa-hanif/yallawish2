import FriendsItem from "@/components/friends/FriendsItem";
import FriendsSectionHeader from "@/components/friends/FriendsSectionHeader";
import RequestItem from "@/components/friends/RequestItem";
import FriendsTabs from "@/components/friends/Tabs";
import Header from "@/components/Header";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Friends = () => {
  const [currentTab, setCurrentTab] = useState("friends");
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const friends = Array.from({ length: 24 });
  const requests = Array.from({ length: 6 });
  const pendingInvites = Array.from({ length: 0 });

  return (
    <View style={styles.container}>
      <Header title="Friends" handleBack={handleBack} />
      <FriendsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <FriendsSectionHeader title={currentTab === "friends" ? "Friends" : currentTab === "requests" ? "Requests" : "Pending Invites"} currentTab={currentTab} count={currentTab === "friends" ? friends.length : currentTab === "requests" ? requests.length : pendingInvites.length} />
      <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer} data={currentTab === "friends" ? friends : currentTab === "requests" ? requests : pendingInvites} renderItem={({ item }) => (currentTab === "friends" ? <FriendsItem /> : currentTab === "requests" ? <RequestItem /> : <RequestItem />)} keyExtractor={(item, index) => index.toString()} />
    </View>
  );
};
export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 16,
  },
});
