import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    paddingVertical: 26,
    paddingHorizontal: 30,
    borderRadius: 15,
    gap: 16,
  },
  icon: {
    width: 24,
    height: 24,
    alignSelf: "center",
  },
  heading: {
    fontSize: 16,
    lineHeight: 20,
    color: "#1C1C1C",
    fontFamily: "Nunito_700Bold",
    textAlign: "center",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    height: 32,
    borderColor: "#9D9D9D",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#9D9D9D",
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    verticalAlign: "middle",
  },
  deleteButton: {
    flex: 1,
    height: 32,
    backgroundColor: "#FF0000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#ffff",
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    verticalAlign: "middle",
  },
});
