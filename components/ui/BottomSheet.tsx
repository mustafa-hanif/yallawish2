import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isVisible, onClose, children }: BottomSheetProps) {
  const [showModal, setShowModal] = useState(isVisible);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const slideUp = useCallback(() => {
    translateY.value = withSpring(0, { damping: 50, stiffness: 300 });
  }, []);

  const slideDown = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setShowModal)(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      // Small delay to ensure modal is mounted and layout calls have happened
      requestAnimationFrame(() => {
        slideUp();
      });
    } else {
      slideDown();
    }
  }, [isVisible]);

  // Gestures
  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Dragging down increases translateY (positive)
      // We prevent dragging up past 0 (top of sheet)
      const newY = event.translationY + context.value.y;
      translateY.value = Math.max(newY, 0);
    })
    .onEnd((event) => {
      if (translateY.value > SCREEN_HEIGHT * 0.15 || event.velocityY > 500) {
        // Close if dragged down sufficiently or flicked
        runOnJS(onClose)();
      } else {
        // Snap back up
        translateY.value = withSpring(0, { damping: 50, stiffness: 300 });
      }
    });

  const rSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateY.value, [0, SCREEN_HEIGHT], [0.3, 0], Extrapolation.CLAMP);
    return {
      opacity: opacity,
    };
  });

  if (!showModal) return null;

  return (
    <Modal visible={showModal} transparent animationType="none" onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <Animated.View style={[styles.backdrop, rBackdropStyle]} />
          </Pressable>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.sheet, rSheetStyle]}>
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
              {children}
            </Animated.View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  sheet: {
    backgroundColor: "white",
    width: "100%",
    maxHeight: "80%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    paddingBottom: 20, // Bottom safe area buffer
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 64,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#C7C7CC",
  },
});
