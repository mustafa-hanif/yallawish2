import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

export type PasswordGateProps = {
  title?: string;
  listId?: string | null;
  requiresPassword: boolean;
  passwordValue?: string | null; // actual password if checking client-side
  onUnlocked: () => void;
  onRequestPassword?: (data: { listId?: string | null; firstName: string; lastName: string; email: string }) => void;
};

export function PasswordGate({ title, listId, requiresPassword, passwordValue, onUnlocked, onRequestPassword }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const ownerName = useMemo(() => {
    const t = (title ?? '').trim();
    const m = t.match(/^(.+?)'s\b/i);
    return m && m[1] ? m[1] : '';
  }, [title]);

  const tryUnlock = () => {
    if (!requiresPassword) {
      setUnlocked(true);
      onUnlocked?.();
      return;
    }
    if (passwordValue && password && String(passwordValue) === String(password)) {
      setUnlocked(true);
      setPwdError(null);
      onUnlocked?.();
    } else {
      setPwdError('Wrong password');
    }
  };

  if (!requiresPassword || unlocked) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#2C0C54', paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Image source={require('@/assets/images/yallawish_logo.png')} style={{ width: 150, height: 30, resizeMode: 'contain' }} />
      </View>

      <View style={{ flex: 1, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.06)', padding: 20 }}>
        <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 16 }}>
          <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#6A0FBF33' }} />
        </View>
        {!showRequest ? (
          <>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 28, textAlign: 'center' }}>
              {ownerName || 'This list'}
            </Text>
            <View style={{ alignSelf: 'center', marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: '#6B21A8', paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="gift-outline" size={18} color="#FFCC00" />
              <Text style={{ color: '#E9D5FF', fontFamily: 'Nunito_700Bold' }}>{title}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', textAlign: 'center', marginTop: 16, marginBottom: 8, fontFamily: 'Nunito_600SemiBold' }}>Requires a password</Text>

            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: pwdError ? '#FF4D4F' : 'rgba(255,255,255,0.5)', borderRadius: 12, paddingHorizontal: 12, height: 56 }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password*"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  secureTextEntry={!showPwd}
                  style={{ flex: 1, color: '#FFFFFF' }}
                />
                <Pressable onPress={() => setShowPwd(v => !v)}>
                  <Ionicons name={showPwd ? 'eye' : 'eye-off'} size={20} color="#D1C4E9" />
                </Pressable>
              </View>
              {pwdError && <Text style={{ color: '#FF4D4F', marginTop: 8 }}>{pwdError}</Text>}
            </View>

            <Pressable onPress={tryUnlock} style={{ marginTop: 16, height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#2C0C54', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>View the Gift List</Text>
            </Pressable>

            <Pressable onPress={() => setShowRequest(true)} style={{ marginTop: 18, alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', textDecorationLine: 'underline' }}>I don’t have the password</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_700Bold', fontSize: 24, textAlign: 'center', marginBottom: 8 }}>Add details to request password</Text>
            <View style={{ marginTop: 8 }}>
              <View style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 12, paddingHorizontal: 12, height: 56, justifyContent: 'center' }}>
                <TextInput value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: '#FFFFFF' }} />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 12, paddingHorizontal: 12, height: 56, justifyContent: 'center' }}>
                <TextInput value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: '#FFFFFF' }} />
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <View style={{ borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 12, paddingHorizontal: 12, height: 56, justifyContent: 'center' }}>
                <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" placeholderTextColor="rgba(255,255,255,0.5)" style={{ color: '#FFFFFF' }} />
              </View>
            </View>
            <Pressable onPress={() => onRequestPassword?.({ listId, firstName, lastName, email })} style={{ marginTop: 16, height: 56, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#2C0C54', fontFamily: 'Nunito_700Bold', fontSize: 16 }}>Request Password</Text>
            </Pressable>
            <Pressable onPress={() => setShowRequest(false)} style={{ marginTop: 18, alignItems: 'center' }}>
              <Text style={{ color: '#FFFFFF', textDecorationLine: 'underline' }}>I have the password</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
