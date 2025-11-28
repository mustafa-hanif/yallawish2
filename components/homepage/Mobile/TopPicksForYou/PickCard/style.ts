import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 15,
    height: 263,
    width: 200,
  },
  image: {
    width: "100%",
    height: 147,
    borderRadius: 10,
  },
  content: {
    rowGap: 10,
  },
  titleSubTitleContainer: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    color: "#1C1C1C",
    fontFamily: "Nunito_700Bold",
    letterSpacing: -0.9,
    lineHeight: 24,
  },

  subtitle: {
    fontSize: 14,
    color: "#1C1C1CB2",
    fontFamily: "Nunito_400Regular",
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  currency: {
    width: 18,
    height: 18,
  },
  price: {
    fontSize: 16,
    color: "#1C1C1C",
    fontFamily: "Nunito_900Black",
    letterSpacing: 0,
    lineHeight: 16,
  },
});
