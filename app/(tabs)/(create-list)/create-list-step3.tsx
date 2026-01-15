import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, Modal, Platform, Pressable, StatusBar, Switch, Text, TextInput, View, useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { TextInputField } from "@/components/TextInputField";
import BottomSheet from "@/components/ui/BottomSheet";
import { Image } from "react-native";
import { desktopStyles, styles } from "./step3styles";

type PrivacyOption = "private" | "my-people" | "public" | null;

type StepStatus = "complete" | "current" | "upcoming";

type StepItem = {
  label: string;
  status: StepStatus;
};

type GroupOption = {
  id: string;
  name: string;
  cover?: string;
};

type FriendOption = {
  id: string;
  name: string;
  email: string;
};

type SharedLayoutProps = {
  selectedOption: PrivacyOption;
  setSelectedOption: (option: PrivacyOption) => void;
  requirePassword: boolean;
  setRequirePassword: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  handleBack: () => void;
  handleContinue: () => void;
  shareVisible: boolean;
  openShareModal: () => void;
  closeShareModal: () => void;
  groupQuery: string;
  setGroupQuery: (value: string) => void;
  friendQuery: string;
  setFriendQuery: (value: string) => void;
  filteredGroups: GroupOption[];
  filteredFriends: FriendOption[];
  selectedGroups: string[];
  selectedFriends: string[];
  toggleGroup: (id: string) => void;
  toggleFriend: (id: string) => void;
  confirmShareAndClose: () => Promise<void>;
  headerTitle?: string;
  isEdit?: boolean;
};

type DesktopLayoutProps = SharedLayoutProps & {
  steps: StepItem[];
};

const DESKTOP_BREAKPOINT = 1024;

const OptionCard = React.memo(function OptionCardBase({ option, icon, title, description, isSelected, children, onPress, styles: optionStyles, setSelectedOption }: { option: PrivacyOption; icon: React.ReactNode; title: string; description: string; isSelected: boolean; children?: React.ReactNode; onPress?: () => void; styles: typeof styles; setSelectedOption: (o: PrivacyOption) => void }) {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }
    setSelectedOption(option);
  }, [onPress, option, setSelectedOption]);

  return (
    <Pressable style={[optionStyles.optionCard, isSelected ? optionStyles.optionCardSelected : optionStyles.optionCardUnselected, isSelected && optionStyles.optionCardSelectedBackground]} onPress={handlePress}>
      <View style={optionStyles.optionContent}>
        <View style={optionStyles.checkboxContainer}>
          <View style={[optionStyles.checkbox, isSelected ? optionStyles.checkboxSelected : optionStyles.checkboxUnselected]}>{isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
        </View>

        <View style={optionStyles.optionHeader}>
          {icon}
          <Text style={optionStyles.optionTitle}>{title}</Text>
          <Image source={require("@/assets/images/infoIcon.png")} />
        </View>

        <Text style={optionStyles.optionDescription}>{description}</Text>
        {children}
      </View>
    </Pressable>
  );
});

const PublicPasswordSettings = React.memo(function PublicPasswordSettingsBase({ requirePassword, setRequirePassword, password, setPassword, styles: optionStyles, isSelected }: { requirePassword: boolean; setRequirePassword: (v: boolean) => void; password: string; setPassword: (v: string) => void; styles: typeof styles; isSelected: boolean }) {
  const onChangePassword = useCallback(
    (text: string) => {
      setPassword(text);
    },
    [setPassword]
  );

  return (
    <View style={optionStyles.publicExtra}>
      <View style={optionStyles.passwordRow}>
        <Text style={optionStyles.passwordLabel}>Require Password to View</Text>
        <Switch value={requirePassword} onValueChange={setRequirePassword} trackColor={{ false: "#D1D1D6", true: "#3B0076" }} thumbColor="#FFFFFF" disabled={!isSelected} />
      </View>
      <TextInputField inputLabelContainerStyle={isSelected ? { backgroundColor: "#F5EDFE" } : { backgroundColor: "#FFF" }} label="Enter Password" variant="password" secureTextEntry value={password} onChangeText={onChangePassword} editable={requirePassword} maxLength={20} hint="Maximum 20 characters" />
    </View>
  );
});

