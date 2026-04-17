import { api } from "@/lib/api";
import { Metric, MetricPayload } from "@/types";

export const metricsService = {
  getAll: () =>
    api.get<Metric[]>("/metrics").then((r) => r.data),

  getLatest: () =>
    api.get<Metric>("/metrics/latest").then((r) => r.data),

  create: (payload: MetricPayload) =>
    api.post<Metric>("/metrics", payload).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/metrics/${id}`).then((r) => r.data),
};
