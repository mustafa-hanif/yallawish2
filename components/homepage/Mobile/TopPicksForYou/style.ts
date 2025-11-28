import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    backgroundColor: "#F8F7FA",
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 50,
    gap: 30,
  },

  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1C1C1C",
    letterSpacing: -1,
    lineHeight: 28,
  },
  inspiration: { rowGap: 12 },
  flatList: { gap: 16 },
});
