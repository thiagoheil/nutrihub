import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Location from "expo-location";
import { nutritionistService } from "@/services/nutritionist.service";

export const nutritionistKeys = {
  all: ["nutritionist"] as const,
  nearby: (lat: number, lng: number) => [...nutritionistKeys.all, "nearby", lat, lng] as const,
  detail: (id: string) => [...nutritionistKeys.all, id] as const,
  myRequest: () => [...nutritionistKeys.all, "my-request"] as const,
  pending: () => [...nutritionistKeys.all, "pending-requests"] as const,
  patients: () => [...nutritionistKeys.all, "patients"] as const,
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

// Hook to get user's current location with permission handling
export function useUserLocation() {
  return useQuery({
    queryKey: ["location"],
    queryFn: async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // fallback para São Paulo quando permissão negada (modo mock/dev)
        return { latitude: -23.5505, longitude: -46.6333 };
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}
