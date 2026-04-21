/**
 * Calculate BMI from weight (kg) and height (cm)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Returns a human-readable BMI classification in Portuguese
 */
export function bmiLabel(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Abaixo do peso", color: "#3B82F6" };
  if (bmi < 25)   return { label: "Peso normal", color: "#16A34A" };
  if (bmi < 30)   return { label: "Sobrepeso", color: "#F59E0B" };
  return { label: "Obesidade", color: "#EF4444" };
}

/**
 * Sum macros across a meal's items
 */
export function sumMacros(items: Array<{ calories: number; proteinG: number; carbsG: number; fatG: number }>) {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      proteinG: acc.proteinG + item.proteinG,
      carbsG: acc.carbsG + item.carbsG,
      fatG: acc.fatG + item.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
}

/**
 * Map meal type to Portuguese label
 */
export const mealTypeLabel: Record<string, string> = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  dinner: "Jantar",
  snack: "Lanche",
};

import type { Sex, ActivityLevel } from "@/types/profile";
import type { HealthGoal } from "@/types";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Mifflin-St Jeor BMR formula
function calcBMR(weight: number, height: number, age: number, sex: Sex): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function calculateDailyCalories(
  weight: number,
  height: number,
  age: number,
  sex: Sex,
  activity: ActivityLevel,
  goal: HealthGoal
): number {
  const bmr = calcBMR(weight, height, age, sex);
  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
  if (goal === "lose_weight") return Math.round(tdee * 0.8);
  if (goal === "gain_muscle") return Math.round(tdee + 300);
  return Math.round(tdee);
}

// protein: 2.1g/kg (lose) | 1.6g/kg (maintain) | 2.2g/kg (gain)
// fat: 0.8g/kg (lose/maintain) | 1.0g/kg (gain)
// carbs: remaining calories / 4
export function calculateMacros(
  calories: number,
  weightKg: number,
  goal: HealthGoal
): { proteinG: number; fatG: number; carbsG: number } {
  const proteinPerKg = goal === "maintain" ? 1.6 : goal === "gain_muscle" ? 2.2 : 2.1;
  const fatPerKg = goal === "gain_muscle" ? 1.0 : 0.8;
  const proteinG = Math.round(weightKg * proteinPerKg);
  const fatG = Math.round(weightKg * fatPerKg);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));
  return { proteinG, fatG, carbsG };
}
