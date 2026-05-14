import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => logout.mutate() },
    ]);
  };

  const menuItems = [
    { icon: "person-outline", label: "Editar perfil", onPress: () => router.push("/(app)/profile/edit") },
    { icon: "card-outline", label: "Assinatura", onPress: () => router.push("/(app)/profile/subscription") },
    { icon: "notifications-outline", label: "Notificações", onPress: () => router.push("/(app)/profile/notifications") },
    { icon: "shield-outline", label: "Privacidade", onPress: () => router.push("/(app)/profile/privacy") },
    { icon: "help-circle-outline", label: "Ajuda", onPress: () => router.push("/(app)/profile/help") },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 24 }}>
          Perfil
        </Text>

        {/* Avatar + name */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <View style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 12,
          }}>
            <Text style={{ fontSize: 28, fontFamily: "Inter-Bold", color: "#16A34A" }}>
              {user?.name?.[0] ?? "?"}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>{user?.name}</Text>
          <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 }}>{user?.email}</Text>
          <View style={{ marginTop: 8, backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: "#16A34A" }}>
              {user?.role === "nutritionist" ? "Nutricionista" : "Usuário"}
            </Text>
          </View>
        </View>

        {/* Menu */}
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{
                flexDirection: "row", alignItems: "center", padding: 16, gap: 12,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <Ionicons name={item.icon as any} size={20} color="#6B7280" />
              <Text style={{ flex: 1, fontFamily: "Inter-Regular", color: "#374151", fontSize: 15 }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 20, backgroundColor: "#FEF2F2", borderRadius: 14, padding: 16,
            flexDirection: "row", alignItems: "center", gap: 12,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={{ fontFamily: "Inter-Medium", color: "#EF4444", fontSize: 15 }}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
