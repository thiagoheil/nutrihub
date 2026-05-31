import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { SEED_NUTRITIONIST_PROFILES } from "@/mocks/data";

const SPECIALTY_SUGGESTIONS = [
  "Emagrecimento", "Nutrição Esportiva", "Reeducação Alimentar",
  "Nutrição Funcional", "Saúde Intestinal", "Vegetarianismo",
  "Nutrição Pediátrica", "Gestantes", "Aleitamento",
  "Hipertrofia", "Diabetes", "Hipertensão",
];

export default function NutritionistEditScreen() {
  const router = useRouter();
  const user   = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const profile = SEED_NUTRITIONIST_PROFILES.find((n) => n.userId === user?.id)
    ?? SEED_NUTRITIONIST_PROFILES[0];

  const [name,        setName]        = useState(user?.name ?? "");
  const [phone,       setPhone]       = useState(user?.phone ?? "");
  const [bio,         setBio]         = useState(profile.bio ?? "");
  const [crnNumber,   setCrnNumber]   = useState(profile.crnNumber ?? "");
  const [specialties, setSpecialties] = useState<string[]>(profile.specialties ?? []);
  const [newSpec,     setNewSpec]     = useState("");
  const [saving,      setSaving]      = useState(false);

  function addSpecialty(s: string) {
    const trimmed = s.trim();
    if (!trimmed || specialties.includes(trimmed)) return;
    setSpecialties((p) => [...p, trimmed]);
    setNewSpec("");
  }

  function removeSpecialty(s: string) {
    setSpecialties((p) => p.filter((x) => x !== s));
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert("Campo obrigatório", "O nome não pode estar vazio.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    updateUser({ name: name.trim(), phone: phone.trim() });
    setSaving(false);
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Editar perfil</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
          {/* Avatar */}
          <View style={{ alignItems: "center", marginBottom: 28 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 32, fontFamily: "Inter-Bold", color: "#16A34A" }}>{name?.[0]?.toUpperCase() ?? "N"}</Text>
            </View>
          </View>

          {/* Basic info */}
          <SectionLabel>Informações pessoais</SectionLabel>
          <View style={{ gap: 14, marginBottom: 24 }}>
            <Field label="Nome completo" required>
              <TextInput value={name} onChangeText={setName} placeholder="Seu nome completo"
                placeholderTextColor="#9CA3AF" autoCapitalize="words" style={inputStyle} />
            </Field>
            <Field label="E-mail" hint="Não pode ser alterado">
              <View style={[inputStyle, { backgroundColor: "#F3F4F6", justifyContent: "center" }]}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 15, color: "#9CA3AF" }}>{user?.email}</Text>
              </View>
            </Field>
            <Field label="Telefone / WhatsApp">
              <TextInput value={phone} onChangeText={setPhone} placeholder="(11) 99999-0000"
                placeholderTextColor="#9CA3AF" keyboardType="phone-pad" style={inputStyle} />
            </Field>
            <Field label="Número do CRN">
              <TextInput value={crnNumber} onChangeText={setCrnNumber} placeholder="CRN-3 00000"
                placeholderTextColor="#9CA3AF" autoCapitalize="characters" style={inputStyle} />
            </Field>
          </View>

          {/* Bio */}
          <SectionLabel>Apresentação</SectionLabel>
          <View style={{ marginBottom: 24 }}>
            <Field label="Bio / Sobre mim">
              <TextInput
                value={bio} onChangeText={setBio}
                placeholder="Descreva sua experiência, abordagem e especialidades..."
                placeholderTextColor="#9CA3AF"
                multiline numberOfLines={5}
                style={[inputStyle, { height: 110, textAlignVertical: "top", paddingTop: 12 }]}
              />
            </Field>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
              {bio.length}/500 caracteres
            </Text>
          </View>

          {/* Specialties */}
          <SectionLabel>Especialidades</SectionLabel>
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {specialties.map((s) => (
                <TouchableOpacity
                  key={s} onPress={() => removeSpecialty(s)} activeOpacity={0.7}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#BBF7D0" }}
                >
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#16A34A" }}>{s}</Text>
                  <Ionicons name="close" size={13} color="#16A34A" />
                </TouchableOpacity>
              ))}
              {specialties.length === 0 && (
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF" }}>
                  Nenhuma especialidade adicionada
                </Text>
              )}
            </View>

            {/* Add custom */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              <TextInput
                value={newSpec} onChangeText={setNewSpec}
                placeholder="Adicionar especialidade..."
                placeholderTextColor="#9CA3AF"
                returnKeyType="done"
                onSubmitEditing={() => addSpecialty(newSpec)}
                style={[inputStyle, { flex: 1 }]}
              />
              <TouchableOpacity
                onPress={() => addSpecialty(newSpec)}
                disabled={!newSpec.trim()}
                activeOpacity={0.8}
                style={{ width: 44, height: 50, borderRadius: 12, backgroundColor: newSpec.trim() ? "#16A34A" : "#E5E7EB", alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="add" size={22} color={newSpec.trim() ? "#fff" : "#9CA3AF"} />
              </TouchableOpacity>
            </View>

            {/* Suggestions */}
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>Sugestões:</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {SPECIALTY_SUGGESTIONS.filter((s) => !specialties.includes(s)).map((s) => (
                <TouchableOpacity key={s} onPress={() => addSpecialty(s)} activeOpacity={0.7}
                  style={{ backgroundColor: "#F3F4F6", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave} activeOpacity={0.8} disabled={saving}
            style={{ backgroundColor: saving ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151" }}>{label}</Text>
        {required && <Text style={{ color: "#EF4444", fontSize: 13 }}>*</Text>}
        {hint && <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>· {hint}</Text>}
      </View>
      {children}
    </View>
  );
}

const inputStyle = {
  height: 50, borderRadius: 12, paddingHorizontal: 16,
  backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB",
  fontFamily: "Inter-Regular", fontSize: 15, color: "#111827",
} as const;
