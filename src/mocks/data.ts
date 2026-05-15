import type { User, DietPlan, Metric, NutritionistProfile, ConnectionRequest, MealLog, Recipe, InviteToken, PatientSummary, NutritionistComment } from "@/types";

export type MockUser = User & { password: string };

export const SEED_USERS: MockUser[] = [
  {
    id: "u1",
    name: "João Silva",
    email: "joao@test.com",
    password: "123456",
    role: "user",
    phone: "(11) 99999-0001",
    createdAt: "2024-01-15T10:00:00Z",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "u2",
    name: "Dra. Ana Lima",
    email: "ana@test.com",
    password: "123456",
    role: "nutritionist",
    phone: "(11) 99999-0002",
    createdAt: "2024-01-10T10:00:00Z",
    latitude: -23.548,
    longitude: -46.636,
  },
];

export const SEED_DIET_PLAN: DietPlan = {
  id: "dp1",
  userId: "u1",
  source: "algorithm",
  title: "Plano Emagrecimento Saudável",
  goal: "Perder 5kg em 3 meses com déficit calórico moderado",
  startDate: "2024-04-01",
  endDate: "2024-06-30",
  status: "active",
  createdAt: "2024-04-01T08:00:00Z",
  meals: [
    {
      id: "m1",
      name: "Café da Manhã",
      mealType: "breakfast",
      scheduledTime: "07:00",
      orderIndex: 0,
      items: [
        {
          id: "mi1",
          food: { id: "f1", name: "Aveia em Flocos", caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, isCustom: false },
          quantity: 50, unit: "g", calories: 194, proteinG: 8.5, carbsG: 33, fatG: 3.5,
        },
        {
          id: "mi2",
          food: { id: "f2", name: "Banana Prata", caloriesPer100g: 98, proteinPer100g: 1.4, carbsPer100g: 26, fatPer100g: 0.1, isCustom: false },
          quantity: 100, unit: "g", calories: 98, proteinG: 1.4, carbsG: 26, fatG: 0.1,
        },
        {
          id: "mi3",
          food: { id: "f3", name: "Leite Desnatado", caloriesPer100g: 35, proteinPer100g: 3.6, carbsPer100g: 5, fatPer100g: 0.1, isCustom: false },
          quantity: 200, unit: "ml", calories: 70, proteinG: 7.2, carbsG: 10, fatG: 0.2,
        },
      ],
    },
    {
      id: "m2",
      name: "Almoço",
      mealType: "lunch",
      scheduledTime: "12:00",
      orderIndex: 1,
      items: [
        {
          id: "mi4",
          food: { id: "f4", name: "Frango Grelhado", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, isCustom: false },
          quantity: 150, unit: "g", calories: 247, proteinG: 46.5, carbsG: 0, fatG: 5.4,
        },
        {
          id: "mi5",
          food: { id: "f5", name: "Arroz Integral", caloriesPer100g: 123, proteinPer100g: 2.6, carbsPer100g: 25.8, fatPer100g: 1, isCustom: false },
          quantity: 150, unit: "g", calories: 184, proteinG: 3.9, carbsG: 38.7, fatG: 1.5,
        },
        {
          id: "mi6",
          food: { id: "f6", name: "Feijão Carioca Cozido", caloriesPer100g: 77, proteinPer100g: 4.8, carbsPer100g: 13.6, fatPer100g: 0.5, isCustom: false },
          quantity: 100, unit: "g", calories: 77, proteinG: 4.8, carbsG: 13.6, fatG: 0.5,
        },
        {
          id: "mi7",
          food: { id: "f7", name: "Salada de Folhas Verdes", caloriesPer100g: 15, proteinPer100g: 1.5, carbsPer100g: 2, fatPer100g: 0.2, isCustom: false },
          quantity: 100, unit: "g", calories: 15, proteinG: 1.5, carbsG: 2, fatG: 0.2,
        },
      ],
    },
    {
      id: "m3",
      name: "Lanche da Tarde",
      mealType: "snack",
      scheduledTime: "15:30",
      orderIndex: 2,
      items: [
        {
          id: "mi8",
          food: { id: "f8", name: "Iogurte Grego Natural", caloriesPer100g: 97, proteinPer100g: 9, carbsPer100g: 3.6, fatPer100g: 5, isCustom: false },
          quantity: 170, unit: "g", calories: 164, proteinG: 15.3, carbsG: 6.1, fatG: 8.5,
        },
        {
          id: "mi9",
          food: { id: "f9", name: "Morango", caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3, isCustom: false },
          quantity: 100, unit: "g", calories: 32, proteinG: 0.7, carbsG: 7.7, fatG: 0.3,
        },
      ],
    },
    {
      id: "m4",
      name: "Jantar",
      mealType: "dinner",
      scheduledTime: "19:30",
      orderIndex: 3,
      items: [
        {
          id: "mi10",
          food: { id: "f10", name: "Salmão Assado", caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, isCustom: false },
          quantity: 150, unit: "g", calories: 312, proteinG: 30, carbsG: 0, fatG: 19.5,
        },
        {
          id: "mi11",
          food: { id: "f11", name: "Batata Doce Cozida", caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, isCustom: false },
          quantity: 200, unit: "g", calories: 172, proteinG: 3.2, carbsG: 40, fatG: 0.2,
        },
        {
          id: "mi12",
          food: { id: "f12", name: "Brócolis Cozido", caloriesPer100g: 55, proteinPer100g: 3.7, carbsPer100g: 11, fatPer100g: 0.6, isCustom: false },
          quantity: 100, unit: "g", calories: 55, proteinG: 3.7, carbsG: 11, fatG: 0.6,
        },
      ],
    },
  ],
};

