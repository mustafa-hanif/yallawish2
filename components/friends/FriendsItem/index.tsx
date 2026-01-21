import { getProfileInitials } from "@/utils";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { styles } from "./style";

const SWIPE_WIDTH = 130;

type FriendsItemProps = {
  connection: any;
  profile: any;
  onRemove: (connectionId: string) => void;
  onBlock: (userId: string) => void;
};

export default function FriendsItem({ connection, profile, onRemove, onBlock }: FriendsItemProps) {
  const swipeableRef = React.useRef<any>(null);

  const renderRightActions = () => (
    <View style={{ width: SWIPE_WIDTH, flexDirection: "row", gap: 3, justifyContent: "center", alignItems: "center" }}>
      <Pressable
        style={[styles.rightAction]}
        onPress={() => {
          swipeableRef.current?.close();
          onRemove(connection._id);
        }}
      >
        <View>
          <Image source={require("@/assets/images/deleteList.png")} style={styles.rightActionIcon} />
        </View>
        <Text style={styles.rightActionText}>Delete</Text>
      </Pressable>
      <Pressable
        style={[styles.rightAction, { backgroundColor: "#9A001D" }]}
        onPress={() => {
          swipeableRef.current?.close();
          onBlock(profile?.user_id);
        }}
      >
        <View>
          <Image source={require("@/assets/images/block.png")} style={styles.rightActionIcon} />
        </View>
        <Text style={styles.rightActionText}>Block</Text>
      </Pressable>
    </View>
  );

  const onPress = () => {
    router.push({
      pathname: "/(tabs)/friend-profile",
      params: {
        connectionId: connection._id,
        friendUserId: profile?.user_id,
      },
    });
  };

  const displayName = profile?.displayName || profile?.firstName || "Unknown User";
  const imageUrl = profile?.profileImageUrl || "";
  const nameInitials = getProfileInitials(profile);

  return (
    <Swipeable ref={swipeableRef} overshootRight={false} renderRightActions={renderRightActions}>
      <Pressable style={styles.container} onPress={onPress}>
        {imageUrl ? (
          <View>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        ) : (
          <View style={[styles.image, styles.initialsContainer]}>
            <Text style={styles.nameInitials}>{nameInitials || ""}</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.commonCircles}>{profile?.contactEmail || ""}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}
