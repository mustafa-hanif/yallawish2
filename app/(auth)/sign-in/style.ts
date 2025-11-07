import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");
export const style = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 10,
  },

  headerSection: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    resizeMode: "contain",
  },
  contentSection: {
    flex: 0.7,
    justifyContent: "space-between",
  },
  mainHeading: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
  splashText: {
    fontWeight: "300",
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "Nunito_300Light",
  },
  textSection: {
    gap: 24,
  },
  socialContainer: {
    gap: 16,
  },
});
