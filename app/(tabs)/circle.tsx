import CircleCard from "@/components/circle/circleCard";
import NoCircleFound from "@/components/circle/NoCircleFound";
import { TextInputField } from "@/components/TextInputField";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Circle = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCirclesIamMemberOfExpanded, setIsCirclesIamMemberOfExpanded] = useState(false);
  const [isCirclesIamAdminOfExpanded, setIsCirclesIamAdminOfExpanded] = useState(false);

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

  const circlesIamAdminOf = Array.from({ length: 10 });
  const circlesIamMemberOf = Array.from({ length: 10 });

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
      <LinearGradient colors={["#F6F0FF", "#FFFFFF"]} style={styles.headContainer}>
        <View>
          <Text style={styles.title}>Circle Management</Text>
          <Text style={styles.description}>Manage all your gifting circles</Text>
        </View>
        <View>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="user-friends" size={12} color="black" />
          </View>
        </View>
      </LinearGradient>

      {circlesIamMemberOf.length === 0 && circlesIamAdminOf.length === 0 ? (
        <NoCircleFound />
      ) : (
        <View style={styles.circleContainer}>
          <TextInputField placeholder="Search" icon={<Image source={require("@/assets/images/search.png")} />} />
          <View style={{ gap: 16 }}>
            <View>
              <Pressable style={[styles.circleExpandableButton, isCirclesIamAdminOfExpanded && { borderBottomEndRadius: 0, borderBottomStartRadius: 0 }]} onPress={() => setIsCirclesIamAdminOfExpanded(!isCirclesIamAdminOfExpanded)}>
                <Text style={styles.circleExpandableButtonText}>Circles you’re Admin of</Text>
                <Entypo name="chevron-down" size={24} color="#1C0335" />
              </Pressable>
              {isCirclesIamAdminOfExpanded && (
                <ScrollView style={{ maxHeight: 624, backgroundColor: "#ECE3F7", paddingHorizontal: 8, paddingBottom: 16, borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                  <FlatList contentContainerStyle={{ gap: 16 }} data={circlesIamAdminOf} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => <CircleCard />} />
                </ScrollView>
              )}
            </View>
            <View>
              <Pressable style={[styles.circleExpandableButton, isCirclesIamMemberOfExpanded && { borderBottomEndRadius: 0, borderBottomStartRadius: 0 }]} onPress={() => setIsCirclesIamMemberOfExpanded(!isCirclesIamMemberOfExpanded)}>
                <Text style={styles.circleExpandableButtonText}>Member Circles</Text>
                <Entypo name="chevron-down" size={24} color="#1C0335" />
              </Pressable>
              {isCirclesIamMemberOfExpanded && (
                <ScrollView style={{ maxHeight: 624, backgroundColor: "#ECE3F7", paddingHorizontal: 8, paddingBottom: 16, borderBottomEndRadius: 8, borderBottomStartRadius: 8 }}>
                  <FlatList contentContainerStyle={{ gap: 16 }} data={circlesIamMemberOf} keyExtractor={(item, index) => index.toString()} renderItem={({ item }) => <CircleCard />} />
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      )}
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
  circleContainer: {
    paddingHorizontal: 8,
    flex: 1,
    gap: 22.34,
  },
  circleExpandableButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ECE3F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circleExpandableButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#3B0076",
  },
});
