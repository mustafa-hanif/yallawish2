import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./style";

const tabs = [
  {
    id: "my-events",
    title: "My Events",
  },
  {
    id: "community-events",
    title: "Community Events",
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
export default function Tabs({ currentTab, setCurrentTab }: TabProps) {
  const handleSelectTab = (id: string) => setCurrentTab(id);

  return (
    <View style={styles.eventContainer}>
      {tabs?.map((event) => (
        <Pressable onPress={() => handleSelectTab(event?.id)} style={[styles.tabItem, currentTab === event?.id ? { borderColor: activeStyle.activeBorder, borderBottomWidth: 2 } : {}]} key={event?.id}>
          <Text style={[styles.tabItemText, currentTab === event?.id ? { color: activeStyle.activeText } : {}]}>{event?.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}
