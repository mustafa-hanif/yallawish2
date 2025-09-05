import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef } from 'react';
import { Image, Pressable, SafeAreaView, StatusBar, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function PurchaseSuccess() {
  const { listId } = useLocalSearchParams<{ name?: string; listId?: string }>();
  const confettiRef = useRef<any>(null);

  const onSendAnnouncement = () => {
    // TODO: integrate announcement flow
    // For now, return to list if available
    if (listId) router.replace({ pathname: '/view-list', params: { listId: String(listId) } });
    else router.replace('/');
  };
  const onPurchaseAnother = () => {
    if (listId) router.replace({ pathname: '/view-list', params: { listId: String(listId) } });
    else router.replace('/');
  };
  const onCreateList = () => {
    router.replace('/create-list-step1');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2C0C54' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2C0C54" />
      {/* Confetti */}
      <ConfettiCannon ref={confettiRef} count={120} origin={{ x: 200, y: -10 }} fadeOut autoStart fallSpeed={3000} explosionSpeed={450} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: 24 }}>
          <Image source={require('@/assets/images/yallawish_logo.png')} style={{ width: 150, height: 30, resizeMode: 'contain' }} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 36, textAlign: 'center', marginTop: 36 }}>
            Thank You!
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Nunito_600SemiBold', fontSize: 18, textAlign: 'center', marginTop: 12, lineHeight: 26 }}>
            Your gift is on its way – and it’s going to make someones’s day!
          </Text>

          {/* Big check icon substitute */}
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#39D98A', alignItems: 'center', justifyContent: 'center', marginTop: 28 }}>
            <Text style={{ color: '#0A4D2E', fontSize: 44 }}>✓</Text>
          </View>

          <View style={{ width: '100%', marginTop: 28, gap: 16 }}>
            <Pressable onPress={onSendAnnouncement} style={{ height: 56, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Send a gift announcement</Text>
            </Pressable>
            <Pressable onPress={onPurchaseAnother} style={{ height: 56, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Purchase another gift</Text>
            </Pressable>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'Nunito_700Bold', fontSize: 18, textAlign: 'center', marginTop: 32 }}>Wasn’t that easy?</Text>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 26, textAlign: 'center', marginTop: 12 }}>
            {`Make Gifting Fun\n& Easy for Your\nFriends & Family`}
          </Text>

          <Pressable onPress={onCreateList} style={{ width: '100%', height: 56, borderRadius: 14, backgroundColor: '#FF3EB5', alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 18 }}>Create My List</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
