import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 46,
    gap: 30,
  },
  content: {},

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
  flatList: { gap: 16 },
});
