import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ResponsiveAuthLayoutProps = {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
  showHero?: boolean;
  mobileScrollViewStyle?: object;
  mobileLogoHeaderStyle?: object;
  tabs?: React.ReactNode;
  showAnimation?: boolean;
};

// Background images for carousel (add more as needed)
const BACKGROUND_IMAGES = [
  require("@/assets/images/onBoarding1.png"),
  require("@/assets/images/onBoarding2.png"),
  require("@/assets/images/onBoarding3.png"),
  // Add more images here when provided
];

export function ResponsiveAuthLayout({
  children,
  heroTitle,
  heroSubtitle,
  showHero = false,
  mobileScrollViewStyle = {},
  mobileLogoHeaderStyle = {},
  tabs,
  showAnimation = false,
}: ResponsiveAuthLayoutProps) {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
    Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSplash, setIsSplash] = useState(showAnimation);

  useEffect(() => {
    setIsSplash(showAnimation);
  }, [showAnimation]);

  // Carousel effect for desktop background
  useEffect(() => {
    if (!isDesktop || BACKGROUND_IMAGES.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [isDesktop]);

  if (isDesktop) {
    return (
      <ImageBackground
        source={BACKGROUND_IMAGES[currentImageIndex]}
        style={styles.desktopFullBackground}
        imageStyle={styles.desktopFullBackgroundImage}
        resizeMode="cover"
      >
        {/* <View style={styles.desktopOverlay} /> */}

        {/* Logo and hero text - positioned on the left */}
        <View style={styles.desktopHeroContent}>
          <Image
            source={require("@/assets/images/yallawish_logo.png")}
            style={styles.desktopLogo}
          />
          <View style={styles.desktopHeroText}>
            <Text style={styles.desktopHeroTitle}>
              GIFTING, MADE MEANINGFUL
            </Text>
            <Text style={styles.desktopHeroSubtitle}>CELEBRATE EVERYTHING</Text>
          </View>
          <View style={styles.sliderButtonContainer}>
            {Array.from({ length: BACKGROUND_IMAGES.length }).map(
              (_, index) => (
                <Pressable
                  key={`hero-carousel-dot-${index}`}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[
                    styles.sliderButton,
                    currentImageIndex === index && styles.sliderButtonActive,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Show hero slide ${index + 1}`}
                />
              )
            )}
          </View>
          <Text style={styles.desktopCopyright}>
            © 2025 YallaWish. All rights reserved
          </Text>
        </View>

        {/* Form container - centered/right positioned */}
        <View style={styles.desktopFormWrapper}>
          <ScrollView
            style={styles.desktopScrollView}
            contentContainerStyle={styles.desktopScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.desktopFormContainer}>{children}</View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  // Mobile layout (original)
  const translateY = useState(new Animated.Value(0))[0];
  const fadeIn = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (isSplash) {
      Animated.timing(translateY, {
        toValue: -340, // logo moves up
        duration: 2500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setIsSplash(false);
      }, 2800); // delay before showing full UI
    }
    if (!isSplash) {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800, // slightly longer fade
        useNativeDriver: true,
      }).start();
    }
  }, [isSplash]);

  return (
    <ImageBackground
      source={require("@/assets/images/onboard_image.png")}
      style={{ width: SCREEN_WIDTH, height: "100%", overflow: "hidden" }}
      imageStyle={{ width: SCREEN_WIDTH, height: "100%" }}
      resizeMode="cover"
    >
      {isSplash ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Animated.Image
            source={require("@/assets/images/yallawish_logo.png")}
            style={{
              width: 158,
              height: 38,
              resizeMode: "contain",
              transform: [{ translateY }],
            }}
          />
        </View>
      ) : (
        <>
          {/* <Animated.View style={{ flex: 1, opacity: fadeIn }}>
            
          </Animated.View> */}
          <SafeAreaView style={{ flex: 1 }}>
            {/* Fixed Header: Logo and Tabs grouped together at top */}
            <View
              style={{
                alignItems: "center",
                paddingHorizontal: 20,
                paddingTop: 40,
                paddingBottom: 20,
                ...mobileLogoHeaderStyle,
              }}
            >
              <Image
                source={require("@/assets/images/yallawish_logo.png")}
                style={{
                  width: 158,
                  height: 38,
                  resizeMode: "contain",
                  marginBottom: 20,
                }}
              />
              {tabs ? tabs : null}
            </View>

            {/* Scrollable Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 24,
                ...mobileScrollViewStyle,
              }}
            >
              <Animated.View style={{ opacity: fadeIn }}>
                {/* Hero text (mobile) */}
                {showHero && heroTitle && (
                  <View style={{ paddingHorizontal: 8, marginBottom: 20 }}>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 40,
                        lineHeight: 38,
                        textAlign: "center",
                        fontFamily: "Nunito_700Bold",
                        marginBottom: 24,
                      }}
                    >
                      {heroTitle}
                    </Text>
                    {heroSubtitle && (
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 20,
                          lineHeight: 24,
                          textAlign: "center",
                          fontFamily: "Nunito_300Light",
                        }}
                      >
                        {heroSubtitle}
                      </Text>
                    )}
                  </View>
                )}
                {children}
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </>
      )}
      {/* <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(44, 12, 84, 0.0001)" }} /> */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Desktop styles - Full screen background
  desktopFullBackground: {
    flex: 1,
    width: "100%",
    height: "100vh" as any,
    backgroundColor: "#330065",
  },
  desktopFullBackgroundImage: {
    width: "100%",
    height: "100%",
  },
  desktopOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(51, 0, 101, 0.75)",
  },
  desktopHeroContent: {
    position: "absolute",
    left: 48,
    top: 48,
    bottom: 48,
    width: "35%",
    justifyContent: "space-between",
    zIndex: 1,
  },
  desktopLogo: {
    width: 180,
    height: 34,
    resizeMode: "contain",
  },
  desktopHeroText: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
  },
  desktopHeroTitle: {
    fontSize: 52,
    lineHeight: 62,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  desktopHeroSubtitle: {
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "Nunito_400Regular",
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  desktopCopyright: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "rgba(255, 255, 255, 0.7)",
  },
  desktopFormWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  desktopScrollView: {
    width: "100%",
  },
  desktopScrollContent: {
    minHeight: "100%",
    justifyContent: "center",
    paddingVertical: 40,
  },
  desktopFormContainer: {
    maxWidth: 620,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 56,
  },
  sliderButtonContainer: {
    width: 79.69,
    height: 32,
    backgroundColor: "#1C1C1C",
    marginBottom: 32,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  sliderButton: {
    width: 7.9,
    height: 7.9,
    backgroundColor: "#EEEEEE",
    borderRadius: 50,
  },
  sliderButtonActive: {
    backgroundColor: "#03FFEE",
  },
});
