import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/clerk-expo';
import { useMutation } from 'convex/react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export function usePushNotifications() {
  const { isSignedIn, userId } = useAuth();
  const savePushToken = useMutation(api.products.savePushToken);
  const [token, setToken] = useState<string | null>(null);
  const savedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSignedIn || !userId) return;
    let mounted = true;

    async function registerAsync() {
      try {
        // Android channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        // Permissions
        const perm = await Notifications.getPermissionsAsync();
        let status = perm.status;
        if (status !== 'granted') {
          const req = await Notifications.requestPermissionsAsync();
          status = req.status;
        }
        if (status !== 'granted') return;

        // Expo token
        const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId || (Constants as any)?.easConfig?.projectId;
        const expToken = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined as any
        );
        const t = expToken.data;
        if (!mounted) return;
        setToken(t);

        // Save to backend (idempotent server-side)
        if (savedRef.current !== `${userId}:${t}`) {
          await savePushToken({ user_id: userId, token: t } as any);
          savedRef.current = `${userId}:${t}`;
        }
      } catch (e) {
        console.warn('Push registration failed', e);
      }
    }

    registerAsync();
    return () => { mounted = false; };
  }, [isSignedIn, userId, savePushToken]);

  return token;
}
