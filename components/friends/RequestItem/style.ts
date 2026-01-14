import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 95,
    borderBottomColor: "#AEAEB2",
    borderBottomWidth: 1,
    gap: 8,
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 63,
    height: 63,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  name: {
    fontSize: 16,
    color: "#1C0335",
    fontFamily: "Nunito_700Bold",
  },
  email: {
    fontSize: 10,
    fontWeight: "300",
    color: "#1C0335",
    fontFamily: "Nunito_300Light",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 28,
  },
});
