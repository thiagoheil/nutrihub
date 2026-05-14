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
  armCm?: number;
  abdomenCm?: number;
  hipCm?: number;
  thighCm?: number;
  calfCm?: number;
  observation?: string;
  photos?: string[];
}

export interface MetricPayload {
  measuredAt: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPct?: number;
  muscleMassKg?: number;
  waistCm?: number;
  goal?: HealthGoal;
  armCm?: number;
  abdomenCm?: number;
  hipCm?: number;
  thighCm?: number;
  calfCm?: number;
  observation?: string;
  photos?: string[];
}
