import { occasionObj } from "@/constants/Occasion";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { styles } from "./style";

interface EventCardProps {
  eventDetails: { id: string; date: string; month: string; title: string; subtitle: string; color: string; dateValue: number; occasion?: string; totalClaimed: number };
}

export default function EventCard({ eventDetails }: EventCardProps) {
  const occasion = occasionObj[String(eventDetails?.occasion) || "birthday"];
  const count = Number(eventDetails?.totalClaimed) > 0 && Number(eventDetails?.totalClaimed) < 10 ? `0${Number(eventDetails?.totalClaimed)}` : String(eventDetails?.totalClaimed);
  return (
    <Link href={{ pathname: "/add-gift", params: { listId: String(eventDetails.id) } }}>
      <View style={[styles.card, { borderColor: occasion?.borderColor }]}>
        <View>
          <Text style={styles.date}>{eventDetails.date}</Text>
          <Text style={styles.month}>{eventDetails.month}</Text>
        </View>
        <View style={styles.titleAndGiftsPurchasedContainer}>
          <View>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {eventDetails?.title}
            </Text>
          </View>
          <View>
            <View style={[styles.giftPurchasedPill, { backgroundColor: occasion?.backgroundColor }]}>
              <Text style={[styles.giftPurchasedText, { color: occasion?.borderColor }]}>Gifts purchased: {count}</Text>
            </View>
          </View>
        </View>
      </View>
    </Link>
  );
}
