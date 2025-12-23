import { profileSetupStyles as styles } from "@/styles/profileSetupStyles";
import React from "react";
import { Switch, Text, View } from "react-native";

import { SECONDARY_PURPLE } from "./constants";

type ExperienceSettingsStepProps = {
  variant: "desktop" | "mobile";
  reminderOptIn: boolean;
  aiIdeasOptIn: boolean;
  communityUpdatesOptIn: boolean;
  shareUpdates: boolean;
  onReminderOptInChange: (value: boolean) => void;
  onAiIdeasOptInChange: (value: boolean) => void;
  onCommunityUpdatesOptInChange: (value: boolean) => void;
  onShareUpdatesChange: (value: boolean) => void;
};

export function ExperienceSettingsStep({
  variant,
  reminderOptIn,
  aiIdeasOptIn,
  communityUpdatesOptIn,
  shareUpdates,
  onReminderOptInChange,
  onAiIdeasOptInChange,
  onCommunityUpdatesOptInChange,
  onShareUpdatesChange,
}: ExperienceSettingsStepProps) {
  const cardStyle = [
    styles.mobileCard,
    variant === "desktop" && styles.desktopStepCard,
  ];

  return (
    <View style={cardStyle}>
      <Text style={styles.sectionTitle}>Tune your experience</Text>
      <Text style={styles.sectionSubtitle}>
        Decide how much help you want from YallaWish moving forward.
      </Text>

      <View style={styles.preferenceToggleBlock}>
        <View style={styles.preferenceToggleCopy}>
          <Text style={styles.preferenceToggleTitle}>Friendly reminders</Text>
          <Text style={styles.preferenceToggleSubtitle}>
            Send me nudges before big dates so I never miss a moment.
          </Text>
        </View>
        <Switch
          value={reminderOptIn}
          onValueChange={onReminderOptInChange}
          thumbColor={"#FFFFFF"}
          trackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
          //@ts-ignore
          activeThumbColor={"#FFFFFF"}
          activeTrackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
        />
      </View>

      <View style={styles.preferenceToggleBlock}>
        <View style={styles.preferenceToggleCopy}>
          <Text style={styles.preferenceToggleTitle}>AI ideas & guides</Text>
          <Text style={styles.preferenceToggleSubtitle}>
            Let Genie share curated picks and planning checklists.
          </Text>
        </View>
        <Switch
          value={aiIdeasOptIn}
          onValueChange={onAiIdeasOptInChange}
          thumbColor={"#FFFFFF"}
          trackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
          //@ts-ignore
          activeThumbColor={"#FFFFFF"}
          activeTrackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
        />
      </View>

      <View style={styles.preferenceToggleBlock}>
        <View style={styles.preferenceToggleCopy}>
          <Text style={styles.preferenceToggleTitle}>Community updates</Text>
          <Text style={styles.preferenceToggleSubtitle}>
            Hear about new features, drops, and popular public lists.
          </Text>
        </View>
        <Switch
          value={communityUpdatesOptIn}
          onValueChange={onCommunityUpdatesOptInChange}
          thumbColor={"#FFFFFF"}
          trackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
          //@ts-ignore
          activeThumbColor={"#FFFFFF"}
          activeTrackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
        />
      </View>

      <View style={styles.preferenceToggleBlock}>
        <View style={styles.preferenceToggleCopy}>
          <Text style={styles.preferenceToggleTitle}>YallaWish updates</Text>
          <Text style={styles.preferenceToggleSubtitle}>
            Get launch announcements and feature previews
          </Text>
        </View>
        <Switch
          value={shareUpdates}
          onValueChange={onShareUpdatesChange}
          thumbColor={"#FFFFFF"}
          trackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
          //@ts-ignore
          activeThumbColor={"#FFFFFF"}
          activeTrackColor={{ false: "#D9D9D9", true: SECONDARY_PURPLE }}
        />
      </View>

      <View style={styles.preferenceSummaryBox}>
        <Text style={styles.preferenceSummaryTitle}>All set!</Text>
        <Text style={styles.preferenceSummaryText}>
          We'll combine these choices with your lists to suggest thoughtful
          gifts and keep you in sync with the people you care about.
        </Text>
      </View>
    </View>
  );
}
