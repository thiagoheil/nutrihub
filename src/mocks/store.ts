import type { Metric, MealLog, ConnectionRequest, DietPlan } from "@/types";
import {
  SEED_USERS,
  SEED_METRICS,
  SEED_TODAY_LOGS,
  SEED_PENDING_REQUESTS,
  type MockUser,
} from "./data";

let users = new Map<string, MockUser>(SEED_USERS.map((u) => [u.id, u]));
let usersByEmail = new Map<string, MockUser>(SEED_USERS.map((u) => [u.email, u]));
let metricsPerUser = new Map<string, Metric[]>([["u1", [...SEED_METRICS]]]);
let todayLogs: MealLog[] = [...SEED_TODAY_LOGS];
let connections: ConnectionRequest[] = [...SEED_PENDING_REQUESTS];
let userIdCounter = 100;
let activeDietPlan: DietPlan | null = null;
let pendingFoodSelections: Record<string, string[]> | null = null;

export const mockStore = {
  getUserById(id: string): MockUser | undefined {
    return users.get(id);
  },
  getUserByEmail(email: string): MockUser | undefined {
    return usersByEmail.get(email);
  },
  addUser(user: MockUser): void {
    users.set(user.id, user);
    usersByEmail.set(user.email, user);
  },
  nextUserId(): string {
    return `u${++userIdCounter}`;
  },

  getMetrics(userId: string): Metric[] {
    return metricsPerUser.get(userId) ?? [];
  },
  getLatestMetric(userId: string): Metric | undefined {
    return (metricsPerUser.get(userId) ?? []).at(-1);
  },
  addMetric(userId: string, metric: Metric): void {
    const list = metricsPerUser.get(userId) ?? [];
    metricsPerUser.set(userId, [...list, metric]);
  },
  deleteMetric(metricId: string): void {
    for (const [userId, list] of metricsPerUser) {
      metricsPerUser.set(userId, list.filter((m) => m.id !== metricId));
    }
  },

  getTodayLogs(): MealLog[] {
    return todayLogs;
  },
  addLog(log: MealLog): void {
    todayLogs = [...todayLogs, log];
  },

  getPendingRequests(nutritionistId: string): ConnectionRequest[] {
    return connections.filter(
      (c) => c.nutritionistId === nutritionistId && c.status === "pending"
    );
  },
  getMyRequest(userId: string): ConnectionRequest | null {
    return connections.find((c) => c.userId === userId) ?? null;
  },
  addConnection(conn: ConnectionRequest): void {
    connections = [...connections, conn];
  },
  respondToRequest(requestId: string, accept: boolean): void {
    connections = connections.map((c) =>
      c.id === requestId
        ? { ...c, status: accept ? "accepted" : "rejected", respondedAt: new Date().toISOString() }
        : c
    );
  },
  cancelRequest(requestId: string): void {
    connections = connections.filter((c) => c.id !== requestId);
  },

  getActivePlan(): DietPlan | null {
    return activeDietPlan;
  },
  setActivePlan(plan: DietPlan): void {
    activeDietPlan = plan;
  },

  getPendingFoodSelections(): Record<string, string[]> | null {
    return pendingFoodSelections;
  },
  setPendingFoodSelections(selections: Record<string, string[]>): void {
    pendingFoodSelections = selections;
  },
};
