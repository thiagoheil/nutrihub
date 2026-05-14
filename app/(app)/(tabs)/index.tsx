import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";
import { useActiveDietPlan, useTodayLogs } from "@/hooks/use-diet";
import { useLatestMetric } from "@/hooks/use-metrics";
import { useWaterStore } from "@/store/water.store";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: plan, isLoading: planLoading } = useActiveDietPlan();
  const { data: logs } = useTodayLogs();
  const { data: metric } = useLatestMetric();
  const { intakeMl, goalMl, addWater, removeWater, setGoal } = useWaterStore();

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const eatenCount = logs?.filter((l) => l.status === "eaten").length ?? 0;
  const totalMeals = plan?.meals.length ?? 0;

  // Set goal based on weight (35ml/kg) when metric loads
  useEffect(() => {
    if (metric?.weightKg) {
      setGoal(Math.round(metric.weightKg * 35));
    }
  }, [metric?.weightKg]);

  const [customMl, setCustomMl] = useState("");
  const [cardWidth, setCardWidth] = useState(0);

  const waterPct = Math.min(intakeMl / goalMl, 1);
  const fillWidth = cardWidth * waterPct;

  function handleAddCustom() {
    const value = parseInt(customMl, 10);
    if (!isNaN(value) && value > 0) {
      addWater(value);
      setCustomMl("");
      Keyboard.dismiss();
    }
  }

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
          {totalMeals > 0 ? (
            <>
              <Text style={{ color: "#D1FAE5", fontFamily: "Inter-Medium", fontSize: 13 }}>Progresso de hoje</Text>
              <Text style={{ color: "#fff", fontFamily: "Inter-Bold", fontSize: 28, marginTop: 4 }}>
                {eatenCount}/{totalMeals}
              </Text>
              <Text style={{ color: "#D1FAE5", fontFamily: "Inter-Regular", fontSize: 13 }}>refeições realizadas</Text>
              <View style={{ marginTop: 14, backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 100, height: 6 }}>
                <View style={{ backgroundColor: "#fff", borderRadius: 100, height: 6, width: `${(eatenCount / totalMeals) * 100}%` }} />
              </View>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/(app)/build-diet")}
              activeOpacity={0.85}
              style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="nutrition-outline" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontFamily: "Inter-Bold", fontSize: 16 }}>Crie seu plano de dieta</Text>
                <Text style={{ color: "#D1FAE5", fontFamily: "Inter-Regular", fontSize: 13, marginTop: 2 }}>
                  Comece agora para acompanhar seu progresso
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
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

        {/* Diary shortcut */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/(tabs)/diary")}
          activeOpacity={0.75}
          style={{
            backgroundColor: "#fff", borderRadius: 14, padding: 16,
            marginTop: 16, marginBottom: 20,
            shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
            flexDirection: "row", alignItems: "center", gap: 14,
            borderLeftWidth: 3, borderLeftColor: "#16A34A",
          }}
        >
          <View style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="calendar" size={22} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>Diário de hoje</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 2, textTransform: "capitalize" }}>
              {today} · {eatenCount}/{totalMeals} refeições
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#16A34A" }}>Abrir</Text>
            <Ionicons name="chevron-forward" size={16} color="#16A34A" />
          </View>
        </TouchableOpacity>

        {/* Water Tracker */}
        <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: "#111827", marginBottom: 12 }}>
          Hidratação
        </Text>
        <View
          onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
          style={{ borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 }}
        >
          {/* Static background */}
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#EFF6FF" }} />
          {/* Blue fill */}
          <View style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: fillWidth, backgroundColor: "#3B82F6" }} />

          {/* Base layer — dark text, fully interactive */}
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#2563EB" }}>💧 Água</Text>
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#1E3A5F", marginTop: 2 }}>
                  {(intakeMl / 1000).toFixed(2).replace(".", ",")}L
                </Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                  de {(goalMl / 1000).toFixed(2).replace(".", ",")}L · {Math.round(waterPct * 100)}%
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => removeWater(250)}
                activeOpacity={0.7}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(37,99,235,0.12)", alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontSize: 18, color: "#2563EB", lineHeight: 22 }}>−</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              {[250, 500, 750].map((ml) => (
                <TouchableOpacity
                  key={ml}
                  onPress={() => addWater(ml)}
                  activeOpacity={0.7}
                  style={{ flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: "center", backgroundColor: "rgba(37,99,235,0.12)" }}
                >
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#2563EB" }}>+{ml}ml</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <TextInput
                value={customMl}
                onChangeText={setCustomMl}
                keyboardType="number-pad"
                placeholder="Quantidade em ml..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
                onSubmitEditing={handleAddCustom}
                style={{ flex: 1, height: 40, borderRadius: 20, paddingHorizontal: 14, fontFamily: "Inter-Regular", fontSize: 13, color: "#111827", backgroundColor: "rgba(37,99,235,0.12)" }}
              />
              <TouchableOpacity
                onPress={handleAddCustom}
                activeOpacity={0.7}
                style={{ height: 40, paddingHorizontal: 18, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#2563EB" }}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* White overlay — clipped to fill width, non-interactive */}
          {cardWidth > 0 && (
            <View
              pointerEvents="none"
              style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: fillWidth, overflow: "hidden" }}
            >
              <View style={{ width: cardWidth, padding: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <View>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#BFDBFE" }}>💧 Água</Text>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 28, color: "#fff", marginTop: 2 }}>
                      {(intakeMl / 1000).toFixed(2).replace(".", ",")}L
                    </Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                      de {(goalMl / 1000).toFixed(2).replace(".", ",")}L · {Math.round(waterPct * 100)}%
                    </Text>
                  </View>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, color: "#fff", lineHeight: 22 }}>−</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
                  {[250, 500, 750].map((ml) => (
                    <View key={ml} style={{ flex: 1, paddingVertical: 8, borderRadius: 20, alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)" }}>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#fff" }}>+{ml}ml</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
                  <View style={{ flex: 1, height: 40, borderRadius: 20, paddingHorizontal: 14, justifyContent: "center", backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: customMl ? "#fff" : "rgba(255,255,255,0.5)" }}>
                      {customMl || "Quantidade em ml..."}
                    </Text>
                  </View>
                  <View style={{ height: 40, paddingHorizontal: 18, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.25)" }}>
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>Adicionar</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
