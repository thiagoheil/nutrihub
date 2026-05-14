import { useState, useMemo } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isToday, isFuture, addMonths, subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useActiveDietPlan, useLogsForDate, useDiaryDates,
  useLogMealForDate, useRemoveLogForDate,
} from "@/hooks/use-diet";
import { useWaterStore } from "@/store/water.store";
import type { Meal, MealLog } from "@/types";

// ─── helpers ──────────────────────────────────────────────────────────────────
const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const CUP_ML = 250;

function dateKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}
function fmtTime(iso: string) {
  return format(new Date(iso), "HH:mm");
}

function mealEmoji(type: string) {
  const map: Record<string, string> = {
    breakfast: "🌅", lunch: "🍽️", dinner: "🌙", snack: "🍎",
  };
  return map[type] ?? "🍴";
}

function mealTotals(meal: Meal) {
  return meal.items.reduce(
    (acc, i) => ({
      cal: acc.cal + i.calories,
      prot: acc.prot + i.proteinG,
      carb: acc.carb + i.carbsG,
      fat: acc.fat + i.fatG,
    }),
    { cal: 0, prot: 0, carb: 0, fat: 0 }
  );
}

// ─── components ───────────────────────────────────────────────────────────────
function MacroChip({ label, value, unit = "g" }: { label: string; value: number; unit?: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 10, backgroundColor: "#F0FDF4", borderRadius: 10 }}>
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#16A34A", marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#111827" }}>
        {Math.round(value)}{unit}
      </Text>
    </View>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function DiaryScreen() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [showLogModal, setShowLogModal] = useState(false);

  const selectedKey = dateKey(selectedDate);
  const isSelectedToday = isToday(selectedDate);

  const { data: plan } = useActiveDietPlan();
  const { data: dayLogs = [], isLoading: logsLoading } = useLogsForDate(selectedKey);
  const { data: diaryDates = [] } = useDiaryDates();
  const logMeal = useLogMealForDate();
  const removeLog = useRemoveLogForDate();
  const { intakeMl, goalMl, addWater, removeWater } = useWaterStore();

  // Calendar days
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const leadingBlanks = Array(getDay(start)).fill(null);
    return [...leadingBlanks, ...days] as (Date | null)[];
  }, [currentMonth]);

  // Days with logs map
  const loggedDatesMap = useMemo(() => {
    const map: Record<string, number> = {};
    diaryDates.forEach(({ date, count }) => { map[date] = count; });
    return map;
  }, [diaryDates]);

  // Calorie & macro computations for selected day
  const goalCalories = useMemo(
    () => plan?.meals.reduce((acc, m) => acc + m.items.reduce((s, i) => s + i.calories, 0), 0) ?? 0,
    [plan]
  );

  const { consumedCal, consumedProt, consumedCarb, consumedFat } = useMemo(() => {
    if (!plan) return { consumedCal: 0, consumedProt: 0, consumedCarb: 0, consumedFat: 0 };
    const eatenMealIds = new Set(dayLogs.filter((l) => l.status !== "skipped").map((l) => l.mealId));
    return plan.meals
      .filter((m) => eatenMealIds.has(m.id))
      .reduce(
        (acc, m) => ({
          consumedCal:  acc.consumedCal  + m.items.reduce((s, i) => s + i.calories, 0),
          consumedProt: acc.consumedProt + m.items.reduce((s, i) => s + i.proteinG, 0),
          consumedCarb: acc.consumedCarb + m.items.reduce((s, i) => s + i.carbsG, 0),
          consumedFat:  acc.consumedFat  + m.items.reduce((s, i) => s + i.fatG, 0),
        }),
        { consumedCal: 0, consumedProt: 0, consumedCarb: 0, consumedFat: 0 }
      );
  }, [plan, dayLogs]);

  const calPct = goalCalories > 0 ? Math.min(consumedCal / goalCalories, 1) : 0;
  const remainingCal = Math.max(goalCalories - consumedCal, 0);

  // Water (today only)
  const totalCups = Math.max(Math.round(goalMl / CUP_ML), 4);
  const filledCups = Math.floor(intakeMl / CUP_ML);
  const waterPct = Math.min(intakeMl / goalMl, 1);

  // Streak: consecutive days with logs going back from yesterday
  const streak = useMemo(() => {
    let count = 0;
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    while (loggedDatesMap[dateKey(d)] != null) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [loggedDatesMap]);

  // Logged meals with plan data
  const loggedMeals: { log: MealLog; meal: Meal }[] = useMemo(() => {
    if (!plan) return [];
    return dayLogs
      .map((log) => ({ log, meal: plan.meals.find((m) => m.id === log.mealId)! }))
      .filter((x) => x.meal != null);
  }, [dayLogs, plan]);

  // Plan meals not yet logged today
  const unloggedMeals: Meal[] = useMemo(() => {
    if (!plan) return [];
    const loggedIds = new Set(dayLogs.map((l) => l.mealId));
    return plan.meals.filter((m) => !loggedIds.has(m.id));
  }, [plan, dayLogs]);

  function handleDeleteLog(log: MealLog) {
    Alert.alert("Remover registro", "Deseja remover este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover", style: "destructive",
        onPress: () => removeLog.mutate({ date: selectedKey, logId: log.id }),
      },
    ]);
  }

  function handleLogMeal(mealId: string) {
    logMeal.mutate({ date: selectedKey, mealId, status: "eaten" }, {
      onSuccess: () => setShowLogModal(false),
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111827" }}>Diário Alimentar</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
              Registre suas refeições e acompanhe seu progresso
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#fff", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: "#E5E7EB" }}>
              <Text style={{ fontSize: 14 }}>⏱</Text>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#111827" }}>{streak} dias</Text>
            </View>
          </View>
        </View>

        {/* ── Calendar ── */}
        <View style={{ marginHorizontal: 20, backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 16 }}>
          {/* Month navigation */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))} activeOpacity={0.7}
              style={{ padding: 6 }}
            >
              <Text style={{ fontSize: 18, color: "#6B7280" }}>‹</Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", textTransform: "capitalize" }}>
              {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
            </Text>
            <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} activeOpacity={0.7}
              style={{ padding: 6 }}
            >
              <Text style={{ fontSize: 18, color: "#6B7280" }}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Week day headers */}
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {WEEK_DAYS.map((d) => (
              <Text key={d} style={{ flex: 1, textAlign: "center", fontFamily: "Inter-Medium", fontSize: 11, color: "#9CA3AF" }}>{d}</Text>
            ))}
          </View>

          {/* Day grid */}
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {calendarDays.map((day, i) => {
              if (!day) return <View key={`blank-${i}`} style={{ width: "14.28%", aspectRatio: 1 }} />;
              const key = dateKey(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const isFutureDate = isFuture(day) && !isTodayDate;
              const hasLogs = loggedDatesMap[key] != null;

              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setSelectedDate(day)}
                  activeOpacity={0.7}
                  disabled={isFutureDate}
                  style={{ width: "14.28%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center",
                    backgroundColor: isSelected ? "#16A34A" : isTodayDate ? "#F0FDF4" : "transparent",
                    borderWidth: isTodayDate && !isSelected ? 1.5 : 0,
                    borderColor: "#16A34A",
                  }}>
                    <Text style={{
                      fontFamily: isSelected || isTodayDate ? "Inter-Bold" : "Inter-Regular",
                      fontSize: 13,
                      color: isSelected ? "#fff" : isFutureDate ? "#D1D5DB" : "#111827",
                    }}>
                      {format(day, "d")}
                    </Text>
                  </View>
                  {hasLogs && !isSelected && (
                    <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: "#16A34A", marginTop: 2 }} />
                  )}
                  {!hasLogs && !isFutureDate && !isSelected && (
                    <View style={{ width: 5, height: 5 }} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={{ flexDirection: "row", gap: 16, marginTop: 12, justifyContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#86EFAC" }} />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6B7280" }}>Registrado</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A" }} />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6B7280" }}>Meta atingida</Text>
            </View>
          </View>
        </View>

        {/* ── Day Content ── */}
        <View style={{ paddingHorizontal: 20 }}>
          {/* Date header + action */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <View>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827" }}>
                {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>
                {dayLogs.length} refeição{dayLogs.length !== 1 ? "ões" : ""} registrada{dayLogs.length !== 1 ? "s" : ""}
              </Text>
            </View>
            {!isFuture(selectedDate) && (
              <TouchableOpacity
                onPress={() => setShowLogModal(true)}
                activeOpacity={0.8}
                style={{ backgroundColor: "#16A34A", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 }}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>+ Registrar</Text>
              </TouchableOpacity>
            )}
          </View>

          {logsLoading ? (
            <ActivityIndicator color="#16A34A" />
          ) : (
            <>
              {/* ── Calorias card ── */}
              <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18 }}>⏱</Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>Calorias Consumidas</Text>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 24, color: "#111827" }}>{Math.round(consumedCal)} kcal</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>{Math.round(consumedCal)}</Text>
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: "#16A34A" }}>● {goalCalories} kcal</Text>
                </View>
                <View style={{ height: 8, borderRadius: 100, backgroundColor: "#F3F4F6" }}>
                  <View style={{ height: 8, borderRadius: 100, backgroundColor: "#16A34A", width: `${Math.round(calPct * 100)}%` }} />
                </View>

                <View style={{ marginTop: 10, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, alignItems: "center" }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280" }}>
                    〰 {remainingCal} kcal restantes
                  </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                  <MacroChip label="Proteína"     value={consumedProt} />
                  <MacroChip label="Carboidratos" value={consumedCarb} />
                  <MacroChip label="Gorduras"     value={consumedFat} />
                </View>
              </View>

              {/* ── Hidratação card (today only) ── */}
              {isSelectedToday && (
                <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 18 }}>💧</Text>
                    </View>
                    <View>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>Hidratação</Text>
                      <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111827" }}>
                        <Text style={{ color: "#3B82F6" }}>{intakeMl}</Text>
                        <Text style={{ fontSize: 14, color: "#6B7280" }}> / {goalMl} ml</Text>
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
                      {filledCups} copo{filledCups !== 1 ? "s" : ""} ({filledCups * CUP_ML}ml)
                    </Text>
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: "#3B82F6" }}>
                      {Math.round(waterPct * 100)}%
                    </Text>
                  </View>
                  <View style={{ height: 8, borderRadius: 100, backgroundColor: "#DBEAFE", marginBottom: 14 }}>
                    <View style={{ height: 8, borderRadius: 100, backgroundColor: "#3B82F6", width: `${Math.round(waterPct * 100)}%` }} />
                  </View>

                  {/* Droplets */}
                  <View style={{ flexDirection: "row", gap: 6, marginBottom: 14 }}>
                    {Array.from({ length: totalCups }).map((_, i) => (
                      <TouchableOpacity key={i} onPress={() => i < filledCups ? removeWater(CUP_ML) : addWater(CUP_ML)} activeOpacity={0.7} style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontSize: 22, opacity: i < filledCups ? 1 : 0.3 }}>💧</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <TouchableOpacity onPress={() => removeWater(CUP_ML)} activeOpacity={0.7}
                      style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#6B7280" }}>− Remover</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => addWater(CUP_ML)} activeOpacity={0.7}
                      style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>+ Adicionar copo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ── Refeições do Dia ── */}
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#111827", marginBottom: 12 }}>
                Refeições do Dia
              </Text>

              {loggedMeals.length === 0 && (
                <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB", borderStyle: "dashed", marginBottom: 12 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                    Nenhuma refeição registrada.{"\n"}
                    {!isFuture(selectedDate) && "Toque em \"+ Registrar\" para adicionar."}
                  </Text>
                </View>
              )}

              {loggedMeals.map(({ log, meal }) => {
                const totals = mealTotals(meal);
                return (
                  <View key={log.id} style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
                    {/* Meal header */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={{ fontSize: 18 }}>{mealEmoji(meal.mealType)}</Text>
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{meal.name}</Text>
                        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                          <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#16A34A" }}>da dieta</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>⏰ {fmtTime(log.loggedAt)}</Text>
                        <TouchableOpacity onPress={() => handleDeleteLog(log)} activeOpacity={0.7}>
                          <Text style={{ fontSize: 16 }}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* Food items */}
                    {meal.items.map((item) => (
                      <Text key={item.id} style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#374151", marginBottom: 2 }}>
                        • {item.food.name} <Text style={{ color: "#9CA3AF" }}>({item.quantity}{item.unit})</Text>
                      </Text>
                    ))}
                    {/* Totals */}
                    <View style={{ flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#16A34A" }}>
                        {Math.round(totals.cal)} kcal
                      </Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>
                        {Math.round(totals.prot)}g P
                      </Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>
                        {Math.round(totals.carb)}g C
                      </Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>
                        {Math.round(totals.fat)}g G
                      </Text>
                    </View>
                    {log.status === "partial" && (
                      <View style={{ marginTop: 8, backgroundColor: "#FFFBEB", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#92400E" }}>Consumida parcialmente</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Log Meal Modal ── */}
      <Modal visible={showLogModal} transparent animationType="slide">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setShowLogModal(false)}
        />
        <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827", marginBottom: 6 }}>Registrar Refeição</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginBottom: 18 }}>
            {format(selectedDate, "d 'de' MMMM", { locale: ptBR })} • selecione o que consumiu
          </Text>

          {unloggedMeals.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#16A34A" }}>
                ✅ Todas as refeições já foram registradas!
              </Text>
            </View>
          ) : (
            unloggedMeals.map((meal) => {
              const totals = mealTotals(meal);
              return (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => handleLogMeal(meal.id)}
                  activeOpacity={0.7}
                  disabled={logMeal.isPending}
                  style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 12, backgroundColor: "#F9FAFB", marginBottom: 10 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text style={{ fontSize: 22 }}>{mealEmoji(meal.mealType)}</Text>
                    <View>
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{meal.name}</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
                        {meal.scheduledTime} · {Math.round(totals.cal)} kcal
                      </Text>
                    </View>
                  </View>
                  <View style={{ backgroundColor: "#16A34A", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 }}>
                    {logMeal.isPending ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#fff" }}>+ Registrar</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
