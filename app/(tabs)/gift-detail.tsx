import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/addGiftStyles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Switch, Text, TextInput, View } from "react-native";

export default function GiftDetail() {
  const { itemId, listId } = useLocalSearchParams<{ itemId?: string; listId?: string }>();
  const item = useQuery(api.products.getListItemById as any, itemId ? ({ itemId } as any) : "skip");
  const list = useQuery(api.products.getListById as any, listId ? ({ listId } as any) : "skip");
  const setClaim = useMutation(api.products.setListItemClaim as any);
  const purchase = useMutation(api.products.purchaseListItem as any);
  const { user } = useUser();

  const bought = (item?.claimed ?? 0) > 0;
  const [marked, setMarked] = useState<boolean>(bought);
  const [qty, setQty] = useState<number>(Math.max(1, Math.min(item?.claimed ?? 1, item?.quantity ?? 1)));
  const inc = useCallback(() => setQty(q => Math.min((item?.quantity ?? 1), q + 1)), [item?.quantity]);
  const dec = useCallback(() => setQty(q => Math.max(1, q - 1)), []);

  const [deliveredTo, setDeliveredTo] = useState<'recipient' | 'me'>('recipient');
  const [note, setNote] = useState("");
  const [storeName, setStoreName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

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
      router.replace({ pathname: "/purchase-success", params: { ...(listId ? { listId: String(listId) } : {}) } });
    } catch (e) {
      console.warn('Failed to update purchase', e);
    }
  };

  const onBack = () => router.back();

  const price = useMemo(() => {
    if (item?.price == null) return null;
    const p = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    if (Number.isFinite(p)) return `AED ${p.toFixed(2)}`;
    return `AED ${item.price}`;
  }, [item?.price]);

  return (
    <View style={styles.container}>
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
                  <Text style={{ color: '#1C0335' }}>amazon</Text>
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
    </View>
  );
}
