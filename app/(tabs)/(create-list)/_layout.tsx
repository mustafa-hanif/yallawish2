import { Stack } from "expo-router";

export default function CreateListLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-list-step1" />
      <Stack.Screen name="create-list-step2" />
      <Stack.Screen name="create-list-step3" />
      <Stack.Screen name="select-profile" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
