export type ConnectionStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type RecipeVisibility = "public" | "private" | "patients_only";
export type CommentEntityType = "meal_log" | "metric" | "diet_plan";
export type InviteTokenStatus = "active" | "used" | "expired" | "revoked";
export type ServiceType = "basic" | "standard" | "premium" | "custom";

export interface NutritionistProfile {
  id: string;
  userId: string;
  crnNumber: string;
  bio?: string;
  specialties: string[];
  isVerified: boolean;
  latitude: number;
  longitude: number;
  serviceRadiusKm: number;
  ratingAvg: number;
  ratingCount: number;
  user: { id: string; name: string; avatarUrl?: string };
  distanceKm?: number;
  inviteCode?: string;
}

export interface InviteToken {
  id: string;
  code: string;
  nutritionistId: string;
  label: string;
  serviceType: ServiceType;
  priceRcents: number;
  notes?: string;
  expiresAt?: string;
  status: InviteTokenStatus;
  createdAt: string;
  usedAt?: string;
  usedByUserId?: string;
  usedByName?: string;
}

export interface ConnectionRequest {
  id: string;
  userId: string;
  nutritionistId: string;
  status: ConnectionStatus;
  message?: string;
  requestedAt: string;
  respondedAt?: string;
  connectedVia?: "code" | "request";
  inviteTokenId?: string;
  serviceType?: ServiceType;
  priceRcents?: number;
}

export interface PatientSummary {
  id: string;
  userId: string;
  name: string;
  serviceType?: ServiceType;
  priceRcents?: number;
  connectedAt: string;
  connectedVia?: "code" | "request";
  latestWeightKg?: number;
}

export interface Recipe {
  id: string;
  nutritionistId: string;
  title: string;
  description?: string;
  prepTimeMin: number;
  servings: number;
  caloriesPerServing: number;
  visibility: RecipeVisibility;
  createdAt: string;
}

export interface NutritionistComment {
  id: string;
  nutritionistId: string;
  patientId: string;
  entityType: CommentEntityType;
  entityId: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  nutritionist: { user: { name: string; avatarUrl?: string } };
}
