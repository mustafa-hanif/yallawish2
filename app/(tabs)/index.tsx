import { Image } from "expo-image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { SignOutButton } from "@/components";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
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
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
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
    maxWidth: 1800,
    alignSelf: "center",
    paddingHorizontal: 150,
  },
  lifeMomentGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems:'center',
    rowGap: 54.5
  },
   lifeMomentGridMobile: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    rowGap: 20
  },
  lifeMomentCardDesktop: {
    width: '23%',
    height: 246,
    minWidth: 260,
    justifyContent:'center'
  },
  lifeMomentCardMobile: {
    width: 300,
    // marginRight: 16,
  },
  lifeMomentScrollContent: {
    paddingHorizontal: 20,
    gap: 20
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
  aiSectionOuterMobile: {
    padding: 0,
    backgroundColor: "transparent",
    marginHorizontal: 0,
    marginTop: 0,
  },
  aiSectionDesktopWrapper: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    // paddingVertical: 40,
    // paddingHorizontal: 20,
  },
  aiSectionDesktop: {
    borderRadius: 32,
    // paddingHorizontal: 40,
    // paddingVertical: 40,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#330065",
  },
  aiContentDesktop: {
    flex: 1,
    padding: 40
  },
  aiRobotDesktop: {
    flex: 1,
    alignItems: "flex-end",
    height: '100%',
    justifyContent:'flex-end',
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
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState(1);
  const scrollRef = useRef<ScrollView | null>(null);
  const TOTAL_PAGES = 2; 


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(prev => {
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
    icon? : any
  };

  const lifeMomentsPrimary: LifeMomentCard[] = [
    {
      id: "birthday",
      title: "Birthday",
      caption: "150+ curated templates",
      background: "#FEFBEB",
      accent: "#F5B400",
      icon: require("@/assets/images/birthday.svg")
    },
    {
      id: "baby",
      title: "Baby Shower",
      caption: "150+ curated templates",
      background: "#EEF6FF",
      accent: "#92C5FD",
      icon: require("@/assets/images/babyShower.svg")
    },
     {
      id: "bridal",
      title: "Bridal Shower",
      caption: "150+ curated templates",
      background: "#FDF1F8",
      accent: "#F8A8D4",
      icon: require("@/assets/images/bridalShower.svg")
    },
    {
      id: "graduation",
      title: "Graduation",
      caption: "150+ curated templates",
      background: "#EDFFEE",
      accent: "#C4FD74",
      icon: require("@/assets/images/graduation.svg")
    },
    {
      id: "wedding",
      title: "Wedding",
      caption: "150+ curated templates",
      background: "#FAF5FF",
      accent: "#D8B3FE",
      icon: require("@/assets/images/wedding.svg")
    },
    {
      id: "retirement",
      title: "Retirement",
      caption: "150+ curated templates",
      background: "#F9FAFB",
      accent: "#D5D9DE",
      icon: require("@/assets/images/retirement.svg")
    },
    {
      id: "housewarming",
      title: "House Warming",
      caption: "150+ curated templates",
      background: "#EFFDFA",
      accent: "#5EEAD3",
      icon: require("@/assets/images/houseWarming.svg")
    },
    {
      id: "viewmore",
      title: "View More",
      caption: "Explore other moments",
      background: "#DCDCDC",
      accent: "#C4C4C4",
      icon: require("@/assets/images/viewMore.svg")
    },
  ];

  const categories = [
    { id: 1,
      name: "Wedding",
      icon: require("@/assets/images/wedding2.svg",),
      color: "#FF3B30"
     },
     { id: 2,
      name: "Baby Shower",
      icon: require("@/assets/images/babyShower2.svg",),
      color: "#00C7BE"
     },
    { id: 3,
      name: "Birthday",
      icon: require("@/assets/images/birthday2.svg",),
      color: "#FFCC00"
     },
      { id: 4,
      name: "Graduation",
      icon: require("@/assets/images/graduation2.svg",),
      color: "#32ADE6"
     },

      { id: 5,
      name: "Bridal Shower",
      icon: require("@/assets/images/bridalShower2.svg",),
      color: "#AF52DE"
     },

    { id: 6,
      name: "House Warming",
      icon: require("@/assets/images/newHome2.svg",),
      color: "#5856D6"
     },
   
    
    { id: 7,
      name: "Retirement",
      icon: require("@/assets/images/retirement2.svg",),
      color: "#FF9500"
     },
    { id: 8,
      name: "Other",
      icon: require("@/assets/images/other2.svg",),
      color: "#A2845E"
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
      <ScrollView
        style={{ backgroundColor: "#FFFFFF" }}
        contentContainerStyle={mergeStyles(responsiveStyles.pageContainer)}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ width: "100%" }}>
          {/* Top Promotional Banner */}
          {isDesktop && (
            <View style={{
              backgroundColor: "#F8A8D4",
              paddingVertical: 8,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Text style={{
                fontFamily: "Nunito_600SemiBold",
                fontSize: 14,
                color: "#330065",
              }}>FREE SHIPPING FOR ALL ORDERS OF AED150</Text>
            </View>
          )}

          {/* Main Navigation Bar */}
          <View style={mergeStyles(styles.headerWrapper, isDesktop ? responsiveStyles.headerWrapper : null)}>
            {isDesktop ? (
              <View style={mergeStyles(styles.navBar, isDesktop ? responsiveStyles.navBarDesktop : null)}>
                <Pressable onPress={() => router.replace("/")} style={styles.navBrandRow}>
                  <Image source={require("@/assets/images/yallawish_logo.png")} style={styles.navBrandLogo} contentFit="contain" />
                </Pressable>

                <View
                  style={mergeStyles(
                    styles.searchContainer,
                    responsiveStyles.headerSearch,
                  )}
                >
                  <LucideIcons.Search size={20} color="#FFFFFF" />
                  <TextInput
                    placeholder="Search for gifts, lists or inspirations..."
                    style={styles.searchInput}
                    placeholderTextColor="#D9CCFF"
                  />
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
            ) : (
              <View style={[styles.header, { paddingHorizontal: 0, paddingVertical: 20 }]}>
                <View style={mergeStyles(responsiveStyles.headerInner, { gap: 30 })}>
                  <View style={[styles.mobileSearchContainer, { height: 40 }]}>
                    <LucideIcons.Search size={20} color="#FFFFFF" />
                    <TextInput
                      placeholder="Type your search here..."
                      style={styles.searchInput}
                      placeholderTextColor="#EFECF266"
                    />
                  </View>
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
                </View>
              </View>
            )}
          </View>

          {/* Secondary Navigation Bar - Categories */}
          {isDesktop && (
            <View style={{
              backgroundColor: "#03FFEE",
              paddingVertical: 12,
              paddingHorizontal: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
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
          <View style={{
            width:'100%', 
            height: isDesktop ? 600 : 400,
            position: 'relative', 
            overflow: 'hidden'
          }}>
              {/* Background Image */}
              <Image 
                source={require("@/assets/images/homepage/homepage_image.png")} 
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
                contentFit="cover"
              />
              
              {/* Dark Overlay */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                paddingHorizontal: isDesktop ? 60 : 24,
                paddingVertical: isDesktop ? 80 : 60,
              }}>
                {/* Main Content Container */}
                <View style={{
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: isDesktop ? 900 : '100%',
                  alignSelf: 'center',
                }}>
                  {/* Top Content */}
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    width: '100%',
                  }}>
                    {/* Main Headline */}
                    <Text style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: isDesktop ? 56 : 32,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      marginBottom: isDesktop ? 20 : 16,
                      lineHeight: isDesktop ? 68 : 40,
                    }}>
                      Celebrate Every Moment with the Perfect Gift
                    </Text>
                    
                    {/* Sub-headline */}
                    <Text style={{
                      fontFamily: 'Nunito_400Regular',
                      fontSize: isDesktop ? 20 : 16,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      marginBottom: isDesktop ? 40 : 32,
                      lineHeight: isDesktop ? 28 : 22,
                      opacity: 0.95,
                    }}>
                      Shop handpicked gifts for weddings, birthdays, and every special day in between.
                    </Text>
                    
                    {/* CTA Buttons */}
                    <View style={{
                      flexDirection: isDesktop ? 'row' : 'column',
                      gap: isDesktop ? 16 : 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                      {/* Create Gift List Button */}
                      <Pressable 
                        onPress={handleCreateWishlist}
                        style={{
                          backgroundColor: '#00C4F0',
                          borderRadius: 999,
                          paddingHorizontal: isDesktop ? 32 : 24,
                          paddingVertical: isDesktop ? 16 : 14,
                          minWidth: isDesktop ? 200 : '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{
                          fontFamily: 'Nunito_600SemiBold',
                          fontSize: isDesktop ? 16 : 15,
                          color: '#FFFFFF',
                        }}>
                          Create Gift List
                        </Text>
                      </Pressable>
                      
                      {/* Discover Gifts Button */}
                      <Pressable 
                        style={{
                          borderWidth: 2,
                          borderColor: '#00D4AA',
                          borderRadius: 999,
                          paddingHorizontal: isDesktop ? 32 : 24,
                          paddingVertical: isDesktop ? 16 : 14,
                          minWidth: isDesktop ? 200 : '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'transparent',
                        }}
                      >
                        <Text style={{
                          fontFamily: 'Nunito_600SemiBold',
                          fontSize: isDesktop ? 16 : 15,
                          color: '#FFFFFF',
                        }}>
                          Discover Gifts
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  
                  {/* Explore YallaWish Element - Bottom */}
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: isDesktop ? 20 : 16,
                  }}>
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
        <View style={mergeStyles(styles.lifeMomentsSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={[styles.lifeMomentsHeader]}>
              <View style={{width:'100%'}}>
                <Text style={[styles.lifeMomentsTitle, !isDesktop ? styles.lifeMomentsTitleMobile : {} ]}>Browse by life moments</Text>
              </View>
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

        {/* Categories */}
        <View style={mergeStyles(styles.lifeMomentsSecondarySection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.lifeMomentsHeader}>
              <View style={{ width: "100%" }}>
                <Text style={[styles.lifeMomentsSecondaryTitle, !isDesktop ? styles.lifeMomentsSecondaryTitleMobile : {}]}>Browse by Categories</Text>
              </View>
            </View>
            <View style={mergeStyles(styles.categoryCardsGrid, !isDesktop ? responsiveStyles.lifeMomentGridMobile : responsiveStyles?.lifeMomentGridDesktop)}>
              {isDesktop ? (
                <>
                  <View style={[styles.categoriesRow]}>{categories.slice(0, 4).map((category) => renderCategoryCard(category))}</View>
                  <View style={[styles.categoriesRow]}>{categories.slice(4, 8).map((category) => renderCategoryCard(category))}</View>
                </>
              ) : (
                <>
              <ScrollView
                ref={scrollRef}
                horizontal
                // pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={(e) => {
                  const x = e.nativeEvent.contentOffset.x;
                  const pageIndex = Math.round(x / SCREEN_WIDTH);
                  setCurrentCategoryIndex(pageIndex);
                }}
              >
                {/* PAGE 1 */}
                <View style={{ width: SCREEN_WIDTH }}>
                  <View style={[styles.categoriesRow, !isDesktop && styles.categoriesRowMobile]}>
                    {categories.slice(0, 4).map(renderCategoryCard)}
                  </View>
                  <View style={[styles.categoriesRow, !isDesktop && styles.categoriesRowMobile]}>
                    {categories.slice(4, 8).map(renderCategoryCard)}
                  </View>
                </View>

              </ScrollView>
                </>
              )}
            </View>
            {!isDesktop ?
              <>
              <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                {[...Array(TOTAL_PAGES)].map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 5,
                      backgroundColor: currentCategoryIndex !== index ? "#ffff" : "#ffffff",
                      opacity: currentCategoryIndex !== index ? 1 : 0.3,
                    }}
                  />
                ))}
              </View>
              </> :
              <>

              </>
              }

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
          {isDesktop ? (
        <View style={mergeStyles(isDesktop ? styles.aiSection : styles.aiSectionMobile, isDesktop ? responsiveStyles.aiSectionOuter : null)}>
            <View style={[responsiveStyles.aiSectionDesktopWrapper]}>
              <LinearGradient 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#330065','#03ffee87']}
                // locations={[0.65, 0.999]}
                locations={[0.65, 0.999]}
                style={[responsiveStyles.aiSectionDesktop]}>
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
              </LinearGradient>
            </View>
            </View>
          ) : (
            <>
            <View style={mergeStyles(styles.aiSectionMobile)}>
                <LinearGradient 
                  // start={{ x: 0, y: 1 }}
                  // end={{ x: 0, y: 1.5 }}
                  colors={['#330065','#03ffee87']}
                  // locations={[0.8, 0.999]}
                  locations={[0.5, 0.9]}
                  style={mergeStyles(styles.gradientSectionMobile)}
                  >

                  <View style={styles.aiHeader}>
                    <Text style={styles.aiButton}>
                      <Text style={{ fontFamily:'Nunito_700Bold', fontWeight:'bold', fontStyle:'italic'}}>AI</Text> POWERED</Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <Text style={styles.aiTitle}>Meet Genie!</Text>
                    <Pressable style={styles.aiChatButton}>
                    <Ionicons name="chevron-forward" size={32}  color="#FFFFFF" />
                  </Pressable>
                  </View>
                  <Text style={styles.aiDescription}>Let our smart assistant suggest the perfect registry items based on your lifestyle, preferences, and needs — saving you time and guesswork!</Text>
                  
                  <View style={{ height: 280, justifyContent:'flex-end', alignItems:'center' }}>
                    <Image source={require("@/assets/images/robot.png")} style={styles.robotImage} contentFit="contain" />
                  </View>

                </LinearGradient>
              </View>
            </>
          )}
        {/* </View> */}

        {/* New Arrivals */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Arrivals</Text>
              <Pressable>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </Pressable>
            </View>
            {isDesktop ? (
              <View style={[responsiveStyles.picksDesktopList, { gap: 24 }]}>
                {[
                  { id: 1, name: "Smartwatch", subtitle: "Dark Green", price: "299.99", image: require("@/assets/images/nikeShoes.png") },
                  { id: 2, name: "Diamond Ring", subtitle: "Platinum", price: "1,299.99", image: require("@/assets/images/oculus.png") },
                  { id: 3, name: "Wicker Chair", subtitle: "Natural", price: "199.99", image: require("@/assets/images/nikeShoes.png") },
                  { id: 4, name: "Essential Oil", subtitle: "Lavender", price: "29.99", image: require("@/assets/images/oculus.png") },
                  { id: 5, name: "Baby Sweater", subtitle: "Light Blue", price: "49.99", image: require("@/assets/images/nikeShoes.png") },
                  { id: 6, name: "Headphones", subtitle: "Black", price: "149.99", image: require("@/assets/images/oculus.png") },
                ].map((item) => (
                  <View key={item.id} style={[mergeStyles(styles.pickCard, responsiveStyles.pickCardDesktop), { width: "31%" }]}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 200, width: "100%", borderRadius: 8 }} contentFit="cover" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                    <Pressable style={{ marginTop: 12, backgroundColor: "#330065", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}>
                      <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14, textAlign: "center" }}>Add to Cart</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picksScroll}>
                {[
                  { id: 1, name: "Smartwatch", subtitle: "Dark Green", price: "299.99", image: require("@/assets/images/nikeShoes.png") },
                  { id: 2, name: "Diamond Ring", subtitle: "Platinum", price: "1,299.99", image: require("@/assets/images/oculus.png") },
                  { id: 3, name: "Wicker Chair", subtitle: "Natural", price: "199.99", image: require("@/assets/images/nikeShoes.png") },
                ].map((item) => (
                  <View key={item.id} style={styles.pickCard}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 200, width: 180, borderRadius: 8 }} contentFit="cover" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                    <Pressable style={{ marginTop: 12, backgroundColor: "#330065", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}>
                      <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14, textAlign: "center" }}>Add to Cart</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Profile Setup Form - Find the Perfect Gift in 3 Simple Steps */}
        {isDesktop && (
          <View style={mergeStyles(styles.topSection, responsiveStyles.section)}>
            <View style={responsiveStyles.sectionInner}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Find the Perfect Gift in 3 Simple Steps</Text>
              </View>
              <Pressable onPress={() => router.push("/profile-setup")} style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                borderWidth: 1,
                borderColor: "#E4DBF6",
                marginTop: 24,
              }}>
                <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 18, color: "#1C0335", marginBottom: 16 }}>Step 1: Profile Details</Text>
                <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#6F5F8F", marginBottom: 20 }}>
                  Complete your profile to get personalized gift recommendations
                </Text>
                <Pressable style={{ alignSelf: "flex-start", backgroundColor: "#330065", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
                  <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14 }}>Get Started</Text>
                </Pressable>
              </Pressable>
            </View>
          </View>
        )}

        {/* Recommended Bestsellers */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended Bestsellers</Text>
              <Pressable>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </Pressable>
            </View>
            {isDesktop ? (
              <View style={[responsiveStyles.picksDesktopList, { gap: 24 }]}>
                {topPicks.map((item) => (
                  <View key={item.id} style={[mergeStyles(styles.pickCard, responsiveStyles.pickCardDesktop), { width: "31%" }]}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 200, width: "100%", borderRadius: 8 }} contentFit="cover" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                    <Pressable style={{ marginTop: 12, backgroundColor: "#330065", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}>
                      <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14, textAlign: "center" }}>Add to Cart</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.picksScroll}>
                {topPicks.map((item) => (
                  <View key={item.id} style={styles.pickCard}>
                    <View style={styles.pickImageContainer}>
                      <Image style={{ height: 200, width: 180, borderRadius: 8 }} contentFit="cover" source={item.image} />
                    </View>
                    <Text style={styles.pickName}>{item.name}</Text>
                    <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                    <View style={styles.pickPriceRow}>
                      <Image source={require("@/assets/images/dirham.png")} style={{ width: 14, height: 12, marginRight: 6 }} />
                      <Text style={styles.pickPrice}>{item.price}</Text>
                    </View>
                    <Pressable style={{ marginTop: 12, backgroundColor: "#330065", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 }}>
                      <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14, textAlign: "center" }}>Add to Cart</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Create Your Own Gift List Banner */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <Pressable onPress={handleCreateWishlist} style={{
              backgroundColor: "#FDF1F8",
              borderRadius: 16,
              padding: isDesktop ? 48 : 32,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#F8A8D4",
            }}>
              <Text style={{ fontFamily: "Nunito_700Bold", fontSize: isDesktop ? 32 : 24, color: "#1C0335", marginBottom: 12, textAlign: "center" }}>
                Create Your Own Gift List
              </Text>
              <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 16, color: "#6F5F8F", textAlign: "center", marginBottom: 24 }}>
                Share your wishlist with friends and family
              </Text>
              <Pressable style={{ backgroundColor: "#330065", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 }}>
                <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 16 }}>Create List</Text>
              </Pressable>
            </Pressable>
          </View>
        </View>

        {/* Real Feedback Testimonial */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Real Feedback. Real Satisfaction</Text>
            </View>
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 32,
              borderWidth: 1,
              borderColor: "#E4DBF6",
              marginTop: 24,
            }}>
              <View style={{ flexDirection: "row", marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons key={i} name="star" size={24} color="#FFD700" />
                ))}
              </View>
              <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 16, color: "#1C0335", marginBottom: 16, lineHeight: 24 }}>
                "YallaWish made it so easy to create and share my wedding registry. My guests loved being able to see exactly what I wanted!"
              </Text>
              <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 14, color: "#6F5F8F" }}>— Sarah M.</Text>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Regular Questions For Our Customers</Text>
            </View>
            <View style={{ marginTop: 24, gap: 16 }}>
              {[
                { q: "How do I create a gift list?", a: "Simply click 'Create List' and follow the step-by-step process to add items and customize your list." },
                { q: "Can I share my list with others?", a: "Yes! You can share your list via link, email, or social media with friends and family." },
                { q: "How do I add items to my list?", a: "Browse our catalog or add custom items with images, descriptions, and links to your preferred stores." },
              ].map((faq, idx) => (
                <Pressable key={idx} style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#E4DBF6",
                }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 16, color: "#1C0335", flex: 1 }}>{faq.q}</Text>
                    <Ionicons name="chevron-down" size={20} color="#6F5F8F" />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Download App Banner */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={{
              backgroundColor: "#330065",
              borderRadius: 16,
              padding: isDesktop ? 48 : 32,
              flexDirection: isDesktop ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <View style={{ flex: 1, marginBottom: isDesktop ? 0 : 24 }}>
                <Text style={{ fontFamily: "Nunito_700Bold", fontSize: isDesktop ? 32 : 24, color: "#FFFFFF", marginBottom: 12 }}>
                  Shop Gifts On The Go — Download Now
                </Text>
                <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 16, color: "#D9CCFF", marginBottom: 24 }}>
                  Get the YallaWish app for iOS and Android
                </Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <Pressable style={{ backgroundColor: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
                    <Text style={{ color: "#330065", fontFamily: "Nunito_600SemiBold", fontSize: 14 }}>App Store</Text>
                  </Pressable>
                  <Pressable style={{ backgroundColor: "#FFFFFF", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
                    <Text style={{ color: "#330065", fontFamily: "Nunito_600SemiBold", fontSize: 14 }}>Google Play</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={mergeStyles(styles.topSection, isDesktop ? responsiveStyles.section : null)}>
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Need Help? Our Team Makes Gifting Simple</Text>
            </View>
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 32,
              borderWidth: 1,
              borderColor: "#E4DBF6",
              marginTop: 24,
            }}>
              <TextInput
                placeholder="Your Name"
                style={{ height: 52, borderRadius: 12, borderWidth: 1, borderColor: "#DDD7E4", paddingHorizontal: 16, marginBottom: 16, fontFamily: "Nunito_400Regular", fontSize: 16 }}
                placeholderTextColor="rgba(28, 3, 53, 0.35)"
              />
              <TextInput
                placeholder="Your Email"
                style={{ height: 52, borderRadius: 12, borderWidth: 1, borderColor: "#DDD7E4", paddingHorizontal: 16, marginBottom: 16, fontFamily: "Nunito_400Regular", fontSize: 16 }}
                placeholderTextColor="rgba(28, 3, 53, 0.35)"
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Message"
                multiline
                numberOfLines={4}
                style={{ minHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: "#DDD7E4", paddingHorizontal: 16, paddingVertical: 16, marginBottom: 24, fontFamily: "Nunito_400Regular", fontSize: 16, textAlignVertical: "top" }}
                placeholderTextColor="rgba(28, 3, 53, 0.35)"
              />
              <Pressable style={{ backgroundColor: "#330065", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, alignSelf: "flex-start" }}>
                <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 16 }}>Send Message</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={{
          backgroundColor: "#1C0335",
          paddingVertical: isDesktop ? 48 : 32,
          paddingHorizontal: isDesktop ? 150 : 20,
        }}>
          <View style={{ maxWidth: 1800, alignSelf: "center", width: "100%" }}>
            <View style={{ flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", marginBottom: 32 }}>
              <View style={{ marginBottom: isDesktop ? 0 : 24 }}>
                <Image source={require("@/assets/images/yallawish_logo.png")} style={{ width: 164, height: 32, marginBottom: 16 }} contentFit="contain" />
                <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", lineHeight: 20 }}>
                  Your trusted partner for finding and sharing the perfect gifts
                </Text>
              </View>
              <View style={{ flexDirection: isDesktop ? "row" : "column", gap: isDesktop ? 48 : 24 }}>
                <View>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 16, color: "#FFFFFF", marginBottom: 12 }}>Quick Links</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", marginBottom: 8 }}>About Us</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", marginBottom: 8 }}>Contact</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF" }}>FAQ</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 16, color: "#FFFFFF", marginBottom: 12 }}>Support</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", marginBottom: 8 }}>Help Center</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", marginBottom: 8 }}>Privacy Policy</Text>
                  <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF" }}>Terms of Service</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 16, color: "#FFFFFF", marginBottom: 12 }}>Newsletter</Text>
                  <View style={{ flexDirection: "row", marginBottom: 12 }}>
                    <TextInput
                      placeholder="Enter your email"
                      style={{ flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#6F5F8F", paddingHorizontal: 12, backgroundColor: "#FFFFFF", fontFamily: "Nunito_400Regular", fontSize: 14 }}
                      placeholderTextColor="rgba(28, 3, 53, 0.35)"
                    />
                    <Pressable style={{ backgroundColor: "#330065", paddingHorizontal: 16, borderRadius: 8, justifyContent: "center", marginLeft: 8 }}>
                      <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14 }}>Subscribe</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: "#6F5F8F", paddingTop: 24, flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#D9CCFF", marginBottom: isDesktop ? 0 : 16 }}>
                © 2024 YallaWish. All rights reserved.
              </Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                {/* <Image source={require("@/assets/images/visa.png")} style={{ width: 40, height: 24 }} contentFit="contain" /> */}
                {/* <Image source={require("@/assets/images/mastercard.png")} style={{ width: 40, height: 24 }} contentFit="contain" /> */}
              </View>
            </View>
          </View>
        </View>

        <View style={isDesktop ? responsiveStyles.signOutWrapper : { paddingHorizontal: 20, marginTop: 24 }}>
          <SignOutButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
