import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, LayoutAnimation, UIManager } from 'react-native';
import { Image } from 'expo-image';
import * as LucideIcons from 'lucide-react-native';
import { styles as globalStyles } from '@/styles';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const faqs = [
  {
    question: "Do I need to pay to create a gift list?",
    answer: "No, creating a gift list is completely free. You can add items from any store and share your list with friends and family."
  },
  {
    question: "How does the gift list work?",
    answer: "Easily create a gift list. Sign up, click \"Create List\", and add items. Share your list with a unique link for others to view and buy."
  },
  {
    question: "Where are your projects located?",
    answer: "We operate globally with a focus on the MENA region. You can check our shipping locations in the help center."
  },
  {
    question: "How can I get a project quote or consultation?",
    answer: "You can contact our support team directly through the app or website for any custom requests or consultations."
  }
];

interface FAQSectionProps {
  isDesktop: boolean;
  responsiveStyles: any;
  mergeStyles: (...args: any[]) => any;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ isDesktop, responsiveStyles, mergeStyles }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(1); // Default second one open as per design? Or null. Design has 2nd open.

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={mergeStyles(styles.container, isDesktop ? responsiveStyles.section : null, { paddingHorizontal: isDesktop ? 0 : 24, marginBottom: 60 })}>
       <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.badge}>
             <Text style={styles.badgeText}>Frequently Asked Questions</Text>
          </View>
          <Text style={[styles.title, isDesktop && styles.desktopTitle]}>
            Regular Question For Our Customers
          </Text>
        </View>

        {/* Accordion List */}
        <View style={styles.listContainer}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <View key={index} style={[
                styles.accordionItem, 
                isOpen ? styles.accordionItemOpen : styles.accordionItemClosed
              ]}>
                <TouchableOpacity 
                  style={styles.accordionHeader} 
                  onPress={() => toggleAccordion(index)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.questionText}>{faq.question}</Text>
                  
                  <View style={[
                    styles.iconContainer, 
                    isOpen ? styles.iconContainerOpen : styles.iconContainerClosed,
                    isOpen && { transform: [{ rotate: '90deg' }] }
                  ]}>
                    {isOpen ? (
                       <LucideIcons.ArrowUpRight size={20} color="#FFFFFF" />
                    ) : (
                       <LucideIcons.ArrowUpRight size={20} color="#1A0034" />
                    )}
                  </View>
                </TouchableOpacity>
                
                {isOpen && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  badge: {
    backgroundColor: '#F9A8D4', // Pink-300 ish
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    transform: [{ rotate: '-2deg' }], // Slight rotation as per design feel, maybe remove if strict
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 14,
  },
  title: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 24,
    color: '#1A0034',
    textAlign: 'center',
  },
  desktopTitle: {
    fontSize: 36,
  },
  listContainer: {
    width: '100%',
    gap: 16,
  },
  accordionItem: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  accordionItemClosed: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  accordionItemOpen: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  questionText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: '#1A0034',
    flex: 1,
    paddingRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerClosed: {
    backgroundColor: '#22D3EE', // Cyan
  },
  iconContainerOpen: {
    backgroundColor: '#4C1D95', // Dark purple
  },
  accordionContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  answerText: {
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});

