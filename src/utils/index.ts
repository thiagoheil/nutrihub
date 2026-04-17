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
