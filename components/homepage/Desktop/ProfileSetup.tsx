import { styles } from "@/styles";
import { responsiveStylesHome } from "@/styles/homePageResponsiveStyles";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
const mergeStyles = (...styleInputs: any[]) => StyleSheet.flatten(styleInputs.filter(Boolean));
const responsiveStyles = responsiveStylesHome;

const ProfileSetupHome = () => {
  return <View style={mergeStyles(styles.topSection, responsiveStyles.section)}>
    <View style={responsiveStyles.sectionInner}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Find the Perfect Gift in 3 Simple Steps</Text>
      </View>
      <Pressable onPress={() => router.push("/profile-setup")} style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: "#E4DBF6",
        marginTop: 24,
      }}>
        <Text style={{ fontFamily: "Nunito_600SemiBold", fontSize: 18, color: "#1C0335", marginBottom: 16 }}>Step 1: Profile Details</Text>
        <Text style={{ fontFamily: "Nunito_400Regular", fontSize: 14, color: "#6F5F8F", marginBottom: 20 }}>
          Complete your profile to get personalized gift recommendations
        </Text>
        <Pressable style={{ alignSelf: "flex-start", backgroundColor: "#330065", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
          <Text style={{ color: "#FFFFFF", fontFamily: "Nunito_600SemiBold", fontSize: 14 }}>Get Started</Text>
        </Pressable>
      </Pressable>
    </View>
  </View>
}

export default ProfileSetupHome;