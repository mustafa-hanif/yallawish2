import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import EventCard from "./EventCard";
import { styles } from "./style";

type UpcomingEvent = {
  id: string;
  date: string;
  month: string;
  title: string;
  subtitle: string;
  color: string;
  dateValue: number;
  occasion?: string;
};
interface UpcomingEventsProps {
  upcomingEvents: UpcomingEvent[];
}
export function UpcomingEvents({ upcomingEvents = [] }: UpcomingEventsProps) {
  return (
    <View style={styles.section}>
      <View style={styles.mainContainer}>
        <View>
          <Text style={styles.title}>Upcoming events</Text>
        </View>
        <View>
          <Image style={{ tintColor: "black" }} source={require("@/assets/images/chevronRight.png")} resizeMode="contain" />
        </View>
      </View>
      <FlatList showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flatList} horizontal data={upcomingEvents} keyExtractor={(item) => String(item.id)} renderItem={({ item }) => <EventCard eventDetails={item} />} />
    </View>
  );
}
