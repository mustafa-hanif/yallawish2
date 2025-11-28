import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    paddingTop: 3,
    paddingLeft: 22,
    paddingRight: 8,
    height: 175,
    width: 180,
    borderLeftWidth: 8,
    justifyContent: "space-between",
  },
  titleAndGiftsPurchasedContainer: {
    gap: 4,
  },
  date: {
    fontSize: 40,
    color: "#1C1C1C",
    fontFamily: "Nunito_900Black",
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  month: {
    fontSize: 20,
    color: "#1C1C1C",
    fontFamily: "Nunito_900Black",
    letterSpacing: -0.9,
    lineHeight: 24,
  },
  eventTitle: {
    fontSize: 20,
    color: "#1C1C1C",
    fontFamily: "Nunito_700Bold",
    letterSpacing: -0.9,
    lineHeight: 24,
  },

  giftPurchasedPill: {
    height: 24,
    borderRadius: 150,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  giftPurchasedText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    letterSpacing: -1,
    lineHeight: 20,
  },
});
