import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import type { ScaledSize } from "react-native";
import { Alert, Dimensions, Pressable, Text, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { styles } from "./style";

interface HeroProp {}
const window: ScaledSize = Dimensions.get("screen");

export function Hero({}: HeroProp) {
  const handleCreateWishlist = () => router.push("/create-list-step1");
  const handleCreateCircle = () => router.push("/create-circle-step1");

  const progress = useSharedValue<number>(0);
  const { user } = useUser();

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
      action: handleCreateCircle,
    },
    {
      id: "3",
      title: "Add Community",
      subtitle: "See popular public registries",
      image: require("@/assets/images/shareList.png"),
      backgroundColor: "#C2D9FF",
      action: () => Alert.alert("Community", "Community lists coming soon"),
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>{`Hi ${user?.firstName || "There"}!`}</Text>
        </View>
        <View>
          <Text style={styles.subTitle}>Ready to make someone smile?</Text>
        </View>
      </View>
      <View>
        <Carousel
          width={window.width}
          height={373}
          data={initialCards}
          pagingEnabled
          snapEnabled
          loop
          mode="parallax"
          modeConfig={{ parallaxScrollingOffset: 240 }}
          onProgressChange={(_, absProgress) => {
            progress.value = absProgress ?? 0;
          }}
          autoPlay
          autoPlayInterval={2000}
          scrollAnimationDuration={1000}
          renderItem={({ item, index }) => <SlideItem data={item} index={index} progress={progress} />}
        />
      </View>
    </View>
  );
}

const SlideItem = ({ data, index, progress }) => {
  //   const progressValue = useDerivedValue(() => {
  //     const v = progress.value;

  //     if (typeof v !== "number" || isNaN(v)) return 0;

  //     // Calculate the difference from the center index
  //     const diff = v - index;

  //     // Clamp to -1, 0, 1 for left, center, right only
  //     if (diff < -0.5) return -1;   // left
  //     if (diff > 0.5) return 1;     // right
  //     return 0;                     // center
  //   });

  //   const animatedStyle = useAnimatedStyle(() => {
  //     const rotation = interpolate(progressValue.value, [-1, 0, 1], [-24, 0, 24]);
  //     return {
  //       transform: [{ rotate: `${rotation}deg` }],
  //     };
  //   });

  return (
    <Animated.View
      style={[
        styles.carouselAnimatedView,
        // animatedStyle
      ]}
    >
      <Pressable style={styles.carouselPressable} onPress={data.action}>
        <Animated.Image style={styles.carouselSlideItemContainer} source={data?.image} resizeMode="contain" />
      </Pressable>
    </Animated.View>
  );
};
