import type { Metric, MetricPayload } from "@/types";
import { supabase } from "@/lib/supabase";
import { mapMetric } from "@/lib/mappers";
import { currentUserId } from "@/lib/session";

export const metricsService = {
  getAll: async (): Promise<Metric[]> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("user_id", uid)
      .order("measured_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMetric);
  },

  getLatest: async (): Promise<Metric> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("user_id", uid)
      .order("measured_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Nenhuma métrica encontrada");
    return mapMetric(data);
  },

  create: async (payload: MetricPayload): Promise<Metric> => {
    const uid = await currentUserId();
    const bmi =
      payload.weightKg && payload.heightCm
        ? +(payload.weightKg / (payload.heightCm / 100) ** 2).toFixed(1)
        : null;
    const { data, error } = await supabase
      .from("metrics")
      .insert({
        user_id: uid,
        measured_at: payload.measuredAt,
        weight_kg: payload.weightKg ?? null,
        height_cm: payload.heightCm ?? null,
        body_fat_pct: payload.bodyFatPct ?? null,
        muscle_mass_kg: payload.muscleMassKg ?? null,
        waist_cm: payload.waistCm ?? null,
        bmi,
        goal: payload.goal ?? null,
        arm_cm: payload.armCm ?? null,
        abdomen_cm: payload.abdomenCm ?? null,
        hip_cm: payload.hipCm ?? null,
        thigh_cm: payload.thighCm ?? null,
        calf_cm: payload.calfCm ?? null,
        observation: payload.observation ?? null,
        photos: payload.photos ?? [],
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapMetric(data);
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("metrics").delete().eq("id", id);
    if (error) throw error;
    return {};
  },
};
