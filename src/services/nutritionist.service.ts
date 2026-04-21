import type { NutritionistProfile, ConnectionRequest } from "@/types";
import { SEED_NUTRITIONIST_PROFILES, SEED_PATIENTS } from "@/mocks/data";
import { mockStore } from "@/mocks/store";
import { storage } from "@/lib/storage";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const currentUserId = () =>
  storage.getTokens()?.accessToken?.replace("mock_token_", "") ?? "u1";

interface NearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  specialties?: string[];
}

export const nutritionistService = {
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
    // np1 é o perfil do nutricionista u2 (ana@test.com)
    return mockStore.getPendingRequests("np1");
  },

  respondToRequest: async (requestId: string, accept: boolean) => {
    await delay();
    mockStore.respondToRequest(requestId, accept);
    return {};
  },

  getMyPatients: async (): Promise<NutritionistProfile[]> => {
    await delay();
    return SEED_PATIENTS;
  },
};
