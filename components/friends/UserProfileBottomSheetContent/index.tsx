import { TextInputField } from "@/components/TextInputField";
import { getProfileInitials } from "@/utils";
import React from "react";
import { Image, Keyboard, KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

interface UserProfileBottomSheetContentProps {
  userProfiles?: Array<any>;
}

export default function UserProfileBottomSheetContent({ userProfiles }: UserProfileBottomSheetContentProps) {
  const [searchText, setSearchText] = React.useState("");
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setIsKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setIsKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const searchFilteredProfiles = React.useMemo(() => {
    if (!userProfiles) return [];
    if (searchText.trim() === "") return userProfiles;
    const lowercasedSearchText = searchText.toLowerCase();
    return userProfiles.filter((profile) => {
      const name = profile?.displayName || (profile?.firstName && profile?.lastName ? `${profile?.firstName} ${profile?.lastName}` : "");
      const email = profile?.contactEmail || "";
      return name.toLowerCase().includes(lowercasedSearchText) || email.toLowerCase().includes(lowercasedSearchText);
    });
  }, [searchText, userProfiles]);

  return (
    <KeyboardAvoidingView style={[styles.container, isKeyboardVisible ? { paddingTop: 150 } : null]} behavior="padding">
      <View style={styles.searchContainer}>
        <TextInputField value={searchText} onChangeText={setSearchText} label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} />
      </View>
      <View style={styles.titleAndCountContainer}>
        <Text style={styles.title}>Profiles</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{searchFilteredProfiles.length}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list} contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
        {searchFilteredProfiles.map((item, index) => {
          const avatarUrl = item?.profileImageUrl || "";
          const nameInitials = getProfileInitials(item);
          const name = item?.displayName || (item?.firstName && item?.lastName ? `${item?.firstName} ${item?.lastName}` : "");
          const email = item?.contactEmail || "";
          return (
            <View key={item?.id || index.toString()} style={styles.containerIItem}>
              <View style={styles.infoContainer}>
                <View>
                  {avatarUrl ? (
                    <View style={styles.imageContainer}>
                      <Image resizeMode="cover" source={{ uri: avatarUrl }} style={styles.image} />
                    </View>
                  ) : (
                    <View style={styles.imageContainer}>
                      <Text style={styles.nameInitials}>{nameInitials || ""}</Text>
                    </View>
                  )}
                </View>
                <View>
                  {name ? <Text style={styles.name}>{name}</Text> : null}
                  {email ? <Text style={styles.email}>{email}</Text> : null}
                </View>
              </View>
              <View>
                <Image resizeMode="contain" source={require("@/assets/images/addFriend.png")} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
