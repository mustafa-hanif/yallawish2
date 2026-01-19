import CircleBanner from "@/components/circle/CircleBanner";
import SectionHeader from "@/components/circle/SectionHeader";
import ViewCircleGroupInfo from "@/components/circle/ViewCircleGroupInfo";
import Header from "@/components/Header";
import WishListCard from "@/components/wishlists/WishListCard";
import { Entypo } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const ViewCircle = () => {
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

  const membersArray = Array.from({ length: 10 });

  const handlePressAddNew = () => {
    router.push("/create-circle-step1");
  };
  return (
    <View style={styles.container}>
      <Header title="View Circle" handleBack={handleBack} />
      <ScrollView>
        <CircleBanner />
        <ViewCircleGroupInfo />
        <SectionHeader title="Occasions" count={4} buttonTitle={"Add New"} buttonAction={handlePressAddNew} />
        <View style={styles.section}>
          <FlatList
            columnWrapperStyle={styles.listColumnWrapperStyle}
            contentContainerStyle={styles.listContentContainerStyle}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            key={2}
            data={[
              { _id: "1", title: "Wish List 1" },
              { _id: "2", title: "Wish List 2" },
              { _id: "3", title: "Wish List 3" },
              { _id: "4", title: "Wish List 4" },
            ]}
            // onViewableItemsChanged={onViewableItemsChanged}
            renderItem={({ item }) => (
              <WishListCard
                item={item}
                //  viewableItems={viewableItems}
                //  onSelectDelete={onSelectDelete}
                //  handleArchiveList={handleArchiveList}
                //  handleDuplicateList={handleDuplicateList}
              />
            )}
            keyExtractor={(item) => String(item._id)}
          />
        </View>
        <SectionHeader title="Members" count={24} buttonTitle={"Invite"} />
        <View>
          <FlatList
            data={membersArray}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <View style={[styles.memberItem, index === membersArray.length - 1 && { borderBottomWidth: 0 }]} key={index}>
                  <View style={styles.infoContainer}>
                    <View style={styles.memberProfileAndInitial}>
                      <Text style={styles.nameInitials}>WS</Text>
                    </View>
                    <View>
                      <Text style={styles.memberName}>Will Smith</Text>
                      <Text style={styles.memberEmail}>will.smith@gmail.com</Text>
                    </View>
                  </View>
                  <Pressable>
                    <Entypo name="circle-with-cross" size={24} color="#3B0076" />
                  </Pressable>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.footer}>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Invite Members</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewCircle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContentContainerStyle: {
    gap: 8,
    paddingBottom: 16,
  },
  listColumnWrapperStyle: {
    gap: 8,
  },
  section: {
    paddingHorizontal: 10.5,
  },
  footer: {
    paddingTop: 57,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: "#330065",
    borderRadius: 8,
    alignItems: "center",
    height: 56,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    lineHeight: 19,
    letterSpacing: -0.02,
  },
  memberItem: {
    padding: 15.32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.96,
    borderColor: "#AEAEB2",
  },
  infoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  memberProfileAndInitial: {
    backgroundColor: "#A2845E",
    width: 48,
    height: 48,
    borderRadius: 7.66,
    justifyContent: "center",
    alignItems: "center",
  },
  nameInitials: {
    color: "#ffff",
    fontSize: 15.32,
    fontFamily: "Nunito_900Black",
  },
  memberName: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#1C0335",
  },
  memberEmail: {
    fontSize: 12,
    fontFamily: "Nunito_300Light",
    color: "#1C0335",
  },
});
