import { TextInputField } from "@/components/TextInputField";
import { getProfileInitials } from "@/utils";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { styles } from "./style";

interface UserProfileBottomSheetContentProps {
  userProfiles?: Array<any>;
}

export default function UserProfileBottomSheetContent({ userProfiles }: UserProfileBottomSheetContentProps) {
  const [searchText, setSearchText] = React.useState("");

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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInputField value={searchText} onChangeText={setSearchText} label="Search by name or email" icon={<Image source={require("@/assets/images/search.png")} />} />
      </View>
      <View style={styles.titleAndCountContainer}>
        <Text style={styles.title}>Friends</Text>
        <View style={styles.countContainer}>
          <Text style={styles.count}>{searchFilteredProfiles.length}</Text>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={searchFilteredProfiles}
        keyExtractor={(_item, index) => _item?.id || index.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const avatarUrl = item?.profileImageUrl || "";
          const nameInitials = getProfileInitials(item);
          const name = item?.displayName || (item?.firstName && item?.lastName ? `${item?.firstName} ${item?.lastName}` : "");
          const email = item?.contactEmail || "";
          return (
            <View style={styles.containerIItem}>
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
        }}
      />
    </View>
  );
}
