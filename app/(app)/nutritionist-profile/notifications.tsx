import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Setting { id: string; icon: string; label: string; description: string; group: string }

const SETTINGS: Setting[] = [
  { id: "new_request",      icon: "person-add-outline",     label: "Nova solicitação",          description: "Quando um paciente solicita acompanhamento",    group: "Pacientes" },
  { id: "patient_message",  icon: "chatbubble-outline",     label: "Mensagens de pacientes",    description: "Chat e dúvidas enviadas pelos seus pacientes",   group: "Pacientes" },
  { id: "meal_logged",      icon: "restaurant-outline",     label: "Refeição registrada",       description: "Quando paciente registra uma refeição no diário",group: "Pacientes" },
  { id: "metric_update",    icon: "trending-up-outline",    label: "Atualização de métricas",   description: "Quando paciente adiciona novo registro de peso",  group: "Pacientes" },
  { id: "low_adherence",    icon: "alert-circle-outline",   label: "Baixa aderência",           description: "Alerta quando aderência ficar abaixo de 60%",    group: "Pacientes" },
  { id: "appointment",      icon: "calendar-outline",       label: "Agendamentos",              description: "Confirmações e lembretes de consultas",           group: "Agenda" },
  { id: "appointment_24h",  icon: "time-outline",           label: "Lembrete 24h antes",        description: "Aviso um dia antes de cada consulta",             group: "Agenda" },
  { id: "plan_review",      icon: "clipboard-outline",      label: "Revisão de plano",          description: "Lembrete para revisar planos próximos do vencimento", group: "Agenda" },
  { id: "new_features",     icon: "sparkles-outline",       label: "Novidades do app",          description: "Atualizações e novas funcionalidades",            group: "Sistema" },
  { id: "billing",          icon: "card-outline",           label: "Faturamento",               description: "Cobranças e confirmações de assinatura",          group: "Sistema" },
];

const GROUPS = ["Pacientes", "Agenda", "Sistema"];

export default function NutritionistNotificationsScreen() {
  const router = useRouter();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    new_request:     true,
    patient_message: true,
    meal_logged:     false,
    metric_update:   true,
    low_adherence:   true,
    appointment:     true,
    appointment_24h: true,
    plan_review:     false,
    new_features:    true,
    billing:         true,
  });

  const allOn = Object.values(enabled).every(Boolean);

  function toggleAll() {
    const next = !allOn;
    setEnabled(Object.fromEntries(Object.keys(enabled).map((k) => [k, next])));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
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
          <Switch value={allOn} onValueChange={toggleAll}
            trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
            thumbColor={allOn ? "#16A34A" : "#fff"} ios_backgroundColor="#E5E7EB" />
        </View>

        {GROUPS.map((group) => {
          const items = SETTINGS.filter((s) => s.group === group);
          return (
            <View key={group} style={{ marginBottom: 20 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
                {group}
              </Text>
              <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                {items.map((item, i) => (
                  <View key={item.id} style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                      <Ionicons name={item.icon as any} size={18} color="#6B7280" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>{item.label}</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{item.description}</Text>
                    </View>
                    <Switch
                      value={enabled[item.id]}
                      onValueChange={(v) => setEnabled((p) => ({ ...p, [item.id]: v }))}
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
