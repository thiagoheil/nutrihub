export type HealthGoal = "lose_weight" | "gain_muscle" | "maintain";

export interface Metric {
  id: string;
  userId: string;
  measuredAt: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  waistCm?: number;
  bmi?: number;
  goal?: HealthGoal;
}

export interface MetricPayload {
  measuredAt: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  waistCm?: number;
  goal?: HealthGoal;
}
