import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 24,
    fontFamily: "Nunito_600SemiBold",
    color: "#626262",
    textAlign: "center",
  },
  imageAndTitleContainer: {
    width: "100%",
    rowGap: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 251,
    height: 111.59,
    resizeMode: "contain",
  },
});
