import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface noListFoundProps {
  currentTab?: string;
  selectedFilter?: string;
}
export default function NoListFound({ currentTab, selectedFilter }: noListFoundProps) {
  const handleClickCreateNewList = () => router.push("/create-list-step1");
  return (
    <View style={styles.noListFoundContent}>
      <View>
        <Text style={styles.noListsFound}>{"No lists found :("}</Text>
      </View>
      <View style={styles.contentCenter}>
        <Image source={require("@/assets/images/noListFoundUsers.png")} resizeMode="contain" />
      </View>
      <View style={styles.contentCenter}>
        <Image source={require("@/assets/images/noListFound.png")} resizeMode="contain" />
      </View>
      {selectedFilter ? (
        <></>
      ) : (
        <>
          <View style={styles.contentCenter}>
            <Text style={styles.listNotCreated}>{currentTab === "my-events" ? <>{"You haven’t created\nany lists yet"}</> : <>{"No lists available for\nCommunity Events"}</>}</Text>
            {currentTab === "my-events" ? (
              <>
                <View style={styles.contentCenter}>
                  <Text style={styles.listNotCreatedDescription}>Add your first list by clicking below</Text>
                </View>
                <View style={styles.contentCenter}>
                  <Pressable onPress={handleClickCreateNewList} style={styles.createNewListButton}>
                    <Text style={styles.createNewListButtonText}>Create New List</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
}
