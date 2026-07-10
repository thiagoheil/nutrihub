import type { LoginPayload, RegisterPayload, User, AuthTokens } from "@/types";
import { supabase } from "@/lib/supabase";
import { mapUser } from "@/lib/mappers";
import { clearSessionCache } from "@/lib/session";

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

async function fetchProfile(id: string): Promise<User> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error || !data) throw new Error("Perfil não encontrado");
  return mapUser(data);
}

export const authService = {
  login: async ({ email, password }: LoginPayload): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      throw Object.assign(new Error("E-mail ou senha incorretos"), { response: { status: 401 } });
    }
    clearSessionCache();
    const user = await fetchProfile(data.user.id);
    return {
      user,
      tokens: { accessToken: data.session.access_token, refreshToken: data.session.refresh_token },
    };
  },

  register: async ({ name, email, password, role, phone }: RegisterPayload): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role, phone, app: "nutrihub" } },
    });
    if (error) {
      const conflict = /registered|already|exists/i.test(error.message);
      throw Object.assign(new Error(conflict ? "E-mail já cadastrado" : error.message), {
        response: { status: conflict ? 409 : 400 },
      });
    }

    // NutriHub signups are auto-confirmed (DB trigger); grab or create a session.
    let session = data.session;
    if (!session) {
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signinError || !signinData.session) {
        throw new Error("Cadastro criado, mas não foi possível iniciar a sessão.");
      }
      session = signinData.session;
    }

    clearSessionCache();
    const uid = session.user.id;
    // Profile is created client-side (no auth trigger on the shared project).
    await supabase.from("profiles").upsert(
      { id: uid, name, email, role, phone: phone ?? null },
      { onConflict: "id" }
    );
    // Nutritionists need a professional profile row for their features to work.
    if (role === "nutritionist") {
      await supabase.from("nutritionist_profiles").upsert(
        { user_id: uid, crn_number: "", specialties: [] },
        { onConflict: "user_id" }
      );
    }
    const user = await fetchProfile(uid);
    return {
      user,
      tokens: { accessToken: session.access_token, refreshToken: session.refresh_token },
    };
  },

  me: async (): Promise<User> => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw new Error("Not authenticated");
    return fetchProfile(data.session.user.id);
  },

  logout: async () => {
    await supabase.auth.signOut();
    clearSessionCache();
    return {};
  },
};
