import type { PropsWithChildren, ReactElement } from "react";
import { StyleSheet } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";
import { useBottomTabOverflow } from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor?: { dark: string; light: string } | null;
  contentPadding?: number;
  gap?: number;
  headerHeight?: number;
  contentContainerStyle?: StyleSheet;
}>;

export default function ParallaxScrollView({ children, headerImage, headerBackgroundColor, contentPadding = 32, gap = 16, headerHeight = 250, contentContainerStyle }: Props) {
  const HEADER_HEIGHT = headerHeight;

  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} scrollIndicatorInsets={{ bottom }} contentContainerStyle={{ paddingBottom: bottom, ...contentContainerStyle }}>
        <Animated.View style={[styles.header, headerBackgroundColor ? { backgroundColor: headerBackgroundColor[colorScheme] } : {}, { height: HEADER_HEIGHT }, headerAnimatedStyle]}>{headerImage}</Animated.View>
        <ThemedView style={{ ...styles.content, padding: contentPadding, gap }}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: "hidden",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
});
