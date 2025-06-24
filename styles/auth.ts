import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    overflowY: "scroll",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    padding: 4,
    width: "100%",
    maxWidth: 300,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    textAlign: "center",
  },
  activeToggle: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  inactiveToggle: {
    backgroundColor: "transparent",
  },
  activeToggleText: {
    color: "#1a1a2e",
    fontWeight: "600",
    fontSize: 16,
  },
  inactiveToggleText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  content: {
    flex: 1,
    backgroundColor: "#2d1b69",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    gap: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: "white",
    backgroundColor: "transparent",
  },
  halfInput: {
    flex: 1,
  },
  dropdownInput: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  inputText: {
    fontSize: 16,
    color: "white",
  },
  placeholderText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
  chevron: {
    color: "white",
    fontSize: 12,
  },
  signupButton: {
    backgroundColor: "#00ffff",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  signupButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialSection: {
    marginTop: 40,
    alignItems: "center",
  },
  orText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  socialButtonText: {
    fontSize: 24,
    color: "white",
  },
  errorContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#1a1a2e",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginTop: -10,
    overflow: "hidden",
  },
  pickerOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  pickerOptionText: {
    color: "white",
    fontSize: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 60,
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  eyeIconText: {
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.6)",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -5,
  },
  forgotPasswordText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#00ffff",
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#1a1a2e",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  signUpLink: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
