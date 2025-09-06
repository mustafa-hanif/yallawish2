
import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: "center",
  },
  progressBarContainer: {
    flexDirection: "row",
    width: screenWidth - 32,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressActive: {
    backgroundColor: "#45018A",
  },
  progressInactive: {
    backgroundColor: "#DDD7E4",
  },
  contentScroll: {
    paddingHorizontal: 16,
    // Leave room for the fixed footer so content isn't hidden
    paddingBottom: 140,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    minHeight: 171,
  },
  optionCardSelected: {
    borderColor: "#1C0335",
  },
  optionCardSelectedBackground: {
    backgroundColor: "#F5EDFE",
  },
  optionCardUnselected: {
    borderColor: "#AEAEB2",
  },
  optionContent: {
    position: "relative",
  },
  checkboxContainer: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#3B0076",
  },
  checkboxUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#AEAEB2",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 24,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    lineHeight: 24,
  },
  optionDescription: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
    lineHeight: 24,
    marginRight: 24,
  },
  publicExtra: {
    marginTop: 12,
    gap: 12,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordLabel: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  passwordInputWrapper: {
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  passwordInput: {
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
  },
  passwordHint: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    zIndex: 1000,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#3B0076",
  },
  buttonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#3B0076",
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },
  buttonSecondaryText: {
    color: "#3B0076",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: Dimensions.get("window").height * 0.9,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD7E4",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
    color: "#1C0335",
  },
  groupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  groupCard: {
    width: (Dimensions.get("window").width - 16 * 2 - 12) / 2,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#C9B7F5",
    position: "relative",
  },
  groupCardSelected: {
    borderWidth: 2,
    borderColor: "#3B0076",
  },
  groupImage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#845EF7",
  },
  groupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28,3,53,0.35)",
  },
  groupCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  groupCheckSelected: {
    backgroundColor: "#3B0076",
  },
  groupTextWrap: {
    position: "absolute",
    left: 12,
    bottom: 12,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
  },
  groupBy: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    color: "#FFFFFF",
  },
  orWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDD7E4",
  },
  orText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  shareWithFriends: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
    marginBottom: 8,
  },
  friendList: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E4E4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
  },
  friendName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  friendEmail: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#8E8E93",
  },
  friendCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#AEAEB2",
    alignItems: "center",
    justifyContent: "center",
  },
  friendCheckboxSelected: {
    backgroundColor: "#3B0076",
    borderColor: "#3B0076",
  },
});