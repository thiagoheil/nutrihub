import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGenerateDietPlan } from "@/hooks/use-diet";
import { useProfileStore } from "@/store/profile.store";
import { calculateDailyCalories, calculateMacros } from "@/utils";
import { MEAL_FOOD_OPTIONS, type MealFoodConfig, type FoodOption } from "@/mocks/food-options";

const H_PAD = 20;
const CARD_GAP = 8;

type Selections = Record<string, Set<string>>;

const EMPTY_SELECTIONS: Selections = Object.fromEntries(
  MEAL_FOOD_OPTIONS.map((m) => [m.key, new Set<string>()])
);

export default function BuildDietScreen() {
  const { profile } = useProfileStore();
  const { mutate: generatePlan, isPending } = useGenerateDietPlan();

  const [selections, setSelections] = useState<Selections>(EMPTY_SELECTIONS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["breakfast"]));

  const dailyCalories = calculateDailyCalories(
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.sex,
    profile.activityLevel,
    profile.goal
  );
  const macros = calculateMacros(dailyCalories, profile.weightKg, profile.goal);

  const toggleExpand = useCallback((key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const toggleFood = useCallback((mealKey: string, foodId: string) => {
    setSelections((prev) => {
      const current = new Set(prev[mealKey]);
      current.has(foodId) ? current.delete(foodId) : current.add(foodId);
      return { ...prev, [mealKey]: current };
    });
  }, []);

  const mealsWithSelections = MEAL_FOOD_OPTIONS.filter(
    (m) => selections[m.key].size > 0
  ).length;
  const allMealsSelected = mealsWithSelections === MEAL_FOOD_OPTIONS.length;

  function handleGenerate() {
    const selectedFoods: Record<string, string[]> = {};
    for (const meal of MEAL_FOOD_OPTIONS) {
      const ids = Array.from(selections[meal.key]);
      const names = ids.map(
        (id) =>
          meal.categories.flatMap((c) => c.foods).find((f) => f.id === id)?.name ?? id
      );
      selectedFoods[meal.key] = names;
    }

    generatePlan(
      {
        goalDescription: `Meta: ${dailyCalories} kcal/dia. Objetivo: ${profile.goal}.`,
        selectedFoods,
      },
      { onSuccess: () => router.replace("/(app)/(tabs)/diet") }
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#374151" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Montar Dieta</Text>
            <Text style={styles.meta}>
              Meta:{" "}
              <Text style={styles.metaHighlight}>{dailyCalories} kcal</Text>
              {" · "}
              <Text style={{ color: "#6B7280" }}>
                Proteínas {macros.proteinG}g · Carbs {macros.carbsG}g · Gordura {macros.fatG}g
              </Text>
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoIcon}>✨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Selecione os alimentos que você gosta</Text>
              <Text style={styles.infoText}>
                Marque os itens que gosta em cada refeição. O sistema vai montar sua dieta
                automaticamente com as gramagens adequadas para o seu alvo calórico.
              </Text>
            </View>
          </View>

          {/* Meal sections */}
          {MEAL_FOOD_OPTIONS.map((meal) => (
            <MealSection
              key={meal.key}
              meal={meal}
              isExpanded={expanded.has(meal.key)}
              selectedIds={selections[meal.key]}
              onToggleExpand={() => toggleExpand(meal.key)}
              onToggleFood={(foodId) => toggleFood(meal.key, foodId)}
            />
          ))}
        </ScrollView>

        {/* Sticky bottom button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.generateBtn, (!allMealsSelected || isPending) && styles.generateBtnDisabled]}
            onPress={handleGenerate}
            disabled={!allMealsSelected || isPending}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateBtnText}>
                {allMealsSelected
                  ? "Gerar minha dieta →"
                  : `Selecione alimentos em todas as refeições (${mealsWithSelections}/${MEAL_FOOD_OPTIONS.length})`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function MealSection({
  meal,
  isExpanded,
  selectedIds,
  onToggleExpand,
  onToggleFood,
}: {
  meal: MealFoodConfig;
  isExpanded: boolean;
  selectedIds: Set<string>;
  onToggleExpand: () => void;
  onToggleFood: (foodId: string) => void;
}) {
  const count = selectedIds.size;

  return (
    <View style={mealStyles.container}>
      {/* Accordion header */}
      <TouchableOpacity style={mealStyles.header} onPress={onToggleExpand} activeOpacity={0.7}>
        <Text style={mealStyles.emoji}>{meal.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={mealStyles.name}>{meal.name}</Text>
          <Text style={[mealStyles.count, count > 0 && mealStyles.countActive]}>
            {count === 0 ? "Nenhum selecionado" : `${count} selecionado${count > 1 ? "s" : ""}`}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {/* Expanded content */}
      {isExpanded && (
        <View style={mealStyles.content}>
          <Text style={mealStyles.instruction}>
            Selecione os alimentos que você gosta para o seu{" "}
            <Text style={{ fontFamily: "Inter-SemiBold" }}>{meal.name.toLowerCase()}</Text>.
          </Text>

          {meal.categories.map((cat) => (
            <View key={cat.label} style={mealStyles.category}>
              <View style={mealStyles.categoryHeader}>
                <Text style={mealStyles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={mealStyles.categoryLabel}>{cat.label}</Text>
              </View>
              <FoodGrid
                foods={cat.foods}
                selectedIds={selectedIds}
                onToggleFood={onToggleFood}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function FoodGrid({
  foods,
  selectedIds,
  onToggleFood,
}: {
  foods: FoodOption[];
  selectedIds: Set<string>;
  onToggleFood: (id: string) => void;
}) {
  const [gridWidth, setGridWidth] = useState(0);
  const cardSize = gridWidth > 0 ? (gridWidth - CARD_GAP * 2) / 3 : 0;

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: CARD_GAP }}
      onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
    >
      {gridWidth > 0 &&
        foods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            size={cardSize}
            selected={selectedIds.has(food.id)}
            onPress={() => onToggleFood(food.id)}
          />
        ))}
    </View>
  );
}

function FoodCard({
  food,
  size,
  selected,
  onPress,
}: {
  food: FoodOption;
  size: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[foodStyles.card, { width: size, height: size }, selected && foodStyles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={foodStyles.infoIcon}>
        <Ionicons name="information-circle-outline" size={12} color="#D1D5DB" />
      </View>
      <Text style={foodStyles.emoji}>{food.emoji}</Text>
      <Text style={foodStyles.name} numberOfLines={2}>
        {food.name}
      </Text>
      {selected && (
        <View style={foodStyles.checkBadge}>
          <Ionicons name="checkmark" size={10} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: H_PAD,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: { paddingTop: 2 },
  title: { fontSize: 20, fontFamily: "Inter-Bold", color: "#111827" },
  meta: { fontSize: 12, fontFamily: "Inter-Regular", color: "#6B7280", marginTop: 2, flexWrap: "wrap" },
  metaHighlight: { color: "#16A34A", fontFamily: "Inter-SemiBold" },
  scroll: { padding: H_PAD, paddingBottom: 12, gap: 12 },

  infoBanner: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  infoIcon: { fontSize: 18 },
  infoTitle: { fontSize: 14, fontFamily: "Inter-SemiBold", color: "#15803D", marginBottom: 4 },
  infoText: { fontSize: 12, fontFamily: "Inter-Regular", color: "#166534", lineHeight: 18 },

  footer: {
    padding: H_PAD,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  generateBtn: {
    backgroundColor: "#16A34A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  generateBtnDisabled: { backgroundColor: "#86EFAC" },
  generateBtnText: { color: "#fff", fontFamily: "Inter-SemiBold", fontSize: 15 },
});

const mealStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },
  emoji: { fontSize: 22 },
  name: { fontSize: 15, fontFamily: "Inter-SemiBold", color: "#111827" },
  count: { fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 1 },
  countActive: { color: "#16A34A", fontFamily: "Inter-Medium" },

  content: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  instruction: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 4,
  },
  category: { marginTop: 14 },
  categoryHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: {
    fontSize: 11,
    fontFamily: "Inter-SemiBold",
    color: "#6B7280",
    letterSpacing: 0.8,
  },
});

const foodStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    position: "relative",
  },
  cardSelected: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },
  infoIcon: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  emoji: { fontSize: 26, marginBottom: 4 },
  name: {
    fontSize: 10,
    fontFamily: "Inter-Regular",
    color: "#374151",
    textAlign: "center",
    lineHeight: 13,
  },
  checkBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
});
