import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type PlanId = "starter" | "professional" | "clinic";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  highlight?: boolean;
  badge?: string;
  features: string[];
  limits: { patients: number | "∞"; recipes: number | "∞"; assistants: number };
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "R$ 29,90",
    period: "por mês",
    features: [
      "Até 10 pacientes simultâneos",
      "Criação de planos de dieta",
      "Receitas públicas ilimitadas",
      "Geração de convites por código",
      "Acesso ao diário dos pacientes",
    ],
    limits: { patients: 10, recipes: 30, assistants: 0 },
  },
  {
    id: "professional",
    name: "Professional",
    price: "R$ 59,90",
    period: "por mês",
    highlight: true,
    badge: "MAIS POPULAR",
    features: [
      "Até 50 pacientes simultâneos",
      "Tudo do Starter",
      "Comentários e notas por refeição",
      "Relatórios PDF de evolução",
      "Convites com tipos de serviço",
      "Suporte prioritário",
    ],
    limits: { patients: 50, recipes: 200, assistants: 1 },
  },
  {
    id: "clinic",
    name: "Clínica",
    price: "R$ 149,90",
    period: "por mês",
    badge: "PARA EQUIPES",
    features: [
      "Pacientes ilimitados",
      "Tudo do Professional",
      "Múltiplos nutricionistas na conta",
      "Painel analítico avançado",
      "API de integração",
      "Gerente de conta dedicado",
    ],
    limits: { patients: Infinity, recipes: Infinity, assistants: 5 },
  },
];

const CURRENT: PlanId = "starter";

export default function NutritionistSubscriptionScreen() {
  const router  = useRouter();
  const [selected, setSelected] = useState<PlanId>(CURRENT);

  function handleUpgrade() {
    if (selected === CURRENT) return;
    const plan = PLANS.find((p) => p.id === selected)!;
    Alert.alert(
      "Confirmar upgrade",
      `Deseja migrar para o plano ${plan.name} por ${plan.price}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => Alert.alert("Em breve", "Pagamentos serão habilitados em breve.") },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Assinatura</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Current plan info */}
        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="card" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#15803D" }}>
              Plano atual: {PLANS.find((p) => p.id === CURRENT)?.name}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 1 }}>
              Próxima cobrança: 14/06/2026 · R$ 29,90
            </Text>
          </View>
        </View>

        {/* Plan cards */}
        <View style={{ gap: 14, marginBottom: 28 }}>
          {PLANS.map((plan) => {
            const isCurrent  = plan.id === CURRENT;
            const isSelected = plan.id === selected;

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                activeOpacity={0.8}
                style={{
                  borderRadius: 16, padding: 18,
                  backgroundColor: isSelected && plan.highlight ? "#16A34A" : "#fff",
                  borderWidth: 2,
                  borderColor: isSelected ? (plan.highlight ? "#16A34A" : "#111827") : "#E5E7EB",
                  shadowColor: "#000", shadowOpacity: isSelected ? 0.08 : 0.03, shadowRadius: 8, elevation: isSelected ? 4 : 1,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: isSelected && plan.highlight ? "#fff" : "#111827" }}>
                      {plan.name}
                    </Text>
                    {plan.badge && (
                      <View style={{ backgroundColor: isSelected && plan.highlight ? "rgba(255,255,255,0.2)" : "#FEF9C3", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: "Inter-Bold", fontSize: 9, color: isSelected && plan.highlight ? "#fff" : "#CA8A04" }}>
                          {plan.badge}
                        </Text>
                      </View>
                    )}
                    {isCurrent && (
                      <View style={{ backgroundColor: "#DCFCE7", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 9, color: "#15803D" }}>ATUAL</Text>
                      </View>
                    )}
                  </View>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    borderWidth: 2,
                    borderColor: isSelected ? (plan.highlight ? "#fff" : "#111827") : "#D1D5DB",
                    backgroundColor: isSelected ? (plan.highlight ? "#fff" : "#111827") : "transparent",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: plan.highlight ? "#16A34A" : "#fff" }} />}
                  </View>
                </View>

                <Text style={{ fontFamily: "Inter-Bold", fontSize: 24, color: isSelected && plan.highlight ? "#fff" : "#111827" }}>
                  {plan.price}
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: isSelected && plan.highlight ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>
                    {" "}{plan.period}
                  </Text>
                </Text>

                {/* Limits */}
                <View style={{ flexDirection: "row", gap: 12, marginTop: 10, marginBottom: 14 }}>
                  {[
                    { label: "Pacientes", value: plan.limits.patients === Infinity ? "∞" : `${plan.limits.patients}` },
                    { label: "Receitas",  value: plan.limits.recipes  === Infinity ? "∞" : `${plan.limits.recipes}` },
                    { label: "Assistentes", value: `${plan.limits.assistants}` },
                  ].map((l) => (
                    <View key={l.label} style={{ flex: 1, backgroundColor: isSelected && plan.highlight ? "rgba(255,255,255,0.15)" : "#F9FAFB", borderRadius: 10, padding: 8, alignItems: "center" }}>
                      <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: isSelected && plan.highlight ? "#fff" : "#111827" }}>{l.value}</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: isSelected && plan.highlight ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>{l.label}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ gap: 7 }}>
                  {plan.features.map((f) => (
                    <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons name="checkmark-circle" size={15} color={isSelected && plan.highlight ? "rgba(255,255,255,0.9)" : "#16A34A"} />
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: isSelected && plan.highlight ? "rgba(255,255,255,0.9)" : "#374151" }}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleUpgrade} activeOpacity={0.8}
          disabled={selected === CURRENT}
          style={{ backgroundColor: selected === CURRENT ? "#E5E7EB" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: selected === CURRENT ? "#9CA3AF" : "#fff" }}>
            {selected === CURRENT ? "Plano atual selecionado" : `Assinar ${PLANS.find((p) => p.id === selected)?.name}`}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 12 }}>
          Cancele quando quiser · Suporte via e-mail incluído
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
