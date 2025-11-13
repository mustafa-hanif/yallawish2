import React from "react";
import { Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");
const DESKTOP_BREAKPOINT = 1024;



export const HeroSwiper = ({initialCards}) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;
  return (
    <View style={styles.container}>
      <Carousel
        autoPlayInterval={3000}
        data={initialCards}
        height={!isDesktop ? 320 : 530} // Adjust height for better spacing
        loop={true}
        pagingEnabled={true}
        snapEnabled={true}
        width={width * 1} // Adjusted width for better card fit
        style={[styles.carousel,  !isDesktop ? { height: 280 } : {} ]}
        mode={"horizontal-stack"}
        modeConfig={{
          snapDirection: "left",
          stackInterval: 15,
        }}
        customConfig={() => ({ type: "negative", viewCount: 4 })}
        renderItem={({ item }) => (
          <Pressable
            onPress={item?.action}
            style={[
              !isDesktop ? styles.cardMobile : styles.card,
              {
                // backgroundColor: item.backgroundColor,
                margin: "auto",
              },
            ]}
          >
            <Image source={item.image} style={!isDesktop ? styles.imageMobile : styles.image} />
            <Text style={!isDesktop ? styles.titleMobile : styles.title}>{item.title}</Text>
            {!isDesktop ? <>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            </> : <></>}
            
            {/* <Text onPress={item.action} style={styles.actionText}>
              Action
            </Text> */}
          </Pressable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  carousel: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 520,
    marginTop: 20
  },
  card: {
    width: 491, // Matching Figma width
    height: 513.18, // Matching Figma height
    borderRadius: 40, // Rounded corners matching Figma
    paddingTop: 99.91, // Matching Figma padding
    paddingRight: 49.96, // Matching Figma padding
    paddingBottom: 99.91, // Matching Figma padding
    paddingLeft: 49.96, // Matching Figma padding
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(243, 236, 254, 0.3)", // Matching Figma background color with alpha
    borderWidth: 2.5, // Border thickness matching Figma
    borderColor: "#FFFFFF", // White border matching Figma
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5.99 }, // Matching shadow offset from Figma
    shadowOpacity: 0.1, // You might adjust this value to match the shadow strength
    shadowRadius: 22.7, // This large radius is more reflective of the Figma shadow
    elevation: 1, // For Android shadow
  },
  cardMobile: {
    width: 280, // Matching Figma width
    height: 300, // Matching Figma height
    borderRadius: 16, // Rounded corners matching Figma
    paddingTop: 40, // Matching Figma padding
    paddingRight: 20, // Matching Figma padding
    paddingBottom: 40, // Matching Figma padding
    paddingLeft: 20, // Matching Figma padding
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(243, 236, 254, 0.3)", // Matching Figma background color with alpha
    borderWidth: 1, // Border thickness matching Figma
    borderColor: "#FFFFFF", // White border matching Figma
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5.99 }, // Matching shadow offset from Figma
    shadowOpacity: 0.1, // You might adjust this value to match the shadow strength
    shadowRadius: 22.7, // This large radius is more reflective of the Figma shadow
    elevation: 1, // For Android shadow
  },
  image: {
    width: 241, // Adjust size for better proportion
    height: 219, // Adjust size for better proportion
    marginBottom: 15,
    resizeMode: "contain",
  },
  imageMobile: {
    width: 96, // Adjust size for better proportion
    height: 81, // Adjust size for better proportion
    marginBottom: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 59, // Adjust font size for title
    fontWeight: "600",
    fontFamily:'Nunito_700Bold',
    color: "#330065",
    textAlign: "center",
    marginBottom: 5,
  },
  titleMobile: {
    fontSize: 24, // Adjust font size for title
    fontWeight: "600",
    fontFamily:'Nunito_700Bold',
    color: "#330065",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14, // Slightly smaller font size for subtitle
    color: "#777",
    textAlign: "center",
    marginBottom: 15,
  },
});
