import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  noListFoundContent: {
    gap: 16.41,
    paddingTop: 27,
  },
  noListsFound: {
    color: "#626262",
    fontSize: 24,
    lineHeight: 16,
    fontFamily: "Nunito_600SemiBold",
    textAlign: "center",
  },
  contentCenter: {
    alignItems: "center",
  },

  listNotCreated: {
    fontSize: 32,
    marginBottom: 10,
    fontFamily: "Nunito_700Bold",
    color: "#1C1C1C",
    textAlign: "center",
  },
  listNotCreatedDescription: {
    fontSize: 24,
    fontFamily: "Nunito_600SemiBold",
    color: "#626262",
    textAlign: "center",
  },
  createNewListButton: {
    marginTop: 16,
    height: 72,
    width: 300,
    backgroundColor: "#3B0076",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createNewListButtonText: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
});
