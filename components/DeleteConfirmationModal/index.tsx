import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface DeleteConfirmationProps {
  text?: string;
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
}
export default function DeleteConfirmation({ text = "", visible, onCancel, onDelete }: DeleteConfirmationProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => onCancel()}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.container}>
          <View>
            <Image style={styles.icon} resizeMode="contain" source={require("@/assets/images/deleteList.png")} />
          </View>
          <View>
            <Text style={styles.heading}>{text || "Are you sure you want to\ndelete this list?"}</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
