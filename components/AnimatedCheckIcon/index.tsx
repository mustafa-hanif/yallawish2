import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Animated, Easing } from "react-native";

export const AnimatedCheckIcon = React.memo(function AnimatedCheckIcon({ visible, size = 14, color = "#FFFFFF" }: { visible: boolean; size?: number; color?: string }) {
  const scale = React.useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scale, {
        toValue: 1,
        speed: 18,
        bounciness: 8,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(scale, {
      toValue: 0,
      duration: 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [scale, visible]);

  return (
    <Animated.View style={{ transform: [{ scale }], opacity: scale }}>
      <Ionicons name="checkmark" size={size} color={color} />
    </Animated.View>
  );
});
