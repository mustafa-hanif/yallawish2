import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 80,
    borderBottomColor: "#AEAEB2",
    borderBottomWidth: 1,
    gap: 8,
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  initialsContainer: {
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#007AFF",
  },
  nameInitials: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1C0335",
    fontFamily: "Nunito_700Bold",
  },
  commonCircles: {
    fontSize: 12,
    lineHeight: 20,
    color: "#1C0335",
    fontFamily: "Nunito_300Light",
  },
  rightActionContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    width: 96,
    paddingVertical: 8,
  },
  rightAction: {
    backgroundColor: "#FF3B30",
    width: 60,
    height: 80,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  rightActionIcon: {
    width: 16,
    height: 16,
    tintColor: "#FFFFFF",
    marginBottom: 10,
  },
  rightActionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
  },
});
