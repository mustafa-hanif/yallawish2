import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
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
});

export default styles;