export const SEED_METRICS: Metric[] = [
  { id: "met1", userId: "u1", measuredAt: "2026-01-15T08:00:00Z", weightKg: 85, heightCm: 175, bodyFatPct: 24, muscleMassKg: 60, waistCm: 92, bmi: 27.8, goal: "lose_weight", armCm: 34, abdomenCm: 95, hipCm: 102, thighCm: 58, calfCm: 37, observation: "Início do programa" },
  { id: "met2", userId: "u1", measuredAt: "2026-02-01T08:00:00Z", weightKg: 83.5, heightCm: 175, bodyFatPct: 23.2, muscleMassKg: 60.8, waistCm: 90, bmi: 27.3, goal: "lose_weight", armCm: 33.5, abdomenCm: 93, hipCm: 100, thighCm: 57, calfCm: 36.5 },
  { id: "met3", userId: "u1", measuredAt: "2026-02-15T08:00:00Z", weightKg: 82.1, heightCm: 175, bodyFatPct: 22.5, muscleMassKg: 61.2, waistCm: 88, bmi: 26.8, goal: "lose_weight", armCm: 33, abdomenCm: 91, hipCm: 98, thighCm: 56, calfCm: 36 },
  { id: "met4", userId: "u1", measuredAt: "2026-03-01T08:00:00Z", weightKg: 80.8, heightCm: 175, bodyFatPct: 21.8, muscleMassKg: 61.8, waistCm: 86, bmi: 26.4, goal: "lose_weight", armCm: 32.5, abdomenCm: 89, hipCm: 97, thighCm: 55.5, calfCm: 35.5, observation: "Após treino de força" },
  { id: "met5", userId: "u1", measuredAt: "2026-03-20T08:00:00Z", weightKg: 79.5, heightCm: 175, bodyFatPct: 21, muscleMassKg: 62.3, waistCm: 85, bmi: 26, goal: "lose_weight", armCm: 32, abdomenCm: 87, hipCm: 95, thighCm: 55, calfCm: 35 },
  { id: "met6", userId: "u1", measuredAt: "2026-04-10T08:00:00Z", weightKg: 78.2, heightCm: 175, bodyFatPct: 20.3, muscleMassKg: 62.8, waistCm: 83, bmi: 25.5, goal: "lose_weight", armCm: 31.5, abdomenCm: 85, hipCm: 93, thighCm: 54, calfCm: 34.5 },
  { id: "met7", userId: "u1", measuredAt: "2026-05-01T08:00:00Z", weightKg: 77, heightCm: 175, bodyFatPct: 19.5, muscleMassKg: 63.5, waistCm: 81, bmi: 25.1, goal: "lose_weight", armCm: 31, abdomenCm: 83, hipCm: 92, thighCm: 53, calfCm: 34, observation: "Melhor registro até agora" },
];

