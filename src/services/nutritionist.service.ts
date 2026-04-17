import { api } from "@/lib/api";
import { NutritionistProfile, ConnectionRequest } from "@/types";

interface NearbyParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  specialties?: string[];
}

export const nutritionistService = {
  // Discovery
  findNearby: (params: NearbyParams) =>
    api.get<NutritionistProfile[]>("/nutritionists/nearby", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<NutritionistProfile>(`/nutritionists/${id}`).then((r) => r.data),

  // Connection flow
  sendRequest: (nutritionistId: string, message?: string) =>
    api.post<ConnectionRequest>("/connections", { nutritionistId, message }).then((r) => r.data),

  getMyRequest: () =>
    api.get<ConnectionRequest | null>("/connections/mine").then((r) => r.data),

  cancelRequest: (requestId: string) =>
    api.delete(`/connections/${requestId}`).then((r) => r.data),

  // Nutritionist side
  getPendingRequests: () =>
    api.get<ConnectionRequest[]>("/connections/pending").then((r) => r.data),

  respondToRequest: (requestId: string, accept: boolean) =>
    api.patch(`/connections/${requestId}`, { accept }).then((r) => r.data),

  getMyPatients: () =>
    api.get<NutritionistProfile[]>("/nutritionists/patients").then((r) => r.data),
};
