import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["user", "nutritionist"]),
  phone: z.string().optional(),
});

export const metricSchema = z.object({
  measuredAt: z.string(),
  weightKg: z.coerce.number().positive().optional(),
  heightCm: z.coerce.number().positive().optional(),
  bodyFatPct: z.coerce.number().min(0).max(100).optional(),
  muscleMassKg: z.coerce.number().positive().optional(),
  waistCm: z.coerce.number().positive().optional(),
  goal: z.enum(["lose_weight", "gain_muscle", "maintain"]).optional(),
});

export const connectionRequestSchema = z.object({
  nutritionistId: z.string().uuid(),
  message: z.string().max(300).optional(),
});
