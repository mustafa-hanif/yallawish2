import { Image } from "expo-image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ContactUs } from "@/components/homepage/ContactUs";
import { DownloadCTA } from "@/components/homepage/DownloadCTA";
import { FAQSection } from "@/components/homepage/FAQSection";
import { Footer } from "@/components/homepage/Footer";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles";
import { responsiveStylesHome } from "@/styles/homePageResponsiveStyles";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { Alert, Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
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

const responsiveStyles = responsiveStylesHome;
export function Desktop() {
  const { user } = useUser();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState(1);
  const scrollRef = useRef<ScrollView | null>(null);
  const TOTAL_PAGES = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => {
        let next = prev + scrollDir;

        // reverse direction when reaching edges
        if (next >= TOTAL_PAGES) {
          next = TOTAL_PAGES - 1;
          setScrollDir(-1);
        } else if (next < 0) {
          next = 0;
          setScrollDir(1);
        }

        scrollRef.current?.scrollTo({
          x: next * SCREEN_WIDTH,
          animated: true,
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [scrollDir]);

  const profilePhoto = user?.imageUrl ?? (typeof user?.unsafeMetadata?.profileImageUrl === "string" ? (user.unsafeMetadata.profileImageUrl as string) : undefined);

  const profileInitials = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    if (name) {
      return (
        name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || "YW"
      );
    }

    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    if (email) {
      const letters = email
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
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
    icon?: any;
  };

  const lifeMomentsPrimary: LifeMomentCard[] = [
    {
      id: "birthday",
      title: "Birthday",
      caption: "150+ curated templates",
      background: "#FEFBEB",
      accent: "#F5B400",
      icon: require("@/assets/images/birthday.svg"),
    },
    {
      id: "baby",
      title: "Baby Shower",
      caption: "150+ curated templates",
      background: "#EEF6FF",
      accent: "#92C5FD",
      icon: require("@/assets/images/babyShower.svg"),
    },
    {
      id: "bridal",
      title: "Bridal Shower",
      caption: "150+ curated templates",
      background: "#FDF1F8",
      accent: "#F8A8D4",
      icon: require("@/assets/images/bridalShower.svg"),
    },
    {
      id: "graduation",
      title: "Graduation",
      caption: "150+ curated templates",
      background: "#EDFFEE",
      accent: "#C4FD74",
      icon: require("@/assets/images/graduation.svg"),
    },
    {
      id: "wedding",
      title: "Wedding",
      caption: "150+ curated templates",
      background: "#FAF5FF",
      accent: "#D8B3FE",
      icon: require("@/assets/images/wedding.svg"),
    },
    {
      id: "retirement",
      title: "Retirement",
      caption: "150+ curated templates",
      background: "#F9FAFB",
      accent: "#D5D9DE",
      icon: require("@/assets/images/retirement.svg"),
    },
    {
      id: "housewarming",
      title: "House Warming",
      caption: "150+ curated templates",
      background: "#EFFDFA",
      accent: "#5EEAD3",
      icon: require("@/assets/images/houseWarming.svg"),
    },
    {
      id: "viewmore",
      title: "View More",
      caption: "Explore other moments",
      background: "#DCDCDC",
      accent: "#C4C4C4",
      icon: require("@/assets/images/viewMore.svg"),
    },
  ];

  const categories = [
    {
      id: 1,
      name: "Wedding",
      icon: require("@/assets/images/wedding2.svg"),
      color: "#FF3B30",
    },
    {
      id: 2,
      name: "Baby Shower",
      icon: require("@/assets/images/babyShower2.svg"),
      color: "#00C7BE",
    },
    {
      id: 3,
      name: "Birthday",
      icon: require("@/assets/images/birthday2.svg"),
      color: "#FFCC00",
    },
    {
      id: 4,
      name: "Graduation",
      icon: require("@/assets/images/graduation2.svg"),
      color: "#32ADE6",
    },

    {
      id: 5,
      name: "Bridal Shower",
      icon: require("@/assets/images/bridalShower2.svg"),
      color: "#AF52DE",
    },

    {
      id: 6,
      name: "House Warming",
      icon: require("@/assets/images/newHome2.svg"),
      color: "#5856D6",
    },

    {
      id: 7,
      name: "Retirement",
      icon: require("@/assets/images/retirement2.svg"),
      color: "#FF9500",
    },
    {
      id: 8,
      name: "Other",
      icon: require("@/assets/images/other2.svg"),
      color: "#A2845E",
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

  // const initialCards = [
  //   { id: 0, title: "Create List", subtitle: "Create a new wishlist for any occasion", image: require("@/assets/images/addList.png"), backgroundColor: "#F3ECFE", action: handleCreateWishlist },
  //   { id: 1, title: "Share List", subtitle: "Invite friends & family to view your list", image: require("@/assets/images/shareList.png"), backgroundColor: "#E9FFE2", action: () => Alert.alert("Share", "Sharing coming soon") },
  //   { id: 2, title: "Add Community", subtitle: "See popular public registries", image: require("@/assets/images/community.png"), backgroundColor: "#C2D9FF", action: () => Alert.alert("Community", "Community lists coming soon") },
  // ];

  const initialCards = [
    {
      id: "1",
      title: "Create List",
      subtitle: "Create a new wishlist for any occasion",
      image: require("@/assets/images/createList.png"),
      backgroundColor: "#F3ECFE",
      action: handleCreateWishlist,
    },
    {
      id: "2",
      title: "Share List",
      subtitle: "Invite friends & family to view your list",
      image: require("@/assets/images/addCommunity.png"),
      backgroundColor: "#E9FFE2",
      action: () => Alert.alert("Share", "Sharing coming soon"),
    },
    {
      id: "3",
      title: "Add Community",
      subtitle: "See popular public registries",
      image: require("@/assets/images/shareList.png"),
      backgroundColor: "#C2D9FF",
      action: () => Alert.alert("Community", "Community lists coming soon"),
    },
    //    {
    //   id: "4",
    //   title: "Create List",
    //   subtitle: "Create a new wishlist for any occasion",
    //   image: require("@/assets/images/purple-3.png"),
    //   backgroundColor: "#F3ECFE",
    //   action: handleCreateWishlist,
    // },
    // {
    //   id: "5",
    //   title: "Share List",
    //   subtitle: "Invite friends & family to view your list",
    //   image: require("@/assets/images/purple-4.png"),
    //   backgroundColor: "#E9FFE2",
    //   action: () => Alert.alert("Share", "Sharing coming soon"),
    // },
    // {
    //   id: "6",
    //   title: "Add Community",
    //   subtitle: "See popular public registries",
    //   image: require("@/assets/images/purple-5.png"),
    //   backgroundColor: "#C2D9FF",
    //   action: () => Alert.alert("Community", "Community lists coming soon"),
    // },
    //  {
    //   id: "7",
    //   title: "Add Community",
    //   subtitle: "See popular public registries",
    //   image: require("@/assets/images/purple-2.png"),
    //   backgroundColor: "#C2D9FF",
    //   action: () => Alert.alert("Community", "Community lists coming soon"),
    // },
  ];
  // Cards array static for infinite loop (no state mutation needed)
  const cards = initialCards;

  const mergeStyles = (...styleInputs: any[]) => StyleSheet.flatten(styleInputs.filter(Boolean));

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
          isDesktop ? responsiveStyles.lifeMomentCardDesktop : responsiveStyles.lifeMomentCardMobile
        )}
        onPress={() => {
          if (moment.href) {
            router.push(moment.href as any);
            return;
          }
          Alert.alert("Coming soon", "More curated experiences are on the way!");
        }}
      >
        {moment?.icon ? <Image source={moment?.icon} style={styles.renderLifeMomentCardIcon} /> : null}
        <View>
          <Text style={mergeStyles(styles.lifeMomentTitle, { color: textColor }, !isDesktop ? styles.lifeMomentTitleMobile : {})}>{moment.title}</Text>
          <Text style={mergeStyles(styles.lifeMomentCaption, !isDesktop ? styles.lifeMomentCaptionMobile : {}, { color: variant === "secondary" ? "#EDE9FF" : "#5B5569" })}>{moment.caption}</Text>
        </View>

        <Image source={require("@/assets/images/arrowRightGrey.svg")} style={styles.renderLifeMomentCardArrowIcon} />
      </Pressable>
    );
  };

  const renderCategoryCard = (category: any) => {
    return (
      <Pressable key={category.id} style={mergeStyles(styles.categoryCard, isDesktop ? styles.categoryCardDesktop : styles.categoryCardMobile, { borderColor: category.color })}>
        <View style={!isDesktop ? styles.categoryContentMobile : styles.categoryContent}>
          {category?.icon && <Image source={category?.icon} style={!isDesktop ? styles.categoryIconMobile : styles.categoryIcon} contentFit="contain" />}

          <Text style={!isDesktop ? styles.categoryNameMobile : styles.categoryName}>{category.name}</Text>
          <Image style={!isDesktop ? styles.arrowWhiteIconMobile : styles.arrowWhiteIconDesktop} source={require("@/assets/images/arrowRightWhite.svg")} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#2C0077" }]}>
      <ScrollView style={{ backgroundColor: "#FFFFFF" }} contentContainerStyle={mergeStyles(responsiveStyles.pageContainer)} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ width: "100%" }}>
          {/* Top Promotional Banner */}
          <View
            style={{
              backgroundColor: "#F8A8D4",
              paddingVertical: 8,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Nunito_600SemiBold",
                fontSize: 14,
                color: "#330065",
              }}
            >
              FREE SHIPPING FOR ALL ORDERS OF AED150
            </Text>
          </View>

          {/* Main Navigation Bar */}
          <View style={mergeStyles(styles.headerWrapper, isDesktop ? responsiveStyles.headerWrapper : null)}>
            <View style={mergeStyles(styles.navBar, isDesktop ? responsiveStyles.navBarDesktop : null)}>
              <Pressable onPress={() => router.replace("/")} style={styles.navBrandRow}>
                <Image source={require("@/assets/images/yallawish_logo.png")} style={styles.navBrandLogo} contentFit="contain" />
              </Pressable>

              <View style={mergeStyles(styles.searchContainer, responsiveStyles.headerSearch)}>
                <LucideIcons.Search size={20} color="#FFFFFF" />
                <TextInput placeholder="Search for gifts, lists or inspirations..." style={styles.searchInput} placeholderTextColor="#D9CCFF" />
              </View>

              <View style={[styles.navActions, { gap: 20 }]}>
                <SignedOut>
                  <Pressable onPress={() => router.push("/sign-up")}>
                    <Text style={styles.navAuthLink}>Sign up</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push("/log-in")}>
                    <Text style={styles.navAuthLink}>Login</Text>
                  </Pressable>
                </SignedOut>
                <SignedIn>
                  <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={[styles.navAuthLink, { marginRight: 0 }]}>Account</Text>
                    <LucideIcons.User size={20} color="#FFFFFF" />
                  </Pressable>
                  <Pressable>
                    <LucideIcons.Heart size={24} color="#FFFFFF" strokeWidth={2} />
                  </Pressable>
                  <Pressable>
                    <LucideIcons.ShoppingBag size={24} color="#FFFFFF" strokeWidth={2} />
                  </Pressable>
                </SignedIn>
              </View>
            </View>
          </View>

          {/* Secondary Navigation Bar - Categories */}
          {isDesktop && (
            <View
              style={{
                backgroundColor: "#03FFEE",
                paddingVertical: 12,
                paddingHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 32 }}>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <LucideIcons.Flame size={18} color="#1C0335" />
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>Trending</Text>
                </Pressable>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <LucideIcons.Heart size={18} color="#1C0335" />
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>Wedding</Text>
                </Pressable>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <LucideIcons.Baby size={18} color="#1C0335" />
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>Baby</Text>
                </Pressable>
                <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <LucideIcons.Gift size={18} color="#1C0335" />
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>Birthday</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
                <Pressable>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>My Gift List</Text>
                </Pressable>
                <Pressable>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>Why YallaWish?</Text>
                </Pressable>
                <Pressable>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#1C0335" }}>YallaWish for Business</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        {/* Hero */}
        <View style={mergeStyles(styles.heroSection, isDesktop ? responsiveStyles.heroSectionDesktop : null, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 })}>
          <View
            style={{
              width: "100%",
              height: isDesktop ? 600 : 400,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background Image */}
            <Image
              source={require("@/assets/images/homepage/homepage_image.png")}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              contentFit="cover"
            />

            {/* Dark Overlay */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                paddingHorizontal: isDesktop ? 60 : 24,
                paddingVertical: isDesktop ? 80 : 60,
              }}
            >
              {/* Main Content Container */}
              <View
                style={{
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: isDesktop ? 900 : "100%",
                  alignSelf: "center",
                }}
              >
                {/* Top Content */}
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    width: "100%",
                  }}
                >
                  {/* Main Headline */}
                  <Text
                    style={{
                      fontFamily: "Nunito_700Bold",
                      fontSize: isDesktop ? 56 : 32,
                      color: "#FFFFFF",
                      textAlign: "center",
                      marginBottom: isDesktop ? 20 : 16,
                      lineHeight: isDesktop ? 68 : 40,
                    }}
                  >
                    Celebrate Every Moment with the Perfect Gift
                  </Text>

                  {/* Sub-headline */}
                  <Text
                    style={{
                      fontFamily: "Nunito_400Regular",
                      fontSize: isDesktop ? 20 : 16,
                      color: "#FFFFFF",
                      textAlign: "center",
                      marginBottom: isDesktop ? 40 : 32,
                      lineHeight: isDesktop ? 28 : 22,
                      opacity: 0.95,
                    }}
                  >
                    Shop handpicked gifts for weddings, birthdays, and every special day in between.
                  </Text>

                  {/* CTA Buttons */}
                  <View
                    style={{
                      flexDirection: isDesktop ? "row" : "column",
                      gap: isDesktop ? 16 : 12,
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {/* Create Gift List Button */}
                    <Pressable
                      onPress={handleCreateWishlist}
                      style={{
                        backgroundColor: "#00C4F0",
                        borderRadius: 999,
                        paddingHorizontal: isDesktop ? 32 : 24,
                        paddingVertical: isDesktop ? 16 : 14,
                        minWidth: isDesktop ? 200 : "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_600SemiBold",
                          fontSize: isDesktop ? 16 : 15,
                          color: "#FFFFFF",
                        }}
                      >
                        Create Gift List
                      </Text>
                    </Pressable>

                    {/* Discover Gifts Button */}
                    <Pressable
                      style={{
                        borderWidth: 2,
                        borderColor: "#00D4AA",
                        borderRadius: 999,
                        paddingHorizontal: isDesktop ? 32 : 24,
                        paddingVertical: isDesktop ? 16 : 14,
                        minWidth: isDesktop ? 200 : "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_600SemiBold",
                          fontSize: isDesktop ? 16 : 15,
                          color: "#FFFFFF",
                        }}
                      >
                        Discover Gifts
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Explore YallaWish Element - Bottom */}
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: isDesktop ? 0 : 16,
                    marginTop: isDesktop ? 10 : 0,
                  }}
                >
                  <Image
                    source={require("@/assets/images/homepage/explore_button.png")}
                    style={{
                      width: isDesktop ? 120 : 100,
                      height: isDesktop ? 120 : 100,
                    }}
                    contentFit="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* {!isDesktop ? renderActionCards() : null} */}

        {/* Life moments */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingVertical: isDesktop ? 80 : 40,
            paddingHorizontal: isDesktop ? 0 : 20,
          }}
        >
          {isDesktop ? (
            <View
              style={{
                width: "100%",
                maxWidth: 1800,
                alignSelf: "center",
                paddingHorizontal: 150,
                flexDirection: "row",
                alignItems: "center",
                gap: 60,
              }}
            >
              {/* Left Side - Text and Button */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 48,
                    color: "#1A0034",
                    marginBottom: 8,
                  }}
                >
                  Browse By Specials
                </Text>
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 48,
                    color: "#1A0034",
                    marginBottom: 32,
                  }}
                >
                  Life Moments
                </Text>
                <Pressable
                  style={{
                    borderWidth: 1,
                    borderColor: "#36006C",
                    borderRadius: 999,
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    backgroundColor: "#fff",
                    alignSelf: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito_600SemiBold",
                      fontSize: 16,
                      color: "#36006C",
                    }}
                  >
                    Discover Gifts
                  </Text>
                </Pressable>
              </View>

              {/* Right Side - Cards */}
              <View style={{ flex: 1.5, flexDirection: "row", gap: 24 }}>
                {/* Birthday Card */}
                <Pressable
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image source={require("@/assets/images/homepage/homepage_image_1.png")} style={{ width: "100%", height: 400 }} contentFit="cover" />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(51, 0, 101, 0.8)",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 24,
                        color: "#FFFFFF",
                        marginBottom: 4,
                      }}
                    >
                      Birthday
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#FFFFFF",
                        opacity: 0.9,
                      }}
                    >
                      55 Products
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LucideIcons.ArrowUpRight size={20} color="#FFFFFF" />
                  </View>
                </Pressable>

                {/* Wedding Card */}
                <Pressable
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image source={require("@/assets/images/homepage/homepage_image_2.png")} style={{ width: "100%", height: 400 }} contentFit="cover" />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(51, 0, 101, 0.8)",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 24,
                        color: "#FFFFFF",
                        marginBottom: 4,
                      }}
                    >
                      Wedding
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#FFFFFF",
                        opacity: 0.9,
                      }}
                    >
                      30 Products
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LucideIcons.ArrowUpRight size={20} color="#FFFFFF" />
                  </View>
                </Pressable>

                {/* Graduation Card */}
                <Pressable
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image source={require("@/assets/images/homepage/homepage_image3.png")} style={{ width: "100%", height: 400 }} contentFit="cover" />
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(51, 0, 101, 0.8)",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 24,
                        color: "#FFFFFF",
                        marginBottom: 4,
                      }}
                    >
                      Graduation
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#FFFFFF",
                        opacity: 0.9,
                      }}
                    >
                      20 Products
                    </Text>
                  </View>
                  <View
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LucideIcons.ArrowUpRight size={20} color="#FFFFFF" />
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 32,
                  color: "#D8B3FE",
                  marginBottom: 8,
                }}
              >
                Browse By Specials
              </Text>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 32,
                  color: "#330065",
                  marginBottom: 24,
                }}
              >
                Life Moments
              </Text>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderColor: "#D8B3FE",
                  borderRadius: 999,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  backgroundColor: "#000000",
                  alignSelf: "flex-start",
                  marginBottom: 24,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 14,
                    color: "#FFFFFF",
                  }}
                >
                  Discover Gifts
                </Text>
              </Pressable>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                {[
                  { title: "Birthday", products: "55 Products", image: require("@/assets/images/homepage/homepage_image_1.png") },
                  { title: "Wedding", products: "30 Products", image: require("@/assets/images/homepage/homepage_image_2.png") },
                  { title: "Graduation", products: "20 Products", image: require("@/assets/images/homepage/homepage_image3.png") },
                ].map((card, index) => (
                  <Pressable
                    key={index}
                    style={{
                      width: 280,
                      borderRadius: 16,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Image source={card.image} style={{ width: "100%", height: 350 }} contentFit="cover" />
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(51, 0, 101, 0.4)",
                      }}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 16,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_700Bold",
                          fontSize: 20,
                          color: "#FFFFFF",
                          marginBottom: 4,
                        }}
                      >
                        {card.title}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Nunito_400Regular",
                          fontSize: 12,
                          color: "#FFFFFF",
                          opacity: 0.9,
                        }}
                      >
                        {card.products}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcons.ArrowUpRight size={18} color="#FFFFFF" />
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Categories */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            paddingVertical: isDesktop ? 80 : 40,
          }}
        >
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={{ alignItems: "center", marginBottom: 48 }}>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 32,
                  color: "#1C0335",
                  textAlign: "center",
                }}
              >
                Shop By Categories
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: isDesktop ? "space-between" : "center",
                gap: isDesktop ? 0 : 32,
              }}
            >
              {[
                { title: "Wedding Essentials", products: "23 Products", image: require("@/assets/images/homepage/circle1.png") },
                { title: "Tech For Him", products: "56 Products", image: require("@/assets/images/homepage/circle2.png") },
                { title: "Luxury For Her", products: "30 Products", image: require("@/assets/images/homepage/circle3.png") },
                { title: "Gifts For Kids", products: "80 Products", image: require("@/assets/images/homepage/circle4.png") },
                { title: "Home & Lifestyle", products: "99+ Products", image: require("@/assets/images/homepage/circle5.png") },
                { title: "Personalized Gifts", products: "50 Products", image: require("@/assets/images/homepage/circle6.png") },
              ].map((category, index) => (
                <Pressable
                  key={index}
                  style={{
                    alignItems: "center",
                    width: isDesktop ? "16%" : "45%",
                    maxWidth: 200,
                  }}
                >
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      overflow: "hidden",
                      marginBottom: 16,
                      backgroundColor: "#FFFFFF",
                      elevation: 2,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                    }}
                  >
                    <Image source={category.image} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  </View>
                  <Text
                    style={{
                      fontFamily: "Nunito_700Bold",
                      fontSize: 18,
                      color: "#1C0335",
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    {category.title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Nunito_400Regular",
                      fontSize: 14,
                      color: "#6F5F8F",
                      textAlign: "center",
                    }}
                  >
                    {category.products}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* New Arrivals */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: isDesktop ? 80 : 40,
            paddingHorizontal: isDesktop ? 0 : 20,
          }}
        >
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={{ alignItems: "center", marginBottom: 48 }}>
              <View
                style={{
                  backgroundColor: "#F8A8D4",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginBottom: 16,
                  transform: [{ rotate: "-5deg" }],
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 12,
                    color: "#330065",
                    textTransform: "uppercase",
                  }}
                >
                  Hurry up to buy
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 48,
                  color: "#1A0034",
                  textAlign: "center",
                }}
              >
                New Arrivals
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 24,
                justifyContent: isDesktop ? "space-between" : "center",
              }}
            >
              {[
                {
                  id: 1,
                  name: "Classic PX Smart Watch",
                  category: "Accessories, Watches",
                  price: "AED 249.00 - AED 399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival1.png"),
                  bgColor: "#E6F4FE",
                },
                {
                  id: 2,
                  name: "Hoor Stylish Edged Ring",
                  category: "Jewelry, Ring",
                  price: "AED 249.00",
                  image: require("@/assets/images/homepage/arrivals/arrival2.png"),
                  bgColor: "#FDF2F8",
                },
                {
                  id: 3,
                  name: "Frames Upholstered Chair",
                  category: "Furniture, Chairs",
                  price: "AED 549.00",
                  image: require("@/assets/images/homepage/arrivals/arrival3.png"),
                  bgColor: "#FEFBEB",
                },
                {
                  id: 4,
                  name: "Nude Liquid Powder",
                  category: "Makeup, Skincare",
                  price: "AED 399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival4.png"),
                  bgColor: "#FEFCE8",
                },
                {
                  id: 5,
                  name: "Baby Girl Warm Shirt",
                  category: "Clothes, Baby",
                  price: "AED 99.00 - AED 199.00",
                  image: require("@/assets/images/homepage/arrivals/arrival5.png"),
                  bgColor: "#F3E8FF",
                },
                {
                  id: 6,
                  name: "BERIBES Bluetooth Headphones",
                  category: "Accessories, Headphones",
                  price: "AED 149.00",
                  image: require("@/assets/images/homepage/arrivals/arrival6.png"),
                  bgColor: "#E0F2FE",
                },
              ].map((item) => (
                <View
                  key={item.id}
                  style={{
                    width: isDesktop ? "31%" : "100%",
                    maxWidth: 400,
                    marginBottom: 40,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.bgColor,
                      borderRadius: 16,
                      aspectRatio: 1.2,
                      marginBottom: 20,
                      position: "relative",
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    <Image source={item.image} style={{ width: "90%", height: "90%" }} contentFit="contain" />
                    <Pressable
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: "#330065",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcons.Heart size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 18,
                        color: "#1A0034",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#6F5F8F",
                        marginBottom: 8,
                        textAlign: "center",
                      }}
                    >
                      {item.category}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 16,
                        color: "#DC2626",
                        marginBottom: 16,
                        textAlign: "center",
                      }}
                    >
                      {item.price}
                    </Text>
                    <Pressable
                      style={{
                        borderWidth: 1,
                        borderColor: "#330065",
                        borderRadius: 999,
                        paddingHorizontal: 24,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_600SemiBold",
                          fontSize: 14,
                          color: "#330065",
                        }}
                      >
                        Add to List
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={{ alignItems: "center", marginTop: 24 }}>
              <Pressable
                style={{
                  backgroundColor: "#330065",
                  borderRadius: 999,
                  paddingHorizontal: 32,
                  paddingVertical: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_600SemiBold",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  Browse More Gifts
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Gift Finder Wizard */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: isDesktop ? 80 : 40,
            paddingHorizontal: isDesktop ? 0 : 20,
          }}
        >
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View
              style={{
                flexDirection: isDesktop ? "row" : "column",
                gap: isDesktop ? 80 : 40,
                alignItems: "center",
              }}
            >
              {/* Left Column - Form */}
              <View style={{ flex: 1, width: "100%" }}>
                <View
                  style={{
                    backgroundColor: "#5C9DFF",
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                    marginBottom: 16,
                    transform: [{ rotate: "-3deg" }],
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito_700Bold",
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    Gift Finder Wizard
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: isDesktop ? 42 : 32,
                    color: "#1A0034",
                    marginBottom: 16,
                    lineHeight: isDesktop ? 54 : 40,
                  }}
                >
                  Find the Perfect Gift in 3 Simple Steps
                </Text>

                <Text
                  style={{
                    fontFamily: "Nunito_400Regular",
                    fontSize: 16,
                    color: "#4B5563",
                    marginBottom: 40,
                    lineHeight: 24,
                  }}
                >
                  Not sure what to buy? Let us guide you. Answer a few quick questions and discover personalized gift ideas instantly.
                </Text>

                <View style={{ gap: 24 }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Nunito_600SemiBold",
                        fontSize: 14,
                        color: "#1F2937",
                        marginBottom: 8,
                      }}
                    >
                      Moment/Occasion
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#9CA3AF",
                        borderRadius: 24,
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                      }}
                    >
                      <TextInput
                        placeholder="Wedding"
                        style={{
                          fontFamily: "Nunito_400Regular",
                          fontSize: 16,
                          color: "#1F2937",
                        }}
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontFamily: "Nunito_600SemiBold",
                        fontSize: 14,
                        color: "#1F2937",
                        marginBottom: 8,
                      }}
                    >
                      Who It's For
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#9CA3AF",
                        borderRadius: 24,
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                      }}
                    >
                      <TextInput
                        placeholder="Wife/Husband"
                        style={{
                          fontFamily: "Nunito_400Regular",
                          fontSize: 16,
                          color: "#1F2937",
                        }}
                        placeholderTextColor="#9CA3AF"
                      />
                    </View>
                  </View>

                  <View>
                    <Text
                      style={{
                        fontFamily: "Nunito_600SemiBold",
                        fontSize: 14,
                        color: "#1F2937",
                        marginBottom: 8,
                      }}
                    >
                      Tell Your Budget ( AED)
                    </Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#9CA3AF",
                        borderRadius: 24,
                        paddingHorizontal: 20,
                        paddingVertical: 14,
                      }}
                    >
                      <TextInput
                        placeholder="e.g 50"
                        style={{
                          fontFamily: "Nunito_400Regular",
                          fontSize: 16,
                          color: "#1F2937",
                        }}
                        placeholderTextColor="#9CA3AF"
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <Pressable
                    style={{
                      backgroundColor: "#330065",
                      borderRadius: 999,
                      paddingVertical: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 12,
                      marginTop: 16,
                      shadowColor: "#330065",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <LucideIcons.Sparkles size={20} color="#FFFFFF" />
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 16,
                        color: "#FFFFFF",
                      }}
                    >
                      Find My Gift
                    </Text>
                  </Pressable>
                </View>

                <View style={{ position: "absolute", bottom: -40, left: 0 }}>
                  <LucideIcons.Sparkles size={24} color="#330065" style={{ opacity: 0.6 }} />
                </View>
              </View>

              {/* Right Column - Placeholder */}
              <View style={{ flex: 1, width: "100%", aspectRatio: isDesktop ? 1.4 : 1 }}>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    borderWidth: 2,
                    borderColor: "#E5E7EB",
                    borderStyle: "dashed", // Note: specific style for web, might need solid for native or custom component
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FAFAFA", // Very light gray background for the placeholder area
                  }}
                >
                  <View style={{ alignItems: "center", gap: 16 }}>
                    <LucideIcons.Wand size={48} color="#9CA3AF" />
                    <Text
                      style={{
                        fontFamily: "Nunito_600SemiBold",
                        fontSize: 18,
                        color: "#9CA3AF",
                      }}
                    >
                      Surprise me
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 80,
            paddingHorizontal: 0,
          }}
        >
          <View style={responsiveStyles.sectionInner}>
            <View style={{ flexDirection: "row", gap: 24, justifyContent: "space-between" }}>
              {[
                {
                  id: 1,
                  title: "Riiffs La Femme Bloom For Women Perfume 100ml",
                  price: "AED399.99",
                  image: require("@/assets/images/homepage/promotions/promotion1.png"),
                  bgColor: "#F59E7E", // Peach/Orange
                },
                {
                  id: 2,
                  title: "Sunset Breeze Women's Sandals",
                  price: "AED109.99",
                  image: require("@/assets/images/homepage/promotions/promotion2.png"),
                  bgColor: "#6B7FD7", // Blue/Purple
                },
                {
                  id: 3,
                  title: "Beautiful elegance and luxury fashion green handbag",
                  price: "AED299.99",
                  image: require("@/assets/images/homepage/promotions/promotion3.png"),
                  bgColor: "#10B981", // Teal/Green
                },
              ].map((item) => (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    backgroundColor: item.bgColor,
                    borderRadius: 24,
                    padding: 32,
                    alignItems: "center",
                    justifyContent: "space-between",
                    minHeight: 500,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 250,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 24,
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        width: 200,
                        height: 200,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: 100,
                        transform: [{ scaleX: 1.2 }],
                      }}
                    />
                    <Image source={item.image} style={{ width: 220, height: 220 }} contentFit="contain" />
                  </View>

                  <View style={{ alignItems: "center", gap: 24 }}>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 20,
                        color: "#FFFFFF",
                        textAlign: "center",
                        lineHeight: 28,
                      }}
                    >
                      {item.title}
                    </Text>

                    <Pressable
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 999,
                        paddingHorizontal: 32,
                        paddingVertical: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Nunito_600SemiBold",
                          fontSize: 14,
                          color: "#1F2937",
                        }}
                      >
                        Add to List
                      </Text>
                    </Pressable>

                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 18,
                        color: "#FFFFFF",
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 80,
            paddingHorizontal: 0,
          }}
        >
          <View style={responsiveStyles.sectionInner}>
            <View style={{ alignItems: "center", marginBottom: 48 }}>
              <View
                style={{
                  backgroundColor: "#F8A8D4",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginBottom: 16,
                  transform: [{ rotate: "-3deg" }],
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 12,
                    color: "#FFFFFF",
                    textTransform: "uppercase",
                  }}
                >
                  Best of the Week
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 42,
                  color: "#1A0034",
                  textAlign: "center",
                }}
              >
                Recommended Bestsellers
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 24, justifyContent: "space-between" }}>
              {[
                {
                  id: 1,
                  title: "Classic PX Smart Watch",
                  category: "Accessories, Watches",
                  price: "AED249.00 - AED399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival1.png"),
                  bgColor: "#E6F4FE", // Light Blue
                },
                {
                  id: 2,
                  title: "Baby Girl Warm Shirt",
                  category: "Clothes, Baby",
                  price: "AED99.00 - AED199.00",
                  image: require("@/assets/images/homepage/arrivals/arrival5.png"),
                  bgColor: "#F3E8FF", // Light Purple
                },
                {
                  id: 3,
                  title: "Frames Upholstered Chair",
                  category: "Furniture, Chairs",
                  price: "AED549.00",
                  image: require("@/assets/images/homepage/arrivals/arrival3.png"),
                  bgColor: "#FEFBEB", // Light Yellow
                },
              ].map((item) => (
                <View
                  key={item.id}
                  style={{
                    flex: 1,
                    maxWidth: 400,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.bgColor,
                      borderRadius: 16,
                      aspectRatio: 1.2,
                      marginBottom: 24,
                      position: "relative",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    <Image source={item.image} style={{ width: "80%", height: "80%" }} contentFit="contain" />
                    <Pressable
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "#330065",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LucideIcons.Heart size={18} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 20,
                        color: "#1A0034",
                        textAlign: "center",
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#6F5F8F",
                        textAlign: "center",
                        marginBottom: 8,
                      }}
                    >
                      {item.category}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 18,
                        color: "#DC2626",
                        textAlign: "center",
                      }}
                    >
                      {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            paddingVertical: 80,
            paddingHorizontal: 80,
            backgroundColor: "#FFFFFF",
          }}
        >
          <View style={responsiveStyles.sectionInner}>
            <LinearGradient
              colors={["#F472B6", "#F9A8D4", "#FBCFE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 32,
                paddingVertical: 80,
                paddingHorizontal: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 999,
                  marginBottom: 32,
                  transform: [{ rotate: "-2deg" }],
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 16,
                    color: "#1A0034",
                  }}
                >
                  Ready to Start Your Gifting Journey?
                </Text>
              </View>

              <Text
                style={{
                  fontFamily: "Nunito_700Bold",
                  fontSize: 36,
                  color: "#1A0034",
                  textAlign: "center",
                  marginBottom: 48,
                  lineHeight: 54,
                  maxWidth: 900,
                }}
              >
                Create Your Own Gift List In Minutes, Share It With Friends & Family, And Make Every Celebration Memorable.
              </Text>

              <View style={{ flexDirection: "row", gap: 24 }}>
                <Pressable
                  onPress={handleCreateWishlist}
                  style={{
                    backgroundColor: "#330065",
                    borderRadius: 999,
                    paddingHorizontal: 48,
                    paddingVertical: 16,
                    minWidth: 200,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito_600SemiBold",
                      fontSize: 18,
                      color: "#FFFFFF",
                    }}
                  >
                    Create List
                  </Text>
                </Pressable>

                <Pressable
                  style={{
                    borderWidth: 2,
                    borderColor: "#330065",
                    borderRadius: 999,
                    paddingHorizontal: 48,
                    paddingVertical: 16,
                    minWidth: 200,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito_600SemiBold",
                      fontSize: 18,
                      color: "#330065",
                    }}
                  >
                    Browse Gifts
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingVertical: 80,
            paddingHorizontal: 0,
          }}
        >
          <View style={responsiveStyles.sectionInner}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 80 }}>
              {/* Left Column */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    backgroundColor: "#5C9DFF",
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                    marginBottom: 24,
                    transform: [{ rotate: "-3deg" }],
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito_700Bold",
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    Testimonial
                  </Text>
                </View>

                <Text
                  style={{
                    fontFamily: "Nunito_700Bold",
                    fontSize: 42,
                    color: "#1A0034",
                    marginBottom: 32,
                  }}
                >
                  Real Feedback, Real Satisfaction
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 32 }}>
                  <View style={{ flexDirection: "row" }}>
                    {[1, 2, 3].map((i) => (
                      <View
                        key={i}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          borderWidth: 2,
                          borderColor: "#FFFFFF",
                          marginLeft: i > 1 ? -12 : 0,
                          backgroundColor: "#E5E7EB",
                          overflow: "hidden",
                        }}
                      >
                        <Image source={require("@/assets/images/girlUser.png")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                      </View>
                    ))}
                  </View>
                  <View>
                    <View style={{ flexDirection: "row", gap: 4, marginBottom: 4 }}>
                      {[...Array(5)].map((_, i) => (
                        <LucideIcons.Star key={i} size={16} color="#FBBF24" fill="#FBBF24" />
                      ))}
                    </View>
                    <Text
                      style={{
                        fontFamily: "Nunito_600SemiBold",
                        fontSize: 14,
                        color: "#1A0034",
                      }}
                    >
                      5.9K Clients Reviews
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: "Nunito_400Regular",
                    fontSize: 18,
                    color: "#4B5563",
                    marginBottom: 32,
                    lineHeight: 28,
                  }}
                >
                  "YallaWish made my wedding planning so much easier! I created my gift list in minutes and shared it with all my guests. Everyone loved how simple it was, and I got exactly the gifts I needed. Truly a stress-free experience!"
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      overflow: "hidden",
                    }}
                  >
                    <Image source={require("@/assets/images/girlUser.png")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Nunito_700Bold",
                        fontSize: 16,
                        color: "#1A0034",
                      }}
                    >
                      Sarah Ahmed
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Nunito_400Regular",
                        fontSize: 14,
                        color: "#6B7280",
                      }}
                    >
                      Wedding Gift
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Column - Heart Graphic */}
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", position: "relative" }}>
                <View
                  style={{
                    opacity: 0.1,
                    transform: [{ scale: 1.5 }],
                  }}
                >
                  <LucideIcons.Heart size={400} color="#F472B6" fill="#FCE7F3" />
                </View>
                <View
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 0,
                    transform: [{ translateY: -50 }],
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <LucideIcons.ChevronRight size={24} color="#1A0034" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <FAQSection isDesktop={isDesktop} responsiveStyles={responsiveStyles} mergeStyles={mergeStyles} />

        {/* Download App Banner */}
        <DownloadCTA isDesktop={isDesktop} />

        {/* Contact Form */}
        <ContactUs isDesktop={isDesktop} responsiveStyles={responsiveStyles} mergeStyles={mergeStyles} />

        <Footer isDesktop={isDesktop} />
      </ScrollView>
    </SafeAreaView>
  );
}
