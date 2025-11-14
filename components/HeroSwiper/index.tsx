import React from "react";
import type { ScaledSize } from "react-native";
import { Dimensions, ImageSourcePropType, Platform, Pressable, StyleSheet, View, type ViewProps } from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated, { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const isWeb = Platform.OS === "web";

const MAX_WIDTH = 430;

const window: ScaledSize = isWeb ? { width: MAX_WIDTH, height: 800, scale: 1, fontScale: 1 } : Dimensions.get("screen");

export function HeroSwiper({ initialCards = [] }) {

  const progress = useSharedValue<number>(0);

  return (
    <View style={styles.container}>
      <Carousel
        containerStyle={styles.containerStyle}
        autoPlayInterval={2000}
        data={initialCards}
        height={500}
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={window.width}
        style={styles.carouselStyle}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.75,
          parallaxScrollingOffset: 180,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => <SlideItem data={item} />}
      />
    </View>
  );
}

interface DataItem {
  action: () => void;
  image: ImageSourcePropType;
}

interface Props extends AnimatedProps<ViewProps> {
  length?: number;
  data: DataItem;
}

const SlideItem: React.FC<Props> = (props) => {
  const { data, length = 0, ...animatedViewProps } = props;

  return (
    <Animated.View style={styles.animatedView} {...animatedViewProps}>
      <Pressable style={styles.pressable} onPress={data?.action}>
        <Animated.Image style={styles.slideItemContainer} source={data?.image} resizeMode="cover" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", justifyContent: "center", alignItems: "center", paddingTop: 20 },
  containerStyle: { width: "100%", alignItems: "center" },
  carouselStyle: {
    width: "100%",
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  animatedView: { flex: 1 },
  slideItemContainer: {
    width: "100%",
    height: "100%",
  },
  pressable: { width: "100%", height: "100%" },
});