export const SEED_TODAY_LOGS: MealLog[] = [
  { id: "log1", mealId: "m1", loggedAt: new Date().toISOString(), status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
  { id: "log2", mealId: "m2", loggedAt: new Date().toISOString(), status: "partial", adherencePct: 75, notes: "Não comi o feijão", photoUri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
];

// Diary logs with photos for patient u7 (Marcos) - used by nutritionist diary view
export const SEED_PATIENT_DIARY_LOGS: Record<string, Record<string, MealLog[]>> = {
  u7: {
    "2026-05-10": [
      { id: "pdl1", mealId: "m1", loggedAt: "2026-05-10T07:30:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
      { id: "pdl2", mealId: "m2", loggedAt: "2026-05-10T12:20:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
      { id: "pdl3", mealId: "m3", loggedAt: "2026-05-10T15:40:00Z", status: "partial", adherencePct: 60, notes: "Não tinha iogurte, substitui por fruta" },
      { id: "pdl4", mealId: "m4", loggedAt: "2026-05-10T19:50:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
    ],
    "2026-05-11": [
      { id: "pdl5", mealId: "m1", loggedAt: "2026-05-11T07:15:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80" },
      { id: "pdl6", mealId: "m2", loggedAt: "2026-05-11T12:45:00Z", status: "skipped", adherencePct: 0, notes: "Reunião no almoço, não consegui comer" },
      { id: "pdl7", mealId: "m3", loggedAt: "2026-05-11T16:00:00Z", status: "eaten", adherencePct: 100 },
      { id: "pdl8", mealId: "m4", loggedAt: "2026-05-11T20:00:00Z", status: "eaten", adherencePct: 90, photoUri: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
    ],
    "2026-05-12": [
      { id: "pdl9",  mealId: "m1", loggedAt: "2026-05-12T07:00:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80" },
      { id: "pdl10", mealId: "m2", loggedAt: "2026-05-12T12:30:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
      { id: "pdl11", mealId: "m3", loggedAt: "2026-05-12T15:50:00Z", status: "partial", adherencePct: 75, notes: "Sem morango hoje" },
    ],
  },
  u8: {
    "2026-05-11": [
      { id: "pdl12", mealId: "m1", loggedAt: "2026-05-11T08:00:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80" },
      { id: "pdl13", mealId: "m2", loggedAt: "2026-05-11T12:30:00Z", status: "eaten", adherencePct: 100 },
    ],
    "2026-05-12": [
      { id: "pdl14", mealId: "m1", loggedAt: "2026-05-12T07:45:00Z", status: "eaten", adherencePct: 100 },
      { id: "pdl15", mealId: "m3", loggedAt: "2026-05-12T16:00:00Z", status: "eaten", adherencePct: 100, photoUri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
    ],
  },
};

export const SEED_NUTRITIONIST_COMMENTS: NutritionistComment[] = [
  {
    id: "nc1",
    nutritionistId: "np1",
    patientId: "u7",
    entityType: "meal_log",
    entityId: "pdl2",
    content: "Ótima escolha de almoço! Continue com essa aderência.",
    isPinned: false,
    createdAt: "2026-05-10T14:00:00Z",
    nutritionist: { user: { name: "Dra. Ana Lima" } },
  },
  {
    id: "nc2",
    nutritionistId: "np1",
    patientId: "u7",
    entityType: "meal_log",
    entityId: "pdl3",
    content: "Tudo bem substituir a fruta, mas tente manter o iogurte grego para garantir a proteína do lanche.",
    isPinned: true,
    createdAt: "2026-05-10T14:05:00Z",
    nutritionist: { user: { name: "Dra. Ana Lima" } },
  },
  {
    id: "nc3",
    nutritionistId: "np1",
    patientId: "u7",
    entityType: "meal_log",
    entityId: "pdl6",
    content: "Entendo que acontece, mas tente sempre ter uma opção saudável reserva para situações como essa. Uma castanha ou fruta já ajuda!",
    isPinned: false,
    createdAt: "2026-05-11T18:00:00Z",
    nutritionist: { user: { name: "Dra. Ana Lima" } },
  },
];

export const SEED_NUTRITIONIST_PROFILES: NutritionistProfile[] = [
  {
    id: "np1",
    userId: "u2",
    crnNumber: "CRN-3 12345",
    bio: "Especialista em nutrição esportiva e emagrecimento. Mais de 10 anos de experiência clínica.",
    specialties: ["Emagrecimento", "Nutrição Esportiva", "Reeducação Alimentar"],
    isVerified: true,
    latitude: -23.548,
    longitude: -46.636,
    serviceRadiusKm: 20,
    ratingAvg: 4.9,
    ratingCount: 127,
    user: { id: "u2", name: "Dra. Ana Lima" },
    distanceKm: 0.8,
    inviteCode: "ANA001",
  },
  {
    id: "np2",
    userId: "u3",
    crnNumber: "CRN-3 67890",
    bio: "Nutricionista clínica e funcional. Foco em saúde intestinal e alimentação anti-inflamatória.",
    specialties: ["Nutrição Funcional", "Saúde Intestinal", "Vegetarianismo"],
    isVerified: true,
    latitude: -23.555,
    longitude: -46.640,
    serviceRadiusKm: 15,
    ratingAvg: 4.7,
    ratingCount: 89,
    user: { id: "u3", name: "Dra. Carla Mendes" },
    distanceKm: 1.4,
    inviteCode: "CAR002",
  },
  {
    id: "np3",
    userId: "u4",
    crnNumber: "CRN-3 54321",
    bio: "Nutricionista pediátrico e materno-infantil. Atendimento humanizado para toda a família.",
    specialties: ["Nutrição Pediátrica", "Gestantes", "Aleitamento"],
    isVerified: false,
    latitude: -23.560,
    longitude: -46.625,
    serviceRadiusKm: 10,
    ratingAvg: 4.5,
    ratingCount: 43,
    user: { id: "u4", name: "Dr. Bruno Costa" },
    distanceKm: 2.1,
    inviteCode: "BRU003",
  },
];

export const SEED_PENDING_REQUESTS: ConnectionRequest[] = [
  {
    id: "cr1",
    userId: "u5",
    nutritionistId: "np1",
    status: "pending",
    message: "Olá! Gostaria de agendar uma consulta para iniciar meu processo de emagrecimento.",
    requestedAt: "2024-04-18T14:30:00Z",
  },
  {
    id: "cr2",
    userId: "u6",
    nutritionistId: "np1",
    status: "pending",
    message: "Preciso de ajuda com minha dieta esportiva para a próxima competição.",
    requestedAt: "2024-04-19T09:00:00Z",
  },
];

export const SEED_INVITE_TOKENS: InviteToken[] = [
  {
    id: "tok1",
    code: "ANA-MK8P",
    nutritionistId: "np1",
    label: "Plano Premium – Marcos Oliveira",
    serviceType: "premium",
    priceRcents: 34900,
    notes: "Consultas quinzenais + acompanhamento de treino",
    status: "used",
    createdAt: "2026-04-10T10:00:00Z",
    usedAt: "2026-04-12T14:30:00Z",
    usedByUserId: "u7",
    usedByName: "Marcos Oliveira",
  },
  {
    id: "tok2",
    code: "ANA-FR3Q",
    nutritionistId: "np1",
    label: "Plano Standard – Fernanda Rocha",
    serviceType: "standard",
    priceRcents: 19900,
    status: "used",
    createdAt: "2026-04-15T09:00:00Z",
    usedAt: "2026-04-17T11:00:00Z",
    usedByUserId: "u8",
    usedByName: "Fernanda Rocha",
  },
  {
    id: "tok3",
    code: "ANA-LF7R",
    nutritionistId: "np1",
    label: "Plano Basic – Lucas Ferreira",
    serviceType: "basic",
    priceRcents: 9900,
    status: "used",
    createdAt: "2026-04-20T08:00:00Z",
    usedAt: "2026-04-22T16:00:00Z",
    usedByUserId: "u9",
    usedByName: "Lucas Ferreira",
  },
  {
    id: "tok4",
    code: "ANA-NV2X",
    nutritionistId: "np1",
    label: "Plano Premium – novo paciente",
    serviceType: "premium",
    priceRcents: 34900,
    notes: "Indicação do Dr. Carlos",
    status: "active",
    createdAt: "2026-05-10T10:00:00Z",
    expiresAt: "2026-06-10T23:59:59Z",
  },
  {
    id: "tok5",
    code: "ANA-EX9Z",
    nutritionistId: "np1",
    label: "Consulta avulsa",
    serviceType: "basic",
    priceRcents: 5000,
    status: "expired",
    createdAt: "2026-03-01T10:00:00Z",
    expiresAt: "2026-04-01T23:59:59Z",
  },
];

export const SEED_PATIENT_CONNECTIONS: ConnectionRequest[] = [
  {
    id: "pc1",
    userId: "u7",
    nutritionistId: "np1",
    status: "accepted",
    connectedVia: "code",
    inviteTokenId: "tok1",
    serviceType: "premium",
    priceRcents: 34900,
    requestedAt: "2026-04-12T14:30:00Z",
    respondedAt: "2026-04-12T14:30:00Z",
  },
  {
    id: "pc2",
    userId: "u8",
    nutritionistId: "np1",
    status: "accepted",
    connectedVia: "code",
    inviteTokenId: "tok2",
    serviceType: "standard",
    priceRcents: 19900,
    requestedAt: "2026-04-17T11:00:00Z",
    respondedAt: "2026-04-17T11:00:00Z",
  },
  {
    id: "pc3",
    userId: "u9",
    nutritionistId: "np1",
    status: "accepted",
    connectedVia: "code",
    inviteTokenId: "tok3",
    serviceType: "basic",
    priceRcents: 9900,
    requestedAt: "2026-04-22T16:00:00Z",
    respondedAt: "2026-04-22T16:00:00Z",
  },
];

export const SEED_PATIENT_SUMMARIES: PatientSummary[] = [
  { id: "pat1", userId: "u7", name: "Marcos Oliveira", serviceType: "premium", priceRcents: 34900, connectedAt: "2026-04-12T14:30:00Z", connectedVia: "code", latestWeightKg: 82 },
  { id: "pat2", userId: "u8", name: "Fernanda Rocha", serviceType: "standard", priceRcents: 19900, connectedAt: "2026-04-17T11:00:00Z", connectedVia: "code", latestWeightKg: 65 },
  { id: "pat3", userId: "u9", name: "Lucas Ferreira", serviceType: "basic", priceRcents: 9900, connectedAt: "2026-04-22T16:00:00Z", connectedVia: "code", latestWeightKg: 75 },
];

export const SEED_PATIENT_METRICS: Record<string, Metric[]> = {
  u7: [
    { id: "pm1", userId: "u7", measuredAt: "2026-04-12T08:00:00Z", weightKg: 85, heightCm: 178, bodyFatPct: 26, muscleMassKg: 58, waistCm: 95, bmi: 26.8, goal: "lose_weight" },
    { id: "pm2", userId: "u7", measuredAt: "2026-04-26T08:00:00Z", weightKg: 83.5, heightCm: 178, bodyFatPct: 25.1, muscleMassKg: 58.5, waistCm: 93, bmi: 26.4, goal: "lose_weight" },
    { id: "pm3", userId: "u7", measuredAt: "2026-05-10T08:00:00Z", weightKg: 82, heightCm: 178, bodyFatPct: 24.2, muscleMassKg: 59, waistCm: 91, bmi: 25.9, goal: "lose_weight" },
  ],
  u8: [
    { id: "pm4", userId: "u8", measuredAt: "2026-04-17T08:00:00Z", weightKg: 67, heightCm: 163, bodyFatPct: 28, muscleMassKg: 44, waistCm: 75, bmi: 25.2, goal: "maintain" },
    { id: "pm5", userId: "u8", measuredAt: "2026-05-01T08:00:00Z", weightKg: 65.5, heightCm: 163, bodyFatPct: 27, muscleMassKg: 44.5, waistCm: 73, bmi: 24.6, goal: "maintain" },
  ],
  u9: [
    { id: "pm6", userId: "u9", measuredAt: "2026-04-22T08:00:00Z", weightKg: 72, heightCm: 170, bodyFatPct: 18, muscleMassKg: 56, waistCm: 80, bmi: 24.9, goal: "gain_muscle" },
    { id: "pm7", userId: "u9", measuredAt: "2026-05-06T08:00:00Z", weightKg: 73.5, heightCm: 170, bodyFatPct: 17.5, muscleMassKg: 57.5, waistCm: 79, bmi: 25.4, goal: "gain_muscle" },
  ],
};

export const SEED_PATIENTS: PatientSummary[] = SEED_PATIENT_SUMMARIES;

export const SEED_RECIPES: Recipe[] = [
  {
    id: "rec1",
    nutritionistId: "np1",
    title: "Bowl de Açaí Proteico",
    description: "Açaí com proteína whey, granola e frutas vermelhas. Ideal para pós-treino.",
    prepTimeMin: 10,
    servings: 1,
    caloriesPerServing: 420,
    visibility: "public",
    createdAt: "2024-03-10T10:00:00Z",
  },
  {
    id: "rec2",
    nutritionistId: "np1",
    title: "Wrap de Frango com Abacate",
    description: "Frango grelhado, abacate, rúcula e tomate em wrap integral. Rico em proteínas e gorduras boas.",
    prepTimeMin: 20,
    servings: 2,
    caloriesPerServing: 350,
    visibility: "patients_only",
    createdAt: "2024-03-15T10:00:00Z",
  },
];

// Diet plans assigned by nutritionist np1 to each patient (keyed by userId)
export const SEED_PATIENT_PLANS: DietPlan[] = [
  {
    id: "dp_u7",
    userId: "u7",
    nutritionistId: "np1",
    source: "nutritionist",
    title: "Plano Hipertrofia Controlada",
    goal: "Ganho de 3kg de massa muscular em 3 meses com superávit calórico moderado",
    startDate: "2026-04-12",
    endDate: "2026-07-12",
    status: "active",
    createdAt: "2026-04-12T10:00:00Z",
    notes: "Manter proteína acima de 140g/dia. Priorizar treino de força 4x semana.",
    meals: SEED_DIET_PLAN.meals,
  },
  {
    id: "dp_u8",
    userId: "u8",
    nutritionistId: "np1",
    source: "nutritionist",
    title: "Plano Manutenção e Bem-estar",
    goal: "Manter peso atual melhorando qualidade alimentar e equilíbrio nutricional",
    startDate: "2026-04-17",
    endDate: "2026-07-17",
    status: "active",
    createdAt: "2026-04-17T10:00:00Z",
    notes: "Reduzir sódio. Aumentar ingestão de vegetais nas refeições principais.",
    meals: SEED_DIET_PLAN.meals,
  },
  // u9 (Lucas) – sem plano atribuído ainda
];
