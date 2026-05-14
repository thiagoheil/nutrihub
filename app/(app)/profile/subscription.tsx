import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type PlanId = "free" | "pro" | "premium";

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Grátis",
    price: "R$ 0",
    period: "para sempre",
    description: "Para começar sua jornada",
    features: [
      "Diário alimentar básico",
      "Monitoramento de água",
      "Histórico de 30 dias",
      "1 plano de dieta ativo",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 19,90",
    period: "por mês",
    description: "Para quem leva saúde a sério",
    highlighted: true,
    features: [
      "Tudo do Grátis",
      "Histórico ilimitado",
      "Conexão com nutricionista",
      "Gráficos avançados de métricas",
      "Receitas exclusivas",
      "Diário com fotos",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 34,90",
    period: "por mês",
    description: "Para resultados máximos",
    features: [
      "Tudo do Pro",
      "IA para ajuste de dieta",
      "Consultas mensais inclusas",
      "Relatórios PDF detalhados",
      "Suporte prioritário 24h",
      "Integração com wearables",
    ],
  },
];

const CURRENT_PLAN: PlanId = "free";

export default function SubscriptionScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<PlanId>(CURRENT_PLAN);

  function handleUpgrade() {
    if (selected === CURRENT_PLAN) return;
    Alert.alert(
      "Fazer upgrade",
      `Deseja assinar o plano ${PLANS.find((p) => p.id === selected)?.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Assinar", style: "default", onPress: () => Alert.alert("Em breve", "Pagamentos serão habilitados em breve!") },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Assinatura</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Current status */}
        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="card" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#15803D" }}>Plano atual: Grátis</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 1 }}>Faça upgrade para desbloquear mais recursos</Text>
          </View>
        </View>

        {/* Plan cards */}
        <View style={{ gap: 14, marginBottom: 28 }}>
          {PLANS.map((plan) => {
            const isCurrent = plan.id === CURRENT_PLAN;
            const isSelected = plan.id === selected;

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                activeOpacity={0.8}
                style={{
                  borderRadius: 16, padding: 18,
                  backgroundColor: isSelected ? (plan.highlighted ? "#16A34A" : "#fff") : "#fff",
                  borderWidth: 2,
                  borderColor: isSelected ? (plan.highlighted ? "#16A34A" : "#111827") : "#E5E7EB",
                  shadowColor: "#000", shadowOpacity: isSelected ? 0.08 : 0.04, shadowRadius: 8, elevation: isSelected ? 4 : 2,
                }}
              >
                {/* Badge */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: isSelected && plan.highlighted ? "#fff" : "#111827" }}>
                      {plan.name}
                    </Text>
                    {plan.highlighted && (
                      <View style={{ backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "#FEF9C3", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: isSelected ? "#fff" : "#CA8A04" }}>POPULAR</Text>
                      </View>
                    )}
                    {isCurrent && (
                      <View style={{ backgroundColor: "#DCFCE7", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#15803D" }}>ATUAL</Text>
                      </View>
                    )}
                  </View>
                  <View style={{
                    width: 22, height: 22, borderRadius: 11,
                    borderWidth: 2,
                    borderColor: isSelected ? (plan.highlighted ? "#fff" : "#111827") : "#D1D5DB",
                    backgroundColor: isSelected ? (plan.highlighted ? "#fff" : "#111827") : "transparent",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: plan.highlighted ? "#16A34A" : "#fff" }} />}
                  </View>
                </View>

                <Text style={{ fontFamily: "Inter-Bold", fontSize: 26, color: isSelected && plan.highlighted ? "#fff" : "#111827" }}>
                  {plan.price}
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: isSelected && plan.highlighted ? "rgba(255,255,255,0.75)" : "#9CA3AF" }}>
                    {" "}{plan.period}
                  </Text>
                </Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: isSelected && plan.highlighted ? "rgba(255,255,255,0.8)" : "#6B7280", marginTop: 4, marginBottom: 14 }}>
                  {plan.description}
                </Text>

                <View style={{ gap: 8 }}>
                  {plan.features.map((f) => (
                    <View key={f} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={isSelected && plan.highlighted ? "rgba(255,255,255,0.9)" : "#16A34A"}
                      />
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: isSelected && plan.highlighted ? "rgba(255,255,255,0.9)" : "#374151" }}>
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={handleUpgrade}
          activeOpacity={0.8}
          disabled={selected === CURRENT_PLAN}
          style={{
            backgroundColor: selected === CURRENT_PLAN ? "#E5E7EB" : "#16A34A",
            borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center",
          }}
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: selected === CURRENT_PLAN ? "#9CA3AF" : "#fff" }}>
            {selected === CURRENT_PLAN ? "Plano atual selecionado" : `Assinar plano ${PLANS.find((p) => p.id === selected)?.name}`}
          </Text>
        </TouchableOpacity>

        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 12 }}>
          Cancele quando quiser. Sem multas ou fidelidade.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
