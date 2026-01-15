import Header from "@/components/Header";
import { TextInputAreaField } from "@/components/TextInputAreaField";
import { TextInputField } from "@/components/TextInputField";
import { router } from "expo-router";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const FriendsProfile = () => {
  const handleBack = () => {
    router.push("/(tabs)/circle");
  };

  return (
    <View style={styles.container}>
      <Header title="Friend Profile" handleBack={handleBack} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image resizeMode="cover" style={styles.image} source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }} />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>Sarah James</Text>
            </View>
          </View>
          <View style={styles.formContainer}>
            <TextInputField label="Custom Display Name" />
            <TextInputAreaField height={100} label="Personal Note" descriptionLimit={150} />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, { borderWidth: 1, borderColor: "#FF3B30" }]}>
              <Text style={[styles.buttonText, { color: "#FF3B30", fontSize: 12 }]}>Remove Friend</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: "#FF3B30" }]}>
              <Text style={[styles.buttonText, { fontSize: 12 }]}>Block User</Text>
            </Pressable>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={[styles.button, { backgroundColor: "#3B0076" }]} onPress={handleBack}>
            <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>Back to circles</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
export default FriendsProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: { flex: 1, paddingHorizontal: 16, paddingBottom: 40, justifyContent: "center", alignItems: "center" },
  profileContainer: {
    width: "100%",
    alignItems: "center",
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 16.67,
    borderWidth: 4.71,
    borderColor: "#ffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C0335",
    fontFamily: "Nunito_700Bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  formContainer: {
    width: "100%",
    gap: 27,
    paddingBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Nunito_700Bold",
  },
});
