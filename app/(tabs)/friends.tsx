import FriendsItem from "@/components/friends/FriendsItem";
import FriendsSectionHeader from "@/components/friends/FriendsSectionHeader";
import RequestItem from "@/components/friends/RequestItem";
import UserProfileBottomSheetContent from "@/components/friends/UserProfileBottomSheetContent";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import BottomSheet from "@/components/ui/BottomSheet";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const tabs = [
  {
    id: "friends",
    title: "Friends",
  },
  {
    id: "requests",
    title: "Requests",
  },
  {
    id: "pending-invites",
    title: "Sent",
  },
];
const Friends = () => {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState("friends");
  const [isAddFriendsSheetVisible, setIsAddFriendsSheetVisible] = useState(false);
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

  const handlePressAddFriends = () => {
    setIsAddFriendsSheetVisible(true);
  };
  const friends = Array.from({ length: 24 });
  const requests = Array.from({ length: 6 });
  const pendingInvites = Array.from({ length: 0 });

  const userProfiles = useQuery(api.products.getUserProfiles, { user_id: user?.id ?? "" });
  return (
    <View style={styles.container}>
      <Header title="Friends" handleBack={handleBack} />
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={tabs} />
      <FriendsSectionHeader title={currentTab === "friends" ? "Friends" : currentTab === "requests" ? "Requests" : "Pending Invites"} currentTab={currentTab} count={currentTab === "friends" ? friends.length : currentTab === "requests" ? requests.length : pendingInvites.length} handlePressAdd={handlePressAddFriends} />
      <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer} data={currentTab === "friends" ? friends : currentTab === "requests" ? requests : pendingInvites} renderItem={({ item }) => (currentTab === "friends" ? <FriendsItem /> : currentTab === "requests" ? <RequestItem /> : <RequestItem />)} keyExtractor={(item, index) => index.toString()} />
      <BottomSheet isVisible={isAddFriendsSheetVisible} onClose={() => setIsAddFriendsSheetVisible(false)}>
        <UserProfileBottomSheetContent userProfiles={userProfiles} />
      </BottomSheet>
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
