import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

type ListOption = 'myself' | 'someone-else' | null;

export default function CreateListStep1() {
  const [selectedOption, setSelectedOption] = useState<ListOption>('myself');

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    // Navigate to next step
    console.log('Continue with option:', selectedOption);
    router.push('/create-list-step2');
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        {/* Step 1 - Active */}
        <View style={[styles.progressSegment, styles.progressActive]} />
        {/* Step 2 - Inactive */}
        <View style={[styles.progressSegment, styles.progressInactive]} />
        {/* Step 3 - Inactive */}
        <View style={[styles.progressSegment, styles.progressInactive]} />
      </View>
    </View>
  );

  const OptionCard = ({
    option,
    icon,
    title,
    description,
    isSelected
  }: {
    option: ListOption;
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
  }) => (
    <Pressable
      style={[
        styles.optionCard,
        isSelected ? styles.optionCardSelected : styles.optionCardUnselected
      ]}
      onPress={() => setSelectedOption(option)}
    >
      <View style={styles.optionContent}>
        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <View style={[
            styles.checkbox,
            isSelected ? styles.checkboxSelected : styles.checkboxUnselected
          ]}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>

        {/* Icon and Title */}
        <View style={styles.optionHeader}>
          {icon}
          <Text style={styles.optionTitle}>{title}</Text>
        </View>

        {/* Description */}
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      {/* Header */}
      <LinearGradient
        colors={['#330065', '#6600CB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            {/* Status Bar Spacer */}
            <View style={styles.statusBar}>
              <Text style={styles.timeText}>12:48</Text>
              <View style={styles.statusIcons}>
                <Ionicons name="cellular" size={16} color="#FFFFFF" />
                <Ionicons name="wifi" size={16} color="#FFFFFF" />
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryFill} />
                </View>
              </View>
            </View>

            {/* Navigation */}
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>Create List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Progress Indicator */}
      <ProgressIndicator />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Make a list from</Text>

        <View style={styles.optionsContainer}>
          <OptionCard
            option="myself"
            icon={<Ionicons name="person-circle-outline" size={40} color="#1C0335" />}
            title="Myself"
            description="Build a wish list for your own celebrations, milestones, or just a treat for yourself!"
            isSelected={selectedOption === 'myself'}
          />

          <OptionCard
            option="someone-else"
            icon={<Ionicons name="people-circle-outline" size={40} color="#1C0335" />}
            title="Someone else"
            description="Create a gift list for your children, pets, or anyone who's your loved one"
            isSelected={selectedOption === 'someone-else'}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.continueContainer}>
          <Pressable
            style={[styles.continueButton, !selectedOption && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedOption}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    paddingTop: 10,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito_600SemiBold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  batteryIcon: {
    width: 22,
    height: 11,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 2,
    padding: 1,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    lineHeight: 28,
    letterSpacing: -1,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    width: screenWidth - 32,
    gap: 4,
  },
  progressSegment: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressActive: {
    backgroundColor: '#45018A',
  },
  progressInactive: {
    backgroundColor: '#DDD7E4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    color: '#1C0335',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  optionCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    paddingBottom: 24,
  },
  optionCardSelected: {
    backgroundColor: '#F5EDFE',
    borderColor: '#1C0335',
  },
  optionCardUnselected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#AEAEB2',
  },
  optionContent: {
    position: 'relative',
  },
  checkboxContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3B0076',
  },
  checkboxUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#AEAEB2',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    marginTop: 24,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    color: '#1C0335',
    lineHeight: 24,
  },
  optionDescription: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Nunito_400Regular',
    color: '#1C0335',
    lineHeight: 24,
    marginRight: 24,
  },
  continueContainer: {
    marginBottom: 24,
    paddingBottom: 100, // Add space for tab bar
  },
  continueButton: {
    backgroundColor: '#3B0076',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#AEAEB2',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito_700Bold',
    lineHeight: 16,
  },
});
