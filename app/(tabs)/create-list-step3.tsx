import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./step3styles";



// Support three UI options; backend only supports 'private' | 'shared'
type PrivacyOption = "private" | "my-people" | "public" | null;

// Memoized OptionCard to avoid unnecessary remounts causing TextInput focus loss
const OptionCard = React.memo(function OptionCardBase({
  option,
  icon,
  title,
  description,
  isSelected,
  children,
  onPress,
  styles,
  setSelectedOption,
}: {
  option: PrivacyOption;
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  styles: any;
  setSelectedOption: (o: PrivacyOption) => void;
}) {
  const handlePress = useCallback(() => {
    if (onPress) return onPress();
    setSelectedOption(option);
  }, [onPress, setSelectedOption, option]);

  return (
    <Pressable
      style={[
        styles.optionCard,
        isSelected ? styles.optionCardSelected : styles.optionCardUnselected,
        isSelected && styles.optionCardSelectedBackground,
      ]}
      onPress={handlePress}
    >
      <View style={styles.optionContent}>
        <View style={styles.checkboxContainer}>
          <View
            style={[
              styles.checkbox,
              isSelected ? styles.checkboxSelected : styles.checkboxUnselected,
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </View>

        <View style={styles.optionHeader}>
          {icon}
          <Text style={styles.optionTitle}>{title}</Text>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#1C0335"
            style={{ marginLeft: 6 }}
          />
        </View>

        <Text style={styles.optionDescription}>{description}</Text>
        {children}
      </View>
    </Pressable>
  );
});

// Memoized password section to isolate from parent re-renders
const PublicPasswordSettings = React.memo(function PublicPasswordSettings({
  requirePassword,
  setRequirePassword,
  password,
  setPassword,
  styles,
}: {
  requirePassword: boolean;
  setRequirePassword: (v: boolean) => void;
  password: string;
  setPassword: (v: string) => void;
  styles: any;
}) {
  const onChangePassword = useCallback(
    (text: string) => {
      setPassword(text);
    },
    [setPassword]
  );
  return (
    <View style={styles.publicExtra}>
      <View style={styles.passwordRow}>
        <Text style={styles.passwordLabel}>Require Password to View</Text>
        <Switch
          value={requirePassword}
          onValueChange={setRequirePassword}
          trackColor={{ false: "#D1D1D6", true: "#3B0076" }}
          thumbColor="#FFFFFF"
        />
      </View>
      <View
        style={[
          styles.passwordInputWrapper,
          !requirePassword && { opacity: 0.5 },
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          placeholderTextColor="#AEAEB2"
          value={password}
          onChangeText={onChangePassword}
          editable={requirePassword}
          secureTextEntry
          maxLength={20}
          autoCorrect={false}
          autoCapitalize="none"
          blurOnSubmit={false}
        />
        <Text style={styles.passwordHint}>Maximum 20 characters</Text>
      </View>
    </View>
  );
});

export default function CreateListStep3() {
  const [selectedOption, setSelectedOption] = useState<PrivacyOption>(null);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState("");

  // Share sheet state
  const [shareVisible, setShareVisible] = useState(false);
  const [groupQuery, setGroupQuery] = useState("");
  const [friendQuery, setFriendQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const updatePrivacy = useMutation(api.products.updateListPrivacy);

  // Load existing list and share data
  const existing = useQuery(
    api.products.getListById,
    listId ? ({ listId } as any) : "skip"
  );
  const myGroups = useQuery(
    api.products.getGroups,
    existing?.user_id ? { owner_id: existing.user_id } : "skip"
  );
  const myContacts = useQuery(
    api.products.getContacts,
    existing?.user_id ? { owner_id: existing.user_id } : "skip"
  );
  const currentShares = useQuery(
    api.products.getListShares,
    listId ? ({ list_id: listId } as any) : "skip"
  );

  const setShares = useMutation(api.products.setListShares);
  const seedShareData = useMutation(api.products.seedShareDataPublic);

  // Prefill password settings from existing
  React.useEffect(() => {
    if ((existing as any)?.requiresPassword != null) {
      setRequirePassword(Boolean((existing as any).requiresPassword));
    }
    if ((existing as any)?.password != null) {
      setPassword(String((existing as any).password ?? ""));
    }
  }, [existing]);

  // Auto-seed sample data if none exist for this owner
  React.useEffect(() => {
    if (!existing?.user_id) return;
    const noGroups = (myGroups ?? []).length === 0;
    const noContacts = (myContacts ?? []).length === 0;
    if (noGroups && noContacts) {
      seedShareData({ owner_id: existing.user_id }).catch(() => { });
    }
  }, [existing?.user_id, myGroups, myContacts, seedShareData]);

  // Map Convex IDs to local string arrays and preselect
  React.useEffect(() => {
    if (!currentShares) return;
    const groupIds = currentShares
      .filter((s) => !!s.group_id)
      .map((s) => String(s.group_id));
    const contactIds = currentShares
      .filter((s) => !!s.contact_id)
      .map((s) => String(s.contact_id));
    setSelectedGroups(groupIds);
    setSelectedFriends(contactIds);
  }, [currentShares]);

  // Prefill selected option based on privacy and whether any shares exist
  React.useEffect(() => {
    if (!existing?.privacy) return;
    // Don’t override if user already picked in this session
    if (selectedOption !== null) return;
    if (existing.privacy === 'private') {
      setSelectedOption('private');
    } else {
      const hasShares = (currentShares?.length ?? 0) > 0;
      setSelectedOption(hasShares ? 'my-people' : 'public');
    }
  }, [existing?.privacy, currentShares, selectedOption]);

  // Derive lists shown in UI strictly from Convex data (no fallbacks)
  const groups = React.useMemo(() => {
    return (myGroups ?? []).map((g) => ({ id: String(g._id), name: g.name }));
  }, [myGroups]);

  const friends = React.useMemo(() => {
    return (myContacts ?? []).map((c) => ({ id: String(c._id), name: c.name, email: c.email ?? "" }));
  }, [myContacts]);

  // Remove duplicate prefill effect (keep only one)
  // (Existing effect retained below)
  // Prefill selection from existing privacy (duplicate removed)
  // React.useEffect(() => {
  //   if (existing?.privacy) {
  //     setSelectedOption(existing.privacy === "private" ? "private" : "my-people");
  //   }
  // }, [existing?.privacy]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    try {
      const backendPrivacy: "private" | "shared" =
        selectedOption === "private" ? "private" : "shared";
      await updatePrivacy({
        listId: listId as any,
        privacy: backendPrivacy,
        requiresPassword: selectedOption === "public" ? requirePassword : false,
        password:
          selectedOption === "public" && requirePassword && password.trim()
            ? password.trim()
            : null,
      } as any);

      // Persist shares: clear for 'public', set for 'my-people', clear for 'private'
      if (backendPrivacy === 'shared') {
        if (selectedOption === 'public') {
          await setShares({
            list_id: listId as unknown as Id<'lists'>,
            group_ids: [],
            contact_ids: [],
          });
        } else {
          await setShares({
            list_id: listId as unknown as Id<'lists'>,
            group_ids: selectedGroups as unknown as Id<'groups'>[],
            contact_ids: selectedFriends as unknown as Id<'contacts'>[],
          });
        }
      } else {
        await setShares({
          list_id: listId as unknown as Id<'lists'>,
          group_ids: [],
          contact_ids: [],
        });
      }

      router.push({ pathname: "/add-gift", params: { listId: String(listId) } });
    } catch (e) {
      console.error("Failed to update privacy", e);
    }
  };

  const confirmShareAndClose = async () => {
    try {
      await setShares({
        list_id: listId as unknown as Id<"lists">,
        group_ids: selectedGroups as unknown as Id<"groups">[],
        contact_ids: selectedFriends as unknown as Id<"contacts">[],
      });
      setShareVisible(false);
    } catch (e) {
      console.error("Failed to set shares", e);
      setShareVisible(false);
    }
  };

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressInactive]} />
        <View style={[styles.progressSegment, styles.progressInactive]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
      </View>
    </View>
  );

  // Share sheet lists filtered by query
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(groupQuery.toLowerCase())
  );
  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(friendQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(friendQuery.toLowerCase())
  );

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#330065" />

      <LinearGradient
        colors={["#330065", "#6600CB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text style={styles.headerTitle}>Create List</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ProgressIndicator />

      <ScrollView
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Who can see this list?</Text>

        <View style={styles.optionsContainer}>
          <OptionCard
            option="private"
            icon={<Ionicons name="lock-closed-outline" size={40} color="#1C0335" />}
            title="Private"
            description="Only visible to you"
            isSelected={selectedOption === "private"}
            styles={styles}
            setSelectedOption={setSelectedOption}
          />

          <OptionCard
            option="my-people"
            icon={<Ionicons name="people-outline" size={40} color="#1C0335" />}
            title="My People"
            description="Visible only to selected groups or individuals in your YallaWish Circle."
            isSelected={selectedOption === "my-people"}
            onPress={() => {
              setSelectedOption("my-people");
              setShareVisible(true);
            }}
            styles={styles}
            setSelectedOption={setSelectedOption}
          />

          <OptionCard
            option="public"
            icon={<Ionicons name="globe-outline" size={40} color="#1C0335" />}
            title="Public"
            description="Visible to anyone with the link, on Google, or on YallaWish"
            isSelected={selectedOption === "public"}
            styles={styles}
            setSelectedOption={setSelectedOption}
          >
            <PublicPasswordSettings
              requirePassword={requirePassword}
              setRequirePassword={setRequirePassword}
              password={password}
              setPassword={setPassword}
              styles={styles}
            />
          </OptionCard>
        </View>
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <Pressable
          style={[
            styles.button,
            !selectedOption ? styles.buttonDisabled : styles.buttonPrimary,
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
        >
          <Text style={styles.buttonPrimaryText}>Yalla! Let’s add gifts</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleBack}
        >
          <Text style={styles.buttonSecondaryText}>Back</Text>
        </Pressable>
      </SafeAreaView>

      {/* Share Bottom Sheet */}
      <Modal
        visible={shareVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setShareVisible(false)}
      >
        <Pressable style={styles.sheetBackdrop} onPress={() => setShareVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.sheetTitle}>Share with groups</Text>

            {/* Group search */}
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search groups"
                placeholderTextColor="#8E8E93"
                value={groupQuery}
                onChangeText={setGroupQuery}
              />
              <Ionicons name="search-outline" size={22} color="#1C0335" />
            </View>

            {/* Groups grid */}
            <View style={styles.groupGrid}>
              {filteredGroups.map((g) => {
                const selected = selectedGroups.includes(g.id);
                return (
                  <Pressable key={g.id} style={[styles.groupCard, selected && styles.groupCardSelected]} onPress={() => toggleGroup(g.id)}>
                    <View style={styles.groupImage} />
                    <View style={styles.groupOverlay} />
                    <View style={[styles.groupCheck, selected && styles.groupCheckSelected]}>
                      {selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <View style={styles.groupTextWrap}>
                      <Text style={styles.groupTitle}>{g.name}</Text>
                      <Text style={styles.groupBy}>Created By: You</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* OR separator */}
            <View style={styles.orWrap}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Friend search */}
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name or email"
                placeholderTextColor="#8E8E93"
                value={friendQuery}
                onChangeText={setFriendQuery}
              />
              <Ionicons name="search-outline" size={22} color="#1C0335" />
            </View>

            <Text style={styles.shareWithFriends}>Share with friends</Text>

            {/* Friends list */}
            <View style={styles.friendList}>
              {filteredFriends.map((f) => {
                const selected = selectedFriends.includes(f.id);
                const initials = f.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <Pressable key={f.id} style={styles.friendRow} onPress={() => toggleFriend(f.id)}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.friendName}>{f.name}</Text>
                      <Text style={styles.friendEmail}>{f.email}</Text>
                    </View>
                    <View style={[styles.friendCheckbox, selected && styles.friendCheckboxSelected]}>
                      {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 16 }} />

            <Pressable style={[styles.button, styles.buttonPrimary]} onPress={confirmShareAndClose}>
              <Text style={styles.buttonPrimaryText}>Yalla! Let’s add gifts</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSecondary, { marginBlockEnd: 20 }]} onPress={() => setShareVisible(false)}>
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}


