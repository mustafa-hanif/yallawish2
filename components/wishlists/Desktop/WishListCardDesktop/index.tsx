import { getProfileInitials } from "@/utils";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Modal, Pressable, Text, View, ViewToken } from "react-native";
import { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { styles } from "./style";


const occasionObj: Record<string, any> = {
  birthday: require("@/assets/images/birthday3.png"),
  wedding: require("@/assets/images/wedding3.png"),
  "baby-shower": require("@/assets/images/babyShower3.png"),
  graduation: require("@/assets/images/graduation3.png"),
  "new-home": require("@/assets/images/houseWarming3.png"),
  retirement: require("@/assets/images/retirement3.png"),
  "no-occasion": require("@/assets/images/other3.png"),
  other: require("@/assets/images/other3.png"),
};
interface WishListCardDesktopProps {
  item: {
    _creationTime: number;
    _id: string;
    coverPhotoUri: string | null;
    created_at: string;
    eventDate: string;
    note: string | null;
    occasion: string;
    password: string;
    privacy: string;
    requiresPassword: boolean;
    shippingAddress: string;
    title: string;
    updated_at: string;
    user_id: string;
    totalItems: number;
    totalClaimed: number;
    isArchived: boolean;
    creator: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileImageUrl: string | null;
      contactEmail: string;
    };
  };
  onSelectDelete?: (id: string) => void;
  handleArchiveList?: (listId: string | null, isArchived: boolean) => Promise<void>;
  handleDuplicateList?: (listDetails: any | null) => Promise<void>;
  viewableItems?: any;
  isActive?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
  currentTab?: string;
}