const DesktopOptionCard = React.memo(function DesktopOptionCard({ title, description, icon, isSelected, onPress, children }: { title: string; description: string; icon: React.ReactNode; isSelected: boolean; onPress: () => void; children?: React.ReactNode }) {
  return (
    <Pressable onPress={onPress} style={[desktopStyles.desktopOptionCard, isSelected && desktopStyles.desktopOptionCardSelected, { flexDirection: "column", alignItems: "stretch" }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
        <View style={desktopStyles.desktopOptionLeft}>
          <View style={desktopStyles.desktopOptionIconWrap}>{icon}</View>
          <View style={desktopStyles.desktopOptionTextWrap}>
            <Text style={desktopStyles.desktopOptionTitle}>{title}</Text>
            <Text style={desktopStyles.desktopOptionDescription}>{description}</Text>
          </View>
        </View>
        <View style={[desktopStyles.desktopRadio, isSelected && desktopStyles.desktopRadioSelected]}>{isSelected && <View style={desktopStyles.desktopRadioInner} />}</View>
      </View>
      {isSelected && children ? <View style={{ width: "100%", marginTop: 20 }}>{children}</View> : null}
    </Pressable>
  );
});

const DesktopPublicPasswordSettings = React.memo(function DesktopPublicPasswordSettingsBase({ requirePassword, setRequirePassword, password, setPassword }: { requirePassword: boolean; setRequirePassword: (value: boolean) => void; password: string; setPassword: (value: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={desktopStyles.desktopPublicExtras}>
      <View style={desktopStyles.desktopPasswordRow}>
        <Text style={desktopStyles.desktopPasswordLabel}>Require Password to View</Text>
        <Switch value={requirePassword} onValueChange={setRequirePassword} trackColor={{ false: "#D1D1D6", true: "#3B0076" }} thumbColor="#FFFFFF" />
      </View>
      <View style={desktopStyles.desktopPasswordInputWrapper}>
        <TextInput style={desktopStyles.desktopPasswordInput} placeholder="Enter Password" placeholderTextColor="#AEAEB2" value={password} onChangeText={setPassword} editable={requirePassword} secureTextEntry={!isVisible} maxLength={20} autoCorrect={false} autoCapitalize="none" blurOnSubmit={false} />
        <View style={desktopStyles.desktopPasswordToggle}>
          <Pressable onPress={() => setIsVisible(!isVisible)}>
            <Ionicons name={isVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#1C0335" />
          </Pressable>
        </View>
        {/* {isVisible ? () :} */}
        <Text style={desktopStyles.desktopPasswordHint}>Maximum 20 characters</Text>
      </View>
    </View>
  );
});

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type DesktopShareModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  groupQuery: string;
  setGroupQuery: (value: string) => void;
  friendQuery: string;
  setFriendQuery: (value: string) => void;
  filteredGroups: GroupOption[];
  filteredFriends: FriendOption[];
  selectedGroups: string[];
  selectedFriends: string[];
  toggleGroup: (id: string) => void;
  toggleFriend: (id: string) => void;
  confirmShareAndClose: () => Promise<void>;
};

function DesktopShareModal({ visible, onRequestClose, groupQuery, setGroupQuery, friendQuery, setFriendQuery, filteredGroups, filteredFriends, selectedGroups, selectedFriends, toggleGroup, toggleFriend, confirmShareAndClose }: DesktopShareModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={desktopStyles.shareModalBackdrop}>
        <Pressable style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} onPress={onRequestClose} />
        <View style={desktopStyles.shareModal}>
          <View style={[desktopStyles.shareModalTitleRow, { marginBottom: 0 }]}>
            <View>
              <View>
                <Text style={desktopStyles.shareModalTitle}>My People</Text>
              </View>
              <View>
                <Text style={desktopStyles.shareModalSubtitle}>Share with your friends and groups</Text>
              </View>
            </View>
            <Pressable onPress={onRequestClose}>
              <Ionicons name="close" size={24} color="#1C0335" />
            </Pressable>
          </View>
          <View style={[desktopStyles.shareModalSearchBox, { marginTop: 0 }]}>
            <Ionicons name="search-outline" size={20} color="#AEAEB2" />
            <TextInput
              style={desktopStyles.shareModalSearchInput}
              placeholder="Search groups or friends by name, email..."
              placeholderTextColor="#AEAEB2"
              value={groupQuery || friendQuery}
              onChangeText={(e) => {
                setGroupQuery(e);
                setFriendQuery(e);
              }}
            />
          </View>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <View style={desktopStyles.headingSection}>
              <View style={desktopStyles.headingItem}>
                <Text style={desktopStyles.heading}>Groups</Text>
                <View style={desktopStyles.headingCountWrap}>
                  <Text style={desktopStyles.headingCount}>{filteredGroups.length}</Text>
                </View>
              </View>
              <View style={desktopStyles.headingItem}>
                <Text style={desktopStyles.selectedText}>Selected</Text>
                <Text style={desktopStyles.selectedCount}>{selectedGroups.length > 0 && selectedGroups.length < 9 ? `0${selectedGroups.length}` : selectedGroups.length}</Text>
              </View>
            </View>
            <FlatList
              data={filteredGroups}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => {
                const selected = selectedGroups.includes(item.id);
                return (
                  <Pressable key={item.id} style={[desktopStyles.shareModalGroupCard, selected && desktopStyles.shareModalGroupSelected]} onPress={() => toggleGroup(item.id)}>
                    <View style={styles.groupImage} />
                    <View style={styles.groupOverlay} />
                    <View style={[desktopStyles.shareModalGroupCheck, selected && desktopStyles.shareModalGroupCheckSelected]}>{selected && <Ionicons name="checkmark" size={15} color="#330065" />}</View>
                    <View />
                    <View style={desktopStyles.shareModalGroupText}>
                      <Text numberOfLines={1} style={desktopStyles.shareModalGroupTitle}>
                        {item.name}
                      </Text>
                      <Text numberOfLines={1} style={desktopStyles.shareModalGroupBy}>
                        Created By: <Text style={desktopStyles.shareModalGroupByHighlight}>You</Text>
                      </Text>
                    </View>
                  </Pressable>
                );
              }}
            />
            <View style={[desktopStyles.headingSection, { marginTop: 20, marginBottom: 0 }]}>
              <View style={desktopStyles.headingItem}>
                <Text style={desktopStyles.heading}>Friends</Text>
                <View style={desktopStyles.headingCountWrap}>
                  <Text style={desktopStyles.headingCount}>{filteredFriends.length}</Text>
                </View>
              </View>
              <View style={desktopStyles.headingItem}>
                <Text style={desktopStyles.selectedText}>Selected</Text>
                <Text style={desktopStyles.selectedCount}>{selectedFriends.length > 0 && selectedFriends.length < 9 ? `0${selectedFriends.length}` : selectedFriends.length}</Text>
              </View>
            </View>
            <FlatList
              data={filteredFriends}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 210 }}
              renderItem={({ item, index }) => {
                const selected = selectedFriends.includes(item.id);
                const isLeftColumn = index % 2 === 0;
                return (
                  <>
                    <Pressable key={item.id} style={[desktopStyles.shareModalFriendRow, isLeftColumn ? {} : { marginLeft: 20 }]} onPress={() => toggleFriend(item.id)}>
                      <View style={desktopStyles.shareModalFriendAvatar}>
                        <Text style={desktopStyles.shareModalFriendInitials}>{getInitials(item.name)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={desktopStyles.shareModalFriendName}>{item.name}</Text>
                        <Text style={desktopStyles.shareModalFriendEmail}>{item.email}</Text>
                      </View>
                      <View style={[desktopStyles.shareModalFriendCheckbox, selected && desktopStyles.shareModalFriendCheckboxSelected]}>{selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
                    </Pressable>
                  </>
                );
              }}
            />
          </ScrollView>
          <View style={desktopStyles.shareModalFooter}>
            <Pressable onPress={onRequestClose} style={desktopStyles.desktopSecondaryButton}>
              <Text style={desktopStyles.desktopSecondaryButtonText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={confirmShareAndClose} style={desktopStyles.desktopPrimaryButton}>
              <Text style={desktopStyles.desktopPrimaryButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MobileLayout({ headerTitle, selectedOption, setSelectedOption, requirePassword, setRequirePassword, password, setPassword, handleBack, handleContinue, shareVisible, openShareModal, closeShareModal, groupQuery, setGroupQuery, friendQuery, setFriendQuery, filteredGroups, filteredFriends, selectedGroups, selectedFriends, toggleGroup, toggleFriend, confirmShareAndClose, isEdit }: SharedLayoutProps) {
  const DESKTOP_BREAKPOINT = 1024;
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= DESKTOP_BREAKPOINT;

  const ProgressIndicator = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
        <View style={[styles.progressSegment, styles.progressActive]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <LinearGradient colors={["#330065", "#45018ad7"]} locations={[0, 0.7]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 2 }} style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <View style={styles.navigation}>
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Image source={require("@/assets/images/backArrow.png")} />
              </Pressable>
              <Text style={styles.headerTitle}>{headerTitle}</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {Boolean(isEdit) ? <View style={{ paddingVertical: 16 }} /> : <ProgressIndicator />}

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Who can see this list?</Text>
        <ScrollView contentContainerStyle={styles.contentScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            <OptionCard option="private" icon={<Image source={require("@/assets/images/privateIcon.png")} />} title="Private" description="Only visible to you" isSelected={selectedOption === "private"} styles={styles} setSelectedOption={setSelectedOption} />

            <OptionCard
              option="my-people"
              icon={<Image source={require("@/assets/images/myPeopleIcon.png")} />}
              title="My People"
              description="Visible only to selected groups or individuals in your YallaWish Circle."
              isSelected={selectedOption === "my-people"}
              onPress={() => {
                setSelectedOption("my-people");
                openShareModal();
              }}
              styles={styles}
              setSelectedOption={setSelectedOption}
            />

            <OptionCard option="public" icon={<Image source={require("@/assets/images/publicIcon.png")} />} title="Public" description="Visible to anyone with the link, on Google, or on YallaWish" isSelected={selectedOption === "public"} styles={styles} setSelectedOption={setSelectedOption}>
              <PublicPasswordSettings isSelected={selectedOption === "public"} requirePassword={requirePassword} setRequirePassword={setRequirePassword} password={password} setPassword={setPassword} styles={styles} />
            </OptionCard>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Pressable style={[styles.button, !selectedOption ? styles.buttonDisabled : styles.buttonPrimary]} onPress={handleContinue} disabled={!selectedOption}>
            <Text style={styles.buttonPrimaryText}>{Boolean(isEdit) ? "Save Changes" : "Yalla! Let’s add gifts"}</Text>
          </Pressable>
          {/* <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleBack}>
          <Text style={styles.buttonSecondaryText}>Back</Text>
        </Pressable> */}
        </View>
      </View>

      {/* <SafeAreaView edges={["bottom"]} style={styles.footer}>
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
        <Pressable style={[styles.button, styles.buttonSecondary]} onPress={handleBack}>
          <Text style={styles.buttonSecondaryText}>Back</Text>
        </Pressable>
      </SafeAreaView> */}

      <BottomSheet isVisible={shareVisible} onClose={closeShareModal}>
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.sheetTitle}>Share with groups</Text>

            <TextInputField label="Search groups" value={groupQuery} onChangeText={setGroupQuery} icon={<Image source={require("@/assets/images/search.png")} />} />

            <View style={styles.groupGrid}>
              {filteredGroups.map((group) => {
                const selected = selectedGroups.includes(group.id);
                return (
                  <Pressable
                    key={group.id}
                    style={[
                      !isDesktop ? styles.groupCardMobile : styles.groupCard,
                      // selected && styles.groupCardSelected,
                    ]}
                    onPress={() => toggleGroup(group.id)}
                  >
                    {group.cover && <Image source={{ uri: group.cover }} style={styles.groupImage} />}
                    <View style={styles.groupOverlay} />
                    <View style={[styles.groupCheck, selected && styles.groupCheckSelected]}>{selected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}</View>
                    <View style={styles.groupTextWrap}>
                      <Text style={styles.groupTitle}>{group.name}</Text>
                      <Text style={styles.groupBy}>Created By: You</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.orWrap}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <TextInputField label="Search by name or email" value={friendQuery} onChangeText={setFriendQuery} icon={<Image source={require("@/assets/images/search.png")} />} />

            <Text style={styles.shareWithFriends}>Share with friends</Text>

            <View style={styles.friendList}>
              {filteredFriends.map((friend) => {
                const selected = selectedFriends.includes(friend.id);
                return (
                  <Pressable key={friend.id} style={styles.friendRow} onPress={() => toggleFriend(friend.id)}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitials}>{getInitials(friend.name)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.friendName}>{friend.name}</Text>
                      <Text style={styles.friendEmail}>{friend.email}</Text>
                    </View>
                    <View style={[styles.friendCheckbox, selected && styles.friendCheckboxSelected]}>{selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}</View>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 16 }} />

            <Pressable style={[styles.button, styles.buttonPrimary]} onPress={confirmShareAndClose}>
              <Text style={styles.buttonPrimaryText}>{Boolean(isEdit) ? "Save Changes" : "Yalla! Let’s add gifts"}</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonSecondary, { marginBottom: 20, marginTop: 20 }]} onPress={closeShareModal}>
              <Text style={styles.buttonSecondaryText}>Back</Text>
            </Pressable>
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
}

function DesktopLayout({ selectedOption, setSelectedOption, requirePassword, setRequirePassword, password, setPassword, handleBack, handleContinue, shareVisible, openShareModal, closeShareModal, groupQuery, setGroupQuery, friendQuery, setFriendQuery, filteredGroups, filteredFriends, selectedGroups, selectedFriends, toggleGroup, toggleFriend, confirmShareAndClose, steps, isEdit, headerTitle }: DesktopLayoutProps) {
  const isContinueDisabled = !selectedOption;

  return (
    <SafeAreaView style={desktopStyles.desktopSafeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={desktopStyles.desktopWrapper}>
        <View style={desktopStyles.desktopSidebar}>
          <Pressable onPress={handleBack} style={desktopStyles.desktopBackLink}>
            <Ionicons name="chevron-back" size={20} color="#4B0082" />
            <Text style={desktopStyles.desktopBackText}>Back</Text>
          </Pressable>
          <Text style={desktopStyles.desktopTitle}>{headerTitle}</Text>
          <Text style={desktopStyles.desktopSubtitle}>To create your gift list, please provide the following details:</Text>
          <View style={desktopStyles.desktopStepList}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <View key={step.label} style={desktopStyles.desktopStepItem}>
                  <View style={desktopStyles.desktopStepIndicator}>
                    <View style={[desktopStyles.desktopStepCircle, step.status === "complete" && desktopStyles.desktopStepCircleComplete, step.status === "current" && desktopStyles.desktopStepCircleCurrent]}>{step.status === "complete" ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : <Text style={[desktopStyles.desktopStepNumber, step.status === "current" ? desktopStyles.desktopStepNumberActive : desktopStyles.desktopStepNumberInactive]}>{index + 1}</Text>}</View>
                    {!isLast && <View style={desktopStyles.desktopStepConnector} />}
                  </View>
                  <Text style={[desktopStyles.desktopStepLabel, step.status === "current" && desktopStyles.desktopStepLabelActive, step.status === "complete" && desktopStyles.desktopStepLabelComplete]}>{step.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <ScrollView contentContainerStyle={desktopStyles.desktopContentScroll} showsVerticalScrollIndicator={false}>
          <View style={desktopStyles.desktopContent}>
            <View style={desktopStyles.desktopHeadingBlock}>
              <Text style={desktopStyles.desktopSectionHeading}>Who can see this list?</Text>
              <Text style={desktopStyles.desktopSectionDescription}>Control how your list is shared with friends, family, or the wider YallaWish community.</Text>
            </View>

            <View style={desktopStyles.desktopOptionStack}>
              <DesktopOptionCard title="Private" description="Only visible to you" icon={<Ionicons name="lock-closed-outline" size={32} color="#4B0082" />} isSelected={selectedOption === "private"} onPress={() => setSelectedOption("private")} />

              <DesktopOptionCard
                title="My People"
                description="Visible only to selected groups or individuals in your YallaWish Circle."
                icon={<Ionicons name="people-outline" size={32} color="#4B0082" />}
                isSelected={selectedOption === "my-people"}
                onPress={() => {
                  setSelectedOption("my-people");
                  openShareModal();
                }}
              >
                <View style={{ alignSelf: "flex-start" }}>
                  <Pressable onPress={openShareModal} style={desktopStyles.desktopSecondaryButton}>
                    <Text style={desktopStyles.desktopSecondaryButtonText}>Manage Share</Text>
                  </Pressable>
                </View>
              </DesktopOptionCard>

              <DesktopOptionCard title="Public" description="Visible to anyone with the link, on Google, or on YallaWish." icon={<Ionicons name="globe-outline" size={32} color="#4B0082" />} isSelected={selectedOption === "public"} onPress={() => setSelectedOption("public")}>
                <DesktopPublicPasswordSettings requirePassword={requirePassword} setRequirePassword={setRequirePassword} password={password} setPassword={setPassword} />
              </DesktopOptionCard>
            </View>

            <View style={desktopStyles.desktopActions}>
              <Pressable onPress={handleBack} style={desktopStyles.desktopSecondaryButton}>
                <Text style={desktopStyles.desktopSecondaryButtonText}>Back</Text>
              </Pressable>
              <Pressable onPress={handleContinue} disabled={isContinueDisabled} style={[desktopStyles.desktopPrimaryButton, isContinueDisabled && desktopStyles.desktopPrimaryButtonDisabled]}>
                <Text style={desktopStyles.desktopPrimaryButtonText}>{Boolean(isEdit) ? "Save Changes" : "Yalla! Let’s add gifts"}</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>

      <DesktopShareModal visible={shareVisible} onRequestClose={closeShareModal} groupQuery={groupQuery} setGroupQuery={setGroupQuery} friendQuery={friendQuery} setFriendQuery={setFriendQuery} filteredGroups={filteredGroups} filteredFriends={filteredFriends} selectedGroups={selectedGroups} selectedFriends={selectedFriends} toggleGroup={toggleGroup} toggleFriend={toggleFriend} confirmShareAndClose={confirmShareAndClose} />
    </SafeAreaView>
  );
}

export default function CreateListStep3() {
  const [selectedOption, setSelectedOption] = useState<PrivacyOption>(null);
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState("");

  const [shareVisible, setShareVisible] = useState(false);
  const [groupQuery, setGroupQuery] = useState("");
  const [friendQuery, setFriendQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;

  const { listId, isEdit = "" } = useLocalSearchParams<{ listId?: string; isEdit?: string }>();
  const updatePrivacy = useMutation(api.products.updateListPrivacy);

  const existing = useQuery(api.products.getListById, listId ? ({ listId } as any) : "skip");
  const myGroups = useQuery(api.products.getGroups, existing?.user_id ? { owner_id: existing.user_id } : "skip");
  const myContacts = useQuery(api.products.getContacts, existing?.user_id ? { owner_id: existing.user_id } : "skip");
  const currentShares = useQuery(api.products.getListShares, listId ? ({ list_id: listId } as any) : "skip");

  const setShares = useMutation(api.products.setListShares);
  const seedShareData = useMutation(api.products.seedShareDataPublic);

  React.useEffect(() => {
    if ((existing as any)?.requiresPassword != null) {
      setRequirePassword(Boolean((existing as any).requiresPassword));
    }
    if ((existing as any)?.password != null) {
      setPassword(String((existing as any).password ?? ""));
    }
  }, [existing]);

  React.useEffect(() => {
    if (!existing?.user_id) return;
    const noGroups = (myGroups ?? []).length === 0;
    const noContacts = (myContacts ?? []).length === 0;
    if (noGroups && noContacts) {
      seedShareData({ owner_id: existing.user_id }).catch(() => {});
    }
  }, [existing?.user_id, myGroups, myContacts, seedShareData]);

  React.useEffect(() => {
    if (!currentShares) return;
    const groupIds = currentShares.filter((share) => !!share.group_id).map((share) => String(share.group_id));
    const contactIds = currentShares.filter((share) => !!share.contact_id).map((share) => String(share.contact_id));
    setSelectedGroups(groupIds);
    setSelectedFriends(contactIds);
  }, [currentShares]);

  React.useEffect(() => {
    if (!existing?.privacy) return;
    if (selectedOption !== null) return;
    if (existing.privacy === "private") {
      setSelectedOption("private");
    } else {
      const hasShares = (currentShares?.length ?? 0) > 0;
      setSelectedOption(hasShares ? "my-people" : "public");
    }
  }, [existing?.privacy, currentShares, selectedOption]);

  useEffect(() => {
    if (selectedOption !== "public") {
      setPassword("");
      setRequirePassword(false);
    }
  }, [selectedOption]);

  const groups = React.useMemo<GroupOption[]>(() => {
    return (myGroups ?? []).map((group) => ({ id: String(group._id), name: group.name, cover: group.coverPhotoUri }));
  }, [myGroups]);

  const friends = React.useMemo<FriendOption[]>(() => {
    return (myContacts ?? []).map((contact) => ({
      id: String(contact._id),
      name: contact.name,
      email: contact.email ?? "",
    }));
  }, [myContacts]);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!selectedOption) return;
    try {
      const backendPrivacy: "private" | "shared" = selectedOption === "private" ? "private" : "shared";
      await updatePrivacy({
        listId: listId as any,
        privacy: backendPrivacy,
        requiresPassword: selectedOption === "public" ? requirePassword : false,
        password: selectedOption === "public" && requirePassword && password.trim() ? password.trim() : null,
      } as any);

      if (backendPrivacy === "shared") {
        if (selectedOption === "public") {
          await setShares({
            list_id: listId as unknown as Id<"lists">,
            group_ids: [],
            contact_ids: [],
          });
        } else {
          await setShares({
            list_id: listId as unknown as Id<"lists">,
            group_ids: selectedGroups as unknown as Id<"groups">[],
            contact_ids: selectedFriends as unknown as Id<"contacts">[],
          });
        }
      } else {
        await setShares({
          list_id: listId as unknown as Id<"lists">,
          group_ids: [],
          contact_ids: [],
        });
      }

      router.push({ pathname: "/add-gift", params: { listId: String(listId) } });
    } catch (error) {
      console.error("Failed to update privacy", error);
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
    } catch (error) {
      console.error("Failed to set shares", error);
      setShareVisible(false);
    }
  };
  const headerTitle = Boolean(isEdit) ? "Edit Visibility" : "Create List";

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(groupQuery.toLowerCase()));
  const filteredFriends = friends.filter((friend) => friend.name.toLowerCase().includes(friendQuery.toLowerCase()) || friend.email.toLowerCase().includes(friendQuery.toLowerCase()));

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]));
  };

  const toggleFriend = (id: string) => {
    setSelectedFriends((prev) => (prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]));
  };

  const sharedProps: SharedLayoutProps = {
    headerTitle,
    selectedOption,
    setSelectedOption,
    requirePassword,
    setRequirePassword,
    password,
    setPassword,
    handleBack,
    handleContinue,
    shareVisible,
    openShareModal: () => setShareVisible(true),
    closeShareModal: () => setShareVisible(false),
    groupQuery,
    setGroupQuery,
    friendQuery,
    setFriendQuery,
    filteredGroups,
    filteredFriends,
    selectedGroups,
    selectedFriends,
    toggleGroup,
    toggleFriend,
    confirmShareAndClose,
    isEdit: Boolean(isEdit),
  };

  if (isDesktop) {
    const steps: StepItem[] = [
      { label: "Who is this list for?", status: "complete" },
      { label: "Giftlist Details", status: "complete" },
      { label: "Who can see this list?", status: "current" },
    ];
    return <DesktopLayout {...sharedProps} steps={steps} />;
  }

  return <MobileLayout {...sharedProps} />;
}
