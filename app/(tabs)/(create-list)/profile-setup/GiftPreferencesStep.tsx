import React from "react";
import { Pressable, Text, View } from "react-native";
import { profileSetupStyles as styles } from "@/styles/profileSetupStyles";
import {
  PERSONA_OPTIONS,
  OCCASION_OPTIONS,
  GIFT_INTEREST_OPTIONS,
  SHOPPING_STYLE_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  DISCOVERY_CHANNEL_OPTIONS,
  PersonaChoice,
} from "./constants";

type GiftPreferencesStepProps = {
  variant: "desktop" | "mobile";
  persona: PersonaChoice;
  selectedOccasions: string[];
  giftInterests: string[];
  giftShoppingStyle: string | null;
  giftBudgetRange: string | null;
  giftDiscoveryChannels: string[];
  onPersonaChange: (persona: PersonaChoice) => void;
  onToggleOccasion: (occasion: string) => void;
  onToggleGiftInterest: (interest: string) => void;
  onSelectGiftShoppingStyle: (style: string) => void;
  onSelectGiftBudgetRange: (range: string) => void;
  onToggleDiscoveryChannel: (channel: string) => void;
};

export function GiftPreferencesStep({
  variant,
  persona,
  selectedOccasions,
  giftInterests,
  giftShoppingStyle,
  giftBudgetRange,
  giftDiscoveryChannels,
  onPersonaChange,
  onToggleOccasion,
  onToggleGiftInterest,
  onSelectGiftShoppingStyle,
  onSelectGiftBudgetRange,
  onToggleDiscoveryChannel,
}: GiftPreferencesStepProps) {
  const cardStyle = [styles.mobileCard, variant === "desktop" && styles.desktopStepCard];
  const wrapStyle = [styles.preferenceTileWrap, variant === "mobile" && styles.preferenceTileWrapMobile];
  const personaContainerStyle = variant === "desktop" ? styles.personaGrid : styles.personaStack;

  return (
    <View style={cardStyle}>
      <Text style={styles.sectionTitle}>How would you describe yourself?</Text>
      <Text style={styles.sectionSubtitle}>
        Pick the option that feels most like you. You can change this later.
      </Text>
      <View style={personaContainerStyle}>
        {PERSONA_OPTIONS.map((option) => {
          const active = persona === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onPersonaChange(option.id)}
              style={[styles.personaTile, active && styles.personaTileActive]}
              accessibilityRole="button"
              accessibilityLabel={option.title}
            >
              <Text style={[styles.personaTitle, active && styles.personaTitleActive]}>{option.title}</Text>
              <Text style={[styles.personaDescription, active && styles.personaDescriptionActive]}>
                {option.description}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>What are you planning for next?</Text>
      <Text style={styles.sectionSubtitle}>
        Choose a few occasions so we can line up ideas and reminders.
      </Text>
      <View style={styles.chipWrap}>
        {OCCASION_OPTIONS.map((occasion) => {
          const active = selectedOccasions.includes(occasion);
          return (
            <Pressable
              key={occasion}
              onPress={() => onToggleOccasion(occasion)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={occasion}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{occasion}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Dial in your gifting style</Text>
      <Text style={styles.sectionSubtitle}>
        Tell Genie what you enjoy so we can surface spot-on ideas.
      </Text>

      <View style={styles.chipWrap}>
        {GIFT_INTEREST_OPTIONS.map((interest) => {
          const active = giftInterests.includes(interest);
          return (
            <Pressable
              key={interest}
              onPress={() => onToggleGiftInterest(interest)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={interest}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{interest}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>How do you like to shop?</Text>
      <View style={wrapStyle}>
        {SHOPPING_STYLE_OPTIONS.map((option) => {
          const active = giftShoppingStyle === option;
          return (
            <Pressable
              key={option}
              onPress={() => onSelectGiftShoppingStyle(option)}
              style={[
                styles.preferenceTile,
                active && styles.preferenceTileActive,
                variant === "mobile" && styles.preferenceTileMobile,
              ]}
              accessibilityRole="button"
              accessibilityLabel={option}
            >
              <Text style={[styles.preferenceTileTitle, active && styles.preferenceTileTitleActive]}>{option}</Text>
              <Text style={[styles.preferenceTileCopy, active && styles.preferenceTileCopyActive]}>
                {option === "I love curated picks"
                  ? "Give me a shortlist that just feels right."
                  : option === "Show me trending now"
                    ? "Keep me in the loop with what others love."
                    : "I want to explore and compare everything myself."}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Typical budget sweet spot</Text>
      <View style={styles.preferencePillsRow}>
        {BUDGET_RANGE_OPTIONS.map((range) => {
          const active = giftBudgetRange === range;
          return (
            <Pressable
              key={range}
              onPress={() => onSelectGiftBudgetRange(range)}
              style={[styles.preferencePill, active && styles.preferencePillActive]}
              accessibilityRole="button"
              accessibilityLabel={range}
            >
              <Text style={[styles.preferencePillText, active && styles.preferencePillTextActive]}>{range}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Where do you discover new gifts?</Text>
      <Text style={styles.sectionSubtitle}>Pick the channels that inspire you the most.</Text>
      <View style={styles.chipWrap}>
        {DISCOVERY_CHANNEL_OPTIONS.map((channel) => {
          const active = giftDiscoveryChannels.includes(channel);
          return (
            <Pressable
              key={channel}
              onPress={() => onToggleDiscoveryChannel(channel)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={channel}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{channel}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

