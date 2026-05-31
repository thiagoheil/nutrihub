import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { useMyPatients, useMyTokens, useMyRecipes } from "@/hooks/use-nutritionist";
import { SEED_NUTRITIONIST_PROFILES } from "@/mocks/data";
import { useRouter } from "expo-router";

type MenuItem = { icon: string; label: string; subtitle?: string; onPress: () => void; danger?: boolean };

export default function NutritionistProfileScreen() {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { data: patients } = useMyPatients();
  const { data: tokens }   = useMyTokens();
  const { data: recipes }  = useMyRecipes();

  const profile = SEED_NUTRITIONIST_PROFILES.find((n) => n.userId === user?.id)
    ?? SEED_NUTRITIONIST_PROFILES[0];

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => logout.mutate() },
    ]);
  };

  const stub = () => Alert.alert("Em breve", "Esta funcionalidade estará disponível em breve.");

  const menuGroups: { title: string; items: MenuItem[] }[] = [
    {
      title: "Conta",
      items: [
        { icon: "person-outline",           label: "Editar perfil",    subtitle: "Nome, bio e especialidades",           onPress: () => router.push("/(app)/nutritionist-profile/edit")         },
        { icon: "card-outline",             label: "Assinatura",       subtitle: "Plano Starter · R$ 29,90/mês",         onPress: () => router.push("/(app)/nutritionist-profile/subscription")  },
        { icon: "shield-checkmark-outline", label: "Verificação CRN",  subtitle: profile.isVerified ? "✓ Conta verificada" : "Pendente de verificação", onPress: () => router.push("/(app)/nutritionist-profile/crn") },
      ],
    },
    {
      title: "Preferências",
      items: [
        { icon: "notifications-outline", label: "Notificações",    subtitle: "Alertas de solicitações e registros",  onPress: () => router.push("/(app)/nutritionist-profile/notifications") },
        { icon: "time-outline",          label: "Disponibilidade", subtitle: "Horários e modalidade de atendimento", onPress: () => router.push("/(app)/nutritionist-profile/availability")   },
        { icon: "location-outline",      label: "Área de atendimento", subtitle: `${profile.serviceRadiusKm}km de raio configurado`, onPress: () => router.push("/(app)/nutritionist-profile/service-area") },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: "help-circle-outline",   label: "Ajuda",          subtitle: "Dúvidas e suporte",       onPress: () => router.push("/(app)/nutritionist-profile/help")  },
        { icon: "document-text-outline", label: "Termos de uso",  subtitle: "Políticas e privacidade",  onPress: () => router.push("/(app)/nutritionist-profile/terms") },
      ],
    },
  ];

  const initials = user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "N";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={{ backgroundColor: "#16A34A", padding: 24, paddingBottom: 36 }}>
          <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#fff", marginBottom: 20 }}>Perfil</Text>

          <View style={{ alignItems: "center" }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Text style={{ fontSize: 30, fontFamily: "Inter-Bold", color: "#fff" }}>{initials}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={{ fontSize: 20, fontFamily: "Inter-Bold", color: "#fff" }}>{user?.name}</Text>
              {profile.isVerified && <Ionicons name="shield-checkmark" size={18} color="#D1FAE5" />}
            </View>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>
              {profile.crnNumber}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 1 }}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Stats row — overlaps hero */}
        <View style={{ flexDirection: "row", gap: 10, marginHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
          {[
            { label: "Pacientes",  value: patients?.length ?? 0,                             icon: "people" },
            { label: "Receitas",   value: recipes?.length ?? 0,                              icon: "book"   },
            { label: "Avaliação",  value: `${profile.ratingAvg.toFixed(1)} ★`,              icon: "star"   },
            { label: "Convites",   value: tokens?.filter((t) => t.status === "active").length ?? 0, icon: "key" },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 10, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 }}>
              <Ionicons name={s.icon as any} size={14} color="#16A34A" />
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111827", marginTop: 4 }}>{s.value}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Specialties */}
        {profile.specialties.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
              Especialidades
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {profile.specialties.map((s) => (
                <View key={s} style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#BBF7D0" }}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#16A34A" }}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bio */}
        {profile.bio && (
          <View style={{ marginHorizontal: 20, marginBottom: 20, backgroundColor: "#fff", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
              Sobre mim
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#374151", lineHeight: 21 }}>
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Menu groups */}
        {menuGroups.map((group) => (
          <View key={group.title} style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
              {group.title}
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              {group.items.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
                    borderBottomWidth: i < group.items.length - 1 ? 1 : 0,
                    borderBottomColor: "#F3F4F6",
                  }}
                >
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name={item.icon as any} size={18} color="#6B7280" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: item.danger ? "#EF4444" : "#111827" }}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={15} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={{ marginHorizontal: 20, backgroundColor: "#FEF2F2", borderRadius: 14, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={{ fontFamily: "Inter-Medium", color: "#EF4444", fontSize: 15 }}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
