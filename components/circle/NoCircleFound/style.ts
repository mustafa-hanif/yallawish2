import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    rowGap: 16,
    paddingTop: 11.41,
  },
  title: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
    color: "#1C1C1C",
  },
  description: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    lineHeight: 16,
    textAlign: "center",
    color: "#626262",
  },
  button: {
    backgroundColor: "#3B0076",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
});
