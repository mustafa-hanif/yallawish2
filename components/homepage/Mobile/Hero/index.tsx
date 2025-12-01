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
  const progress = useSharedValue<number>(0);

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
  ];

  return (
    <View style={styles.section}>
      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title}>{"Hi There!"}</Text>
        </View>
        <View>
          <Text style={styles.subTitle}>Ready to make someone smile?</Text>
        </View>
      </View>
      <View>
        <Carousel
          containerStyle={styles.carouselContainer}
          autoPlayInterval={2000}
          data={initialCards}
          height={373}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={window.width}
          style={styles.carouselStyle}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.75,
            parallaxScrollingOffset: 250,
          }}
          onProgressChange={progress}
          renderItem={({ item }) => <SlideItem data={item} />}
        />
      </View>
    </View>
  );
}

const SlideItem: React.FC<Props> = (props) => {
  const { data, length = 0, ...animatedViewProps } = props;

  return (
    <Animated.View style={styles.carouselAnimatedView} {...animatedViewProps}>
      <Pressable style={styles.carouselPressable} onPress={data?.action}>
        <Animated.Image style={styles.carouselSlideItemContainer} source={data?.image} resizeMode="contain" />
      </Pressable>
    </Animated.View>
  );
};
