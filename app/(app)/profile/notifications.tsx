import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface NotifSetting {
  id: string;
  icon: string;
  label: string;
  description: string;
  group: string;
}

const SETTINGS: NotifSetting[] = [
  { id: "meal_reminder", icon: "restaurant-outline", label: "Lembretes de refeição", description: "Avise quando for hora de comer", group: "Dieta" },
  { id: "water_reminder", icon: "water-outline", label: "Hidratação", description: "Lembrete para beber água ao longo do dia", group: "Dieta" },
  { id: "weight_reminder", icon: "scale-outline", label: "Pesagem semanal", description: "Lembrete para registrar seu peso", group: "Métricas" },
  { id: "metrics_progress", icon: "trending-up-outline", label: "Progresso de métricas", description: "Resumo semanal do seu progresso", group: "Métricas" },
  { id: "nutritionist_message", icon: "chatbubble-outline", label: "Mensagens do nutricionista", description: "Quando seu nutricionista enviar uma mensagem", group: "Nutricionista" },
  { id: "nutritionist_plan", icon: "clipboard-outline", label: "Atualizações do plano", description: "Quando o nutricionista atualizar sua dieta", group: "Nutricionista" },
  { id: "promo", icon: "gift-outline", label: "Novidades e promoções", description: "Ofertas especiais e novos recursos do app", group: "App" },
  { id: "tips", icon: "bulb-outline", label: "Dicas de saúde", description: "Dicas nutricionais personalizadas", group: "App" },
];

const GROUPS = ["Dieta", "Métricas", "Nutricionista", "App"];

export default function NotificationsScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    meal_reminder: true,
    water_reminder: true,
    weight_reminder: false,
    metrics_progress: true,
    nutritionist_message: true,
    nutritionist_plan: true,
    promo: false,
    tips: true,
  });

  const allOn = Object.values(enabled).every(Boolean);

  function toggleAll() {
    const next = !allOn;
    setEnabled(Object.fromEntries(Object.keys(enabled).map((k) => [k, next])));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Notificações</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Master toggle */}
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="notifications" size={20} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>Todas as notificações</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              {allOn ? "Todas ativas" : "Algumas desativadas"}
            </Text>
          </View>
          <Switch
            value={allOn}
            onValueChange={toggleAll}
            trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
            thumbColor={allOn ? "#16A34A" : "#fff"}
            ios_backgroundColor="#E5E7EB"
          />
        </View>

        {/* Groups */}
        {GROUPS.map((group) => {
          const items = SETTINGS.filter((s) => s.group === group);
          return (
            <View key={group} style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                {group}
              </Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                {items.map((item, i) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
                      borderBottomWidth: i < items.length - 1 ? 1 : 0,
                      borderBottomColor: "#F3F4F6",
                    }}
                  >
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={item.icon as any} size={18} color="#6B7280" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>{item.label}</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{item.description}</Text>
                    </View>
                    <Switch
                      value={enabled[item.id]}
                      onValueChange={(v) => setEnabled((prev) => ({ ...prev, [item.id]: v }))}
                      trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                      thumbColor={enabled[item.id] ? "#16A34A" : "#fff"}
                      ios_backgroundColor="#E5E7EB"
                    />
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
