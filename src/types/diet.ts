export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
export type DietPlanStatus = "draft" | "active" | "completed";
export type DietPlanSource = "algorithm" | "nutritionist" | "manual";
export type MealLogStatus = "eaten" | "skipped" | "partial";
export type FoodPreference = "liked" | "disliked" | "allergic" | "intolerant";

export interface Food {
  id: string;
  name: string;
  brand?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isCustom: boolean;
}

export interface MealItem {
  id: string;
  food: Food;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export interface Meal {
  id: string;
  name: string;
  mealType: MealType;
  scheduledTime: string;
  orderIndex: number;
  items: MealItem[];
}

export interface DietPlan {
  id: string;
  userId: string;
  nutritionistId?: string;
  source: DietPlanSource;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: DietPlanStatus;
  notes?: string;
  meals: Meal[];
  createdAt: string;
}

export interface UserFoodPreference {
  id: string;
  foodId: string;
  food: Food;
  preference: FoodPreference;
}

export interface MealLog {
  id: string;
  mealId: string;
  loggedAt: string;
  status: MealLogStatus;
  adherencePct: number;
  notes?: string;
  photoUri?: string;
}
