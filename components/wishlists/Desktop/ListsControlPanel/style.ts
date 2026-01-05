import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  listsControlPanelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listCountContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropDownText: {
    color: "#1A0034",
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  count: {
    backgroundColor: "#00A0FF",
    width: 22.5,
    height: 22.5,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon:{
    width: 16, 
    height: 16,
    objectFit:'contain'
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
  },
  sortAndFilterButton: {
    width: 113,
    height: 36,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3B0172",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    gap: 4,
    flexDirection: "row",
  },
  sortAndFilterText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold'
  },
});
