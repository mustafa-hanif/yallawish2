import NoCircleFound from "@/components/circle/NoCircleFound";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Image, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Circle = () => {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;
  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient colors={["#330065", "#45018ad7"]} style={styles.header} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>My Circles</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
      <View style={styles.headContainer}>
        <View>
          <Text style={styles.title}>Circle Management</Text>
          <Text style={styles.description}>Manage all your gifting circles</Text>
        </View>
        <View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="user-friends" size={12} color="black" />
          </View>
        </View>
      </View>
      <NoCircleFound />
    </View>
  );
};

export default Circle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 108,
    justifyContent: "flex-end",
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headContainer: {
    backgroundColor: "#F6F0FF",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  navigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  backButton: {},
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    lineHeight: 28,
    letterSpacing: -1,
  },
  title: {
    fontSize: 28,
    fontFamily: "Nunito_700Bold",
    color: "#0F0059",
  },
  description: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#794CA1",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});
