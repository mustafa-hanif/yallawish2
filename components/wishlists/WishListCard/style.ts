import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    height: 165,
    width: "48.5%",
    minWidth: 169,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#ffff",
    // position: "relative",
  },
  cardContentWrapper: {
    padding: 8,
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
  profile: {
    width: 28,
    height: 28,
    backgroundColor: "#3B0076",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImageUrl: {
    width: "100%",
    height: "100%",
  },
  profileInitials: {
    color: "#FFFF",
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 0,
  },

  pressableArea: {
    borderRadius: 12,
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    zIndex: 1,
    position: "absolute",
  },
  actionIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
    borderWidth: 0.1,
    borderColor: "#00000012",
    backgroundColor: "#ffff",
    borderRadius: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
});
