import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface noListFoundProps {
  currentTab?: string;
}
export default function NoListFound({ currentTab }: noListFoundProps) {
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
      <View style={styles.contentCenter}>
        <Text style={styles.listNotCreated}>{currentTab === "my-events" ? <>{"You haven’t created\nany lists yet"}</> : <>{"No lists available for\nCommunity Events"}</>}</Text>
      </View>
      {currentTab === "my-events" ? (
        <>
          <View style={styles.contentCenter}>
            <Text style={styles.listNotCreatedDescription}>Add your first list by clicking below</Text>
          </View>
          <View style={styles.contentCenter}>
            <Pressable style={styles.createNewListButton}>
              <Text style={styles.createNewListButtonText}>Create New List</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}
