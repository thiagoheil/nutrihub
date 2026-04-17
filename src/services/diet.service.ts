import { api } from "@/lib/api";
import { DietPlan, MealLog, Food, UserFoodPreference, FoodPreference } from "@/types";

export const dietService = {
  // Diet Plans
  getActivePlan: () =>
    api.get<DietPlan>("/diet-plans/active").then((r) => r.data),

  getPlanById: (id: string) =>
    api.get<DietPlan>(`/diet-plans/${id}`).then((r) => r.data),

  generatePlan: (payload: { goalDescription: string }) =>
    api.post<DietPlan>("/diet-plans/generate", payload).then((r) => r.data),

  // Food preferences (for algorithm)
  getPreferences: () =>
    api.get<UserFoodPreference[]>("/food-preferences").then((r) => r.data),

  upsertPreference: (foodId: string, preference: FoodPreference) =>
    api.put(`/food-preferences/${foodId}`, { preference }).then((r) => r.data),

  // Foods
  searchFoods: (query: string) =>
    api.get<Food[]>("/foods/search", { params: { q: query } }).then((r) => r.data),

  // Meal logs
  logMeal: (payload: { mealId: string; status: MealLog["status"]; notes?: string }) =>
    api.post<MealLog>("/meal-logs", payload).then((r) => r.data),

  getTodayLogs: () =>
    api.get<MealLog[]>("/meal-logs/today").then((r) => r.data),
};
