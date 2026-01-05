import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "transparent",
    zIndex: 10000,
  },
  dropdownContainer: { 
    position: "absolute",
    top: 50, 
    right: 0,
    width: 360,
    maxHeight: 580,
    backgroundColor: "#FFFFFF", 
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 25,
    zIndex: 10001,
  },
  dropdownContent: { 
    padding: 24,
    gap: 16,
  },
  sortDivider: { 
    height: 1, 
    backgroundColor: "#E5E5EA",
    marginVertical: 4,
  },
  sortSection: { 
    gap: 10,
  },
  sortSectionHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between",
  },
  sortSectionTitle: { 
    fontSize: 18, 
    fontFamily: "Nunito_700Bold", 
    color: "#1C0335",
  },
  radioRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 16, 
    paddingVertical: 4,
    paddingLeft: 4,
  },
  radioOuter: { 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    borderWidth: 2, 
    borderColor: "#D5D2DA", 
    alignItems: "center", 
    justifyContent: "center",
  },
  radioOuterActive: { 
    borderColor: "#360068", 
    backgroundColor: "#360068",
  },
  radioInner: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: "#FFFFFF",
  },
  radioLabel: { 
    fontSize: 18, 
    fontFamily: "Nunito_600SemiBold", 
    color: "#1C1C1C",
    flex: 1,
  },
  applyBtn: { 
    backgroundColor: "#360068", 
    height: 48, 
    borderRadius: 8, 
    alignItems: "center", 
    justifyContent: "center",
    marginTop: 8,
  },
  applyBtnText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontFamily: "Nunito_700Bold",
  },
});
