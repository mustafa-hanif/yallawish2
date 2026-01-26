import { TextInputField } from "@/components/TextInputField";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface FriendsEmptyStateProps {
  currentTab: string;
  handlePressAdd: () => void;
}
const friends = "You haven’t added any\nfriends yet";
const requests = "No new requests";
const pending = "You have no pending\nfriend invites";

export default function FriendsEmptyState({ currentTab, handlePressAdd }: FriendsEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageAndTitleContainer}>
        <Text style={styles.text}>{currentTab === "friends" ? friends : currentTab === "requests" ? requests : pending}</Text>
        <Image source={require("@/assets/images/noCircletFound.png")} style={styles.image} />
      </View>
      {currentTab === "friends" && (
        <Pressable style={{ marginTop: 32, width: "100%" }} onPress={handlePressAdd}>
          <TextInputField editable={false} label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} />
        </Pressable>
      )}
    </View>
  );
}
