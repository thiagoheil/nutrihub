import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (!isLoading && !isAuthenticated) return <Redirect href="/(auth)/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(nutritionist)" />
      <Stack.Screen name="nutritionist/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="patient/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="patient-diary/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="patient-plan/[id]" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/edit" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/subscription" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/crn" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/notifications" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/availability" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/service-area" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/help" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="nutritionist-profile/terms" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="profile/edit" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="profile/subscription" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="profile/notifications" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="profile/privacy" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="profile/help" options={{ presentation: "card", animation: "slide_from_right" }} />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="build-diet" />
    </Stack>
  );
}
