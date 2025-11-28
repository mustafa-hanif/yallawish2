import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { rowGap: 8 },
  card: {
    justifyContent: "center",
    alignItems: "center",
    gap: 11,
    width: 130,
    height: 100,
    backgroundColor: "#431471",
    borderBottomWidth: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 16,
    color: "#ffff",
    fontFamily: "Nunito_400Regular",
    letterSpacing: -0.5,
    lineHeight: 20,
  },
  icon: { width: 24, height: 24, color: "#ffff", tintColor: "#ffff" },
});
