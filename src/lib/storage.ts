import * as SecureStore from "expo-secure-store";
import { AuthTokens } from "@/types";

const TOKENS_KEY = "auth_tokens";

export const storage = {
  getTokens(): AuthTokens | null {
    // SecureStore is sync on native, but we cache in memory for performance
    const raw = SecureStore.getItem(TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setTokens(tokens: AuthTokens): void {
    SecureStore.setItem(TOKENS_KEY, JSON.stringify(tokens));
  },

  clearTokens(): void {
    SecureStore.deleteItemAsync(TOKENS_KEY);
  },
};
