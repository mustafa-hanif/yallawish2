import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { styles } from "./style";

const SWIPE_WIDTH = 130;

export default function FriendsItem() {
  const swipeableRef = React.useRef<any>(null);

  const renderRightActions = () => (
    <View style={{ width: SWIPE_WIDTH, flexDirection: "row", gap: 3, justifyContent: "center", alignItems: "center" }}>
      <Pressable
        style={[styles.rightAction]}
        onPress={() => {
          swipeableRef.current?.close();
          // onDelete?.(String(item._id));
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
          // onDelete?.(String(item._id));
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
    router.push("/(tabs)/friend-profile");
  };

  return (
    <Swipeable ref={swipeableRef} overshootRight={false} renderRightActions={renderRightActions}>
      <Pressable style={styles.container} onPress={onPress}>
        <View>
          <Image source={{ uri: "https://htmlstream.com/preview/unify-v2.6.1/assets/img-temp/400x450/img5.jpg" }} style={styles.image} />
        </View>
        <View>
          <Text style={styles.name}>Adam Sandlers</Text>
          <Text style={styles.commonCircles}>3 circles in common</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}
