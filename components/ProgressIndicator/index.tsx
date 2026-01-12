import { View } from "react-native";
import styles from "./style";

interface ProgressIndicatorProps {
  activeSteps?: number;
  totalSteps?: number;
}
export const ProgressIndicator = ({ activeSteps = 0, totalSteps = 3 }: ProgressIndicatorProps) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBarContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} style={[styles.progressSegment, index < activeSteps ? styles.progressActive : styles.progressInactive]} />
      ))}
    </View>
  </View>
);
