import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EFECF266",
    borderRadius: 16,
    padding: 10,
    gap: 10,
    height: 168,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
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
  image: {
    height: 148,
    width: 148,
    borderRadius: 10,
  },
});
