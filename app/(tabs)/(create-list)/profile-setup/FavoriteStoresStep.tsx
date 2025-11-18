import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { profileSetupStyles as styles } from "@/styles/profileSetupStyles";
import { STORE_SUGGESTIONS } from "./constants";

type FavoriteStoresStepProps = {
  variant: "desktop" | "mobile";
  favoriteStores: string[];
  customStoreInput: string;
  onToggleFavoriteStore: (store: string) => void;
  onCustomStoreInputChange: (value: string) => void;
  onAddCustomStore: () => void;
};

export function FavoriteStoresStep({
  variant,
  favoriteStores,
  customStoreInput,
  onToggleFavoriteStore,
  onCustomStoreInputChange,
  onAddCustomStore,
}: FavoriteStoresStepProps) {
  const cardStyle = [styles.mobileCard, variant === "desktop" && styles.desktopStepCard];
  const inputBaseStyle = variant === "desktop" ? styles.desktopInput : styles.mobileInput;

  return (
    <View style={cardStyle}>
      <Text style={styles.sectionTitle}>Where do you love to shop?</Text>
      <Text style={styles.sectionSubtitle}>
        Highlight your go-to stores so we can personalise brand recommendations.
      </Text>

      <View style={styles.chipWrap}>
        {STORE_SUGGESTIONS.map((store) => {
          const active = favoriteStores.includes(store);
          return (
            <Pressable
              key={store}
              onPress={() => onToggleFavoriteStore(store)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityLabel={store}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{store}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Add your own</Text>
      <Text style={styles.sectionSubtitle}>Think local boutiques or hidden gems you rely on.</Text>
      <View style={styles.storeInputRow}>
        <TextInput
          value={customStoreInput}
          onChangeText={onCustomStoreInputChange}
          placeholder="e.g. Crate & Barrel"
          placeholderTextColor="rgba(28, 3, 53, 0.35)"
          style={[inputBaseStyle, styles.storeInput]}
          autoCapitalize="words"
          onSubmitEditing={onAddCustomStore}
          returnKeyType="done"
        />
        <Pressable
          style={[styles.addStoreButton, !customStoreInput.trim() && styles.addStoreButtonDisabled]}
          onPress={onAddCustomStore}
          disabled={!customStoreInput.trim()}
          accessibilityRole="button"
        >
          <Text style={styles.addStoreButtonText}>Add</Text>
        </Pressable>
      </View>

      {favoriteStores.length ? (
        <View style={styles.selectedStoresWrap}>
          {favoriteStores.map((store) => (
            <Pressable
              key={store}
              onPress={() => onToggleFavoriteStore(store)}
              style={styles.selectedStoreChip}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${store}`}
            >
              <Text style={styles.selectedStoreText}>{store}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

