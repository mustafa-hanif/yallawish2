import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { styles } from "./style";

interface DeleteConfirmationProps {
  text?: string;
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  cancelButtonText?: string;
  deleteButtonText?: string;
  cancelButtonColor?: null | string;
  deleteButtonColor?: null | string;
  iconSource?: any;
}
export default function DeleteConfirmation({ text = "", visible, onCancel, onDelete, cancelButtonText = "Cancel", deleteButtonText = "Delete", cancelButtonColor, deleteButtonColor, iconSource }: DeleteConfirmationProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => onCancel()}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.container}>
          <View>
            <Image style={styles.icon} resizeMode="contain" source={iconSource || require("@/assets/images/deleteList.png")} />
          </View>
          <View>
            <Text style={styles.heading}>{text || "Are you sure you want to\ndelete this list?"}</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onCancel} style={[styles.cancelButton, cancelButtonColor ? { backgroundColor: cancelButtonColor } : null]}>
              <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
            </Pressable>
            <Pressable onPress={onDelete} style={[styles.deleteButton, deleteButtonColor ? { backgroundColor: deleteButtonColor } : null]}>
              <Text style={styles.deleteButtonText}>{deleteButtonText}</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
