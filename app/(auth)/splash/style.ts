import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
    resizeMode: "cover",
  },
});
