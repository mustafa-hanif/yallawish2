import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {},
  inputWrapper: {
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    position: "relative",
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    padding: 16,
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
    lineHeight: 24,
  },
  labelContainer: {
    position: "absolute",
    backgroundColor: "#ffff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    top: -18,
    marginLeft: 13,
  },
  label: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  rightIconContainer: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minWidth: 50,
  },
  errorText: { fontSize: 12, color: "#B00020", fontFamily: "Nunito_700Bold" },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 20,
  },
  calendarHeader: {
    backgroundColor: "#3b007647",
    borderRadius: 50,
  },
  calendarHeaderTextStyle: {
    fontSize: 20,
    fontFamily: "Nunito_900Black",
    color: "#1C0335",
  },
  weekDaysTextStyle: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
  },
  calendarDayContainerStyle: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarTextStyle: {
    fontFamily: "Nunito_300Light",
  },
});
