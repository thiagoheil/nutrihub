import type { Metric, MealLog, ConnectionRequest, DietPlan, InviteToken, Recipe, PatientSummary, NutritionistComment } from "@/types";
import {
  SEED_USERS,
  SEED_METRICS,
  SEED_TODAY_LOGS,
  SEED_PENDING_REQUESTS,
  SEED_INVITE_TOKENS,
  SEED_PATIENT_CONNECTIONS,
  SEED_PATIENT_SUMMARIES,
  SEED_PATIENT_METRICS,
  SEED_RECIPES,
  SEED_PATIENT_DIARY_LOGS,
  SEED_NUTRITIONIST_COMMENTS,
  SEED_PATIENT_PLANS,
  type MockUser,
} from "./data";

let users = new Map<string, MockUser>(SEED_USERS.map((u) => [u.id, u]));
let usersByEmail = new Map<string, MockUser>(SEED_USERS.map((u) => [u.email, u]));
let metricsPerUser = new Map<string, Metric[]>([
  ["u1", [...SEED_METRICS]],
  ...Object.entries(SEED_PATIENT_METRICS).map(([uid, m]) => [uid, [...m]] as [string, Metric[]]),
]);
let todayLogs: MealLog[] = [...SEED_TODAY_LOGS];
let connections: ConnectionRequest[] = [...SEED_PENDING_REQUESTS, ...SEED_PATIENT_CONNECTIONS];
let inviteTokens: InviteToken[] = [...SEED_INVITE_TOKENS];
let recipes: Recipe[] = [...SEED_RECIPES];
let patientSummaries: PatientSummary[] = [...SEED_PATIENT_SUMMARIES];
let nutritionistComments: NutritionistComment[] = [...SEED_NUTRITIONIST_COMMENTS];
let patientPlans: DietPlan[] = [...SEED_PATIENT_PLANS];
// Deep copy patient diary logs: Record<userId, Map<date, MealLog[]>>
const patientDiaryLogs: Record<string, Map<string, MealLog[]>> = Object.fromEntries(
  Object.entries(SEED_PATIENT_DIARY_LOGS).map(([uid, dates]) => [
    uid,
    new Map(Object.entries(dates).map(([date, logs]) => [date, [...logs]])),
  ])
);
let userIdCounter = 100;
let activeDietPlan: DietPlan | null = null;
let pendingFoodSelections: Record<string, string[]> | null = null;

// Per-date meal logs (historic diary)
let logsPerDate: Map<string, MealLog[]> = new Map([
  ["2026-05-05", [
    { id: "dl1", mealId: "m1", loggedAt: "2026-05-05T07:10:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl2", mealId: "m2", loggedAt: "2026-05-05T12:15:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl3", mealId: "m3", loggedAt: "2026-05-05T15:45:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl4", mealId: "m4", loggedAt: "2026-05-05T19:40:00Z", status: "eaten", adherencePct: 100 },
  ]],
  ["2026-05-07", [
    { id: "dl5", mealId: "m1", loggedAt: "2026-05-07T07:00:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl6", mealId: "m2", loggedAt: "2026-05-07T12:30:00Z", status: "partial", adherencePct: 70 },
  ]],
  ["2026-05-09", [
    { id: "dl7", mealId: "m1", loggedAt: "2026-05-09T07:20:00Z", status: "eaten", adherencePct: 100 },
  ]],
  ["2026-05-10", [
    { id: "dl8", mealId: "m1", loggedAt: "2026-05-10T07:30:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl9", mealId: "m3", loggedAt: "2026-05-10T15:30:00Z", status: "eaten", adherencePct: 100 },
  ]],
  ["2026-05-11", [
    { id: "dl10", mealId: "m1", loggedAt: "2026-05-11T07:05:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl11", mealId: "m2", loggedAt: "2026-05-11T12:10:00Z", status: "eaten", adherencePct: 100 },
    { id: "dl12", mealId: "m3", loggedAt: "2026-05-11T15:30:00Z", status: "eaten", adherencePct: 100 },
  ]],
]);

