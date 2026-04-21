import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (!isLoading && !isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(nutritionist)" />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="build-diet" />
    </Stack>
  );
}
