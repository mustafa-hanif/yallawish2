import { Image } from "expo-image";

import { styles } from "@/styles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  // State for managing which card is in center
  const [centerCardIndex, setCenterCardIndex] = useState(1);
  const [animatedValues] = useState([
    new Animated.Value(0), // left card
    new Animated.Value(1), // center card (default)
    new Animated.Value(0), // right card
  ]);

  const categories = [
    { id: 1, name: "Wedding", color: "#00D4AA" },
    { id: 2, name: "Birthday", color: "#00C4F0" },
    { id: 3, name: "New Home", color: "#FFD700" },
    { id: 4, name: "Graduation", color: "#FF69B4" },
    { id: 5, name: "Baby Shower", color: "#9966CC" },
    { id: 6, name: "Retirement", color: "#FF4500" },
  ];

  const upcomingEvents = [
    {
      id: 1,
      date: "08",
      month: "JUNE",
      title: "Hala's Housewarming",
      subtitle: "Gifts purchased: 8",
      color: "#FFD700",
    },
    {
      id: 2,
      date: "21",
      month: "JUNE",
      title: "Rita's Birthday Party",
      subtitle: "Gifts purchased: 5",
      color: "#4A90E2",
    },
  ];

  const topPicks = [
    {
      id: 1,
      name: "Nike Air Jester 1",
      subtitle: "Sonic Green",
      price: "325.32",
      image: require("@/assets/images/nikeShoes.png"),
    },
    {
      id: 2,
      name: "Oculus Quest",
      subtitle: "Dynamic White",
      price: "325.32",
      image: require("@/assets/images/oculus.png"),
    },
  ];

  const inspirationBoards = [
    {
      id: 1,
      title: "Build your nursery",
      subtitle: "All essentials items under one roof with Pottery Barn Kids",
      image: require("@/assets/images/nursery.png"),
    },
    {
      id: 2,
      title: "The wedding checklist",
      subtitle: "Don't know where to start? See what others do.",
      image: require("@/assets/images/wedding.png"),
    },
    {
      id: 3,
      title: "From house to home",
      subtitle: "Set up your space with a little oomph with Pan Home",
      image: require("@/assets/images/pan.png"),
    },
  ];

  const handleCreateWishlist = () => {
    Alert.alert(
      "Create Wishlist",
      "This will open the wishlist creation screen",
      [{ text: "OK" }]
    );
  };

  // Card data for the three different cards
  const cardData = [
    {
      id: 1,
      title: "Share List",
      subtitle: "Discover amazing gifts for your loved ones",
      image: require("@/assets/images/shareList.png"), // You can change this to a different image
      action: () => Alert.alert("Browse Gifts", "This will open gift browsing"),
    },
    {
      id: 0,
      title: "Add List",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      image: require("@/assets/images/addList.png"),
      action: handleCreateWishlist,
    },

    {
      id: 2,
      title: "Community Lists",
      subtitle: "Check out your existing wishlists",
      image: require("@/assets/images/community.png"), // You can change this to a different image
      action: () => Alert.alert("View Lists", "This will show your lists"),
    },
  ];

  // Animation function to move card to center
  const animateToCenter = (targetIndex: number) => {
    if (targetIndex === centerCardIndex) return;

    // Reset all animations
    animatedValues.forEach((animValue, index) => {
      Animated.spring(animValue, {
        toValue: index === targetIndex ? 1 : 0,
        useNativeDriver: true,
      }).start();
    });

    setCenterCardIndex(targetIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color="#FFFFFF" />
            <TextInput
              placeholder="Type your search here..."
              style={styles.searchInput}
              placeholderTextColor="#FFFFFF"
            />
          </View>
          <Pressable style={styles.profileButton}>
            <View style={styles.profileImage}>
              <Image
                source={require("@/assets/images/girlUser.png")}
                style={{
                  width: 48,
                  height: 48,
                }}
              />
              <View
                style={{
                  backgroundColor: "#03FFEE",
                  borderRadius: 50,
                  position: "absolute",
                  zIndex: 2,
                  width: 20,
                  height: 20,
                  bottom: 0,
                  left: 0,
                }}
              >
                2
              </View>
            </View>
          </Pressable>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Hi Ayesha!</Text>
          <Text style={styles.welcomeSubtitle}>
            Ready to make someone smile?
          </Text>
        </View>

        {/* Add List Card */}
        <View style={styles.addListContainer}>
          <View style={styles.cardStack}>
            {cardData.map((card, index) => {
              const isCenter = index === centerCardIndex;
              const isLeft = index === (centerCardIndex + 2) % 3;
              const isRight = index === (centerCardIndex + 1) % 3;

              let cardStyle;
              let cardPosition = {};

              if (isCenter) {
                cardStyle = styles.mainCard;
                cardPosition = { zIndex: 3 };
              } else if (isLeft) {
                cardStyle = styles.leftCard;
                cardPosition = { zIndex: 1 };
              } else if (isRight) {
                cardStyle = styles.rightCard;
                cardPosition = { zIndex: 1 };
              } else {
                cardStyle = styles.sideCard;
                cardPosition = { zIndex: 1 };
              }

              return (
                <Animated.View
                  key={card.id}
                  style={[
                    cardPosition,
                    {
                      opacity: 1,
                      transform: [
                        {
                          scale: animatedValues[index].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.85, 1],
                          }),
                        },
                        // {
                        //   rotate: animatedValues[index].interpolate({
                        //     inputRange: [0, 1],
                        //     outputRange: isCenter
                        //       ? ["-20deg", "0deg"]
                        //       : ["0deg", "0deg"],
                        //   }),
                        // },
                      ],
                    },
                  ]}
                >
                  <Pressable
                    style={[cardStyle]}
                    onPress={() => {
                      if (isCenter) {
                        card.action();
                      } else {
                        animateToCenter(index);
                      }
                    }}
                  >
                    <View style={styles.addIconContainer}>
                      <Image
                        source={card.image}
                        contentFit="cover"
                        style={{
                          position: "absolute",
                          top: 10,
                          width: 96,
                          height: 92,
                        }}
                      />
                    </View>
                    <Text style={styles.addListTitle}>{card.title}</Text>
                    <Text style={styles.addListSubtitle}>{card.subtitle}</Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleCategory}>Browse by categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            <View style={styles.categoriesContainer}>
              <View style={styles.categoriesRow}>
                {categories.slice(0, 3).map((category) => (
                  <Pressable key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIconContainer}>
                        <Image
                          source={require("@/assets/images/gift.svg")}
                          style={styles.categoryIcon}
                          contentFit="contain"
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View
                      style={[
                        styles.categoryBorder,
                        { backgroundColor: category.color },
                      ]}
                    />
                  </Pressable>
                ))}
              </View>
              <View style={styles.categoriesRow}>
                {categories.slice(3, 6).map((category) => (
                  <Pressable key={category.id} style={styles.categoryCard}>
                    <View style={styles.categoryContent}>
                      <View style={styles.categoryIconContainer}>
                        <Image
                          source={require("@/assets/images/gift.svg")}
                          style={styles.categoryIcon}
                          contentFit="contain"
                        />
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                    <View
                      style={[
                        styles.categoryBorder,
                        { backgroundColor: category.color },
                      ]}
                    />
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
              <View key={event.id} style={styles.eventCard}>
                <View
                  style={[
                    styles.eventLeftBorder,
                    { backgroundColor: event.color },
                  ]}
                />
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
              </View>
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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.picksScroll}
          >
            {topPicks.map((item) => (
              <View key={item.id} style={styles.pickCard}>
                <View style={styles.pickImageContainer}>
                  <Image
                    style={{
                      height: 147,
                      width: 180,
                      borderRadius: 8,
                    }}
                    contentFit="contain"
                    source={item.image}
                  />
                </View>
                <Text style={styles.pickName}>{item.name}</Text>
                <Text style={styles.pickSubtitle}>{item.subtitle}</Text>
                <Text style={styles.pickPrice}>
                  <Image
                    source={require("@/assets/images/dirham.png")}
                    style={{
                      width: 14,
                      marginTop: -1,
                      height: 12,
                    }}
                  />
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
                <Image
                  style={{
                    width: 148,
                    height: 148,
                  }}
                  contentFit="cover"
                  source={board.image}
                />
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
          <Text style={styles.aiDescription}>
            Let our smart assistant suggest the perfect registry items based on
            your lifestyle, preferences, and needs — saving you time and
            guesswork!
          </Text>
          <Pressable style={styles.aiChatButton}>
            <Ionicons name="chevron-forward" size={32} color="#FFFFFF" />
          </Pressable>
          <View
            style={{
              height: 280,
            }}
          >
            <Image
              source={require("@/assets/images/robot.png")}
              style={styles.robotImage}
              contentFit="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
