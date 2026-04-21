import type { User, DietPlan, Metric, NutritionistProfile, ConnectionRequest, MealLog, Recipe } from "@/types";

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
  { id: "met1", userId: "u1", measuredAt: "2024-02-01T08:00:00Z", weightKg: 85, heightCm: 175, bodyFatPct: 24, muscleMassKg: 60, waistCm: 92, bmi: 27.8, goal: "lose_weight" },
  { id: "met2", userId: "u1", measuredAt: "2024-02-15T08:00:00Z", weightKg: 84, heightCm: 175, bodyFatPct: 23.5, muscleMassKg: 60.5, waistCm: 91, bmi: 27.4, goal: "lose_weight" },
  { id: "met3", userId: "u1", measuredAt: "2024-03-01T08:00:00Z", weightKg: 83.2, heightCm: 175, bodyFatPct: 23, muscleMassKg: 61, waistCm: 90, bmi: 27.2, goal: "lose_weight" },
  { id: "met4", userId: "u1", measuredAt: "2024-03-15T08:00:00Z", weightKg: 82.5, heightCm: 175, bodyFatPct: 22.5, muscleMassKg: 61.5, waistCm: 89, bmi: 26.9, goal: "lose_weight" },
  { id: "met5", userId: "u1", measuredAt: "2024-04-01T08:00:00Z", weightKg: 81.8, heightCm: 175, bodyFatPct: 22, muscleMassKg: 62, waistCm: 88, bmi: 26.7, goal: "lose_weight" },
];

export const SEED_TODAY_LOGS: MealLog[] = [
  { id: "log1", mealId: "m1", loggedAt: new Date().toISOString(), status: "eaten", adherencePct: 100 },
  { id: "log2", mealId: "m2", loggedAt: new Date().toISOString(), status: "partial", adherencePct: 75, notes: "Não comi o feijão" },
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

export const SEED_PATIENTS: NutritionistProfile[] = [
  {
    id: "pat1", userId: "u7", crnNumber: "", bio: "", specialties: [],
    isVerified: false, latitude: -23.55, longitude: -46.63,
    serviceRadiusKm: 0, ratingAvg: 0, ratingCount: 0,
    user: { id: "u7", name: "Marcos Oliveira" }, distanceKm: 0,
  },
  {
    id: "pat2", userId: "u8", crnNumber: "", bio: "", specialties: [],
    isVerified: false, latitude: -23.56, longitude: -46.64,
    serviceRadiusKm: 0, ratingAvg: 0, ratingCount: 0,
    user: { id: "u8", name: "Fernanda Rocha" }, distanceKm: 0,
  },
  {
    id: "pat3", userId: "u9", crnNumber: "", bio: "", specialties: [],
    isVerified: false, latitude: -23.57, longitude: -46.65,
    serviceRadiusKm: 0, ratingAvg: 0, ratingCount: 0,
    user: { id: "u9", name: "Lucas Ferreira" }, distanceKm: 0,
  },
];

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
