import { Image } from "expo-image";
import React, { useMemo } from "react";

import { SignOutButton } from "@/components/SignOutButton";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

// Occasion -> color map for event left border
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
export default function HomeScreen() {
  const { user } = useUser();

  const myLists = useQuery(
    api.products.getMyLists,
    user?.id ? { user_id: user.id } : "skip"
  );

  type UpcomingEvent = {
    id: string; date: string; month: string; title: string; subtitle: string; color: string; dateValue: number;
  };

  const upcomingEvents = useMemo(() => {
    if (!myLists) return [] as UpcomingEvent[];
    return myLists
      .filter((l: any) => !!l.eventDate)
      .map((l: any) => {
        const [y, m, d] = String(l.eventDate).split("-").map((n) => parseInt(n, 10));
        const dateObj = new Date(y, (m ?? 1) - 1, d ?? 1);
        const dayStr = String(d ?? 1).padStart(2, "0");
        let monthStr = "";
        try {
          monthStr = new Intl.DateTimeFormat(undefined, { month: "long" }).format(dateObj).toUpperCase();
        } catch {
          const months = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"]; monthStr = months[dateObj.getMonth()];
        }
        return { id: String(l._id), date: dayStr, month: monthStr, title: l.title || "Untitled", subtitle: l.note || (l.occasion ? `Occasion: ${l.occasion}` : ""), color: OCCASION_COLOR[String(l.occasion)] ?? "#AEAEB2", dateValue: dateObj.getTime() };
      })
      .sort((a: UpcomingEvent, b: UpcomingEvent) => a.dateValue - b.dateValue);
  }, [myLists]);

  const categories = [
    { id: 1, name: "Wedding", color: "#00D4AA" },
    { id: 2, name: "Birthday", color: "#00C4F0" },
    { id: 3, name: "New Home", color: "#FFD700" },
    { id: 4, name: "Graduation", color: "#FF69B4" },
    { id: 5, name: "Baby Shower", color: "#9966CC" },
    { id: 6, name: "Retirement", color: "#FF4500" },
  ];

  const topPicks = [
    { id: 1, name: "Nike Air Jester 1", subtitle: "Sonic Green", price: "325.32", image: require("@/assets/images/nikeShoes.png") },
    { id: 2, name: "Oculus Quest", subtitle: "Dynamic White", price: "325.32", image: require("@/assets/images/oculus.png") },
  ];

  const inspirationBoards = [
    { id: 1, title: "Build your nursery", subtitle: "All essentials items under one roof with Pottery Barn Kids", image: require("@/assets/images/nursery.png") },
    { id: 2, title: "The wedding checklist", subtitle: "Don't know where to start? See what others do.", image: require("@/assets/images/wedding.png") },
    { id: 3, title: "From house to home", subtitle: "Set up your space with a little oomph with Pan Home", image: require("@/assets/images/pan.png") },
  ];

  const handleCreateWishlist = () => router.push("/create-list-step1");

  const initialCards = [
    { id: 0, title: "Add List", subtitle: "Create a new wishlist for any occasion", image: require("@/assets/images/addList.png"), backgroundColor: "#F3ECFE", action: handleCreateWishlist },
    { id: 1, title: "Share List", subtitle: "Invite friends & family to view your list", image: require("@/assets/images/shareList.png"), backgroundColor: "#E9FFE2", action: () => Alert.alert("Share", "Sharing coming soon") },
    { id: 2, title: "Community Lists", subtitle: "See popular public registries", image: require("@/assets/images/community.png"), backgroundColor: "#C2D9FF", action: () => Alert.alert("Community", "Community lists coming soon") },
  ];

  // Cards array static for infinite loop (no state mutation needed)
  const cards = initialCards;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color="#FFFFFF" />
            <TextInput placeholder="Type your search here..." style={styles.searchInput} placeholderTextColor="#FFFFFF" />
          </View>
          <SignedIn>
            <Pressable style={styles.profileButton}>
              <View style={styles.profileImage}>
                <Image source={require("@/assets/images/girlUser.png")} style={{ width: 48, height: 48 }} />
              </View>
            </Pressable>
          </SignedIn>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Hi {user?.firstName}!</Text>
          <Text style={styles.welcomeSubtitle}>Ready to make someone smile?</Text>
        </View>

        {/* Swiper action cards */}
        <View style={{ height: 200, marginBottom: 36 }}>
          <Swiper
            cards={cards}
            stackSize={3}
            stackSeparation={-22}
            backgroundColor="transparent"
            disableTopSwipe
            disableBottomSwipe
            // Enable infinite looping so user can't swipe past last card
            infinite
            // Removed onSwipedAll reset; cards now loop seamlessly
            cardVerticalMargin={0}
            cardHorizontalMargin={16}
            renderCard={(card: any) => {
              if (!card) return <View />;
              return (
                <Pressable
                  onPress={card.action}
                  style={{
                    height: 180,
                    borderRadius: 32,
                    paddingHorizontal: 28,
                    paddingVertical: 24,
                    backgroundColor: card.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    shadowColor: '#000',
                    shadowOpacity: 0.08,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                  }}
                >
                  <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#FFFFFF', opacity:0.92, alignItems:'center', justifyContent:'center', marginBottom: 16 }}>
                    <Image source={card.image} contentFit="contain" style={{ width: 60, height: 60 }} />
                  </View>
                  <Text style={[styles.addListTitle, { textAlign:'center', fontSize:18, marginBottom:6 }]}>{card.title}</Text>
                  <Text style={[styles.addListSubtitle, { textAlign:'center', fontSize:12, lineHeight:16, maxWidth:180 }]} numberOfLines={2}>{card.subtitle}</Text>
                </Pressable>
              );
            }}
          />
          <Text style={{ position: 'absolute', bottom: 0, alignSelf:'center', fontSize:12, color:'#6E6E73' }}>Swipe</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCategory}>Browse by categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <View style={styles.categoriesContainer}>
              <View style={styles.categoriesRow}>
                {categories.slice(0, 3).map((category) => (
                  <Pressable key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIconContainer}>
                        <Image source={require("@/assets/images/gift.svg")} style={styles.categoryIcon} contentFit="contain" />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={[styles.categoryBorder, { backgroundColor: category.color }]} />
                  </Pressable>
                ))}
              </View>
              <View style={styles.categoriesRow}>
                {categories.slice(3, 6).map((category) => (
                  <Pressable key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIconContainer}>
                        <Image source={require("@/assets/images/gift.svg")} style={styles.categoryIcon} contentFit="contain" />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View style={[styles.categoryBorder, { backgroundColor: category.color }]} />
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.eventSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.eventSectionTitle}>Upcoming events</Text>
            <Pressable>
              <Ionicons name="chevron-forward" size={28} color="black" />
            </Pressable>
          </View>
          <ScrollView horizontal style={styles.eventsScroll}>
            {upcomingEvents.map((event) => (
              <Pressable key={event.id} style={styles.eventCard} onPress={() => router.push({ pathname: "/add-gift", params: { listId: String(event.id) } })}>
                <View style={[styles.eventLeftBorder, { backgroundColor: event.color }]} />
                <View style={styles.eventContent}>
                  <View style={styles.eventDateContainer}>
                    <Text style={styles.eventDateNumber}>{event.date}</Text>
                    <Text style={styles.eventDateMonth}>{event.month}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Top Picks */}
        <View style={styles.topSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top picks for you...</Text>
            <Pressable>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picksScroll}>
            {topPicks.map((item) => (
              <View key={item.id} style={styles.pickCard}>
                <View style={styles.pickImageContainer}>
                  <Image style={{ height: 147, width: 180, borderRadius: 8 }} contentFit="contain" source={item.image} />
                </View>
                <Text style={styles.pickName}>{item.name}</Text>
                <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                <Text style={styles.pickPrice}>
                  <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, marginTop: -1, height: 12 }} />
                  {item.price}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Inspiration Boards */}
        <View style={styles.isection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Inspiration boards</Text>
            <Pressable>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </Pressable>
          </View>
          {inspirationBoards.map((board) => (
            <Pressable key={board.id} style={styles.inspirationCard}>
              <View style={styles.inspirationContent}>
                <Text style={styles.inspirationTitle}>{board.title}</Text>
                <Text style={styles.inspirationSubtitle}>{board.subtitle}</Text>
              </View>
              <View style={styles.inspirationImageContainer}>
                <Image style={{ width: 148, height: 148 }} contentFit="cover" source={board.image} />
              </View>
            </Pressable>
          ))}
        </View>

        {/* AI Assistant */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiButton}>AI-POWERED</Text>
          </View>
          <Text style={styles.aiTitle}>Meet Genie!</Text>
          <Text style={styles.aiDescription}>Let our smart assistant suggest the perfect registry items based on your lifestyle, preferences, and needs — saving you time and guesswork!</Text>
          <Pressable style={styles.aiChatButton}>
            <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
          </Pressable>
          <View style={{ height: 280 }}>
            <Image source={require("@/assets/images/robot.png")} style={styles.robotImage} contentFit="contain" />
          </View>
        </View>
        <SignOutButton />
      </ScrollView>
    </SafeAreaView>
  );
}
