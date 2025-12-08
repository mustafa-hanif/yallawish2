import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  actionBarContainer: {
    rowGap: 16,
    paddingTop: 16,
  },
  searchInputContainer: {
    position: "relative",
  },
  iconContainer: {
    height: 41,
    position: "absolute",
    paddingLeft: 10,
    justifyContent: "center",
  },
  searchIcon: {
    width: 16.01,
    height: 16.01,
    tintColor: "#626262",
  },
  searchInput: {
    width: "100%",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    paddingLeft: 34,
    fontSize: 12.04,
  },

  sortAndFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedSortAndFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  sortByText: {
    color: "#000000",
    fontSize: 12,
    lineHeight: 28,
    fontFamily: "Nunito_700Bold",
  },
  selectedSortValue: {
    color: "#1C1C1CB2",
    fontSize: 12,
    lineHeight: 28,
    fontFamily: "Nunito_700Bold",
  },
  sortAndFilterButton: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#3B0172",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    gap: 4,
    flexDirection: "row",
  },
  sortAndFilterButtonText: {
    color: "#3B0172",
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
  },
  selectedListText: {
    color: "#1A0034",
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
});