export default function WishListCardDesktop({  item, onSelectDelete, handleArchiveList, handleDuplicateList, viewableItems, onSelect, isSelected, currentTab }: WishListCardDesktopProps) {
  const actionBtnRef = useRef<any>(null);
  const chevronRef = useRef<View>(null);
  const { user: loggedInUser } = useUser();
  const [isShowDropDownMenu, setIsShowDropDownMenu] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const id = item?._id;
  const title = item?.title || "Raghavendra Suryadev Birthday";
  const date = item?.eventDate || "-----------";
  const totalItems = Number(item?.totalItems ?? 0) || 0;
  const purchasedItems = Number(item?.totalClaimed ?? 0) || 0;
  // Compute percentage safely and clamp between 0 and 100
  const rawPercent = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;
  let percentage = Number.isFinite(rawPercent) ? Math.round(rawPercent) : 0;
  percentage = Math.max(0, Math.min(100, percentage));
  const occasion = item?.occasion || "birthday";
  const user = item?.creator || null;
  const isArchive = loggedInUser?.id !== item?.user_id ? false : item?.isArchived || false;
  const occasionIcon = occasionObj?.[occasion];
  const isActive = item?._id === "js738qbanj5gkwpv669f8emerd7y6r35";
  const quickActions = [
    { title: "Delete", icon: require("@/assets/images/deleteList.png") },
    { title: "Duplicate", icon: require("@/assets/images/duplicateList.png") },
    { title: isArchive ? "Unarchive" : "Archive", icon: isArchive ? require("@/assets/images/unarchiveList.png") : require("@/assets/images/archiveList.png") },
    { title: "Edit", icon: require("@/assets/images/Edit.png") },
  ];

  const handlePress = (id: string) => {
    onSelect?.();
  };

  const profileInitials = useMemo(() => getProfileInitials(user), [user?.firstName, user?.lastName, user?.contactEmail]);

  const handlePressActionButton = (title: string) => {
    if (id) {
      if (title === "Edit") router.push({ pathname: "/create-list-step2", params: { listId: String(id) } });
      else if (title === "Delete" && onSelectDelete) onSelectDelete(id);
      else if (title === "Archive" && handleArchiveList) handleArchiveList(id, true);
      else if (title === "Unarchive" && handleArchiveList) handleArchiveList(id, false);
      else if (title === "Duplicate" && handleDuplicateList) handleDuplicateList(item);
    }
    setIsShowDropDownMenu(false);
  };

  return (
    <>
      {(() => {
        const rStyle = useAnimatedStyle(() => {
          if (!viewableItems?.value) {
            return { opacity: 1, transform: [{ scale: 1 }] };
          }
          const tokens: ViewToken[] = (viewableItems?.value as ViewToken[]) || [];
          const isVisible = Boolean(tokens.filter((vi: ViewToken) => vi.isViewable).find((vi: ViewToken) => String((vi.item as any)?._id) === String(item._id)));
          return {
            opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
            transform: [{ scale: withTiming(isVisible ? 1 : 0.9, { duration: 200 }) }],
          };
        }, [item._id]);

        return (
          <Pressable onPress={() => handlePress(item._id)} style={[styles.card, isSelected ? { backgroundColor: "#ffff" } : {}, isArchive ? { borderColor: "#FF6C6C", backgroundColor: "#F1F1F1" } : {}, rStyle]}>
            <View style={styles.cardContentWrapper}>
              <View style={styles.iconAndDetails}>
                <Image style={styles.cardIcon} resizeMode="contain" source={occasionIcon} />
                <View style={styles.titleAndDetails}>
                  <View>
                    <Text numberOfLines={1} style={styles.title}>
                      {title}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.date}>{date}</Text>
                  </View>
                  <View>
                    <Text style={styles.totalItems}>
                      Total Items: {" "}
                      <Text style={styles.totalIteNumber}>{Number(totalItems) < 10 && Number(totalItems) > 0 ? `0${totalItems}` : totalItems}</Text>
                    </Text>
                  </View>
                </View>
                <View style={styles.profileAndDropDownContainer}>
                  {currentTab === "my-events" && (
                  <View ref={chevronRef} collapsable={false}>
                    <Pressable onPress={() => {
                      chevronRef.current?.measureInWindow((x, y, width, height) => {
                        setDropdownPosition({ top: y + height + 5, left: 250 });
                        setIsShowDropDownMenu((prev) => !prev);
                      });
                    }}>
                      <Ionicons name={"chevron-down"} size={15} color="#1C0335" />
                    </Pressable>
                  </View>
                  )}
                  <View style={styles.profile}>{user?.profileImageUrl ? <Image resizeMode="cover" style={styles.profileImageUrl} source={{ uri: user.profileImageUrl }} /> : <Text style={styles.profileInitials}>{profileInitials}</Text>}</View>
                </View>
              </View>
              <View>
                <View>
                  <Text style={styles.progressText}>{percentage}% Completed</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                </View>
              </View>
            </View>
          </Pressable>
        );
      })()}
      
      {/* Dropdown Modal */}
      <Modal
        visible={isShowDropDownMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setIsShowDropDownMenu(false)}
      >
        <Pressable 
          style={{ flex: 1 }} 
          onPress={() => setIsShowDropDownMenu(false)}
        >
          <View style={{ position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left }}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={{ padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, borderRadius: 8, elevation: 30, width: 287, backgroundColor: "#FFFFFF" }}>
                <Text style={{ fontSize: 16, fontFamily: "Nunito_700Bold" }}>Manage List</Text>
                <View style={{ rowGap: 12, marginTop: 8 }}>
                  {quickActions.map((option) => (
                    <Pressable
                      key={option.title}
                      style={({ hovered }: { hovered?: boolean }) => ({
                        backgroundColor: hovered ? "#EFEFEF" : "transparent",
                        borderRadius: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        columnGap: 13,
                        padding: 4,
                      })}
                      onPress={() => handlePressActionButton(option.title)}
                    >
                      <View style={{ width: 40, height: 40, justifyContent: "center", alignItems: "center", borderRadius: 8, backgroundColor: "#EFEFEF" }}>
                        <Image source={option.icon} resizeMode="contain" style={{ width: 16, height: 16 }} />
                      </View>
                      <View>
                        <Text style={{ fontSize: 16, fontFamily: "Nunito_600SemiBold", color: option?.title === "Delete" ? "#FF3B30" : "#000000" }}>{option.title}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
