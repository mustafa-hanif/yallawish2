import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffff",
    paddingTop: 40,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 40,
    fontFamily: "Nunito_700Bold",
    color: "#2A262D",
    letterSpacing: -2,
    lineHeight: 44,
  },
  subTitle: {
    fontSize: 20,
    fontFamily: "Nunito_500Medium",
    color: "#1C1C1CB2",
    letterSpacing: -1,
    lineHeight: 28,
  },
  carouselContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 373,
  },
  containerStyle: { width: "100%", alignItems: "center", height: 373 },
  carouselStyle: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 373,
  },
  carouselAnimatedView: { flex: 1, height: 373 },
  carouselSlideItemContainer: {
    width: "100%",
    height: 373,
  },
  carouselPressable: { width: "100%", height: "100%" },
});
