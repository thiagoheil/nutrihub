import type { Metric, MetricPayload } from "@/types";
import { mockStore } from "@/mocks/store";
import { storage } from "@/lib/storage";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const currentUserId = () =>
  storage.getTokens()?.accessToken?.replace("mock_token_", "") ?? "u1";

export const metricsService = {
  getAll: async (): Promise<Metric[]> => {
    await delay();
    return mockStore.getMetrics(currentUserId());
  },

  getLatest: async (): Promise<Metric> => {
    await delay();
    const metric = mockStore.getLatestMetric(currentUserId());
    if (!metric) throw new Error("Nenhuma métrica encontrada");
    return metric;
  },

  create: async (payload: MetricPayload): Promise<Metric> => {
    await delay();
    const userId = currentUserId();
    const metric: Metric = {
      id: `met_${Date.now()}`,
      userId,
      ...payload,
      bmi:
        payload.weightKg && payload.heightCm
          ? +((payload.weightKg / (payload.heightCm / 100) ** 2).toFixed(1))
          : undefined,
    };
    mockStore.addMetric(userId, metric);
    return metric;
  },

  delete: async (id: string) => {
    await delay();
    mockStore.deleteMetric(id);
    return {};
  },
};
