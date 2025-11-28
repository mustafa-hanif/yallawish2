import React from "react";
import { Image } from "expo-image";
import { View, Text, TextInput, Pressable, Linking, StyleSheet } from "react-native";
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface FooterProps {
  isDesktop?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDesktop = false }) => {
  const currentYear = new Date().getFullYear();

  const renderSocialIcon = (name: keyof typeof FontAwesome.glyphMap) => (
    <Pressable style={styles.socialIcon}>
        <FontAwesome name={name} size={20} color="#00F0FF" />
    </Pressable>
  );

  const renderPaymentIcon = (name: string, Library: any) => (
    <View style={styles.paymentIcon}>
        <Library name={name} size={24} color="#FFFFFF" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Footer Content */}
      <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
        
        {/* Column 1: Brand & Contact */}
        <View style={[styles.column, isDesktop && styles.columnDesktop, { flex: 2 }]}>
          <View style={styles.logoContainer}>
             <Image 
                source={require("@/assets/images/yallawish_logo.png")} 
                style={{ width: 150, height: 40 }}
                contentFit="contain"
             />
          </View>
          <Text style={styles.description}>
            YallaWish is a smart gifting platform that helps you create, share, and manage gift lists for every life moment. From weddings to birthdays, we make gifting simple and memorable.
          </Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>naif@yallawish.co</Text>
          </View>
          
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={styles.contactText}>+966 55 641 4444</Text>
          </View>

          <View style={styles.socialRow}>
            {renderSocialIcon("facebook")}
            {renderSocialIcon("instagram")}
          </View>
        </View>

        {/* Column 2: Quick Links */}
        <View style={[styles.column, isDesktop && styles.columnDesktop]}>
          <Text style={styles.columnTitle}>Quick Links</Text>
          <Pressable><Text style={styles.linkText}>• Create Gifts List</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Browse Life Moments</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Shop Gifts</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• FAQs</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Contact Us</Text></Pressable>
        </View>

        {/* Column 3: Support */}
        <View style={[styles.column, isDesktop && styles.columnDesktop]}>
          <Text style={styles.columnTitle}>Support</Text>
          <Pressable><Text style={styles.linkText}>• Help Center</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Return Policy</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Refund Policy</Text></Pressable>
          <Pressable><Text style={styles.linkText}>• Globe-Tech Asia</Text></Pressable>
        </View>

        {/* Column 4: Newsletter */}
        <View style={[styles.column, isDesktop && styles.columnDesktop, { flex: 1.5 }]}>
          <Text style={styles.columnTitle}>Our Newsletter</Text>
          <Text style={styles.newsletterText}>
            Subscribe our newsletter to get the latest gift ideas & offers.
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput 
                style={styles.input} 
                placeholder="Your Email Address" 
                placeholderTextColor="#ccc"
            />
          </View>
          
          <Pressable style={styles.subscribeButton}>
             <Ionicons name="notifications-outline" size={20} color="#12002b" style={{ marginRight: 8 }} />
             <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </Pressable>
        </View>
      </View>

      {/* Payment Methods */}
      <View style={[styles.paymentRow, isDesktop && { justifyContent: 'flex-end', paddingRight: 100 }]}>
         {/* Using generic icons or text as placeholders since actual SVGs might need specific handling or fonts */}
         <FontAwesome name="cc-visa" size={30} color="#fff" style={styles.payIcon} />
         <FontAwesome name="cc-stripe" size={30} color="#fff" style={styles.payIcon} />
         <FontAwesome name="cc-paypal" size={30} color="#fff" style={styles.payIcon} />
         <FontAwesome name="google-wallet" size={30} color="#fff" style={styles.payIcon} />
         <FontAwesome name="apple" size={30} color="#fff" style={styles.payIcon} />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={[styles.bottomContent, isDesktop && styles.bottomContentDesktop]}>
            <Text style={styles.copyrightText}>Copyrights {currentYear}. All rights reserved.</Text>
            <View style={styles.bottomLinks}>
                <Pressable><Text style={styles.bottomLinkText}>Terms Of Use</Text></Pressable>
                <Pressable><Text style={styles.bottomLinkText}>Privacy Policy</Text></Pressable>
            </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12002b', // Deep purple
    width: '100%',
    paddingTop: 60,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 40,
  },
  contentContainerDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    maxWidth: 1200,
    alignSelf: 'center',
    gap: 20,
  },
  column: {
    marginBottom: 20,
  },
  columnDesktop: {
    marginBottom: 0,
    flex: 1,
  },
  logoContainer: {
    marginBottom: 20,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
    opacity: 0.9,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 15,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.9,
  },
  newsletterText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 22,
    opacity: 0.9,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    justifyContent: 'center',
    marginBottom: 15,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  subscribeButton: {
    backgroundColor: '#00F0FF',
    borderRadius: 25,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#12002b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  paymentIcon: {
    // Placeholder style
  },
  payIcon: {
    marginHorizontal: 10,
  },
  bottomBar: {
    backgroundColor: '#F8BBD0', // Pink/Lavender
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bottomContent: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  bottomContentDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  copyrightText: {
    color: '#12002b',
    fontSize: 14,
  },
  bottomLinks: {
    flexDirection: 'row',
    gap: 20,
  },
  bottomLinkText: {
    color: '#12002b',
    fontSize: 14,
  },
});

