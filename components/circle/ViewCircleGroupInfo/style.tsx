import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    height: 48,
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
  },
  bodyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  bodyItemImage: {
    width: 16,
    height: 16,
    tintColor: "#330065",
  },
  bodyItemText: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#330065",
  },
});
