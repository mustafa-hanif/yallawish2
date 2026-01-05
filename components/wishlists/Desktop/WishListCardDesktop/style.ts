import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    width: "100%",
    minWidth: 169,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "visible",
  },
  cardContentWrapper: {
    padding: 16,
    rowGap: 10,
    position:'relative'
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconAndDetails: {
    alignItems:'flex-start',
    flexDirection: "row",
    gap: 16,
  },
  cardIcon: {
    height: 72,
    width: 72,
    borderRadius: 8,
    resizeMode: "contain",
  },
  titleAndDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    height: 35,
    justifyContent: "center",
  },
  title: {
    color: "#1A0034",
    fontSize: 24,
    verticalAlign: "top",
    fontFamily: "Nunito_700Bold",
  },
  date: {
    color: "#777777",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  totalItems: {
    color: "#00A0FF",
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
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
    paddingBottom: 8,
  },
  profile: {
    width: 24,
    height: 24,
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
  actionButtonContent: {
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  actionTitle: {
    fontSize: 8,
    textAlign: "center",
    color: "#1C0335",
    fontFamily: "Nunito_600SemiBold",
  },
  actionIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 43,
    height: 43,
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
  profileAndDropDownContainer: {
    flexDirection: "row",
    gap: 13,
    alignItems:'center',
    position: 'relative',
  },
});
