import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { useCreateMetric } from "@/hooks/use-metrics";
import { calculateDailyCalories, calculateMacros } from "@/utils";
import type { HealthGoal } from "@/types";
import type { ActivityLevel, Sex } from "@/types/profile";

const GOALS: { key: HealthGoal; label: string; emoji: string }[] = [
  { key: "lose_weight", label: "Emagrecer", emoji: "🔥" },
  { key: "maintain", label: "Manter Peso", emoji: "⚖️" },
  { key: "gain_muscle", label: "Ganhar Massa", emoji: "💪" },
];

const ACTIVITY_LEVELS: { key: ActivityLevel; label: string; sub: string }[] = [
  { key: "sedentary", label: "Sedentário", sub: "Pouco ou nenhum exercício" },
  { key: "light", label: "Leve", sub: "Exercício 1-3 dias/semana" },
  { key: "moderate", label: "Moderado", sub: "Exercício 3-5 dias/semana" },
  { key: "active", label: "Ativo", sub: "Exercício 6-7 dias/semana" },
  { key: "very_active", label: "Muito Ativo", sub: "Exercício intenso diário" },
];

const MEAL_LABELS: { key: keyof ReturnType<typeof defaultMealTimes>; label: string }[] = [
  { key: "breakfast", label: "Café" },
  { key: "morningSnack", label: "L. Manhã" },
  { key: "lunch", label: "Almoço" },
  { key: "afternoonSnack", label: "L. Tarde" },
  { key: "dinner", label: "Jantar" },
];

function defaultMealTimes() {
  return {
    breakfast: "07:00",
    morningSnack: "09:30",
    lunch: "12:00",
    afternoonSnack: "15:00",
    dinner: "19:00",
  };
}

