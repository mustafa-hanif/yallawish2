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
    gap: 6,
    borderWidth: 0.8,
    borderRadius: 33.79,
    paddingVertical: 8,
    paddingHorizontal: 13.68,
  },

  selectedSortValue: {
    color: "#330065",
    fontSize: 12,
    lineHeight: 12,
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

  selectedListText: {
    color: "#1A0034",
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  filterButtons: {
    flexDirection: "row",
    gap: 4.02,
    flex: 1,
    alignItems: "center",
  },
});
