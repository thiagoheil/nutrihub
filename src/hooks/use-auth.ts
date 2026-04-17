import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { queryClient } from "@/lib/query-client";
import { LoginPayload, RegisterPayload } from "@/types";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    staleTime: Infinity,
  });
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      router.replace(user.role === "nutritionist" ? "/(app)/(nutritionist)" : "/(app)/(tabs)");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      router.replace("/(app)/(tabs)");
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
      router.replace("/(auth)/login");
    },
  });
}
