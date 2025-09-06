import { RibbonHeader } from "@/components/RibbonHeader";
import { ActionsBar, FooterBar, GiftItemCard, HeaderBar, ListCover, PasswordGate } from "@/components/list";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import * as Linking from 'expo-linking';
import { Redirect, useLocalSearchParams, usePathname } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, Share, Text, View } from "react-native";

export default function ViewList() {
  const { listId } = useLocalSearchParams<{ listId?: string }>();
  const { isSignedIn, userId } = useAuth();
  const pathname = usePathname();
  const list = useQuery(api.products.getListById, { listId: listId as any });
  const items = useQuery(api.products.getListItems as any, listId ? ({ list_id: listId } as any) : "skip");
  const requestPassword = useMutation(api.products.requestListPassword);
  const shares = useQuery(api.products.getListShares as any, listId ? ({ list_id: listId } as any) : "skip");
  const loading = !list;

  const title = list?.title ?? "Your List";
  const subtitle = list?.note ?? "";
  const coverUri = list?.coverPhotoUri as string | undefined;
  const privacy = list?.privacy ?? "private";
  const shareCount = Array.isArray(shares) ? shares.length : undefined;

  // Password gate
  const requiresPassword: boolean = Boolean((list as any)?.requiresPassword);
  const [unlocked, setUnlocked] = useState(false);

  // Enforce private access: only owner may view
  if (list && privacy === "private") {
    const isOwner = userId && list.user_id && String(userId) === String(list.user_id);
    const qs = listId ? `?listId=${encodeURIComponent(String(listId))}` : "";
    const returnTo = `${pathname}${qs}`;
    if (!isSignedIn) {
      // Redirect unauthenticated users to sign-in, preserving returnTo
      return <Redirect href={{ pathname: "/sign-in", params: { returnTo: encodeURIComponent(returnTo) } }} />;
    }
    if (!isOwner) {
      // Signed-in but not the owner: show simple private notice
      return (
        <View style={styles.container}>
          <HeaderBar title="Private List" />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Text style={{ fontFamily: 'Nunito_700Bold', color: '#1C0335', fontSize: 18, textAlign: 'center' }}>
              This list is private and only visible to its owner.
            </Text>
          </View>
        </View>
      );
    }
  }

  if (requiresPassword && !unlocked) {
    return (
      <PasswordGate
        title={title}
        listId={listId ?? null}
        requiresPassword={requiresPassword}
        passwordValue={(list as any)?.password ?? null}
        onUnlocked={() => setUnlocked(true)}
        onRequestPassword={async (data) => {
          try {
            if (!listId) return;
            await requestPassword({
              list_id: listId as any,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
            } as any);
          } catch (e) {
            console.error('Failed to submit password request', e);
          }
        }}
      />
    );
  }

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

  const handleShare = async () => {
    try {
      if (!listId) return;
      let url = '';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const origin = window.location?.origin || '';
        const qs = `listId=${encodeURIComponent(String(listId))}`;
        url = `${origin}/view-list?${qs}`;
      } else {
        url = Linking.createURL('view-list', {
          queryParams: { listId: String(listId) },
        });
      }
      await Share.share({ message: url, url });
    } catch (e) {
      console.warn('Share failed', e);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar title={title} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ListCover imageUri={coverUri} overlayText={formatEventDate((list?.eventDate ?? undefined) as string | undefined)} />
        <View style={styles.listInfoContainer}>
          <RibbonHeader title={title} subtitle={subtitle ?? ""} />
        </View>
        <ActionsBar privacy={privacy} loading={loading} address={(list?.shippingAddress as string | undefined) ?? null} shareCount={shareCount} />

        <View style={styles.addGiftSection}>
          {Array.isArray(items) && items.length > 0 ? (
            items.map((item: any) => <GiftItemCard key={item._id} item={item} />)
          ) : (
            <Text style={{ textAlign: "center", color: "#8E8E93" }}>No gifts yet.</Text>
          )}
        </View>

        {/* <InfoBox>
          View only mode. Ask the list owner to share edit access if you need to add items.
        </InfoBox> */}
      </ScrollView>

      <FooterBar viewMode lastUpdated="Last updated: July 15, 2025 | 08:00PM" onShare={handleShare} onManage={() => { }} manageLabel="Close" />
    </View>
  );
}
