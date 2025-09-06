import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
// Clerk
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Redirect, router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Linking, Modal, Pressable, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";

export default function GiftDetail() {
  const { itemId, listId, action } = useLocalSearchParams<{ itemId?: string; listId?: string; action?: string }>();
  const item = useQuery(api.products.getListItemById as any, itemId ? ({ itemId } as any) : "skip");
  const list = useQuery(api.products.getListById as any, listId ? ({ listId } as any) : "skip");
  const setClaim = useMutation(api.products.setListItemClaim as any);
  const purchase = useMutation(api.products.purchaseListItem as any);
  const createItem = useMutation(api.products.createListItem as any);
  const { user } = useUser();
  const { isSignedIn, userId } = useAuth();
  const pathname = usePathname();

  const bought = (item?.claimed ?? 0) > 0;
  const [marked, setMarked] = useState<boolean>(bought);
  const [qty, setQty] = useState<number>(Math.max(1, Math.min(item?.claimed ?? 1, item?.quantity ?? 1)));
  const inc = useCallback(() => setQty(q => Math.min((item?.quantity ?? 1), q + 1)), [item?.quantity]);
  const dec = useCallback(() => setQty(q => Math.max(1, q - 1)), []);

  const [deliveredTo, setDeliveredTo] = useState<'recipient' | 'me'>('recipient');
  const [note, setNote] = useState("");
  const [storeName, setStoreName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  // Copy to my list sheet
  const [showCopySheet, setShowCopySheet] = useState(false);
  // Buy Now bottom sheet state
  const [showLeaving, setShowLeaving] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const buyUrl = (item?.buy_url as string | undefined) || undefined;
  const host = useMemo(() => {
    try {
      if (!buyUrl) return "the seller";
      const u = new URL(buyUrl);
      return u.hostname.replace(/^www\./, "");
    } catch { return "the seller"; }
  }, [buyUrl]);

  const storeDisplayName = useMemo(() => {
    try {
      if (!buyUrl) return 'Seller';
      const u = new URL(buyUrl);
      const h = u.hostname.replace(/^www\./, '').toLowerCase();
      const mappings: { test: RegExp; name: string }[] = [
        { test: /amazon|amzn\.to/, name: 'Amazon' },
        { test: /noon/, name: 'Noon' },
        { test: /etsy/, name: 'Etsy' },
        { test: /ikea/, name: 'IKEA' },
        { test: /carrefour/, name: 'Carrefour' },
        { test: /shein/, name: 'SHEIN' },
        { test: /decathlon/, name: 'Decathlon' },
        { test: /walmart/, name: 'Walmart' },
        { test: /target/, name: 'Target' },
        { test: /apple\.com|store\.apple\.com/, name: 'Apple' },
      ];
      for (const m of mappings) {
        if (m.test.test(h)) return m.name;
      }
      const first = h.split('.')[0];
      return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'Seller';
    } catch {
      return 'Seller';
    }
  }, [buyUrl]);

  const ownerName = useMemo(() => {
    // Try to parse from list title like "Bilal's Birthday"
    const title = (list?.title ?? '').trim();
    const m = title.match(/^(.+?)'s\b/i);
    if (m && m[1]) return m[1];
    // If current user owns the list, use their name
    if (list?.user_id && user?.id && list.user_id === user.id) {
      return user.firstName || user.username || 'Me';
    }
    return 'Recipient';
  }, [list?.title, list?.user_id, user?.firstName, user?.id, user?.username]);

  const canSubmit = marked ? qty > 0 : true;

  // If returned from sign-in with action=buy, show the leaving sheet automatically
  React.useEffect(() => {
    if (action === 'buy' && buyUrl) {
      setShowLeaving(true);
      setCountdown(5);
    }
  }, [action, buyUrl]);

  // Countdown effect to open external link
  React.useEffect(() => {
    if (!showLeaving) return;
    if (countdown <= 0) {
      if (buyUrl) Linking.openURL(buyUrl).catch(() => { });
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showLeaving, countdown, buyUrl]);

  const computeReturnTo = () => {
    const parts: string[] = [];
    if (listId) parts.push(`listId=${encodeURIComponent(String(listId))}`);
    if (itemId) parts.push(`itemId=${encodeURIComponent(String(itemId))}`);
    return `${pathname}${parts.length ? `?${parts.join('&')}` : ''}`;
  };

  const onBuyNow = () => {
    if (!buyUrl) return;
    if (!isSignedIn) {
      const returnTo = `${computeReturnTo()}${computeReturnTo().includes('?') ? '&' : '?'}action=buy`;
      router.push({ pathname: '/sign-in', params: { returnTo: encodeURIComponent(returnTo) } });
      return;
    }
    setShowLeaving(true);
    setCountdown(5);
  };

  const onIWantThisToo = () => {
    if (!isSignedIn) {
      const returnTo = `${computeReturnTo()}${computeReturnTo().includes('?') ? '&' : '?'}action=want`;
      router.push({ pathname: '/sign-in', params: { returnTo: encodeURIComponent(returnTo) } });
      return;
    }
    setShowCopySheet(true);
  };

  const onSubmit = async () => {
    try {
      if (!itemId) return;
      if (marked) {
        await purchase({
          list_id: (listId as any) ?? (item?.list_id as any),
          item_id: itemId as any,
          quantity: qty,
          deliveredTo,
          note: note || null,
          storeName: storeName || null,
          orderNumber: orderNumber || null,
          buyer_user_id: user?.id ?? null,
          buyer_name: user?.fullName || user?.username || null,
          buyer_email: user?.primaryEmailAddress?.emailAddress || null,
        });
      } else {
        await setClaim({ itemId, claimed: 0 } as any);
      }
      // Navigate to success
      const params: any = {};
      if (listId) params.listId = String(listId);
      router.replace({ pathname: "/purchase-success", params });
    } catch (e) {
      console.warn('Failed to update purchase', e);
    }
  };
  const onBack = () => {
    router.back();
  };

  const price = useMemo(() => {
    if (item?.price == null) return null;
    const p = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    if (Number.isFinite(p)) return `AED ${p.toFixed(2)}`;
    return `AED ${item.price}`;
  }, [item?.price]);

  return (
    <View style={styles.container}>
      {/* Private list guard: only owner can view */}
      {list && list.privacy === 'private' && (() => {
        const isOwner = userId && list.user_id && String(userId) === String(list.user_id);
        const qsParts: string[] = [];
        if (listId) qsParts.push(`listId=${encodeURIComponent(String(listId))}`);
        if (itemId) qsParts.push(`itemId=${encodeURIComponent(String(itemId))}`);
        const qs = qsParts.length ? `?${qsParts.join('&')}` : '';
        const returnTo = `${pathname}${qs}`;
        if (!isSignedIn) {
          return <Redirect href={{ pathname: "/sign-in", params: { returnTo: encodeURIComponent(returnTo) } }} />;
        }
        if (!isOwner) {
          return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <Text style={{ fontFamily: 'Nunito_700Bold', color: '#1C0335', fontSize: 18, textAlign: 'center' }}>
                This list is private and only visible to its owner.
              </Text>
            </View>
          );
        }
        return null;
      })()}
      <StatusBar barStyle="light-content" backgroundColor="#330065" />
      <View style={{ backgroundColor: '#4B0082', paddingTop: 14, paddingBottom: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </Pressable>
        <Text numberOfLines={1} style={{ color: '#FFF', fontSize: 20, fontFamily: 'Nunito_700Bold', marginLeft: 8, flex: 1 }}>{item?.name ?? 'Gift'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={{ padding: 16 }}>
          {item?.image_url ? (
            <Image source={{ uri: item.image_url }} style={{ width: '100%', height: 220, borderRadius: 12 }} />
          ) : null}
          <Text style={{ marginTop: 12, color: '#1C0335', fontSize: 24, lineHeight: 30, fontFamily: 'Nunito_700Bold' }}>{item?.name ?? ''}</Text>
          {price && <Text style={{ color: '#4B0082', fontSize: 18, fontFamily: 'Nunito_700Bold', marginTop: 6 }}>{price}</Text>}
          {item?.quantity != null && (
            <Text style={{ color: '#4B0082', marginTop: 4 }}>Quantity: <Text style={{ fontFamily: 'Nunito_700Bold' }}>{item.quantity}</Text></Text>
          )}
          {item?.description && (
            <Text style={{ color: '#7A6F88', marginTop: 8 }}>{item.description}</Text>
          )}

          {/* CTA row: I want this too | Buy Now */}
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Pressable onPress={onIWantThisToo} style={{ flex: 1, height: 56, borderRadius: 12, borderWidth: 2, borderColor: '#3B0076', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#3B0076', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>I want this too</Text>
            </Pressable>
            <Pressable disabled={!buyUrl} onPress={onBuyNow} style={{ flex: 1, height: 56, borderRadius: 12, backgroundColor: '#3B0076', alignItems: 'center', justifyContent: 'center', opacity: buyUrl ? 1 : 0.5 }}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Buy Now</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ backgroundColor: '#F7F3FB', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', paddingBottom: 16 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#1C0335', fontSize: 18, fontFamily: 'Nunito_700Bold', marginBottom: 8 }}>Did you buy this gift?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: '#1C0335' }}>Mark as purchased</Text>
              <Switch value={marked} onValueChange={setMarked} trackColor={{ true: '#7C3AED' }} thumbColor={marked ? '#FFF' : undefined} />
            </View>
          </View>
          {marked && (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ color: '#1C0335', marginBottom: 8 }}>I bought</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E5E0EC', borderRadius: 12, paddingHorizontal: 12, height: 56 }}>
                <Pressable onPress={dec} style={{ width: 44, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#F0E9FA' }}>
                  <Text style={{ color: '#4B0082', fontSize: 18 }}>–</Text>
                </Pressable>
                <Text style={{ color: '#4B0082', fontSize: 20, fontFamily: 'Nunito_700Bold' }}>{String(qty).padStart(2, '0')}</Text>
                <Pressable onPress={inc} style={{ width: 44, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: '#F0E9FA' }}>
                  <Text style={{ color: '#4B0082', fontSize: 18 }}>+</Text>
                </Pressable>
              </View>

              <Text style={{ color: '#1C0335', marginTop: 16, marginBottom: 8 }}>Delivered to</Text>
              <View style={{ gap: 12 }}>
                <Pressable onPress={() => setDeliveredTo('recipient')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1C0335' }}>{ownerName}</Text>
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#4B0082', alignItems: 'center', justifyContent: 'center' }}>
                    {deliveredTo === 'recipient' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4B0082' }} />}
                  </View>
                </Pressable>
                <Pressable onPress={() => setDeliveredTo('me')} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: '#1C0335' }}>My Home</Text>
                  <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#4B0082', alignItems: 'center', justifyContent: 'center' }}>
                    {deliveredTo === 'me' && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#4B0082' }} />}
                  </View>
                </Pressable>
              </View>

              <Text style={{ color: '#8E8E93', marginTop: 16 }}>Add a note</Text>
              <View style={{ borderWidth: 1, borderColor: '#E5E0EC', borderRadius: 12, padding: 12, minHeight: 92 }}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Hears a little gift to make your day better! Can’t wait to celebrate 🎉"
                  placeholderTextColor="#B1A6C4"
                  multiline
                  style={{ color: '#1C0335' }}
                />
                <Text style={{ color: '#B1A6C4', textAlign: 'right' }}>{`${Math.max(0, 400 - note.length)}/400`}</Text>
              </View>

              <Text style={{ color: '#1C0335', fontSize: 18, fontFamily: 'Nunito_700Bold', marginTop: 20, marginBottom: 10 }}>Where did you buy this?</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, height: 64, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0EC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
                  <Text style={{ color: '#1C0335' }}>{storeDisplayName}</Text>
                </View>
                <View style={{ flex: 1, height: 64, borderRadius: 12, borderWidth: 2, borderColor: '#4B0082', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F3FB' }}>
                  <Text style={{ color: '#4B0082', fontFamily: 'Nunito_700Bold' }}>Another Store</Text>
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={{ color: '#8E8E93' }}>Store Name</Text>
                <View style={{ borderWidth: 1, borderColor: '#E5E0EC', borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: 'center' }}>
                  <TextInput value={storeName} onChangeText={setStoreName} placeholder="Macy’s" placeholderTextColor="#B1A6C4" style={{ color: '#1C0335' }} />
                </View>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={{ color: '#8E8E93' }}>Order Number (if known)</Text>
                <View style={{ borderWidth: 1, borderColor: '#E5E0EC', borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: 'center' }}>
                  <TextInput value={orderNumber} onChangeText={setOrderNumber} placeholder="#8393847589347" placeholderTextColor="#B1A6C4" style={{ color: '#1C0335' }} />
                </View>
              </View>

            </View>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <View style={{ padding: 16 }}>
        <Pressable onPress={onSubmit} style={{ height: 56, borderRadius: 12, backgroundColor: '#4B0082', alignItems: 'center', justifyContent: 'center', opacity: canSubmit ? 1 : 0.6 }} disabled={!canSubmit}>
          <Text style={{ color: '#FFF', fontFamily: 'Nunito_700Bold', fontSize: 18 }}>Submit</Text>
        </Pressable>
      </View>

      {/* Leaving Yallawish bottom sheet */}
      <Modal
        visible={showLeaving}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLeaving(false)}
      >
        <Pressable onPress={() => setShowLeaving(false)} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}>
          <Pressable onPress={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
            <View style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2DAF0', marginBottom: 12 }} />
            <Text style={{ color: '#1C0335', fontSize: 28, fontFamily: 'Nunito_700Bold', textAlign: 'center' }}>Leaving Yallawish</Text>
            <Text style={{ color: '#6B5E7E', textAlign: 'center', marginTop: 8 }}>
              You’re about to visit the seller’s site. After buying, come back and mark this gift as purchased.
            </Text>
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: '#1C0335' }}>Redirecting to</Text>
              <Text style={{ color: '#1C0335', fontFamily: 'Nunito_700Bold', fontSize: 24, marginTop: 6 }}>{host}</Text>
              <Text style={{ color: '#1C0335', marginTop: 8 }}>You’ll be redirected in</Text>
              <Text style={{ color: '#4B0082', fontFamily: 'Nunito_700Bold', fontSize: 40, marginTop: 4 }}>{countdown}s</Text>
            </View>
            <View style={{ marginTop: 16, gap: 12 }}>
              <Pressable onPress={() => buyUrl && Linking.openURL(buyUrl)} style={{ height: 56, borderRadius: 12, backgroundColor: '#3B0076', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Proceed Now</Text>
              </Pressable>
              <Pressable onPress={() => setShowLeaving(false)} style={{ height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#3B0076', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
                <Text style={{ color: '#3B0076', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Stay Here</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Copy to my list bottom sheet */}
      <CopyToMyListSheet
        visible={(() => {
          if (showCopySheet) return true;
          // Auto-open after sign-in if action=want
          if (action === 'want' && isSignedIn) return true;
          return false;
        })()}
        onClose={() => {
          setShowCopySheet(false);
          // Clear action param is optional; leaving as-is keeps idempotent behavior
        }}
        userId={userId ?? null}
        item={item as any}
        onAdd={async (targetListIds: string[]) => {
          if (!item) return false;
          try {
            // Copy to each selected list as quantity 1 by default
            const payloads = targetListIds.map((lid) => ({
              list_id: lid as any,
              name: item.name,
              description: item.description ?? null,
              image_url: item.image_url ?? null,
              quantity: 1,
              price: item.price ?? null,
              currency: item.currency ?? 'AED',
              buy_url: item.buy_url ?? null,
            }));
            for (const p of payloads) {
              await createItem(p as any);
            }
            return true;
          } catch (e) {
            console.warn('Failed to copy item', e);
            return false;
          }
        }}
        onCreateNewList={() => {
          // Navigate to create list flow; keep a returnTo back here with action=want to reopen
          const rt = `${computeReturnTo()}${computeReturnTo().includes('?') ? '&' : '?'}action=want`;
          router.push({ pathname: '/create-list-step1', params: { returnTo: encodeURIComponent(rt) } });
        }}
      />
    </View>
  );
}

// Bottom sheet component for copying item to user's lists
function CopyToMyListSheet({
  visible,
  onClose,
  userId,
  item,
  onAdd,
  onCreateNewList,
}: {
  visible: boolean;
  onClose: () => void;
  userId: string | null;
  item: any;
  onAdd: (ids: string[]) => Promise<boolean>;
  onCreateNewList: () => void;
}) {
  const myLists = useQuery(api.products.getMyLists as any, userId ? ({ user_id: userId } as any) : 'skip');
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAdd = async () => {
    if (selected.length === 0) return;
    try {
      setSaving(true);
      const ok = await onAdd(selected);
      if (ok) {
        onClose();
        setSelected([]);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }}>
        <Pressable onPress={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, maxHeight: '80%' }}>
          <View style={{ alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#E2DAF0', marginBottom: 12 }} />
          <Text style={{ color: '#1C0335', fontSize: 24, fontFamily: 'Nunito_700Bold' }}>Copy Item to your list</Text>
          <Text style={{ color: '#6B5E7E', marginTop: 6 }}>Choose a list to add this item to</Text>

          <ScrollView style={{ marginTop: 12 }} contentContainerStyle={{ paddingBottom: 16 }}>
            {Array.isArray(myLists) && myLists.length > 0 ? (
              myLists.map((l: any) => {
                const checked = selected.includes(String(l._id));
                return (
                  <Pressable key={String(l._id)} onPress={() => toggle(String(l._id))} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: '#FFC857' }} />
                      <Text style={{ color: '#1C0335', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>{l.title}</Text>
                    </View>
                    <View style={{ width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: checked ? '#3B0076' : '#CFC7DD', alignItems: 'center', justifyContent: 'center', backgroundColor: checked ? '#3B0076' : 'transparent' }}>
                      {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={{ paddingVertical: 16 }}>
                <Text style={{ color: '#6B5E7E' }}>You don’t have any lists yet.</Text>
              </View>
            )}
          </ScrollView>

          <View style={{ gap: 12 }}>
            <Pressable onPress={handleAdd} disabled={selected.length === 0 || saving} style={{ height: 56, borderRadius: 12, backgroundColor: '#3B0076', alignItems: 'center', justifyContent: 'center', opacity: selected.length === 0 || saving ? 0.6 : 1 }}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>{saving ? 'Adding...' : 'Add to selected lists'}</Text>
            </Pressable>
            <Pressable onPress={onCreateNewList} style={{ height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#3B0076', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
              <Text style={{ color: '#3B0076', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Create a new list</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
