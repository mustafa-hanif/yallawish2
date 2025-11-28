import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    backgroundColor: "#330065",
  },
  content: {},
  gradientSectionMobile: {
    paddingTop: 30,
    paddingHorizontal: 16,
    gap: 16,
  },
  pillContainer: {
    alignItems: "flex-start",
  },

  pillText: {
    fontFamily: "Nunito_400Regular",
    backgroundColor: "#283884",
    color: "#03FFEE",
    fontSize: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    letterSpacing: -0.28,
  },
  pillItalicText: { fontFamily: "Nunito_700Bold", fontWeight: "bold", fontStyle: "italic" },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: -1,
    lineHeight: 44,
  },
  description: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#FFFFFFB2",
    lineHeight: 20,
    letterSpacing: -0.28,
  },
  boldDescription: {
    fontFamily: "Nunito_700Bold",
    color: "#FFFF",
  },
  image: {
    width: "100%",
    height: 306,
  },
});
