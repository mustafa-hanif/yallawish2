import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#ffff",
  },
  innerContainer: {
    position: "relative",
    justifyContent: "center",
    width: "100%",
  },
  iconContainer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  text: {
    fontSize: 16,
    color: "#1F1235",
    textAlign: "center",
    fontFamily: "Nunito_700Bold",
  },
});
