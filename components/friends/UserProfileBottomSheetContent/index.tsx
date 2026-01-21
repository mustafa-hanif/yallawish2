import { TextInputField } from "@/components/TextInputField";
import { getProfileInitials } from "@/utils";
import React from "react";
import { Image, Keyboard, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import { styles } from "./style";

interface UserProfileBottomSheetContentProps {
  userProfiles?: Array<any>;
  onSendRequest: (userId: string) => void;
}

export default function UserProfileBottomSheetContent({ userProfiles, onSendRequest }: UserProfileBottomSheetContentProps) {
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

  // Profiles are already filtered by search text from backend
  const searchFilteredProfiles = userProfiles || [];

  return (
    <KeyboardAvoidingView style={[styles.container, isKeyboardVisible && styles.containerWithKeyboard]} behavior="padding">
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
              {(() => {
                const status = item?.connectionStatus || "none";
                const perspective = item?.connectionPerspective;

                if (status === "accepted") {
                  return (
                    <View style={styles.statusAccepted}>
                      <Text style={styles.statusAcceptedText}>Added</Text>
                    </View>
                  );
                } else if (status === "pending" && perspective === "sent") {
                  return (
                    <View style={styles.statusSent}>
                      <Text style={styles.statusSentText}>Sent</Text>
                    </View>
                  );
                } else if (status === "pending" && perspective === "received") {
                  return (
                    <View style={styles.statusRespond}>
                      <Text style={styles.statusRespondText}>Respond</Text>
                    </View>
                  );
                } else {
                  return (
                    <Pressable onPress={() => onSendRequest(item?.user_id)}>
                      <Image resizeMode="contain" source={require("@/assets/images/addFriend.png")} />
                    </Pressable>
                  );
                }
              })()}
            </View>
          );
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