export const mockStore = {
  // ─── Users ────────────────────────────────────────────────────────────────────
  getUserById(id: string): MockUser | undefined { return users.get(id); },
  getUserByEmail(email: string): MockUser | undefined { return usersByEmail.get(email); },
  addUser(user: MockUser): void {
    users.set(user.id, user);
    usersByEmail.set(user.email, user);
  },
  nextUserId(): string { return `u${++userIdCounter}`; },

  // ─── Metrics ──────────────────────────────────────────────────────────────────
  getMetrics(userId: string): Metric[] { return metricsPerUser.get(userId) ?? []; },
  getLatestMetric(userId: string): Metric | undefined { return (metricsPerUser.get(userId) ?? []).at(-1); },
  addMetric(userId: string, metric: Metric): void {
    const list = metricsPerUser.get(userId) ?? [];
    metricsPerUser.set(userId, [...list, metric]);
  },
  deleteMetric(metricId: string): void {
    for (const [userId, list] of metricsPerUser) {
      metricsPerUser.set(userId, list.filter((m) => m.id !== metricId));
    }
  },

  // ─── Today logs ───────────────────────────────────────────────────────────────
  getTodayLogs(): MealLog[] { return todayLogs; },
  addLog(log: MealLog): void { todayLogs = [...todayLogs, log]; },

  // ─── Per-date logs ────────────────────────────────────────────────────────────
  getLogsForDate(date: string): MealLog[] {
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) return todayLogs;
    return logsPerDate.get(date) ?? [];
  },
  addLogForDate(date: string, log: MealLog): void {
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) { todayLogs = [...todayLogs, log]; return; }
    const list = logsPerDate.get(date) ?? [];
    logsPerDate.set(date, [...list, log]);
  },
  removeLogForDate(date: string, logId: string): void {
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) { todayLogs = todayLogs.filter((l) => l.id !== logId); return; }
    const list = logsPerDate.get(date) ?? [];
    logsPerDate.set(date, list.filter((l) => l.id !== logId));
  },
  getDiaryDates(): { date: string; count: number }[] {
    const result: { date: string; count: number }[] = [];
    for (const [date, logs] of logsPerDate) {
      if (logs.length > 0) result.push({ date, count: logs.length });
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (todayLogs.length > 0 && !result.find((r) => r.date === todayStr)) {
      result.push({ date: todayStr, count: todayLogs.length });
    }
    return result;
  },

  // ─── Connections ──────────────────────────────────────────────────────────────
  getPendingRequests(nutritionistId: string): ConnectionRequest[] {
    return connections.filter((c) => c.nutritionistId === nutritionistId && c.status === "pending");
  },
  getMyRequest(userId: string): ConnectionRequest | null {
    return connections.find((c) => c.userId === userId) ?? null;
  },
  addConnection(conn: ConnectionRequest): void { connections = [...connections, conn]; },
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
  getAcceptedPatients(nutritionistId: string): ConnectionRequest[] {
    return connections.filter((c) => c.nutritionistId === nutritionistId && c.status === "accepted");
  },

  // ─── Invite tokens ────────────────────────────────────────────────────────────
  getTokensByNutritionist(nutritionistId: string): InviteToken[] {
    return inviteTokens.filter((t) => t.nutritionistId === nutritionistId);
  },
  findTokenByCode(code: string): InviteToken | null {
    return inviteTokens.find((t) => t.code.toUpperCase() === code.toUpperCase()) ?? null;
  },
  addToken(token: InviteToken): void { inviteTokens = [...inviteTokens, token]; },
  useToken(tokenId: string, userId: string, userName: string): void {
    inviteTokens = inviteTokens.map((t) =>
      t.id === tokenId
        ? { ...t, status: "used", usedAt: new Date().toISOString(), usedByUserId: userId, usedByName: userName }
        : t
    );
  },
  revokeToken(tokenId: string): void {
    inviteTokens = inviteTokens.map((t) => t.id === tokenId ? { ...t, status: "revoked" } : t);
  },

  // ─── Patients ─────────────────────────────────────────────────────────────────
  getMyPatients(): PatientSummary[] { return patientSummaries; },
  getPatientById(id: string): PatientSummary | undefined {
    return patientSummaries.find((p) => p.id === id || p.userId === id);
  },
  addPatient(patient: PatientSummary): void { patientSummaries = [...patientSummaries, patient]; },

  // ─── Recipes ──────────────────────────────────────────────────────────────────
  getRecipesByNutritionist(nutritionistId: string): Recipe[] {
    return recipes.filter((r) => r.nutritionistId === nutritionistId);
  },
  addRecipe(recipe: Recipe): void { recipes = [...recipes, recipe]; },
  deleteRecipe(recipeId: string): void { recipes = recipes.filter((r) => r.id !== recipeId); },

  // ─── Patient diary (nutritionist view) ───────────────────────────────────────
  getPatientLogsForDate(userId: string, date: string): MealLog[] {
    return patientDiaryLogs[userId]?.get(date) ?? [];
  },
  getPatientDiaryDates(userId: string): string[] {
    return Array.from(patientDiaryLogs[userId]?.keys() ?? []).sort();
  },

  // ─── Nutritionist comments ────────────────────────────────────────────────────
  getCommentsForLog(logId: string): NutritionistComment[] {
    return nutritionistComments.filter((c) => c.entityId === logId);
  },
  getCommentsForPatientDate(patientId: string, date: string): NutritionistComment[] {
    const logs = Object.values(patientDiaryLogs[patientId] ? Object.fromEntries(patientDiaryLogs[patientId]) : {})
      .flat()
      .filter((l) => l.loggedAt.startsWith(date))
      .map((l) => l.id);
    return nutritionistComments.filter((c) => c.patientId === patientId && logs.includes(c.entityId));
  },
  addComment(comment: NutritionistComment): void {
    nutritionistComments = [...nutritionistComments, comment];
  },
  deleteComment(commentId: string): void {
    nutritionistComments = nutritionistComments.filter((c) => c.id !== commentId);
  },

  // ─── Patient plans (nutritionist-assigned) ────────────────────────────────────
  getPatientPlan(userId: string): DietPlan | null {
    return patientPlans.find((p) => p.userId === userId) ?? null;
  },
  getAllPatientPlans(nutritionistId: string): DietPlan[] {
    return patientPlans.filter((p) => p.nutritionistId === nutritionistId);
  },
  upsertPatientPlan(plan: DietPlan): void {
    const idx = patientPlans.findIndex((p) => p.userId === plan.userId);
    if (idx >= 0) patientPlans = patientPlans.map((p, i) => (i === idx ? plan : p));
    else patientPlans = [...patientPlans, plan];
  },

  // ─── Diet plan (self) ─────────────────────────────────────────────────────────
  getActivePlan(): DietPlan | null { return activeDietPlan; },
  setActivePlan(plan: DietPlan): void { activeDietPlan = plan; },

  getPendingFoodSelections(): Record<string, string[]> | null { return pendingFoodSelections; },
  setPendingFoodSelections(selections: Record<string, string[]>): void { pendingFoodSelections = selections; },
};
