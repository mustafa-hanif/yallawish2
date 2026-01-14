import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FDF9FF",
    overflow: "hidden",
    height: 120,
  },

  headerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#3b0076ab",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Nunito_900Black",
    lineHeight: 28,
    letterSpacing: -1,
  },
});