export default function SetupProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { profile, setProfile } = useProfileStore();
  const { mutate: createMetric, isPending } = useCreateMetric();

  const [weight, setWeight] = useState(String(profile.weightKg));
  const [height, setHeight] = useState(String(profile.heightCm));
  const [age, setAge] = useState(String(profile.age));
  const [sex, setSex] = useState<Sex>(profile.sex);
  const [goal, setGoal] = useState<HealthGoal>(profile.goal);
  const [activity, setActivity] = useState<ActivityLevel>(profile.activityLevel);
  const [calMode, setCalMode] = useState<"auto" | "manual">(profile.dailyCaloriesMode);
  const [manualCal, setManualCal] = useState(String(profile.dailyCaloriesManual));
  const [mealTimes, setMealTimes] = useState(profile.mealTimes);

  const weightNum = parseFloat(weight) || 0;
  const heightNum = parseFloat(height) || 0;
  const ageNum = parseInt(age) || 0;

  const autoCal = useMemo(() => {
    if (!weightNum || !heightNum || !ageNum) return 0;
    return calculateDailyCalories(weightNum, heightNum, ageNum, sex, activity, goal);
  }, [weightNum, heightNum, ageNum, sex, activity, goal]);

  const displayCal = calMode === "auto" ? autoCal : (parseInt(manualCal) || 0);

  const macros = useMemo(
    () => calculateMacros(displayCal, weightNum, goal),
    [displayCal, weightNum, goal]
  );

  function updateMealTime(key: keyof typeof mealTimes, value: string) {
    setMealTimes((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!weightNum || !heightNum || !ageNum) return;

    createMetric(
      {
        measuredAt: new Date().toISOString(),
        weightKg: weightNum,
        heightCm: heightNum,
        goal,
      },
      {
        onSuccess: () => {
          setProfile({
            weightKg: weightNum,
            heightCm: heightNum,
            age: ageNum,
            sex,
            goal,
            activityLevel: activity,
            dailyCaloriesMode: calMode,
            dailyCaloriesManual: parseInt(manualCal) || 2000,
            mealTimes,
          });
          router.push("/(app)/(tabs)/diet");
        },
      }
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.greeting}>
            Olá, {user?.name?.split(" ")[0]}! 👋
          </Text>
          <Text style={styles.subtitle}>
            Vamos configurar sua dieta personalizada
          </Text>

          {/* Medidas Corporais */}
          <Card>
            <SectionHeader icon="body-outline" title="Medidas Corporais" />
            <View style={styles.row}>
              <View style={styles.halfCol}>
                <FieldLabel>Peso (kg)</FieldLabel>
                <InputBox
                  icon="scale-outline"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                />
              </View>
              <View style={styles.halfCol}>
                <FieldLabel>Altura (cm)</FieldLabel>
                <InputBox
                  icon="resize-outline"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
            <View style={[styles.row, { marginTop: 12 }]}>
              <View style={styles.halfCol}>
                <FieldLabel>Idade</FieldLabel>
                <InputBox
                  icon="calendar-outline"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.halfCol}>
                <FieldLabel>Sexo</FieldLabel>
                <View style={styles.sexToggle}>
                  <TouchableOpacity
                    style={[styles.sexBtn, sex === "male" && styles.sexBtnActive]}
                    onPress={() => setSex("male")}
                  >
                    <Text style={[styles.sexBtnText, sex === "male" && styles.sexBtnTextActive]}>
                      Masculino
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sexBtn, sex === "female" && styles.sexBtnActive]}
                    onPress={() => setSex("female")}
                  >
                    <Text style={[styles.sexBtnText, sex === "female" && styles.sexBtnTextActive]}>
                      Feminino
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>

          {/* Objetivo */}
          <Card>
            <SectionHeader icon="flag-outline" title="Objetivo" />
            <View style={styles.row}>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g.key}
                  style={[styles.goalCard, goal === g.key && styles.goalCardActive]}
                  onPress={() => setGoal(g.key)}
                >
                  <Text style={styles.goalEmoji}>{g.emoji}</Text>
                  <Text style={[styles.goalLabel, goal === g.key && styles.goalLabelActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Nível de Atividade */}
          <Card>
            <SectionHeader icon="pulse-outline" title="Nível de Atividade" />
            {ACTIVITY_LEVELS.map((a, i) => (
              <TouchableOpacity
                key={a.key}
                style={[
                  styles.activityItem,
                  i < ACTIVITY_LEVELS.length - 1 && styles.activityItemBorder,
                  activity === a.key && styles.activityItemActive,
                ]}
                onPress={() => setActivity(a.key)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityLabel}>{a.label}</Text>
                  <Text style={styles.activitySub}>{a.sub}</Text>
                </View>
                <View style={[styles.radio, activity === a.key && styles.radioActive]}>
                  {activity === a.key && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
          </Card>

          {/* Calorias Diárias */}
          <Card>
            <SectionHeader icon="flame-outline" title="Calorias Diárias" />
            <View style={styles.calToggleRow}>
              <TouchableOpacity
                style={[styles.calToggleBtn, calMode === "auto" && styles.calToggleBtnActive]}
                onPress={() => setCalMode("auto")}
              >
                <Text style={[styles.calToggleText, calMode === "auto" && styles.calToggleTextActive]}>
                  Automático
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calToggleBtn, calMode === "manual" && styles.calToggleBtnActive]}
                onPress={() => setCalMode("manual")}
              >
                <Text style={[styles.calToggleText, calMode === "manual" && styles.calToggleTextActive]}>
                  Manual
                </Text>
              </TouchableOpacity>
            </View>

            {calMode === "manual" && (
              <TextInput
                style={styles.manualCalInput}
                value={manualCal}
                onChangeText={setManualCal}
                keyboardType="number-pad"
                placeholder="Ex: 2000"
                placeholderTextColor="#9CA3AF"
              />
            )}

            <View style={styles.calCard}>
              <Text style={styles.calCardTitle}>Calorias recomendadas</Text>
              <Text style={styles.calCardValue}>{displayCal > 0 ? `${displayCal} kcal` : "—"}</Text>
              <Text style={styles.calCardSub}>Baseado nas suas medidas e objetivo</Text>
              {displayCal > 0 && (
                <View style={styles.macrosRow}>
                  <MacroItem value={macros.proteinG} label="Proteínas" color="#16A34A" />
                  <MacroItem value={macros.carbsG} label="Carboidratos" color="#F59E0B" />
                  <MacroItem value={macros.fatG} label="Gorduras" color="#F97316" />
                </View>
              )}
            </View>
          </Card>

          {/* Horários das Refeições */}
          <Card>
            <SectionHeader icon="time-outline" title="Horários das Refeições" />
            <View style={styles.mealTimesRow}>
              {MEAL_LABELS.map((m) => (
                <View key={m.key} style={styles.mealTimeCol}>
                  <Text style={styles.mealTimeLabel}>{m.label}</Text>
                  <View style={styles.mealTimeInput}>
                    <TextInput
                      style={styles.mealTimeText}
                      value={mealTimes[m.key]}
                      onChangeText={(v) => updateMealTime(m.key, v)}
                      keyboardType="numbers-and-punctuation"
                      maxLength={5}
                    />
                    <Ionicons name="time-outline" size={12} color="#9CA3AF" />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          {/* Save button */}
          <TouchableOpacity
            style={[styles.saveBtn, (!weightNum || !heightNum || !ageNum || isPending) && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!weightNum || !heightNum || !ageNum || isPending}
          >
            <Text style={styles.saveBtnText}>
              {isPending ? "Salvando..." : "Continuar para montar dieta →"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

function SectionHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon} size={18} color="#16A34A" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

function InputBox({
  icon,
  value,
  onChangeText,
  keyboardType,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: "decimal-pad" | "number-pad";
}) {
  return (
    <View style={styles.inputBox}>
      <Ionicons name={icon} size={16} color="#9CA3AF" style={{ marginRight: 6 }} />
      <TextInput
        style={styles.inputText}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#D1D5DB"
      />
    </View>
  );
}

function MacroItem({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={styles.macroItem}>
      <Text style={[styles.macroValue, { color }]}>{value}g</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scroll: { padding: 20, paddingBottom: 40 },
  backBtn: { marginBottom: 16 },
  greeting: { fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 24 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter-SemiBold", color: "#111827" },

  row: { flexDirection: "row", gap: 12 },
  halfCol: { flex: 1 },
  fieldLabel: { fontSize: 13, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 6 },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
  },
  inputText: {
    flex: 1,
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#111827",
  },

  sexToggle: { flexDirection: "row", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, overflow: "hidden" },
  sexBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: "#FAFAFA" },
  sexBtnActive: { backgroundColor: "#16A34A" },
  sexBtnText: { fontSize: 13, fontFamily: "Inter-Medium", color: "#6B7280" },
  sexBtnTextActive: { color: "#fff" },

  goalCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FAFAFA",
  },
  goalCardActive: { borderColor: "#16A34A", backgroundColor: "#F0FDF4" },
  goalEmoji: { fontSize: 22 },
  goalLabel: { fontSize: 12, fontFamily: "Inter-Medium", color: "#6B7280", textAlign: "center" },
  goalLabelActive: { color: "#16A34A" },

  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  activityItemBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  activityItemActive: {},
  activityLabel: { fontSize: 15, fontFamily: "Inter-Medium", color: "#111827" },
  activitySub: { fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#16A34A" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#16A34A" },

  calToggleRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  calToggleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  calToggleBtnActive: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  calToggleText: { fontSize: 14, fontFamily: "Inter-Medium", color: "#6B7280" },
  calToggleTextActive: { color: "#fff" },

  manualCalInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#111827",
    marginBottom: 14,
  },

  calCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  calCardTitle: { fontSize: 13, fontFamily: "Inter-Regular", color: "#6B7280" },
  calCardValue: { fontSize: 28, fontFamily: "Inter-Bold", color: "#16A34A", marginVertical: 4 },
  calCardSub: { fontSize: 12, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 12 },

  macrosRow: { flexDirection: "row", width: "100%", justifyContent: "space-around" },
  macroItem: { alignItems: "center" },
  macroValue: { fontSize: 16, fontFamily: "Inter-Bold" },
  macroLabel: { fontSize: 11, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 },

  mealTimesRow: { flexDirection: "row", gap: 6 },
  mealTimeCol: { flex: 1, alignItems: "center" },
  mealTimeLabel: { fontSize: 11, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 6, textAlign: "center" },
  mealTimeInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
    gap: 2,
  },
  mealTimeText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#111827",
    flex: 1,
    textAlign: "center",
    padding: 0,
  },

  saveBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnDisabled: { backgroundColor: "#86EFAC" },
  saveBtnText: { color: "#fff", fontFamily: "Inter-SemiBold", fontSize: 16 },
});
