import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  mainContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  searchContainer: {
    height: 40,
    width: 255,
    borderColor: "#ffff",
    borderWidth: 1,
    borderRadius: 40,
    paddingLeft: 48,
    position: "relative",
    overflow: "hidden",
  },
  iconContainer: {
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 18,
  },
  icon: {
    tintColor: "#ffff",
  },
  searchInput: {
    width: 200,
    fontFamily: "Nunito_400Regular",
    fontStyle: "italic",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(51, 0, 101, 0.12)",
  },

  profileAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 22,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  profileText: {
    fontSize: 20,
    fontFamily: "Nunito_600SemiBold",
    color: "#330065",
  },
});
