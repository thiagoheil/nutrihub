import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { nutritionistService } from "@/services/nutritionist.service";
import type { ServiceType } from "@/types";

export const nutritionistKeys = {
  all: ["nutritionist"] as const,
  nearby: (lat: number, lng: number) => [...nutritionistKeys.all, "nearby", lat, lng] as const,
  detail: (id: string) => [...nutritionistKeys.all, id] as const,
  myRequest: () => [...nutritionistKeys.all, "my-request"] as const,
  pending: () => [...nutritionistKeys.all, "pending-requests"] as const,
  patients: () => [...nutritionistKeys.all, "patients"] as const,
  patient: (id: string) => [...nutritionistKeys.all, "patient", id] as const,
  patientMetrics: (userId: string) => [...nutritionistKeys.all, "patient-metrics", userId] as const,
  tokens: () => [...nutritionistKeys.all, "tokens"] as const,
  recipes: () => [...nutritionistKeys.all, "recipes"] as const,
};

export function useNearbyNutritionists(coords: { latitude: number; longitude: number } | null) {
  return useQuery({
    queryKey: coords ? nutritionistKeys.nearby(coords.latitude, coords.longitude) : [],
    queryFn: () =>
      nutritionistService.findNearby({
        latitude: coords!.latitude,
        longitude: coords!.longitude,
        radiusKm: 50,
      }),
    enabled: !!coords,
  });
}

export function useNutritionistDetail(id: string) {
  return useQuery({
    queryKey: nutritionistKeys.detail(id),
    queryFn: () => nutritionistService.getById(id),
    enabled: !!id,
  });
}

export function useMyConnectionRequest() {
  return useQuery({
    queryKey: nutritionistKeys.myRequest(),
    queryFn: nutritionistService.getMyRequest,
  });
}

export function useSendConnectionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ nutritionistId, message }: { nutritionistId: string; message?: string }) =>
      nutritionistService.sendRequest(nutritionistId, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.myRequest() }),
  });
}

export function useFindNutritionistByCode() {
  return useMutation({
    mutationFn: (code: string) => nutritionistService.findByCode(code),
  });
}

export function useFindTokenByCode() {
  return useMutation({
    mutationFn: (code: string) => nutritionistService.findTokenByCode(code),
  });
}

export function useConnectByCode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ nutritionistId, code }: { nutritionistId: string; code: string }) =>
      nutritionistService.connectByCode(nutritionistId, code),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: nutritionistKeys.myRequest() });
      qc.invalidateQueries({ queryKey: nutritionistKeys.tokens() });
    },
  });
}

export function useCancelConnectionRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => nutritionistService.cancelRequest(requestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.myRequest() }),
  });
}

export function useRespondToRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, accept }: { requestId: string; accept: boolean }) =>
      nutritionistService.respondToRequest(requestId, accept),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.pending() }),
  });
}

export function usePendingRequests() {
  return useQuery({
    queryKey: nutritionistKeys.pending(),
    queryFn: nutritionistService.getPendingRequests,
  });
}

export function useMyPatients() {
  return useQuery({
    queryKey: nutritionistKeys.patients(),
    queryFn: nutritionistService.getMyPatients,
  });
}

export function usePatientDetail(id: string) {
  return useQuery({
    queryKey: nutritionistKeys.patient(id),
    queryFn: () => nutritionistService.getPatientById(id),
    enabled: !!id,
  });
}

export function usePatientMetrics(userId: string) {
  return useQuery({
    queryKey: nutritionistKeys.patientMetrics(userId),
    queryFn: () => nutritionistService.getPatientMetrics(userId),
    enabled: !!userId,
  });
}

export function useMyTokens() {
  return useQuery({
    queryKey: nutritionistKeys.tokens(),
    queryFn: nutritionistService.getMyTokens,
  });
}

export function useCreateToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      label: string;
      serviceType: ServiceType;
      priceRcents: number;
      notes?: string;
      expiresAt?: string;
    }) => nutritionistService.createToken(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.tokens() }),
  });
}

export function useRevokeToken() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tokenId: string) => nutritionistService.revokeToken(tokenId),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.tokens() }),
  });
}

export function useMyRecipes() {
  return useQuery({
    queryKey: nutritionistKeys.recipes(),
    queryFn: nutritionistService.getMyRecipes,
  });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: nutritionistService.createRecipe,
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.recipes() }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (recipeId: string) => nutritionistService.deleteRecipe(recipeId),
    onSuccess: () => qc.invalidateQueries({ queryKey: nutritionistKeys.recipes() }),
  });
}

export function useUserLocation() {
  return useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return { latitude: -23.5505, longitude: -46.6333 };
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}
