import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";
import { useActiveDietPlan, useTodayLogs } from "@/hooks/use-diet";
import { useLatestMetric } from "@/hooks/use-metrics";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router } from "expo-router";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: plan, isLoading: planLoading } = useActiveDietPlan();
  const { data: logs } = useTodayLogs();
  const { data: metric } = useLatestMetric();

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const eatenCount = logs?.filter((l) => l.status === "eaten").length ?? 0;
  const totalMeals = plan?.meals.length ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <Text style={{ fontSize: 13, fontFamily: "Inter-Regular", color: "#9CA3AF", textTransform: "capitalize" }}>
          {today}
        </Text>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginTop: 2, marginBottom: 24 }}>
          Olá, {user?.name?.split(" ")[0]} 👋
        </Text>

        {/* Daily progress card */}
        <View style={{ backgroundColor: "#16A34A", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <Text style={{ color: "#D1FAE5", fontFamily: "Inter-Medium", fontSize: 13 }}>Progresso de hoje</Text>
          <Text style={{ color: "#fff", fontFamily: "Inter-Bold", fontSize: 28, marginTop: 4 }}>
            {eatenCount}/{totalMeals}
          </Text>
          <Text style={{ color: "#D1FAE5", fontFamily: "Inter-Regular", fontSize: 13 }}>refeições realizadas</Text>
          {totalMeals > 0 && (
            <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 100, height: 6 }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  height: 6,
                  width: `${(eatenCount / totalMeals) * 100}%`,
                }}
              />
            </View>
          )}
        </View>

        {/* Metrics summary */}
        {metric && (
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            {metric.weightKg && (
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
                onPress={() => router.push("/(app)/setup-profile")}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF" }}>Peso</Text>
                <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>{metric.weightKg}</Text>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF" }}>kg</Text>
              </TouchableOpacity>
            )}
            {metric.bmi && (
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
                onPress={() => router.push("/(app)/setup-profile")}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF" }}>IMC</Text>
                <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>{metric.bmi.toFixed(1)}</Text>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF" }}>kg/m²</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Active plan */}
        <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: "#111827", marginBottom: 12 }}>
          Plano ativo
        </Text>
        {planLoading ? (
          <ActivityIndicator color="#16A34A" />
        ) : plan ? (
          <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#111827", fontSize: 15 }}>{plan.title}</Text>
            <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280", fontSize: 13, marginTop: 4 }}>
              Objetivo: {plan.goal}
            </Text>
            <View style={{ flexDirection: "row", marginTop: 10, gap: 8 }}>
              <View style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: "#16A34A" }}>
                  {plan.source === "algorithm" ? "Gerado por IA" : plan.source === "nutritionist" ? "Nutricionista" : "Manual"}
                </Text>
              </View>
              <View style={{ backgroundColor: "#F3F4F6", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: "#6B7280" }}>
                  {plan.meals.length} refeições
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 20, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", borderStyle: "dashed" }}>
            <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", textAlign: "center" }}>
              Nenhum plano ativo.{"\n"}Vá para a aba Dieta para criar um.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
