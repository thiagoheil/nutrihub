import type { HealthGoal } from "./metrics";

export type Sex = "male" | "female";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

export interface MealTimes {
  breakfast: string;
  morningSnack: string;
  lunch: string;
  afternoonSnack: string;
  dinner: string;
}

export interface UserProfile {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  goal: HealthGoal;
  activityLevel: ActivityLevel;
  dailyCaloriesMode: "auto" | "manual";
  dailyCaloriesManual: number;
  mealTimes: MealTimes;
}
