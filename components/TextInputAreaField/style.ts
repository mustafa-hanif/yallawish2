import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  inputWrapper: {
    height: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    padding: 16,
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
    lineHeight: 24,
    textAlignVertical: "top",
  },
  labelContainer: {
    position: "absolute",
    backgroundColor: "#ffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    top: -18,
    marginLeft: 13,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  rightIconContainer: {
    position: "absolute",
    right: 16,
    justifyContent: "center",
    height: "100%",
  },
  characterCount: {
    position: "absolute",
    right: 16,
    bottom: 8,
  },
  characterCountText: {
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    lineHeight: 24,
  },
});
