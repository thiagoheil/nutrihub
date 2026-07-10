import type { DietPlan, MealLog, Food, UserFoodPreference, FoodPreference } from "@/types";
import { supabase } from "@/lib/supabase";
import { mapDietPlan, mapMealLog, mapFood, mapPreference } from "@/lib/mappers";
import { currentUserId } from "@/lib/session";

const PLAN_SELECT = "*, meals(*, meal_items(*, food:foods(*)))";
const todayStr = () => new Date().toISOString().slice(0, 10);
const adherence = (s: MealLog["status"]) => (s === "eaten" ? 100 : s === "partial" ? 70 : 0);

export const dietService = {
  getActivePlan: async (): Promise<DietPlan | null> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("diet_plans")
      .select(PLAN_SELECT)
      .eq("user_id", uid)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDietPlan(data) : null;
  },

  getPlanById: async (id: string): Promise<DietPlan> => {
    const { data, error } = await supabase.from("diet_plans").select(PLAN_SELECT).eq("id", id).single();
    if (error) throw error;
    return mapDietPlan(data);
  },

  generatePlan: async (payload: {
    goalDescription: string;
    selectedFoods?: Record<string, string[]>;
  }): Promise<DietPlan> => {
    const { data: planId, error } = await supabase.rpc("generate_diet_plan", {
      p_goal: payload.goalDescription,
      p_title: "Plano Personalizado",
    });
    if (error) throw error;
    return dietService.getPlanById(planId as string);
  },

  getPreferences: async (): Promise<UserFoodPreference[]> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("user_food_preferences")
      .select("*, food:foods(*)")
      .eq("user_id", uid);
    if (error) throw error;
    return (data ?? []).map(mapPreference);
  },

  upsertPreference: async (foodId: string, preference: FoodPreference) => {
    const uid = await currentUserId();
    const { error } = await supabase
      .from("user_food_preferences")
      .upsert({ user_id: uid, food_id: foodId, preference }, { onConflict: "user_id,food_id" });
    if (error) throw error;
    return {};
  },

  searchFoods: async (query: string): Promise<Food[]> => {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .ilike("name", `%${query}%`)
      .limit(30);
    if (error) throw error;
    return (data ?? []).map(mapFood);
  },

  logMeal: async (payload: {
    mealId: string;
    status: MealLog["status"];
    notes?: string;
  }): Promise<MealLog> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("meal_logs")
      .insert({
        user_id: uid,
        meal_id: payload.mealId,
        status: payload.status,
        adherence_pct: adherence(payload.status),
        notes: payload.notes ?? null,
        logged_at: new Date().toISOString(),
        log_date: todayStr(),
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapMealLog(data);
  },

  getTodayLogs: async (): Promise<MealLog[]> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", uid)
      .eq("log_date", todayStr())
      .order("logged_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMealLog);
  },

  getLogsForDate: async (date: string): Promise<MealLog[]> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", uid)
      .eq("log_date", date)
      .order("logged_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMealLog);
  },

  logMealForDate: async (
    date: string,
    payload: { mealId: string; status: MealLog["status"]; notes?: string }
  ): Promise<MealLog> => {
    const uid = await currentUserId();
    const time = new Date().toTimeString().slice(0, 8);
    const { data, error } = await supabase
      .from("meal_logs")
      .insert({
        user_id: uid,
        meal_id: payload.mealId,
        status: payload.status,
        adherence_pct: adherence(payload.status),
        notes: payload.notes ?? null,
        logged_at: new Date(`${date}T${time}`).toISOString(),
        log_date: date,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapMealLog(data);
  },

  removeLogForDate: async (_date: string, logId: string): Promise<void> => {
    const { error } = await supabase.from("meal_logs").delete().eq("id", logId);
    if (error) throw error;
  },

  getDiaryDates: async (): Promise<{ date: string; count: number }[]> => {
    const { data, error } = await supabase.rpc("get_diary_dates");
    if (error) throw error;
    return (data ?? []).map((r: { date: string; count: number }) => ({
      date: r.date,
      count: r.count,
    }));
  },
};
