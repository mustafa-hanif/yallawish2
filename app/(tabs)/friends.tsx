import FriendsItem from "@/components/friends/FriendsItem";
import FriendsSectionHeader from "@/components/friends/FriendsSectionHeader";
import RequestItem from "@/components/friends/RequestItem";
import UserProfileBottomSheetContent from "@/components/friends/UserProfileBottomSheetContent";
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import BottomSheet from "@/components/ui/BottomSheet";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

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

  // Fetch real friend data
  const myFriends = useQuery(api.products.getMyFriends, user?.id ? { user_id: user.id } : "skip");
  const receivedRequests = useQuery(api.products.getReceivedRequests, user?.id ? { user_id: user.id } : "skip");
  const sentRequests = useQuery(api.products.getSentRequests, user?.id ? { user_id: user.id } : "skip");

  // Data for each tab
  const friends = myFriends || [];
  const requests = receivedRequests || [];
  const pendingInvites = sentRequests || [];

  // Get all users with their connection status (joined)
  const userProfiles = useQuery(api.products.getAllUsersWithConnectionStatus, user?.id ? { user_id: user.id, searchText: "" } : "skip");

  // Mutations
  const removeFriend = useMutation(api.products.removeFriend);
  const blockUser = useMutation(api.products.blockUser);
  const acceptRequest = useMutation(api.products.acceptFriendRequest);
  const rejectRequest = useMutation(api.products.rejectFriendRequest);
  const sendRequest = useMutation(api.products.sendFriendRequest);

  // Handlers
  const handleSendRequest = async (receiverId: string) => {
    if (!user?.id) return;

    try {
      await sendRequest({ requester_id: user.id, receiver_id: receiverId });
      // setIsAddFriendsSheetVisible(false);
      // Alert.alert("Success", "Friend request sent!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to send friend request");
    }
  };

  const handleRemoveFriend = async (connectionId: string) => {
    if (!user?.id) return;

    Alert.alert("Remove Friend", "Are you sure you want to remove this friend?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeFriend({ connection_id: connectionId as any, user_id: user.id });
          } catch (error) {
            Alert.alert("Error", "Failed to remove friend");
          }
        },
      },
    ]);
  };

  const handleBlockUser = async (userId: string) => {
    if (!user?.id) return;

    Alert.alert("Block User", "Are you sure you want to block this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Block",
        style: "destructive",
        onPress: async () => {
          try {
            await blockUser({ blocker_id: user.id, blocked_id: userId });
          } catch (error) {
            Alert.alert("Error", "Failed to block user");
          }
        },
      },
    ]);
  };

  const handleAcceptRequest = async (connectionId: string) => {
    if (!user?.id) return;

    try {
      await acceptRequest({ connection_id: connectionId as any, user_id: user.id });
    } catch (error) {
      Alert.alert("Error", "Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (connectionId: string) => {
    if (!user?.id) return;

    try {
      await rejectRequest({ connection_id: connectionId as any, user_id: user.id });
    } catch (error) {
      Alert.alert("Error", "Failed to reject friend request");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Friends" handleBack={handleBack} />
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} tabs={tabs} />
      <FriendsSectionHeader title={currentTab === "friends" ? "Friends" : currentTab === "requests" ? "Requests" : "Pending Invites"} currentTab={currentTab} count={currentTab === "friends" ? friends.length : currentTab === "requests" ? requests.length : pendingInvites.length} handlePressAdd={handlePressAddFriends} />
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        data={currentTab === "friends" ? friends : currentTab === "requests" ? requests : pendingInvites}
        renderItem={({ item }) => {
          if (currentTab === "friends") {
            return <FriendsItem connection={item.connection} profile={item.profile} onRemove={handleRemoveFriend} onBlock={handleBlockUser} />;
          } else if (currentTab === "requests") {
            return <RequestItem connection={item.connection} profile={item.profile} onAccept={handleAcceptRequest} onReject={handleRejectRequest} type="received" />;
          } else {
            return <RequestItem connection={item.connection} profile={item.profile} onAccept={handleAcceptRequest} onReject={handleRejectRequest} type="sent" />;
          }
        }}
        keyExtractor={(item, index) => item.connection?._id || index.toString()}
      />
      <BottomSheet isVisible={isAddFriendsSheetVisible} onClose={() => setIsAddFriendsSheetVisible(false)}>
        <UserProfileBottomSheetContent userProfiles={userProfiles} onSendRequest={handleSendRequest} />
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
