import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();
  const decodedReturnTo = returnTo ? decodeURIComponent(String(returnTo)) : undefined;

  if (isSignedIn) {
    return <Redirect href={decodedReturnTo ? (decodedReturnTo as any) : "/"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
