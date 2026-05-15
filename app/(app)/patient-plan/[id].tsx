import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePatientDetail, usePatientPlan } from "@/hooks/use-nutritionist";
import type { Meal, MealType } from "@/types";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const MEAL_ICON: Record<MealType, string> = {
  breakfast: "sunny-outline",
  lunch:     "restaurant-outline",
  dinner:    "moon-outline",
  snack:     "cafe-outline",
};

function totalMacros(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => {
      m.items.forEach((i) => {
        acc.calories += i.calories;
        acc.protein  += i.proteinG;
        acc.carbs    += i.carbsG;
        acc.fat      += i.fatG;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

function MacroBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6B7280" }}>{label}</Text>
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: "#374151" }}>{value.toFixed(0)}g</Text>
      </View>
      <View style={{ height: 6, backgroundColor: "#F3F4F6", borderRadius: 10 }}>
        <View style={{ height: 6, borderRadius: 10, backgroundColor: color, width: `${Math.min(100, (value / total) * 100)}%` }} />
      </View>
    </View>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  const [expanded, setExpanded] = useState(false);
  const mealCal = meal.items.reduce((s, i) => s + i.calories, 0);
  const mealProt = meal.items.reduce((s, i) => s + i.proteinG, 0);

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 14, marginBottom: 10, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.75}
        style={{ padding: 14, flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name={(MEAL_ICON[meal.mealType] ?? "restaurant-outline") as any} size={18} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{meal.name}</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
            {meal.scheduledTime} · {meal.items.length} itens · {mealCal.toFixed(0)} kcal · {mealProt.toFixed(0)}g prot
          </Text>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color="#D1D5DB" />
      </TouchableOpacity>

      {expanded && (
        <View style={{ borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          {meal.items.map((item, i) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10,
                borderBottomWidth: i < meal.items.length - 1 ? 1 : 0, borderBottomColor: "#F9FAFB",
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#D1FAE5", marginRight: 10 }} />
              <Text style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 13, color: "#374151" }}>
                {item.food.name}
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
                {item.quantity}{item.unit}
              </Text>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#6B7280", marginLeft: 10, minWidth: 52, textAlign: "right" }}>
                {item.calories} kcal
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function PatientPlanScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // id = userId (u7, u8…)
  const { data: patient, isLoading: patientLoading } = usePatientDetail(id);
  const { data: plan, isLoading: planLoading } = usePatientPlan(id);

  if (patientLoading || planLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  const initials = patient?.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  if (!plan) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Plano do paciente</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
          <Ionicons name="clipboard-outline" size={52} color="#D1D5DB" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#374151", marginTop: 16, textAlign: "center" }}>
            {patient?.name} ainda não tem plano
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
            Crie um plano personalizado para começar o acompanhamento.
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert("Em breve", "Criação de plano personalizado em desenvolvimento.")}
            activeOpacity={0.8}
            style={{ marginTop: 24, backgroundColor: "#16A34A", borderRadius: 14, paddingHorizontal: 28, paddingVertical: 14 }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#fff" }}>Criar plano</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const macros = totalMacros(plan.meals);
  const totalMacroG = macros.protein + macros.carbs + macros.fat;
  const daysLeft = Math.max(0, differenceInDays(new Date(plan.endDate), new Date()));
  const daysTotal = differenceInDays(new Date(plan.endDate), new Date(plan.startDate));
  const elapsed = daysTotal - daysLeft;
  const pct = Math.round((elapsed / daysTotal) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Plano do paciente</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{patient?.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => Alert.alert("Em breve", "Edição de plano em desenvolvimento.")}
          style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F0FDF4", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#BBF7D0" }}
        >
          <Ionicons name="create-outline" size={15} color="#16A34A" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#16A34A" }}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Plan hero */}
        <View style={{ backgroundColor: "#16A34A", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#fff" }}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#fff" }}>{plan.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#fff" }}>
                    {plan.source === "nutritionist" ? "Nutricionista" : plan.source === "algorithm" ? "IA" : "Manual"}
                  </Text>
                </View>
                <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#fff" }}>Ativo</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 19, marginBottom: 14 }}>
            {plan.goal}
          </Text>

          {/* Progress */}
          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                {format(new Date(plan.startDate), "dd/MM/yy")} → {format(new Date(plan.endDate), "dd/MM/yy")}
              </Text>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#fff" }}>
                {daysLeft}d restantes
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 10 }}>
              <View style={{ height: 6, borderRadius: 10, backgroundColor: "#fff", width: `${pct}%` }} />
            </View>
          </View>
        </View>

        {/* Notes */}
        {plan.notes && (
          <View style={{ backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14, marginBottom: 16, flexDirection: "row", gap: 10 }}>
            <Ionicons name="document-text-outline" size={16} color="#D97706" style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#92400E", marginBottom: 4 }}>
                Observações do nutricionista
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#92400E", lineHeight: 19 }}>
                {plan.notes}
              </Text>
            </View>
          </View>
        )}

        {/* Macros summary */}
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>Macros diários</Text>
            <View style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 13, color: "#16A34A" }}>
                {macros.calories.toFixed(0)} kcal
              </Text>
            </View>
          </View>
          <View style={{ gap: 12 }}>
            <MacroBar label="Proteína" value={macros.protein} total={totalMacroG} color="#16A34A" />
            <MacroBar label="Carboidrato" value={macros.carbs} total={totalMacroG} color="#3B82F6" />
            <MacroBar label="Gordura" value={macros.fat} total={totalMacroG} color="#F59E0B" />
          </View>
        </View>

        {/* Meals */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 12 }}>
          Refeições ({plan.meals.length})
        </Text>
        {plan.meals
          .slice()
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
