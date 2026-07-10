import type {
  NutritionistProfile, ConnectionRequest, InviteToken, ServiceType, Recipe,
  PatientSummary, Metric, MealLog, NutritionistComment, DietPlan,
} from "@/types";
import { supabase } from "@/lib/supabase";
import { currentUserId, currentNutritionistId, currentUserName } from "@/lib/session";
import {
  mapNutritionist, mapConnection, mapInviteToken, mapRecipe, mapPatientSummary,
  mapMetric, mapMealLog, mapComment, mapDietPlan,
} from "@/lib/mappers";

const NUT_SELECT = "*, user:profiles(id,name,avatar_url)";
const PLAN_SELECT = "*, meals(*, meal_items(*, food:foods(*)))";

interface NearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  specialties?: string[];
}

function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return +(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))).toFixed(1);
}

function tokenCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${prefix.toUpperCase().slice(0, 3)}-${rand}`;
}

export const nutritionistService = {
  // ─── Discovery ────────────────────────────────────────────────────────────
  findNearby: async (params: NearbyParams): Promise<NutritionistProfile[]> => {
    const { data, error } = await supabase.from("nutritionist_profiles").select(NUT_SELECT);
    if (error) throw error;
    return (data ?? [])
      .map((r) => {
        const n = mapNutritionist(r);
        n.distanceKm = haversineKm(params.latitude, params.longitude, n.latitude, n.longitude);
        return n;
      })
      .filter((n) => (params.radiusKm ? (n.distanceKm ?? 0) <= params.radiusKm : true))
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  },

  getById: async (id: string): Promise<NutritionistProfile> => {
    const { data, error } = await supabase.from("nutritionist_profiles").select(NUT_SELECT).eq("id", id).single();
    if (error || !data) throw new Error("Nutricionista não encontrado");
    return mapNutritionist(data);
  },

  // ─── My professional profile ───────────────────────────────────────────────
  getMyProfile: async (): Promise<NutritionistProfile | null> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("nutritionist_profiles")
      .select(NUT_SELECT)
      .eq("user_id", uid)
      .maybeSingle();
    if (error) throw error;
    return data ? mapNutritionist(data) : null;
  },

  updateMyProfile: async (params: {
    name?: string;
    phone?: string;
    bio?: string;
    crnNumber?: string;
    specialties?: string[];
    serviceRadiusKm?: number;
  }): Promise<NutritionistProfile> => {
    const uid = await currentUserId();
    if (params.name !== undefined || params.phone !== undefined) {
      const patch: Record<string, unknown> = {};
      if (params.name !== undefined) patch.name = params.name;
      if (params.phone !== undefined) patch.phone = params.phone;
      const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
      if (error) throw error;
    }
    const npPatch: Record<string, unknown> = {};
    if (params.bio !== undefined) npPatch.bio = params.bio;
    if (params.crnNumber !== undefined) npPatch.crn_number = params.crnNumber;
    if (params.specialties !== undefined) npPatch.specialties = params.specialties;
    if (params.serviceRadiusKm !== undefined) npPatch.service_radius_km = params.serviceRadiusKm;
    if (Object.keys(npPatch).length > 0) {
      const { error } = await supabase.from("nutritionist_profiles").update(npPatch).eq("user_id", uid);
      if (error) throw error;
    }
    const updated = await nutritionistService.getMyProfile();
    if (!updated) throw new Error("Perfil de nutricionista não encontrado");
    return updated;
  },

  // ─── Code / token lookup ──────────────────────────────────────────────────
  findByCode: async (code: string): Promise<NutritionistProfile | null> => {
    const { data, error } = await supabase.rpc("lookup_invite", { p_code: code.trim() });
    if (error) throw error;
    if (!data?.nutritionist) return null;
    return mapNutritionist(data.nutritionist);
  },

  findTokenByCode: async (code: string): Promise<InviteToken | null> => {
    const { data, error } = await supabase.rpc("lookup_invite", { p_code: code.trim() });
    if (error) throw error;
    return data?.token ? mapInviteToken(data.token) : null;
  },

  connectByCode: async (_nutritionistId: string, code: string): Promise<ConnectionRequest> => {
    const { data, error } = await supabase.rpc("redeem_code", { p_code: code.trim() });
    if (error) throw error;
    return mapConnection(data);
  },

  // ─── Requests ─────────────────────────────────────────────────────────────
  sendRequest: async (nutritionistId: string, message?: string): Promise<ConnectionRequest> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("connection_requests")
      .insert({ user_id: uid, nutritionist_id: nutritionistId, status: "pending", message: message ?? null })
      .select("*")
      .single();
    if (error) throw error;
    return mapConnection(data);
  },

  getMyRequest: async (): Promise<ConnectionRequest | null> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("user_id", uid)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapConnection(data) : null;
  },

  cancelRequest: async (requestId: string) => {
    const { error } = await supabase.from("connection_requests").delete().eq("id", requestId);
    if (error) throw error;
    return {};
  },

  getPendingRequests: async (): Promise<ConnectionRequest[]> => {
    const { data, error } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("status", "pending")
      .order("requested_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapConnection);
  },

  respondToRequest: async (requestId: string, accept: boolean) => {
    const { error } = await supabase
      .from("connection_requests")
      .update({ status: accept ? "accepted" : "rejected", responded_at: new Date().toISOString() })
      .eq("id", requestId);
    if (error) throw error;
    return {};
  },

  // ─── Patients ─────────────────────────────────────────────────────────────
  getMyPatients: async (): Promise<PatientSummary[]> => {
    const { data, error } = await supabase.rpc("get_my_patients");
    if (error) throw error;
    return (data ?? []).map(mapPatientSummary);
  },

  getPatientById: async (id: string): Promise<PatientSummary> => {
    const patients = await nutritionistService.getMyPatients();
    const found = patients.find((p) => p.id === id || p.userId === id);
    if (!found) throw new Error("Paciente não encontrado");
    return found;
  },

  getPatientMetrics: async (userId: string): Promise<Metric[]> => {
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("user_id", userId)
      .order("measured_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMetric);
  },

  // ─── Invite tokens ────────────────────────────────────────────────────────
  getMyTokens: async (): Promise<InviteToken[]> => {
    const { data, error } = await supabase
      .from("invite_tokens")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapInviteToken);
  },

  createToken: async (params: {
    label: string;
    serviceType: ServiceType;
    priceRcents: number;
    notes?: string;
    expiresAt?: string;
  }): Promise<InviteToken> => {
    const nutId = await currentNutritionistId();
    const name = await currentUserName();
    const prefix = name.split(" ").at(-1)?.slice(0, 3) ?? "NUT";
    const { data, error } = await supabase
      .from("invite_tokens")
      .insert({
        code: tokenCode(prefix),
        nutritionist_id: nutId,
        label: params.label,
        service_type: params.serviceType,
        price_rcents: params.priceRcents,
        notes: params.notes ?? null,
        expires_at: params.expiresAt ?? null,
        status: "active",
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapInviteToken(data);
  },

  revokeToken: async (tokenId: string) => {
    const { error } = await supabase.from("invite_tokens").update({ status: "revoked" }).eq("id", tokenId);
    if (error) throw error;
    return {};
  },

  // ─── Recipes ──────────────────────────────────────────────────────────────
  getMyRecipes: async (): Promise<Recipe[]> => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRecipe);
  },

  createRecipe: async (params: Omit<Recipe, "id" | "nutritionistId" | "createdAt">): Promise<Recipe> => {
    const nutId = await currentNutritionistId();
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        nutritionist_id: nutId,
        title: params.title,
        description: params.description ?? null,
        prep_time_min: params.prepTimeMin,
        servings: params.servings,
        calories_per_serving: params.caloriesPerServing,
        visibility: params.visibility,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapRecipe(data);
  },

  deleteRecipe: async (recipeId: string) => {
    const { error } = await supabase.from("recipes").delete().eq("id", recipeId);
    if (error) throw error;
    return {};
  },

  // ─── Patient plans ────────────────────────────────────────────────────────
  getPatientPlan: async (userId: string): Promise<DietPlan | null> => {
    const nutId = await currentNutritionistId();
    const { data, error } = await supabase
      .from("diet_plans")
      .select(PLAN_SELECT)
      .eq("user_id", userId)
      .eq("nutritionist_id", nutId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapDietPlan(data) : null;
  },

  getAllPatientPlans: async (): Promise<DietPlan[]> => {
    const nutId = await currentNutritionistId();
    const { data, error } = await supabase
      .from("diet_plans")
      .select(PLAN_SELECT)
      .eq("nutritionist_id", nutId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapDietPlan);
  },

  // ─── Patient diary ────────────────────────────────────────────────────────
  getPatientLogsForDate: async (userId: string, date: string): Promise<MealLog[]> => {
    const { data, error } = await supabase
      .from("meal_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", date)
      .order("logged_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapMealLog);
  },

  getPatientDiaryDates: async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase.rpc("get_patient_diary_dates", { p_user: userId });
    if (error) throw error;
    return (data ?? []) as string[];
  },

  // ─── Comments ─────────────────────────────────────────────────────────────
  getCommentsForLog: async (logId: string): Promise<NutritionistComment[]> => {
    const { data, error } = await supabase
      .from("nutritionist_comments")
      .select("*, nutritionist:nutritionist_profiles(user:profiles(name,avatar_url))")
      .eq("entity_id", logId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapComment);
  },

  addComment: async (params: {
    patientId: string;
    logId: string;
    content: string;
    isPinned?: boolean;
  }): Promise<NutritionistComment> => {
    const nutId = await currentNutritionistId();
    const { data, error } = await supabase
      .from("nutritionist_comments")
      .insert({
        nutritionist_id: nutId,
        patient_id: params.patientId,
        entity_type: "meal_log",
        entity_id: params.logId,
        content: params.content,
        is_pinned: params.isPinned ?? false,
      })
      .select("*, nutritionist:nutritionist_profiles(user:profiles(name,avatar_url))")
      .single();
    if (error) throw error;
    return mapComment(data);
  },

  deleteComment: async (commentId: string) => {
    const { error } = await supabase.from("nutritionist_comments").delete().eq("id", commentId);
    if (error) throw error;
    return {};
  },
};
