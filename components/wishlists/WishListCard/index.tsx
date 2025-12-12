import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import ActionButton from "react-native-circular-action-menu";
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
interface WishListCardProps {
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
}

export default function WishListCard({ item, onSelectDelete, handleArchiveList, handleDuplicateList }: WishListCardProps) {
  const actionBtnRef = useRef<any>(null);
  const { user: loggedInUser } = useUser();
  const [isBottomSheet, setIsBottomSheet] = useState(false);

  const id = item?._id;
  const title = item?.title || "Raghavendra Suryadev Birthday";
  const date = item?.eventDate || "-----------";
  const totalItems = item?.totalItems ?? 0;
  const purchasedItems = item?.totalClaimed ?? 0;
  const percentage = totalItems > 0 ? Math.round((purchasedItems / totalItems) * 100) : 0;
  const occasion = item?.occasion || "birthday";
  const user = item?.creator || null;
  const isArchive = loggedInUser?.id !== item?.user_id ? false : item?.isArchived || false;
  const occasionIcon = occasionObj?.[occasion];

  const quickActions = [
    { title: "Delete", icon: require("@/assets/images/deleteList.png") },
    { title: "Duplicate", icon: require("@/assets/images/duplicateList.png") },
    { title: isArchive ? "Unarchive" : "Archive", icon: isArchive ? require("@/assets/images/unarchiveList.png") : require("@/assets/images/archiveList.png") },
    { title: "Edit", icon: require("@/assets/images/Edit.png") },
  ];

  const handlePress = (id: string) => router.push({ pathname: "/view-list", params: { listId: String(id) } });
  const handleLongPress = () => {
    if (loggedInUser?.id === item?.user_id) {
      setIsBottomSheet(true);
      try {
        const inst = actionBtnRef.current as any;
        if (inst && typeof inst.animateButton === "function") {
          inst.animateButton();
        } else if (inst && typeof inst._animateButton === "function") {
          inst._animateButton();
        } else {
          setIsBottomSheet(true);
        }
      } catch {
        setIsBottomSheet(true);
      }
    }
  };

  const profileInitials = useMemo(() => {
    const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    if (name) {
      return (
        name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("")
          .slice(0, 2) || "YW"
      );
    }

    const email = user?.contactEmail ?? "";
    if (email) {
      const letters = email
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase();
      return letters || "YW";
    }

    return "YW";
  }, [user?.firstName, user?.lastName, user?.contactEmail]);

  const handlePressActionButton = (title: string) => {
    if (id) {
      if (title === "Edit") router.push({ pathname: "/create-list-step2", params: { listId: String(id) } });
      else if (title === "Delete" && onSelectDelete) onSelectDelete(id);
      else if (title === "Archive" && handleArchiveList) handleArchiveList(id, true);
      else if (title === "Unarchive" && handleArchiveList) handleArchiveList(id, false);
      else if (title === "Duplicate" && handleDuplicateList) handleDuplicateList(item);
    }
    setIsBottomSheet(false);
  };

  return (
    <>
      <View style={[styles.card, isArchive ? { borderColor: "#FF6C6C", backgroundColor: "#F1F1F1" } : {}]}>
        <Pressable onPress={() => handlePress(id)} onLongPress={handleLongPress} delayLongPress={200} style={[styles.pressableArea, isBottomSheet && { zIndex: 10, backgroundColor: isBottomSheet ? "#FFFFFFE5" : "transparent" }]}>
          <ActionButton onPress={() => setIsBottomSheet(false)} onOverlayPress={() => setIsBottomSheet(false)} size={0} radius={120} icon={<Text></Text>} ref={actionBtnRef} position={"right"}>
            {quickActions?.map((action) => (
              <ActionButton.Item key={action.title} title={action.title} onPress={() => handlePressActionButton(action.title)} buttonColor={"#FFFFFF"}>
                <View style={styles.actionButtonContent}>
                  <View style={styles.actionIconWrapper}>
                    <Image source={action.icon} style={styles.actionIcon} resizeMode="contain" />
                  </View>
                  <Text style={[styles.actionTitle, action.title === "Delete" && { color: "#FF3B30" }]}>{action.title}</Text>
                </View>
              </ActionButton.Item>
            ))}
          </ActionButton>
        </Pressable>
        <View style={styles.cardContentWrapper}>
          <View style={styles.cardHeader}>
            <Image style={styles.cardIcon} resizeMode="contain" source={occasionIcon} />
            <View style={styles.profile}>{user?.profileImageUrl ? <Image resizeMode="cover" style={styles.profileImageUrl} source={{ uri: user.profileImageUrl }} /> : <Text style={styles.profileInitials}>{profileInitials}</Text>}</View>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
          </View>
          <View>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View>
            <Text style={styles.totalItems}>
              Total Items:
              <Text style={styles.totalIteNumber}>{Number(totalItems) < 10 && Number(totalItems) > 0 ? `0${totalItems}` : totalItems}</Text>
            </Text>
          </View>
          <View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${percentage}%` }]} />
            </View>
            <View>
              <Text style={styles.progressText}>{percentage}% Completed</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
