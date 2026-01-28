import CircleCard from "@/components/circle/CircleCard";
import CircleManagement from "@/components/circle/CircleManagement";
import NoCircleFound from "@/components/circle/NoCircleFound";
import Header from "@/components/Header";
import { TextInputField } from "@/components/TextInputField";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";

// Wrapper component to fetch owner profile for each circle
const CircleCardWithOwner = ({ circle }: { circle: any }) => {
  const ownerProfile = useQuery(api.products.getUserProfileByUserId, circle?.owner_id ? { user_id: circle.owner_id } : "skip");
  return <CircleCard circle={circle} ownerProfile={ownerProfile} />;
};

type CircleType = "admin" | "member";

const Circle = () => {
  const [expanded, setExpanded] = useState({
    admin: false,
    member: false,
  });

  const [searchText, setSearchText] = useState("");
  const { userId } = useAuth();

  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const encodedReturnTo = returnTo ? String(returnTo) : undefined;
  const decodedReturnTo = encodedReturnTo ? decodeURIComponent(encodedReturnTo) : undefined;

  // Fetch all circles where user is a member
  const allCircles = useQuery(api.products.getGroups, userId ? { user_id: userId } : "skip");
  const isLoading = allCircles === undefined;

  // Categorize circles by admin/owner status
  const { circlesIamAdminOf, circlesIamMemberOf } = useMemo(() => {
    if (!allCircles) return { circlesIamAdminOf: [], circlesIamMemberOf: [] };

    const adminCircles = allCircles.filter((circle) => circle.isOwner || circle.isAdmin);
    const memberCircles = allCircles.filter((circle) => !circle.isOwner && !circle.isAdmin);

    // Apply search filter if present
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      return {
        circlesIamAdminOf: adminCircles.filter((c) => c.name.toLowerCase().includes(searchLower)),
        circlesIamMemberOf: memberCircles.filter((c) => c.name.toLowerCase().includes(searchLower)),
      };
    }

    return {
      circlesIamAdminOf: adminCircles,
      circlesIamMemberOf: memberCircles,
    };
  }, [allCircles, searchText]);

  const handleBack = () => {
    if (decodedReturnTo) {
      router.replace(decodedReturnTo as any);
      return;
    }
    router.back();
  };

  const toggleExpand = (type: CircleType) => {
    setExpanded((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handlePressAddCircle = () => {
    router.push("/(tabs)/create-circle-step1");
  };
  return (
    <View style={styles.container}>
      <Header title="My Circles" handleBack={handleBack} />
      <CircleManagement />
      <View style={{ paddingHorizontal: 16, marginBottom: 22.3 }}>
        <TextInputField placeholder="Search" icon={<Image source={require("@/assets/images/search.png")} />} value={searchText} onChangeText={setSearchText} />
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#3B0076" size="large" />
          <Text style={styles.loadingText}>Loading circles...</Text>
        </View>
      ) : circlesIamMemberOf.length === 0 && circlesIamAdminOf.length === 0 ? (
        <NoCircleFound searchText={searchText} />
      ) : (
        <View style={styles.circleContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingBottom: 100 }}
            data={[
              { type: "admin", title: "Circles you're Admin of", data: circlesIamAdminOf },
              { type: "member", title: "Member Circles", data: circlesIamMemberOf },
            ]?.filter((section) => section.data.length > 0)}
            keyExtractor={(item) => item.type as string}
            renderItem={({ item }) => {
              const isExpanded = expanded[item.type as "admin" | "member"];
              return (
                <View>
                  <Pressable
                    style={[
                      styles.circleExpandableButton,
                      isExpanded && {
                        borderBottomEndRadius: 0,
                        borderBottomStartRadius: 0,
                      },
                    ]}
                    onPress={() => toggleExpand(item?.type as "admin" | "member")}
                  >
                    <Text style={styles.circleExpandableButtonText}>{item.title}</Text>
                    <Entypo name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#1C0335" />
                  </Pressable>

                  {isExpanded && (
                    <View
                      style={{
                        maxHeight: 624,
                        backgroundColor: "#ECE3F7",
                        paddingHorizontal: 8,
                        paddingBottom: 16,
                        borderBottomEndRadius: 8,
                        borderBottomStartRadius: 8,
                      }}
                    >
                      <FlatList showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 100 }} data={item.data} keyExtractor={(circle) => circle._id} renderItem={({ item }) => <CircleCardWithOwner circle={item} />} nestedScrollEnabled />
                    </View>
                  )}
                </View>
              );
            }}
          />

          <View style={styles.createCircleButtonContainer}>
            <Pressable style={styles.createCircleButton} onPress={handlePressAddCircle}>
              <AntDesign name="plus" size={16} color="#1C1C1C" />
              <Text style={styles.createCircleButtonText}>Add New Circle</Text>
            </Pressable>
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

  circleContainer: {
    paddingHorizontal: 8,
    flex: 1,
    gap: 22.34,
    position: "relative",
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
  createCircleButtonContainer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "flex-end",
  },
  createCircleButton: {
    backgroundColor: "#6FFFF6",
    height: 56,
    width: 219,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  createCircleButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C1C1C",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#8E8E93",
  },
});
