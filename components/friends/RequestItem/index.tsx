import { getProfileInitials } from "@/utils";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./style";

type RequestItemProps = {
  connection: any;
  profile: any;
  onAccept: (connectionId: string) => void;
  onReject: (connectionId: string) => void;
  type?: "received" | "sent";
};

export default function RequestItem({ connection, profile, onAccept, onReject, type = "received" }: RequestItemProps) {
  const displayName = profile?.displayName || profile?.firstName || "Unknown User";
  const email = profile?.contactEmail || "";
  const imageUrl = profile?.profileImageUrl || "";
  const nameInitials = getProfileInitials(profile);

  return (
    <View style={styles.container}>
      {imageUrl ? (
        <View>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </View>
      ) : (
        <View style={[styles.image, styles.initialsContainer]}>
          <Text style={styles.nameInitials}>{nameInitials || ""}</Text>
        </View>
      )}
      <View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
        {type === "received" ? (
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => onAccept(connection._id)}>
              <FontAwesome name="check-circle" size={24} color="#34C759" />
            </Pressable>
            <Pressable onPress={() => onReject(connection._id)}>
              <Entypo name="circle-with-cross" size={24} color="#FF3B30" />
            </Pressable>
          </View>
        ) : (
          <Text style={styles.email}>Pending...</Text>
        )}
      </View>
    </View>
  );
}
