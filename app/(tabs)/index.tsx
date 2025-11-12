import { Image } from "expo-image";
import React, { useMemo } from "react";

import { SignOutButton } from "@/components";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link, router } from "expo-router";
import { Alert, Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Swiper from "react-native-deck-swiper";
import { SafeAreaView } from "react-native-safe-area-context";

const DESKTOP_BREAKPOINT = 1024;

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

const responsiveStyles = StyleSheet.create({
  pageContainer: {
    paddingBottom: 48,
  },
  headerWrapper: {
    width: "100%",
  },
  navBarDesktop: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  header: {
    paddingHorizontal: 0,
    justifyContent: "center",
  },
  headerInner: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerInnerDesktop: {
    paddingVertical: 6,
  },
  headerSearch: {
    maxWidth: 520,
  },
  profileButtonDesktop: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 20,
  },
  heroSectionDesktop: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  heroContentDesktop: {
    flex: 1,
    paddingRight: 48,
  },
  heroVisualDesktop: {
    flex: 1.1,
    paddingLeft: 32,
    justifyContent: "center",
  },
  heroSwiperDesktop: {
    justifyContent: "center",
    width: "100%",
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionInner: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  lifeMomentGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  lifeMomentCardDesktop: {
    width: "31%",
    minWidth: 260,
    marginBottom: 24,
    marginRight: 24,
  },
  lifeMomentCardMobile: {
    width: 220,
    marginRight: 16,
  },
  lifeMomentScrollContent: {
    paddingHorizontal: 20,
  },
  eventsDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  eventCardDesktop: {
    width: "31%",
    minWidth: 250,
    marginBottom: 24,
    marginRight: 24,
  },
  picksDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  pickCardDesktop: {
    width: "31%",
    minWidth: 240,
    marginBottom: 24,
    marginRight: 24,
  },
  inspirationDesktopList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  inspirationCardDesktop: {
    width: "48%",
    minWidth: 340,
    marginBottom: 24,
    marginRight: 24,
  },
  aiSectionOuter: {
    padding: 0,
    backgroundColor: "transparent",
    marginHorizontal: 0,
    marginTop: 0,
  },
  aiSectionDesktopWrapper: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  aiSectionDesktop: {
    borderRadius: 32,
    paddingHorizontal: 40,
    paddingVertical: 40,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#330065",
  },
  aiContentDesktop: {
    flex: 1,
    marginRight: 32,
  },
  aiRobotDesktop: {
    flex: 1,
    alignItems: "flex-end",
  },
  robotImageDesktop: {
    width: 340,
    height: 260,
  },
  signOutWrapper: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 20,
    marginTop: 24,
  },
});
export default function HomeScreen() {
  const { user } = useUser();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;

  const profilePhoto = user?.imageUrl ?? (typeof user?.unsafeMetadata?.profileImageUrl === "string" ? (user.unsafeMetadata.profileImageUrl as string) : undefined);

  const profileInitials = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    if (name) {
      return name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 2) || "YW";
    }

    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    if (email) {
      const letters = email.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
      return letters || "YW";
    }

    return "YW";
  }, [user?.firstName, user?.lastName, user?.emailAddresses]);

  const myLists = useQuery(api.products.getMyLists, user?.id ? { user_id: user.id } : "skip");

  type UpcomingEvent = {
    id: string;
    date: string;
    month: string;
    title: string;
    subtitle: string;
    color: string;
    dateValue: number;
  };

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
        return { id: String(l._id), date: dayStr, month: monthStr, title: l.title || "Untitled", subtitle: l.note || (l.occasion ? `Occasion: ${l.occasion}` : ""), color: OCCASION_COLOR[String(l.occasion)] ?? "#AEAEB2", dateValue: dateObj.getTime() };
      })
      .sort((a: UpcomingEvent, b: UpcomingEvent) => a.dateValue - b.dateValue);
  }, [myLists]);

  type LifeMomentCard = {
    id: string;
    title: string;
    caption: string;
    background: string;
    accent: string;
    textColor?: string;
    href?: string;
  };

  const lifeMomentsPrimary: LifeMomentCard[] = [
    {
      id: "baby",
      title: "New arrival",
      caption: "Curate nursery must-haves",
      background: "#FDF2FF",
      accent: "#F472B6",
    },
    {
      id: "birthday",
      title: "Birthday bash",
      caption: "Throw an unforgettable party",
      background: "#FFF7ED",
      accent: "#FB923C",
    },
    {
      id: "wedding",
      title: "Wedding bliss",
      caption: "Celebrate the happy couple",
      background: "#F0FDFA",
      accent: "#34D399",
    },
    {
      id: "graduation",
      title: "Graduation glow",
      caption: "Honor their big milestone",
      background: "#EFF6FF",
      accent: "#60A5FA",
    },
    {
      id: "housewarming",
      title: "Housewarming",
      caption: "Warm up their new space",
      background: "#F9F5FF",
      accent: "#A855F7",
    },
    {
      id: "anniversary",
      title: "Anniversary",
      caption: "Plan a heartfelt surprise",
      background: "#FFF1F2",
      accent: "#FB7185",
    },
  ];

  const lifeMomentsSecondary: LifeMomentCard[] = [
    {
      id: "team-celebration",
      title: "Team wins",
      caption: "Recognize workplace heroes",
      background: "#381176",
      accent: "#7B61FF",
      textColor: "#FFFFFF",
    },
    {
      id: "just-because",
      title: "Just because",
      caption: "Share a spontaneous smile",
      background: "#2B0C57",
      accent: "#6EE7B7",
      textColor: "#FFFFFF",
    },
    {
      id: "faith-festivities",
      title: "Faith & festivities",
      caption: "Curate seasonal traditions",
      background: "#311463",
      accent: "#FDE68A",
      textColor: "#FFFFFF",
    },
    {
      id: "self-care",
      title: "Self care",
      caption: "Treat yourself kindly",
      background: "#240948",
      accent: "#F9A8D4",
      textColor: "#FFFFFF",
    },
  ];

  const heroTags = lifeMomentsPrimary.slice(0, 3);

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
  const handlePressProfile = () => router.push("/profile-setup");

  const initialCards = [
    { id: 0, title: "Add List", subtitle: "Create a new wishlist for any occasion", image: require("@/assets/images/addList.png"), backgroundColor: "#F3ECFE", action: handleCreateWishlist },
    { id: 1, title: "Share List", subtitle: "Invite friends & family to view your list", image: require("@/assets/images/shareList.png"), backgroundColor: "#E9FFE2", action: () => Alert.alert("Share", "Sharing coming soon") },
    { id: 2, title: "Community Lists", subtitle: "See popular public registries", image: require("@/assets/images/community.png"), backgroundColor: "#C2D9FF", action: () => Alert.alert("Community", "Community lists coming soon") },
  ];

  // Cards array static for infinite loop (no state mutation needed)
  const cards = initialCards;

  const mergeStyles = (...styleInputs: any[]) => StyleSheet.flatten(styleInputs.filter(Boolean));

  const renderActionCards = () => (
    <View style={mergeStyles(styles.heroSwiperContainer, isDesktop ? responsiveStyles.heroSwiperDesktop : null)}>
      <View style={{ height: 220, overflow: "hidden" }} pointerEvents="box-none">
        <Swiper
          cards={cards}
          stackSize={3}
          stackSeparation={-20}
          backgroundColor="transparent"
          disableTopSwipe
          disableBottomSwipe
          infinite
          cardVerticalMargin={0}
          cardHorizontalMargin={isDesktop ? 0 : 16}
          containerStyle={{ height: 200, position: "relative" }}
          cardStyle={{ borderRadius: 28 }}
          renderCard={(card: any) => {
            if (!card) return <View />;
            return (
              <Pressable
                onPress={card.action}
                style={{
                  height: 190,
                  borderRadius: 28,
                  paddingHorizontal: 28,
                  paddingVertical: 24,
                  backgroundColor: card.backgroundColor,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 6 },
                }}
              >
                <View
                  style={{
                    width: 82,
                    height: 82,
                    borderRadius: 26,
                    backgroundColor: "#FFFFFF",
                    opacity: 0.94,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 18,
                  }}
                >
                  <Image source={card.image} contentFit="contain" style={{ width: 56, height: 56 }} />
                </View>
                <Text style={mergeStyles(styles.addListTitle, styles.heroCardTitle)}>{card.title}</Text>
                <Text style={mergeStyles(styles.addListSubtitle, styles.heroCardSubtitle)} numberOfLines={2}>
                  {card.subtitle}
                </Text>
              </Pressable>
            );
          }}
        />
        <Text style={styles.heroSwipeLabel}>Swipe</Text>
      </View>
    </View>
  );

  const renderLifeMomentCard = (moment: LifeMomentCard, variant: "primary" | "secondary") => {
    const textColor = moment.textColor ?? "#1C0335";
    return (
      <Pressable
        key={moment.id}
        style={mergeStyles(
          styles.lifeMomentCard,
          {
            backgroundColor: moment.background,
            borderColor: moment.accent,
          },
          variant === "secondary" ? styles.lifeMomentCardSecondary : null,
          isDesktop ? responsiveStyles.lifeMomentCardDesktop : responsiveStyles.lifeMomentCardMobile,
        )}
        onPress={() => {
          if (moment.href) {
            router.push(moment.href as any);
            return;
          }
          Alert.alert("Coming soon", "More curated experiences are on the way!");
        }}
      >
        <View style={mergeStyles(styles.lifeMomentBadge, { backgroundColor: moment.accent, opacity: variant === "secondary" ? 0.32 : 0.16 })} />
        <View>
          <Text style={mergeStyles(styles.lifeMomentTitle, { color: textColor })}>{moment.title}</Text>
          <Text style={mergeStyles(styles.lifeMomentCaption, { color: variant === "secondary" ? "#EDE9FF" : "#5B5569" })}>{moment.caption}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#2C0077" }]}> 
      <ScrollView
        style={{ backgroundColor: "#FFFFFF" }}
        contentContainerStyle={mergeStyles(responsiveStyles.pageContainer)}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={mergeStyles(styles.headerWrapper, isDesktop ? responsiveStyles.headerWrapper : null)}>
          <View style={mergeStyles(styles.navBar, isDesktop ? responsiveStyles.navBarDesktop : null)}>
            <Pressable onPress={() => router.replace("/")} style={styles.navBrandRow}>
              <Image source={require("@/assets/images/yallawish_logo.png")} style={styles.navBrandLogo} contentFit="contain" />
            </Pressable>

            {isDesktop ? (
              <View
                style={mergeStyles(
                  styles.searchContainer,
                  responsiveStyles.headerSearch,
                )}
              >
                <Ionicons name="search" size={20} color="#FFFFFF" />
                <TextInput
                  placeholder="Search for gifts, lists or inspirations..."
                  style={styles.searchInput}
                  placeholderTextColor="#D9CCFF"
                />
              </View>
            ) : null}

            <View style={styles.navActions}>
              <SignedOut>
                <Pressable onPress={() => router.push("/sign-up")}>
                  <Text style={styles.navAuthLink}>Sign up</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/log-in")}>
                  <Text style={styles.navAuthLink}>Login</Text>
                </Pressable>
              </SignedOut>
              <SignedIn>
                <Pressable
                  style={mergeStyles(styles.profileButton, isDesktop ? responsiveStyles.profileButtonDesktop : null)}
                  onPress={handlePressProfile}
                >
                  {profilePhoto ? (
                    <Image
                      source={{ uri: profilePhoto }}
                      style={mergeStyles(
                        styles.profileAvatarImage,
                        isDesktop ? { width: 48, height: 48, borderRadius: 24 } : null,
                      )}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      style={mergeStyles(
                        styles.profileImage,
                        isDesktop ? { width: 48, height: 48, borderRadius: 24 } : null,
                      )}
                    >
                      <Text style={styles.profileText}>{profileInitials}</Text>
                    </View>
                  )}
                </Pressable>
              </SignedIn>
            </View>
          </View>

          {!isDesktop ? (
            <View style={styles.header}>
              <View style={mergeStyles(responsiveStyles.headerInner, responsiveStyles.headerInnerDesktop)}>
                <View style={styles.mobileSearchContainer}>
                  <Ionicons name="search" size={20} color="#FFFFFF" />
                  <TextInput
                    placeholder="Search for gifts, lists or inspirations..."
                    style={styles.searchInput}
                    placeholderTextColor="#D9CCFF"
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>

        {/* Hero */}
        <View style={mergeStyles(styles.heroSection, isDesktop ? responsiveStyles.heroSectionDesktop : null)}>
          <View style={mergeStyles(styles.heroContent, isDesktop ? responsiveStyles.heroContentDesktop : null)}>
            <Text style={styles.heroEyebrow}>Hi {user?.firstName ?? "there"}, let&apos;s celebrate</Text>
            <Text style={styles.welcomeTitle}>What brings you joy today?</Text>
            <Text style={styles.welcomeSubtitle}>Pick a life moment and we&apos;ll help you build a wishlist that feels personal, thoughtful, and easy to share.</Text>
            <View style={styles.heroActions}>
              <Pressable style={styles.heroPrimaryButton} onPress={handleCreateWishlist}>
                <Text style={styles.heroPrimaryButtonText}>Create a wishlist</Text>
              </Pressable>
              <Pressable style={styles.heroSecondaryButton} onPress={() => router.push("/global")}>
                <Text style={styles.heroSecondaryButtonText}>Explore inspiration</Text>
              </Pressable>
            </View>
            <View style={styles.heroTagRow}>
              {heroTags.map((tag) => (
                <Pressable key={tag.id} style={styles.heroTag} onPress={() => Alert.alert(tag.title, tag.caption)}>
                  <Text style={styles.heroTagText}>{tag.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {isDesktop ? <View style={mergeStyles(styles.heroVisual, responsiveStyles.heroVisualDesktop)}>{renderActionCards()}</View> : null}
        </View>

        {!isDesktop ? renderActionCards() : null}

        {/* Life moments */}
        <View style={mergeStyles(styles.lifeMomentsSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.lifeMomentsHeader}>
              <View>
                <Text style={styles.lifeMomentsEyebrow}>Life moments</Text>
                <Text style={styles.lifeMomentsTitle}>Browse by life moments</Text>
              </View>
              <Pressable style={styles.sectionAction} onPress={() => router.push("/global")}>
                <Text style={styles.sectionActionText}>View all</Text>
                <Ionicons name="arrow-forward" size={18} color="#6F6B89" />
              </Pressable>
            </View>
            {isDesktop ? (
              <View style={mergeStyles(styles.lifeMomentsGrid, responsiveStyles.lifeMomentGridDesktop)}>
                {lifeMomentsPrimary.map((moment) => renderLifeMomentCard(moment, "primary"))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={responsiveStyles.lifeMomentScrollContent}
                style={styles.lifeMomentsScroll}
              >
                {lifeMomentsPrimary.map((moment) => renderLifeMomentCard(moment, "primary"))}
              </ScrollView>
            )}
          </View>
        </View>

        <View style={mergeStyles(styles.lifeMomentsSecondarySection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.lifeMomentsSecondaryHeader}>
              <Text style={styles.lifeMomentsSecondaryTitle}>Need something more specific?</Text>
              <Text style={styles.lifeMomentsSecondarySubtitle}>Tap into curated collections tailored for every type of gifter.</Text>
            </View>
            {isDesktop ? (
              <View style={mergeStyles(styles.lifeMomentsGrid, responsiveStyles.lifeMomentGridDesktop)}>
                {lifeMomentsSecondary.map((moment) => renderLifeMomentCard(moment, "secondary"))}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={responsiveStyles.lifeMomentScrollContent}
                style={styles.lifeMomentsScroll}
              >
                {lifeMomentsSecondary.map((moment) => renderLifeMomentCard(moment, "secondary"))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={mergeStyles(styles.eventSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.eventSectionTitle}>Upcoming events</Text>
              <Ionicons name="chevron-forward" size={28} color="black" />
            </View>
            {isDesktop ? (
              <View style={responsiveStyles.eventsDesktopList}>
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={{ pathname: "/add-gift", params: { listId: String(event.id) } }} asChild>
                    <Pressable style={mergeStyles(styles.eventCard, responsiveStyles.eventCardDesktop)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
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
                  </Link>
                ))}
              </View>
            ) : (
              <ScrollView horizontal style={styles.eventsScroll} directionalLockEnabled decelerationRate="fast" showsHorizontalScrollIndicator={false}>
                {upcomingEvents.map((event) => (
                  <Link key={event.id} href={{ pathname: "/add-gift", params: { listId: String(event.id) } }} asChild>
                    <Pressable style={styles.eventCard} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
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
                  </Link>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Top Picks */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top picks for you...</Text>
              <Pressable>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </Pressable>
            </View>
            {isDesktop ? (
              <View style={responsiveStyles.picksDesktopList}>
                {topPicks.map((item) => (
                  <View key={item.id} style={mergeStyles(styles.pickCard, responsiveStyles.pickCardDesktop)}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 147, width: 180, borderRadius: 8 }} contentFit="contain" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picksScroll}>
                {topPicks.map((item) => (
                  <View key={item.id} style={styles.pickCard}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 147, width: 180, borderRadius: 8 }} contentFit="contain" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Inspiration Boards */}
        <View style={mergeStyles(styles.isection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Inspiration boards</Text>
              <Pressable>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </Pressable>
            </View>
            {isDesktop ? (
              <View style={responsiveStyles.inspirationDesktopList}>
                {inspirationBoards.map((board) => (
                  <Pressable key={board.id} style={mergeStyles(styles.inspirationCard, responsiveStyles.inspirationCardDesktop)}>
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
            ) : (
              inspirationBoards.map((board) => (
                <Pressable key={board.id} style={styles.inspirationCard}>
                  <View style={styles.inspirationContent}>
                    <Text style={styles.inspirationTitle}>{board.title}</Text>
                    <Text style={styles.inspirationSubtitle}>{board.subtitle}</Text>
                  </View>
                  <View style={styles.inspirationImageContainer}>
                    <Image style={{ width: 148, height: 148 }} contentFit="cover" source={board.image} />
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>

        {/* AI Assistant */}
        <View style={mergeStyles(styles.aiSection, isDesktop ? responsiveStyles.aiSectionOuter : null)}>
          {isDesktop ? (
            <View style={responsiveStyles.aiSectionDesktopWrapper}>
              <View style={responsiveStyles.aiSectionDesktop}>
                <View style={responsiveStyles.aiContentDesktop}>
                  <View style={styles.aiHeader}>
                    <Text style={styles.aiButton}>AI-POWERED</Text>
                  </View>
                  <Text style={styles.aiTitle}>Meet Genie!</Text>
                  <Text style={styles.aiDescription}>Let our smart assistant suggest the perfect registry items based on your lifestyle, preferences, and needs — saving you time and guesswork!</Text>
                  <Pressable style={styles.aiChatButton}>
                    <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
                  </Pressable>
                </View>
                <View style={responsiveStyles.aiRobotDesktop}>
                  <Image source={require("@/assets/images/robot.png")} style={mergeStyles(styles.robotImage, responsiveStyles.robotImageDesktop)} contentFit="contain" />
                </View>
              </View>
            </View>
          ) : (
            <>
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
            </>
          )}
        </View>
        <View style={isDesktop ? responsiveStyles.signOutWrapper : { paddingHorizontal: 20, marginTop: 24 }}>
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
