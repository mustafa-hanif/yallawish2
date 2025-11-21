import { Mail, Phone } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ContactUsProps {
  isDesktop: boolean;
  responsiveStyles: any;
  mergeStyles: (...args: any[]) => any;
}

export const ContactUs: React.FC<ContactUsProps> = ({ isDesktop, responsiveStyles, mergeStyles }) => {
  return (
    <View style={mergeStyles(styles.container, isDesktop ? responsiveStyles.section : null, { backgroundColor: '#fff', paddingHorizontal: isDesktop ? 0 : 24, paddingVertical: 60 })}>
       <View style={[isDesktop ? responsiveStyles.sectionInner : undefined, styles.contentContainer, isDesktop && styles.desktopContentContainer]}>
        
        {/* Left Column: Contact Info */}
        <View style={[styles.leftColumn, isDesktop && styles.desktopLeftColumn]}>
          <View style={styles.badge}>
             <Text style={styles.badgeText}>Get in Touch With Us</Text>
          </View>
          
          <Text style={[styles.title, isDesktop && styles.desktopTitle]}>
            Need Help? Our Team Makes Gifting Simple.
          </Text>

          <View style={styles.contactItem}>
            <View style={styles.iconCircle}>
              <Phone size={20} color="#000" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Call Us</Text>
              <Text style={styles.contactValue}>+00 (47) 939 4888</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.iconCircle}>
              <Mail size={20} color="#000" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email Us</Text>
              <Text style={styles.contactValue}>sales@yallawish.com</Text>
            </View>
          </View>
        </View>

        {/* Right Column: Form */}
        <View style={[styles.rightColumn, isDesktop && styles.desktopRightColumn]}>
          <Text style={styles.formHeader}>
            We'd love to share more with you, please complete this form and our dedicated team will get back to you shortly.
          </Text>

          <View style={[styles.row, !isDesktop && styles.mobileColumn]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="John" 
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Doe" 
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={[styles.row, !isDesktop && styles.mobileColumn]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input} 
                placeholder="johndoe@example.com" 
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                placeholder="+92 3001234567" 
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="johndoe@example.com" 
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>We're excited to connect with you! 🙌</Text>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 40,
  },
  desktopContentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align top
    justifyContent: 'space-between',
    gap: 80,
  },
  leftColumn: {
    width: '100%',
  },
  desktopLeftColumn: {
    flex: 1,
    maxWidth: 400,
  },
  rightColumn: {
    width: '100%',
  },
  desktopRightColumn: {
    flex: 1.5,
  },
  badge: {
    backgroundColor: '#F9A8D4', // Pink
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 24,
    transform: [{ rotate: '-2deg' }],
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4C1D95', // Dark Purple - might need adjustment for contrast on black
    marginBottom: 40,
    lineHeight: 40,
    fontFamily: 'Nunito_700Bold',
  },
  desktopTitle: {
    fontSize: 40,
    lineHeight: 48,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22D3EE', // Cyan
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Nunito_600SemiBold',
  },
  contactValue: {
    color: '#000', // White for visibility on black
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  formHeader: {
    color: '#4C1D95',
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
    fontFamily: 'Nunito_400Regular',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  mobileColumn: {
    flexDirection: 'column',
    gap: 20,
  },
  inputGroup: {
    flex: 1,
    gap: 8,
  },
  label: {
    color: '#4C1D95',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 14,
    color: '#000',
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
  },
  textArea: {
    height: 120,
    borderRadius: 20,
    textAlignVertical: 'top', // Android
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  footerText: {
    color: '#4C1D95',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  submitButton: {
    backgroundColor: '#4C1D95', // Dark Purple
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
});

