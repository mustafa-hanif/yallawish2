import { ClerkProvider } from "@clerk/clerk-expo";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import useGoogleFonts from "@/hooks/useFonts";
import { Dimensions, Platform } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL as string);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const isDesktop = Platform.OS === "web" && SCREEN_WIDTH >= 768;

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const googleFontsLoaded = useGoogleFonts();

  useEffect(() => {
    if (loaded && googleFontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, googleFontsLoaded]);

  if (!loaded || !googleFontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey="pk_test_cHJvZm91bmQtc3RhZy04Ny5jbGVyay5hY2NvdW50cy5kZXYk" tokenCache={tokenCache}>
      <ConvexProvider client={convex}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          {isDesktop ? (
            <>
              <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="desktopHomepage" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </>
          ) : (
            <>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false, title: "" }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="desktopHomepage" options={{ headerShown: false }} />

                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </>
          )}
        </ThemeProvider>
      </ConvexProvider>
    </ClerkProvider>
  );
}
