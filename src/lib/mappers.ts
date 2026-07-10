import type {
  User, NutritionistProfile, Food, MealItem, Meal, DietPlan, MealLog, Metric,
  InviteToken, ConnectionRequest, PatientSummary, Recipe, NutritionistComment,
  Plan, Subscription, UserFoodPreference,
} from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const mapUser = (r: any): User => ({
  id: r.id,
  name: r.name,
  email: r.email ?? "",
  role: r.role,
  phone: r.phone ?? undefined,
  avatarUrl: r.avatar_url ?? undefined,
  latitude: r.latitude ?? undefined,
  longitude: r.longitude ?? undefined,
  createdAt: r.created_at ?? new Date().toISOString(),
});

export const mapNutritionist = (r: any): NutritionistProfile => ({
  id: r.id,
  userId: r.user_id,
  crnNumber: r.crn_number,
  bio: r.bio ?? undefined,
  specialties: r.specialties ?? [],
  isVerified: r.is_verified,
  latitude: r.latitude,
  longitude: r.longitude,
  serviceRadiusKm: r.service_radius_km,
  ratingAvg: r.rating_avg,
  ratingCount: r.rating_count,
  inviteCode: r.invite_code ?? undefined,
  user: {
    id: r.user_id,
    name: r.user?.name ?? r.user_name ?? "Nutricionista",
    avatarUrl: r.user?.avatar_url ?? r.user_avatar ?? undefined,
  },
});

export const mapFood = (r: any): Food => ({
  id: r.id,
  name: r.name,
  brand: r.brand ?? undefined,
  caloriesPer100g: r.calories_per_100g,
  proteinPer100g: r.protein_per_100g,
  carbsPer100g: r.carbs_per_100g,
  fatPer100g: r.fat_per_100g,
  isCustom: r.is_custom,
});

export const mapMealItem = (r: any): MealItem => ({
  id: r.id,
  food: mapFood(r.food),
  quantity: r.quantity,
  unit: r.unit,
  calories: r.calories,
  proteinG: r.protein_g,
  carbsG: r.carbs_g,
  fatG: r.fat_g,
});

export const mapMeal = (r: any): Meal => ({
  id: r.id,
  name: r.name,
  mealType: r.meal_type,
  scheduledTime: r.scheduled_time,
  orderIndex: r.order_index,
  items: (r.meal_items ?? [])
    .slice()
    .sort((a: any, b: any) => (a.id > b.id ? 1 : -1))
    .map(mapMealItem),
});

export const mapDietPlan = (r: any): DietPlan => ({
  id: r.id,
  userId: r.user_id,
  nutritionistId: r.nutritionist_id ?? undefined,
  source: r.source,
  title: r.title,
  goal: r.goal ?? "",
  startDate: r.start_date ?? "",
  endDate: r.end_date ?? "",
  status: r.status,
  notes: r.notes ?? undefined,
  createdAt: r.created_at,
  meals: (r.meals ?? [])
    .slice()
    .sort((a: any, b: any) => a.order_index - b.order_index)
    .map(mapMeal),
});

export const mapMealLog = (r: any): MealLog => ({
  id: r.id,
  mealId: r.meal_id,
  loggedAt: r.logged_at,
  status: r.status,
  adherencePct: r.adherence_pct,
  notes: r.notes ?? undefined,
  photoUri: r.photo_uri ?? undefined,
});

export const mapMetric = (r: any): Metric => ({
  id: r.id,
  userId: r.user_id,
  measuredAt: r.measured_at,
  weightKg: r.weight_kg ?? undefined,
  heightCm: r.height_cm ?? undefined,
  bodyFatPct: r.body_fat_pct ?? undefined,
  muscleMassKg: r.muscle_mass_kg ?? undefined,
  waistCm: r.waist_cm ?? undefined,
  bmi: r.bmi ?? undefined,
  goal: r.goal ?? undefined,
  armCm: r.arm_cm ?? undefined,
  abdomenCm: r.abdomen_cm ?? undefined,
  hipCm: r.hip_cm ?? undefined,
  thighCm: r.thigh_cm ?? undefined,
  calfCm: r.calf_cm ?? undefined,
  observation: r.observation ?? undefined,
  photos: r.photos ?? undefined,
});

export const mapInviteToken = (r: any): InviteToken => ({
  id: r.id,
  code: r.code,
  nutritionistId: r.nutritionist_id,
  label: r.label,
  serviceType: r.service_type,
  priceRcents: r.price_rcents,
  notes: r.notes ?? undefined,
  expiresAt: r.expires_at ?? undefined,
  status: r.status,
  createdAt: r.created_at,
  usedAt: r.used_at ?? undefined,
  usedByUserId: r.used_by_user_id ?? undefined,
  usedByName: r.used_by_name ?? undefined,
});

export const mapConnection = (r: any): ConnectionRequest => ({
  id: r.id,
  userId: r.user_id,
  nutritionistId: r.nutritionist_id,
  status: r.status,
  message: r.message ?? undefined,
  requestedAt: r.requested_at,
  respondedAt: r.responded_at ?? undefined,
  connectedVia: r.connected_via ?? undefined,
  inviteTokenId: r.invite_token_id ?? undefined,
  serviceType: r.service_type ?? undefined,
  priceRcents: r.price_rcents ?? undefined,
});

export const mapPatientSummary = (r: any): PatientSummary => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  serviceType: r.service_type ?? undefined,
  priceRcents: r.price_rcents ?? undefined,
  connectedAt: r.connected_at,
  connectedVia: r.connected_via ?? undefined,
  latestWeightKg: r.latest_weight_kg ?? undefined,
});

export const mapRecipe = (r: any): Recipe => ({
  id: r.id,
  nutritionistId: r.nutritionist_id,
  title: r.title,
  description: r.description ?? undefined,
  prepTimeMin: r.prep_time_min,
  servings: r.servings,
  caloriesPerServing: r.calories_per_serving,
  visibility: r.visibility,
  createdAt: r.created_at,
});

export const mapComment = (r: any): NutritionistComment => ({
  id: r.id,
  nutritionistId: r.nutritionist_id,
  patientId: r.patient_id,
  entityType: r.entity_type,
  entityId: r.entity_id,
  content: r.content,
  isPinned: r.is_pinned,
  createdAt: r.created_at,
  nutritionist: {
    user: {
      name: r.nutritionist?.user?.name ?? r.nutritionist_name ?? "Nutricionista",
      avatarUrl: r.nutritionist?.user?.avatar_url ?? undefined,
    },
  },
});

export const mapPlan = (r: any): Plan => ({
  id: r.id,
  type: r.type,
  name: r.name,
  description: r.description ?? "",
  price: Number(r.price),
  billingCycle: r.billing_cycle,
  features: r.features ?? [],
  isActive: r.is_active,
});

export const mapSubscription = (r: any): Subscription => ({
  id: r.id,
  userId: r.user_id,
  plan: mapPlan(r.plan),
  status: r.status,
  startsAt: r.starts_at,
  endsAt: r.ends_at,
  cancelledAt: r.cancelled_at ?? undefined,
});

export const mapPreference = (r: any): UserFoodPreference => ({
  id: r.id,
  foodId: r.food_id,
  food: mapFood(r.food),
  preference: r.preference,
});
