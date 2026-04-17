import { api } from "@/lib/api";
import { Plan, Subscription } from "@/types";

export const subscriptionService = {
  getPlans: (type?: "user" | "nutritionist") =>
    api.get<Plan[]>("/plans", { params: { type } }).then((r) => r.data),

  getMySubscription: () =>
    api.get<Subscription | null>("/subscriptions/mine").then((r) => r.data),

  subscribe: (planId: string) =>
    api.post<Subscription>("/subscriptions", { planId }).then((r) => r.data),

  cancel: () =>
    api.delete("/subscriptions/mine").then((r) => r.data),
};
