import { Image } from "expo-image";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { SignOutButton } from "@/components";
import { HeroSwiper } from "@/components/HeroSwiper";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link, router } from "expo-router";
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
    maxWidth: 1900,
    justifyContent:'center',
    alignItems:'center',
    // alignSelf: "center",
    // flexDirection: "row",
    // alignItems: "stretch",
    paddingHorizontal: 100,
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
    maxWidth: 1900,
    alignSelf: "center",
    paddingHorizontal: 100,
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
    height: 276,
    minWidth: 260,
    // marginBottom: 24,
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
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [scrollDir, setScrollDir] = useState(1);
  const scrollRef = useRef(null);
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
      name: "Retirement",
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
      id: "0",
      title: "Create List",
      subtitle: "Create a new wishlist for any occasion",
      image: require("@/assets/images/createList.svg"),
      backgroundColor: "#F3ECFE",
      action: handleCreateWishlist,
    },
    {
      id: "1",
      title: "Share List",
      subtitle: "Invite friends & family to view your list",
      image: require("@/assets/images/shareList.svg"),
      backgroundColor: "#E9FFE2",
      action: () => Alert.alert("Share", "Sharing coming soon"),
    },
  
    {
      id: "2",
      title: "Add Community",
      subtitle: "See popular public registries",
      image: require("@/assets/images/addCommunity.svg"),
      backgroundColor: "#C2D9FF",
      action: () => Alert.alert("Community", "Community lists coming soon"),
    },
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
          <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
             <View style={[styles.lifeMomentsHeader]}>
              <View style={{width:'100%'}}>
                <Text style={[styles.welcomeTitle, !isDesktop ? styles.welcomeTitleMobile : {} ]}>What brings you joy today?</Text>
                <Text style={[styles.welcomeSubtitle, !isDesktop ? styles.welcomeSubtitleMobile : {} ]}>Create, share, and discover the perfect gifts</Text>
              </View>
            </View>
          </View>
        
          <HeroSwiper initialCards={cards} />
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
                pagingEnabled
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
