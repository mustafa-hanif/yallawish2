import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.3)" },
  sortSheetContainer: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#FFFFFF", borderTopLeftRadius: 32, borderTopRightRadius: 32, maxHeight: "80%" },
  sortSheetHandle: { width: 64, height: 6, borderRadius: 3, backgroundColor: "#C7C7CC", alignSelf: "center", marginTop: 12 },
  sortSheetContent: { paddingBottom: 32, paddingHorizontal: 32, paddingTop: 8, gap: 24 },
  sortSheetTitle: { fontSize: 24, fontFamily: "Nunito_700Bold", color: "#1C0335", textAlign: "center", marginTop: 24 },
  sortDivider: { height: 1, backgroundColor: "#E5E5EA" },
  sortSection: { gap: 12 },
  sortSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  sortSectionTitle: { fontSize: 20, fontFamily: "Nunito_900Black", color: "#1C0335" },
  radioRow: { flexDirection: "row", alignItems: "center", gap: 22, paddingVertical: 8 },
  radioOuter: { width: 24, height: 24, borderRadius: 22, borderWidth: 2, borderColor: "#D5D2DA", alignItems: "center", justifyContent: "center" },
  radioOuterActive: { borderColor: "#360068", backgroundColor: "#360068" },
  radioInner: { width: 10, height: 10, borderRadius: 9, backgroundColor: "#ffff" },
  radioLabel: { fontSize: 18, fontFamily: "Nunito_700Bold", color: "#1C1C1C" },
  checkboxBox: { width: 24, height: 24, borderRadius: 22, borderWidth: 2, borderColor: "#D5D2DA", alignItems: "center", justifyContent: "center" },
  checkboxBoxActive: { borderColor: "#360068", backgroundColor: "#360068" },
  applyBarWrapper: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#E5E5EA" },
  applyBtnFull: { backgroundColor: "#360068", height: 56, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  applyBtnText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Nunito_700Bold" },
  sortScrollSpacer: { height: 120 },
});
