import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

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

        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 8 }}>
          {/* Avatar */}
          <View style={{ alignItems: "center", marginBottom: 32 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 32, fontFamily: "Inter-Bold", color: "#16A34A" }}>{name?.[0]?.toUpperCase() ?? "?"}</Text>
            </View>
          </View>

          {/* Fields */}
          <View style={{ gap: 16 }}>
            <Field label="Nome completo" required>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                style={inputStyle}
              />
            </Field>

            <Field label="E-mail" hint="Não pode ser alterado">
              <View style={[inputStyle, { backgroundColor: "#F3F4F6", justifyContent: "center" }]}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 15, color: "#9CA3AF" }}>{user?.email}</Text>
              </View>
            </Field>

            <Field label="Telefone">
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="(11) 99999-0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                style={inputStyle}
              />
            </Field>

            <Field label="Tipo de conta">
              <View style={[inputStyle, { backgroundColor: "#F3F4F6", justifyContent: "center" }]}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 15, color: "#9CA3AF" }}>
                  {user?.role === "nutritionist" ? "Nutricionista" : "Usuário"}
                </Text>
              </View>
            </Field>
          </View>

          {/* Save */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={saving}
            style={{ marginTop: 32, backgroundColor: saving ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
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
