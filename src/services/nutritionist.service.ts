import type { NutritionistProfile, ConnectionRequest, InviteToken, ServiceType, Recipe, PatientSummary, Metric, MealLog, NutritionistComment } from "@/types";
import { SEED_NUTRITIONIST_PROFILES } from "@/mocks/data";
import { mockStore } from "@/mocks/store";
import { storage } from "@/lib/storage";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const currentUserId = () =>
  storage.getTokens()?.accessToken?.replace("mock_token_", "") ?? "u1";

const currentNutritionistId = () => {
  const uid = currentUserId();
  return SEED_NUTRITIONIST_PROFILES.find((n) => n.userId === uid)?.id ?? "np1";
};

interface NearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  specialties?: string[];
}

function generateTokenCode(prefix: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${prefix.toUpperCase().slice(0, 3)}-${rand}`;
}

export const nutritionistService = {
  // ─── Discovery ────────────────────────────────────────────────────────────────
  findNearby: async (_params: NearbyParams): Promise<NutritionistProfile[]> => {
    await delay();
    return SEED_NUTRITIONIST_PROFILES;
  },

  getById: async (id: string): Promise<NutritionistProfile> => {
    await delay();
    const profile = SEED_NUTRITIONIST_PROFILES.find((n) => n.id === id);
    if (!profile) throw new Error("Nutricionista não encontrado");
    return profile;
  },

  // ─── Code / token lookup ──────────────────────────────────────────────────────
  findByCode: async (code: string): Promise<NutritionistProfile | null> => {
    await delay(300);
    const normalized = code.trim().toUpperCase();
    const token = mockStore.findTokenByCode(normalized);
    if (token) {
      return SEED_NUTRITIONIST_PROFILES.find((n) => n.id === token.nutritionistId) ?? null;
    }
    return SEED_NUTRITIONIST_PROFILES.find((n) => n.inviteCode?.toUpperCase() === normalized) ?? null;
  },

  findTokenByCode: async (code: string): Promise<InviteToken | null> => {
    await delay(300);
    return mockStore.findTokenByCode(code.trim().toUpperCase());
  },

  connectByCode: async (nutritionistId: string, code: string): Promise<ConnectionRequest> => {
    await delay();
    const uid = currentUserId();
    const token = mockStore.findTokenByCode(code.trim().toUpperCase());
    const conn: ConnectionRequest = {
      id: `cr_${Date.now()}`,
      userId: uid,
      nutritionistId,
      status: "accepted",
      message: `Conectado via código: ${code.toUpperCase()}`,
      requestedAt: new Date().toISOString(),
      respondedAt: new Date().toISOString(),
      connectedVia: "code",
      inviteTokenId: token?.id,
      serviceType: token?.serviceType,
      priceRcents: token?.priceRcents,
    };
    if (token) {
      const user = mockStore.getUserById(uid);
      mockStore.useToken(token.id, uid, user?.name ?? "Usuário");
    }
    mockStore.addConnection(conn);
    return conn;
  },

  // ─── Requests ─────────────────────────────────────────────────────────────────
  sendRequest: async (nutritionistId: string, message?: string): Promise<ConnectionRequest> => {
    await delay();
    const conn: ConnectionRequest = {
      id: `cr_${Date.now()}`,
      userId: currentUserId(),
      nutritionistId,
      status: "pending",
      message,
      requestedAt: new Date().toISOString(),
    };
    mockStore.addConnection(conn);
    return conn;
  },

  getMyRequest: async (): Promise<ConnectionRequest | null> => {
    await delay();
    return mockStore.getMyRequest(currentUserId());
  },

  cancelRequest: async (requestId: string) => {
    await delay();
    mockStore.cancelRequest(requestId);
    return {};
  },

  getPendingRequests: async (): Promise<ConnectionRequest[]> => {
    await delay();
    return mockStore.getPendingRequests(currentNutritionistId());
  },

  respondToRequest: async (requestId: string, accept: boolean) => {
    await delay();
    mockStore.respondToRequest(requestId, accept);
    return {};
  },

  // ─── Patients ─────────────────────────────────────────────────────────────────
  getMyPatients: async (): Promise<PatientSummary[]> => {
    await delay();
    return mockStore.getMyPatients();
  },

  getPatientById: async (id: string): Promise<PatientSummary> => {
    await delay();
    const patient = mockStore.getPatientById(id);
    if (!patient) throw new Error("Paciente não encontrado");
    return patient;
  },

  getPatientMetrics: async (userId: string): Promise<Metric[]> => {
    await delay(300);
    return mockStore.getMetrics(userId);
  },

  // ─── Invite tokens ────────────────────────────────────────────────────────────
  getMyTokens: async (): Promise<InviteToken[]> => {
    await delay();
    return mockStore.getTokensByNutritionist(currentNutritionistId());
  },

  createToken: async (params: {
    label: string;
    serviceType: ServiceType;
    priceRcents: number;
    notes?: string;
    expiresAt?: string;
  }): Promise<InviteToken> => {
    await delay();
    const nutId = currentNutritionistId();
    const nut = SEED_NUTRITIONIST_PROFILES.find((n) => n.id === nutId);
    const prefix = nut?.user.name.split(" ").at(-1)?.slice(0, 3) ?? "NUT";
    const token: InviteToken = {
      id: `tok_${Date.now()}`,
      code: generateTokenCode(prefix),
      nutritionistId: nutId,
      status: "active",
      createdAt: new Date().toISOString(),
      ...params,
    };
    mockStore.addToken(token);
    return token;
  },

  revokeToken: async (tokenId: string) => {
    await delay();
    mockStore.revokeToken(tokenId);
    return {};
  },

  // ─── Recipes ──────────────────────────────────────────────────────────────────
  getMyRecipes: async (): Promise<Recipe[]> => {
    await delay();
    return mockStore.getRecipesByNutritionist(currentNutritionistId());
  },

  createRecipe: async (params: Omit<Recipe, "id" | "nutritionistId" | "createdAt">): Promise<Recipe> => {
    await delay();
    const recipe: Recipe = {
      id: `rec_${Date.now()}`,
      nutritionistId: currentNutritionistId(),
      createdAt: new Date().toISOString(),
      ...params,
    };
    mockStore.addRecipe(recipe);
    return recipe;
  },

  deleteRecipe: async (recipeId: string) => {
    await delay();
    mockStore.deleteRecipe(recipeId);
    return {};
  },

  // ─── Patient plans ────────────────────────────────────────────────────────────
  getPatientPlan: async (userId: string) => {
    await delay(300);
    return mockStore.getPatientPlan(userId);
  },

  getAllPatientPlans: async (): Promise<import("@/types").DietPlan[]> => {
    await delay();
    return mockStore.getAllPatientPlans(currentNutritionistId());
  },

  // ─── Patient diary ────────────────────────────────────────────────────────────
  getPatientLogsForDate: async (userId: string, date: string): Promise<MealLog[]> => {
    await delay(250);
    return mockStore.getPatientLogsForDate(userId, date);
  },

  getPatientDiaryDates: async (userId: string): Promise<string[]> => {
    await delay(200);
    return mockStore.getPatientDiaryDates(userId);
  },

  // ─── Comments ─────────────────────────────────────────────────────────────────
  getCommentsForLog: async (logId: string): Promise<NutritionistComment[]> => {
    await delay(200);
    return mockStore.getCommentsForLog(logId);
  },

  addComment: async (params: {
    patientId: string;
    logId: string;
    content: string;
    isPinned?: boolean;
  }): Promise<NutritionistComment> => {
    await delay();
    const nutId = currentNutritionistId();
    const nut = SEED_NUTRITIONIST_PROFILES.find((n) => n.id === nutId);
    const comment: NutritionistComment = {
      id: `nc_${Date.now()}`,
      nutritionistId: nutId,
      patientId: params.patientId,
      entityType: "meal_log",
      entityId: params.logId,
      content: params.content,
      isPinned: params.isPinned ?? false,
      createdAt: new Date().toISOString(),
      nutritionist: { user: { name: nut?.user.name ?? "Nutricionista" } },
    };
    mockStore.addComment(comment);
    return comment;
  },

  deleteComment: async (commentId: string) => {
    await delay();
    mockStore.deleteComment(commentId);
    return {};
  },
};
