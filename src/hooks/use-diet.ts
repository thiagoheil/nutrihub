import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dietService } from "@/services/diet.service";
import { MealLog } from "@/types";

export const dietKeys = {
  all: ["diet"] as const,
  activePlan: () => [...dietKeys.all, "active-plan"] as const,
  todayLogs: () => [...dietKeys.all, "logs", "today"] as const,
  preferences: () => [...dietKeys.all, "preferences"] as const,
  foods: (q: string) => [...dietKeys.all, "foods", q] as const,
};

export function useActiveDietPlan() {
  return useQuery({
    queryKey: dietKeys.activePlan(),
    queryFn: dietService.getActivePlan,
  });
}

export function useTodayLogs() {
  return useQuery({
    queryKey: dietKeys.todayLogs(),
    queryFn: dietService.getTodayLogs,
  });
}

export function useFoodPreferences() {
  return useQuery({
    queryKey: dietKeys.preferences(),
    queryFn: dietService.getPreferences,
  });
}

export function useSearchFoods(query: string) {
  return useQuery({
    queryKey: dietKeys.foods(query),
    queryFn: () => dietService.searchFoods(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { mealId: string; status: MealLog["status"]; notes?: string }) =>
      dietService.logMeal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dietKeys.todayLogs() });
    },
  });
}

export function useLogsForDate(date: string) {
  return useQuery({
    queryKey: ["diet", "logs", date],
    queryFn: () => dietService.getLogsForDate(date),
  });
}

export function useDiaryDates() {
  return useQuery({
    queryKey: ["diet", "diary-dates"],
    queryFn: dietService.getDiaryDates,
  });
}

export function useLogMealForDate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, ...payload }: { date: string; mealId: string; status: MealLog["status"] }) =>
      dietService.logMealForDate(date, payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["diet", "logs", vars.date] });
      qc.invalidateQueries({ queryKey: ["diet", "diary-dates"] });
      qc.invalidateQueries({ queryKey: dietKeys.todayLogs() });
    },
  });
}

export function useRemoveLogForDate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ date, logId }: { date: string; logId: string }) =>
      dietService.removeLogForDate(date, logId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["diet", "logs", vars.date] });
      qc.invalidateQueries({ queryKey: ["diet", "diary-dates"] });
      qc.invalidateQueries({ queryKey: dietKeys.todayLogs() });
    },
  });
}

export function useGenerateDietPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { goalDescription: string; selectedFoods?: Record<string, string[]> }) =>
      dietService.generatePlan(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: dietKeys.activePlan() });
    },
  });
}
