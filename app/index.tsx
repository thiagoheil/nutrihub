import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;

  if (user?.role === "nutritionist") return <Redirect href="/(app)/(nutritionist)" />;

  return <Redirect href="/(app)/(tabs)" />;
}
