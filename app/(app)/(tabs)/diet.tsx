import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useActiveDietPlan, useTodayLogs, useLogMeal } from "@/hooks/use-diet";
import type { Meal } from "@/types";

export default function DietScreen() {
  const { data: plan, isLoading } = useActiveDietPlan();

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#16A34A" size="large" />
      </SafeAreaView>
    );
  }

  if (!plan) {
    return <Redirect href="/(app)/build-diet" />;
  }

  return <ActiveDietView />;
}

function ActiveDietView() {
  const { data: plan } = useActiveDietPlan();
  const { data: logs } = useTodayLogs();
  const { mutate: logMeal } = useLogMeal();

  if (!plan) return null;

  const loggedIds = new Set(logs?.map((l) => l.mealId) ?? []);
  const eatenCount = logs?.filter((l) => l.status === "eaten").length ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>
              Minha Dieta
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter-Regular", color: "#6B7280", marginTop: 2 }}>
              {plan.title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/build-diet")}
            style={{ backgroundColor: "#F3F4F6", borderRadius: 8, padding: 8 }}
          >
            <Ionicons name="refresh-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginTop: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>
              Progresso de hoje
            </Text>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#16A34A" }}>
              {eatenCount}/{plan.meals.length} refeições
            </Text>
          </View>
          <View style={{ backgroundColor: "#F3F4F6", borderRadius: 100, height: 8 }}>
            <View
              style={{
                backgroundColor: "#16A34A",
                borderRadius: 100,
                height: 8,
                width: `${(eatenCount / plan.meals.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Meal list */}
        <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: "#111827", marginBottom: 12 }}>
          Refeições do dia
        </Text>
        {plan.meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            logged={loggedIds.has(meal.id)}
            onLog={() => logMeal({ mealId: meal.id, status: "eaten" })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function MealCard({
  meal,
  logged,
  onLog,
}: {
  meal: Meal;
  logged: boolean;
  onLog: () => void;
}) {
  const totalCal = meal.items.reduce((sum, i) => sum + i.calories, 0);
  const totalProt = meal.items.reduce((sum, i) => sum + i.proteinG, 0);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: logged ? "#16A34A" : "#E5E7EB",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>
            {meal.name}
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
            {meal.scheduledTime} · {Math.round(totalCal)} kcal · {Math.round(totalProt)}g prot
          </Text>
        </View>
        {logged ? (
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
            <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: "#16A34A" }}>Feito</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onLog}
            style={{ backgroundColor: "#16A34A", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}
          >
            <Text style={{ fontSize: 12, fontFamily: "Inter-Medium", color: "#fff" }}>Marcar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Food items */}
      {meal.items.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4, borderTopWidth: 1, borderTopColor: "#F9FAFB" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#374151" }}>
              {item.food.name}
            </Text>
          </View>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
            {item.quantity}{item.unit}
          </Text>
        </View>
      ))}
    </View>
  );
}
