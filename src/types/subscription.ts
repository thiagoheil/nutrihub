export type PlanType = "user" | "nutritionist";
export type BillingCycle = "monthly" | "quarterly" | "yearly";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";

export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  description: string;
  price: number;
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  startsAt: string;
  endsAt: string;
  cancelledAt?: string;
}
