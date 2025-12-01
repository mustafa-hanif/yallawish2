import { useUser } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Image, Pressable, StatusBar, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";

interface HeaderProp {}

export function Header({}: HeaderProp) {
  const { user } = useUser();

  const handlePressProfile = () => router.push("/profile-setup");
  const profilePhoto = user?.imageUrl ?? (typeof user?.unsafeMetadata?.profileImageUrl === "string" ? (user.unsafeMetadata.profileImageUrl as string) : undefined);
  const profileInitials = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    if (name) {
      return (
        name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || "YW"
      );
    }

    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    if (email) {
      const letters = email
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
      return letters || "YW";
    }

    return "YW";
  }, [user?.firstName, user?.lastName, user?.emailAddresses]);

  return (
    <>
      <View>
        <StatusBar barStyle="light-content" backgroundColor="transparent" />
        <LinearGradient colors={["#330065", "#45018ad7"]} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }} style={styles.header}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.mainContainer}>
              <View style={styles.searchContainer}>
                <View style={styles.iconContainer}>
                  <Image source={require("@/assets/images/search.png")} style={styles.icon} />
                </View>
                <TextInput placeholder="Type your search here..." style={styles.searchInput} placeholderTextColor="#EFECF266" />
              </View>

              <Pressable style={styles.profileButton} onPress={handlePressProfile}>
                {profilePhoto ? (
                  <Image style={styles.profileAvatarImage} source={{ uri: profilePhoto }} resizeMode="cover" />
                ) : (
                  <View style={styles.profileImage}>
                    <Text style={styles.profileText}>{profileInitials}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </>
  );
}
