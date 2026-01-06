import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Section
  header: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },

  headerBackgroundImage: {
    borderRadius: 16,
    opacity: 0.1,
  },

  headerContent: {
    maxWidth: 600,
  },

  lockText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#03FFEE",
  },

  listTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 32,
    color: "#00000",
  },

  eventDate: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "#1C1C1C",
  },

  eventDetails: {
    paddingTop: 18,
    paddingBottom: 25,
    paddingHorizontal: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  flagIconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  flagEmoji: {
    fontSize: 16,
  },

  detailContent: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  detailLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "#1C1C1C",
  },

  detailValue: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#1C1C1C",
  },

  // Items Section
  itemsSection: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: -16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 24,
  },

  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
  },

  totalItemsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  totalItemsText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: "#1C0335",
  },

  itemCountBadge: {
    backgroundColor: "#00A0FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  itemCountText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },

  sortButtonText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    color: "#330065",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#03FFEE",
  },

  addButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: "#330065",
  },

  itemsList: {
    flex: 1,
  },

  giftCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
  },

  giftCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 30,
  },

  giftImage: {
    width: 200,
    height: 186,
    borderRadius: 12,
    backgroundColor: "#E9F3FF",
    borderWidth: 0.19,
    borderColor: "#c4c4c411",
  },

  giftInfo: {
    flex: 1,
    height: 186,
    justifyContent:'space-around'
  },

  giftName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: "#1A0034",
    marginBottom: 4,
  },

  giftPrice: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: "#00A0FF",
  },

  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  quantityLabel: {
    fontFamily: "Nunito_500Medium",
    fontSize: 18,
    color: "#1A0034",
  },

  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F7F8",
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityValue: {
    fontFamily: "Nunito_500Medium",
    fontSize: 14,
    color: "#1C0335",
    minWidth: 24,
    textAlign: "center",
  },

  removeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  removeButtonText: {
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: "#FF0000",
  },
  privacyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  privacyStatus: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  privacyDesc: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
});
