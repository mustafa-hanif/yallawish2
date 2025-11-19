import { StyleSheet } from "react-native";

export const authCardStyles = StyleSheet.create({
  formContainer: {
    width: "100%",
    gap: 24,
  },
  formContainerMobile: {
    paddingHorizontal: 8,
  },
  formContainerDesktop: {
    backgroundColor: "rgba(18,0,42,0.78)",
    borderRadius: 40,
    paddingHorizontal: 48,
    paddingVertical: 52,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    gap: 32,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 48,
    shadowOffset: { width: 0, height: 24 },
  },
  segmentedControl: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    padding: 5,
    backgroundColor: "#EEEEEE",
    alignSelf: "stretch",
  },
  segmentedControlDesktop: {
    alignSelf: "center",
    maxWidth: 440,
    width: "100%",
  },
  segmentedControlMobile: {
    marginBottom: 32
  },
  segmentedOption: {
    flex: 1,
  },
  segmentedActive: {
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#2B0055",
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
  },
  segmentedActiveMobile: {
    paddingVertical: 14,
  },

  
  segmentedActiveText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#330065",
  },
   segmentedActiveTextMobile: {
    fontSize: 13.44,
  },
  segmentedInactive: {
    borderRadius: 999,
    alignItems: "center",
    paddingVertical: 16,
  },
  segmentedInactiveMobile: {
   
    paddingVertical: 14,
  },
  
 
  segmentedInactiveText: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 18,
    color: "#330065",
  },
  segmentedInactiveTextMobile: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13.44,
    color:'#330065'
  },
  welcomeTitle: {
    textAlign: "center",
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
    fontSize: 32,
    letterSpacing: 0.4,
  },
  welcomeTitleDesktop: {
    fontSize: 36,
  },
  cardSubtitle: {
    textAlign: "center",
    color: "rgba(255,255,255,0.78)",
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  cardSubtitleDesktop: {
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 420,
    alignSelf: "center",
  },
  otpMessage: {
    textAlign: "center",
    color: "rgba(255,255,255,0.78)",
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  otpInputsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  otpInput: {
    width: 58,
    height: 66,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.42)",
    backgroundColor: "rgba(12,0,32,0.32)",
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  resendContainer: {
    alignItems: "center",
    gap: 8,
  },
  resendText: {
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
  },
  resendLink: {
    color: "#03FFEE",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  resendLinkDisabled: {
    color: "rgba(3,255,238,0.45)",
  },
  backLink: {
    marginTop: 12,
    color: "rgba(255,255,255,0.72)",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  fieldsStack: {
    gap: 16,
  },
  nameRow: {
    gap: 16,
  },
  nameRowDesktop: {
    flexDirection: "row",
  },
  inputField: {
    flex: 1,
  },
  input: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.42)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontFamily: "Nunito_500Medium",
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "rgba(12,0,32,0.32)",
  },
  inputDesktop: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  inputMobile: {
    backgroundColor: "transparent",
    borderColor: '#FFFFFF',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 8,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.65)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxBoxChecked: {
    backgroundColor: "#03FFEE",
    borderColor: "#03FFEE",
  },
  checkboxLabel: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: "#03FFEE",
    fontFamily: "Nunito_600SemiBold",
  },
  errorContainer: {
    gap: 6,
  },
  errorText: {
    color: "#FFB4B4",
    fontFamily: "Nunito_400Regular",
  },
  socialStack: {
    gap: 14,
  },
  socialRowDesktop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },
  passwordField: {
    position: "relative",
    width: "100%",
  },
  passwordInput: {
    paddingRight: 56,
  },
  passwordToggle: {
    position: "absolute",
    right: 18,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  forgotLinkWrapper: {
    alignSelf: "flex-end",
  },
  forgotLink: {
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
   forgotLinkMobile: {
    color: "#FFFFFF",
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
  },
});
