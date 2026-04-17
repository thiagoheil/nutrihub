import { api } from "@/lib/api";
import { LoginPayload, RegisterPayload, User, AuthTokens } from "@/types";

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  me: () =>
    api.get<User>("/auth/me").then((r) => r.data),

  logout: () =>
    api.post("/auth/logout").then((r) => r.data),
};
