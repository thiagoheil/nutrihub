import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { metricsService } from "@/services/metrics.service";
import { MetricPayload } from "@/types";

export const metricsKeys = {
  all: ["metrics"] as const,
  list: () => [...metricsKeys.all, "list"] as const,
  latest: () => [...metricsKeys.all, "latest"] as const,
};

export function useMetrics() {
  return useQuery({
    queryKey: metricsKeys.list(),
    queryFn: metricsService.getAll,
  });
}

export function useLatestMetric() {
  return useQuery({
    queryKey: metricsKeys.latest(),
    queryFn: metricsService.getLatest,
  });
}

export function useCreateMetric() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MetricPayload) => metricsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: metricsKeys.all });
    },
  });
}
