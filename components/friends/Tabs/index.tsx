import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { styles } from "./style";

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
    title: "Pending Invites",
  },
];

const activeStyle = {
  activeText: "#330065",
  activeBorder: "#330065",
};

interface TabProps {
  currentTab?: string;
  setCurrentTab: (id: string) => void;
}
export default function FriendsTabs({ currentTab, setCurrentTab }: TabProps) {
  const handleSelectTab = (id: string) => setCurrentTab(id);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const activeIndex = useMemo(() => tabs.findIndex((t) => t.id === currentTab) || 0, [currentTab]);

  useEffect(() => {
    if (containerWidth > 0) {
      const tabWidth = containerWidth / tabs.length;
      Animated.timing(translateX, {
        toValue: activeIndex * tabWidth,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [activeIndex, containerWidth, translateX]);

  return (
    <View style={styles.eventContainer} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {tabs?.map((event) => (
        <Pressable onPress={() => handleSelectTab(event?.id)} style={[styles.tabItem, currentTab === event?.id ? { borderColor: activeStyle.activeBorder, borderBottomWidth: 2 } : {}]} key={event?.id}>
          <Text style={[styles.tabItemText, currentTab === event?.id ? { color: activeStyle.activeText } : {}]}>{event?.title}</Text>
        </Pressable>
      ))}
      {containerWidth > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 2,
            width: containerWidth / tabs.length,
            backgroundColor: activeStyle.activeBorder,
            transform: [{ translateX }],
          }}
        />
      )}
    </View>
  );
}
