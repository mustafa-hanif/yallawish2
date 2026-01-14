import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F0FF",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#0F0059",
  },
  description: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#794CA1",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
