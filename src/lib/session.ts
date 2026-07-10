import { supabase } from "./supabase";

/** Current authenticated user id (from the locally-persisted session). */
export async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) throw new Error("Não autenticado");
  return data.session.user.id;
}

let profileCache: { uid: string; name: string } | null = null;
export async function currentUserName(): Promise<string> {
  const uid = await currentUserId();
  if (profileCache?.uid === uid) return profileCache.name;
  const { data } = await supabase.from("profiles").select("name").eq("id", uid).single();
  const name = data?.name ?? "Usuário";
  profileCache = { uid, name };
  return name;
}

let nutCache: { uid: string; nid: string } | null = null;
/** nutritionist_profiles.id for the current user (throws if not a nutritionist). */
export async function currentNutritionistId(): Promise<string> {
  const uid = await currentUserId();
  if (nutCache?.uid === uid) return nutCache.nid;
  const { data, error } = await supabase
    .from("nutritionist_profiles")
    .select("id")
    .eq("user_id", uid)
    .single();
  if (error || !data) throw new Error("Perfil de nutricionista não encontrado");
  nutCache = { uid, nid: data.id };
  return data.id;
}

export function clearSessionCache() {
  profileCache = null;
  nutCache = null;
}
