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
    position: "relative",
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
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  sheetContainer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#FFFFFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: "80%" },
  sheetHandle: { width: 64, height: 6, borderRadius: 3, backgroundColor: "#C7C7CC", alignSelf: "center", marginTop: 12 },
  sheetContent: { paddingBottom: 32, paddingHorizontal: 32, paddingTop: 8, gap: 24 },
  sheetTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#1C0335", textAlign: "center", marginTop: 24 },
  actionsContainer: {
    gap: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 6,
  },
  actionIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
  },
  actionIcon: {
    width: 16,
    height: 16,
  },

  actionLabel: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#1C0335",
  },
  actionButtonIcon: {
    width: 24,
    height: 24,
    color: "#FFFFFF",
  },
});
