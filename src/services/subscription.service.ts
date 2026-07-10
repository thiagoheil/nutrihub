import { Plan, Subscription } from "@/types";
import { supabase } from "@/lib/supabase";
import { currentUserId } from "@/lib/session";
import { mapPlan, mapSubscription } from "@/lib/mappers";

const SUB_SELECT = "*, plan:plans(*)";

export const subscriptionService = {
  getPlans: async (type?: "user" | "nutritionist"): Promise<Plan[]> => {
    let q = supabase.from("plans").select("*").eq("is_active", true).order("price", { ascending: true });
    if (type) q = q.eq("type", type);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(mapPlan);
  },

  getMySubscription: async (): Promise<Subscription | null> => {
    const uid = await currentUserId();
    const { data, error } = await supabase
      .from("subscriptions")
      .select(SUB_SELECT)
      .eq("user_id", uid)
      .eq("status", "active")
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? mapSubscription(data) : null;
  },

  subscribe: async (planId: string): Promise<Subscription> => {
    const uid = await currentUserId();
    const { data: plan } = await supabase
      .from("plans")
      .select("billing_cycle")
      .eq("id", planId)
      .single();
    const days = plan?.billing_cycle === "yearly" ? 365 : plan?.billing_cycle === "quarterly" ? 90 : 30;
    const now = new Date();
    const ends = new Date(now.getTime() + days * 86400000);
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: uid,
        plan_id: planId,
        status: "active",
        starts_at: now.toISOString(),
        ends_at: ends.toISOString(),
      })
      .select(SUB_SELECT)
      .single();
    if (error) throw error;
    return mapSubscription(data);
  },

  cancel: async () => {
    const uid = await currentUserId();
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
      .eq("user_id", uid)
      .eq("status", "active");
    if (error) throw error;
    return {};
  },
};
