import type { DietPlan, MealLog, Food, UserFoodPreference, FoodPreference } from "@/types";
import { SEED_DIET_PLAN } from "@/mocks/data";
import { mockStore } from "@/mocks/store";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

export const dietService = {
  getActivePlan: async (): Promise<DietPlan | null> => {
    await delay();
    return mockStore.getActivePlan();
  },

  getPlanById: async (_id: string): Promise<DietPlan> => {
    await delay();
    return SEED_DIET_PLAN;
  },

  generatePlan: async (payload: {
    goalDescription: string;
    selectedFoods?: Record<string, string[]>;
  }): Promise<DietPlan> => {
    await delay(1200);
    if (payload.selectedFoods) {
      mockStore.setPendingFoodSelections(payload.selectedFoods);
    }
    const plan = SEED_DIET_PLAN;
    mockStore.setActivePlan(plan);
    return plan;
  },

  getPreferences: async (): Promise<UserFoodPreference[]> => {
    await delay();
    return [];
  },

  upsertPreference: async (_foodId: string, _preference: FoodPreference) => {
    await delay();
    return {};
  },

  searchFoods: async (query: string): Promise<Food[]> => {
    await delay(300);
    const allFoods = SEED_DIET_PLAN.meals.flatMap((m) => m.items.map((i) => i.food));
    const q = query.toLowerCase();
    return allFoods.filter((f) => f.name.toLowerCase().includes(q));
  },

  logMeal: async (payload: {
    mealId: string;
    status: MealLog["status"];
    notes?: string;
  }): Promise<MealLog> => {
    await delay();
    const log: MealLog = {
      id: `log_${Date.now()}`,
      mealId: payload.mealId,
      loggedAt: new Date().toISOString(),
      status: payload.status,
      adherencePct: payload.status === "eaten" ? 100 : payload.status === "partial" ? 70 : 0,
      notes: payload.notes,
    };
    mockStore.addLog(log);
    return log;
  },

  getTodayLogs: async (): Promise<MealLog[]> => {
    await delay();
    return mockStore.getTodayLogs();
  },

  getLogsForDate: async (date: string): Promise<MealLog[]> => {
    await delay(200);
    return mockStore.getLogsForDate(date);
  },

  logMealForDate: async (date: string, payload: { mealId: string; status: MealLog["status"]; notes?: string }): Promise<MealLog> => {
    await delay();
    const log: MealLog = {
      id: `log_${Date.now()}`,
      mealId: payload.mealId,
      loggedAt: new Date(`${date}T${new Date().toTimeString().slice(0, 8)}`).toISOString(),
      status: payload.status,
      adherencePct: payload.status === "eaten" ? 100 : payload.status === "partial" ? 70 : 0,
      notes: payload.notes,
    };
    mockStore.addLogForDate(date, log);
    return log;
  },

  removeLogForDate: async (date: string, logId: string): Promise<void> => {
    await delay(200);
    mockStore.removeLogForDate(date, logId);
  },

  getDiaryDates: async (): Promise<{ date: string; count: number }[]> => {
    await delay(200);
    return mockStore.getDiaryDates();
  },
};
