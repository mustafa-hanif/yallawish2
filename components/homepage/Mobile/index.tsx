import React, { useMemo } from "react";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrowseByCategories } from "./BrowseByCategories";
import { Hero } from "./Hero";
import { InspirationBoards } from "./InspirationBoards";
import { MeetGenie } from "./MeetGenie";
import { TopPicksForYou } from "./TopPicksForYou";
import { UpcomingEvents } from "./UpcomingEvents";

const OCCASION_COLOR: Record<string, string> = {
  birthday: "#00C4F0",
  wedding: "#00D4AA",
  "new-home": "#FFD700",
  graduation: "#FF69B4",
  "baby-shower": "#9966CC",
  retirement: "#FF4500",
  other: "#4D4D4D",
  "no-occasion": "#4D4D4D",
};

type UpcomingEvent = {
  id: string;
  date: string;
  month: string;
  title: string;
  subtitle: string;
  color: string;
  occasion?: string;
  dateValue: number;
};
export function Mobile() {
  const { user } = useUser();

  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");

  const upcomingEvents = useMemo(() => {
    if (!myLists) return [] as UpcomingEvent[];
    return myLists
      .filter((l: any) => !!l.eventDate)
      .map((l: any) => {
        const [y, m, d] = String(l.eventDate)
          .split("-")
          .map((n) => parseInt(n, 10));
        const dateObj = new Date(y, (m ?? 1) - 1, d ?? 1);
        const dayStr = String(d ?? 1).padStart(2, "0");
        let monthStr = "";
        try {
          monthStr = new Intl.DateTimeFormat(undefined, { month: "long" }).format(dateObj).toUpperCase();
        } catch {
          const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
          monthStr = months[dateObj.getMonth()];
        }
        return { id: String(l._id), date: dayStr, month: monthStr, title: l.title || "Untitled", subtitle: l.note || (l.occasion ? `Occasion: ${l.occasion}` : ""), occasion: l.occasion, color: OCCASION_COLOR[String(l.occasion)] ?? "#AEAEB2", dateValue: dateObj.getTime() };
      })
      .sort((a: UpcomingEvent, b: UpcomingEvent) => a?.dateValue - b?.dateValue);
  }, [myLists]);

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Hero />
        <BrowseByCategories />
        <UpcomingEvents upcomingEvents={upcomingEvents} />
        <TopPicksForYou />
        <InspirationBoards />
        <MeetGenie />
      </ScrollView>
    </SafeAreaView>
  );
}
