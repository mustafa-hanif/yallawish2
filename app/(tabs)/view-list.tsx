import { RibbonHeader } from "@/components/RibbonHeader";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, InfoBox, ListCover } from "@/components/list";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ViewList() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const list = useQuery(api.products.getListById, { listId: listId as any });
  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");
  const loading = !list;

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";

  const formatEventDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-").map((p) => parseInt(p, 10));
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return dateStr;
    const [y, m, d] = parts;
    const date = new Date(y, (m ?? 1) - 1, d ?? 1);
    try {
      return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" }).format(date);
    } catch {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar title={title} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover imageUri={coverUri} overlayText={formatEventDate((list?.eventDate ?? undefined) as string | undefined)} />
        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} />
        </View>
        <ActionsBar privacy={privacy} loading={loading} />

        <View style={styles.addGiftSection}>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item: any) => <GiftItemCard key={item._id} item={item} />)
          ) : (
            <Text style={{ textAlign: "center", color: "#8E8E93" }}>No gifts yet.</Text>
          )}
        </View>

        <InfoBox>
          View only mode. Ask the list owner to share edit access if you need to add items.
        </InfoBox>
      </ScrollView>

      <FooterBar lastUpdated="Last updated: July 15, 2025 | 08:00PM" onShare={() => { }} onManage={() => { }} manageLabel="Close" />
    </View>
  );
}
