import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    height: 165,
    width: "49.5%",
    minWidth: 169,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    padding: 8,
    flex: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardIcon: {
    height: 30,
    width: 30,
    borderRadius: 6,
    resizeMode: "contain",
  },

  titleContainer: {
    height: 35,
    justifyContent: "center",
  },
  title: {
    color: "#1A0034",
    fontSize: 16,
    lineHeight: 16,
    verticalAlign: "top",
    fontFamily: "Nunito_700Bold",
  },
  date: {
    color: "#777777",
    fontSize: 11,
    lineHeight: 11,
    fontFamily: "Nunito_400Regular",
  },
  totalItems: {
    color: "#00A0FF",
    fontSize: 10,
    fontFamily: "Nunito_400Regular",
    lineHeight: 10,
  },
  totalIteNumber: {
    fontFamily: "Nunito_700Bold",
    lineHeight: 10,
  },
  progressBarContainer: {
    backgroundColor: "#2121211A",
    height: 6,
    borderRadius: 27.4,
  },
  progressBar: {
    backgroundColor: "#3C0077",
    height: "100%",
    borderRadius: 27.4,
  },
  progressText: {
    textAlign: "right",
    color: "#777777",
    fontSize: 10,
    verticalAlign: "middle",
    fontFamily: "Nunito_600SemiBold",
  },
});
