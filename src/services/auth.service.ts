import type { LoginPayload, RegisterPayload, User, AuthTokens } from "@/types";
import { storage } from "@/lib/storage";
import { mockStore } from "@/mocks/store";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const toTokens = (userId: string): AuthTokens => ({
  accessToken: `mock_token_${userId}`,
  refreshToken: `mock_refresh_${userId}`,
});

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    await delay();
    const found = mockStore.getUserByEmail(payload.email);
    if (!found || found.password !== payload.password) {
      throw Object.assign(new Error("E-mail ou senha incorretos"), {
        response: { status: 401 },
      });
    }
    const { password: _p, ...user } = found;
    return { user: user as User, tokens: toTokens(found.id) };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    await delay();
    if (mockStore.getUserByEmail(payload.email)) {
      throw Object.assign(new Error("E-mail já cadastrado"), {
        response: { status: 409 },
      });
    }
    const id = mockStore.nextUserId();
    const newUser = {
      id,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      phone: payload.phone,
      createdAt: new Date().toISOString(),
    };
    mockStore.addUser(newUser);
    const { password: _p, ...user } = newUser;
    return { user: user as User, tokens: toTokens(id) };
  },

  me: async (): Promise<User> => {
    await delay(100);
    const tokens = storage.getTokens();
    if (!tokens?.accessToken) throw new Error("Not authenticated");
    const userId = tokens.accessToken.replace("mock_token_", "");
    const found = mockStore.getUserById(userId);
    if (!found) throw new Error("User not found");
    const { password: _p, ...user } = found;
    return user as User;
  },

  logout: async () => {
    await delay(100);
    return {};
  },
};
