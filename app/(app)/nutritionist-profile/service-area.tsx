import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SEED_NUTRITIONIST_PROFILES } from "@/mocks/data";
import { useAuthStore } from "@/store/auth.store";

const RADIUS_PRESETS = [5, 10, 20, 30, 50, 100];

function RadiusRing({ radius, maxRadius }: { radius: number; maxRadius: number }) {
  const pct = Math.min(radius / maxRadius, 1);
  const rings = [0.25, 0.5, 0.75, 1];
  return (
    <View style={{ alignItems: "center", justifyContent: "center", height: 200, marginVertical: 8 }}>
      {rings.map((r) => (
        <View
          key={r}
          style={{
            position: "absolute",
            width: 200 * r, height: 200 * r,
            borderRadius: 200 * r,
            borderWidth: 1,
            borderColor: pct >= r ? "#86EFAC" : "#F3F4F6",
            backgroundColor: pct >= r ? "rgba(22,163,74,0.04)" : "transparent",
          }}
        />
      ))}
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
        <Ionicons name="location" size={18} color="#fff" />
      </View>
      <Text style={{ position: "absolute", bottom: 4, fontFamily: "Inter-SemiBold", fontSize: 13, color: "#16A34A" }}>
        {radius} km
      </Text>
    </View>
  );
}

export default function ServiceAreaScreen() {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const profile = SEED_NUTRITIONIST_PROFILES.find((n) => n.userId === user?.id)
    ?? SEED_NUTRITIONIST_PROFILES[0];

  const [radius,    setRadius]    = useState(profile.serviceRadiusKm);
  const [city,      setCity]      = useState("São Paulo");
  const [state,     setState]     = useState("SP");
  const [online,    setOnline]    = useState(true);
  const [inPerson,  setInPerson]  = useState(true);
  const [saving,    setSaving]    = useState(false);

  function increment(delta: number) {
    setRadius((r) => Math.max(1, Math.min(200, r + delta)));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    Alert.alert("Salvo!", "Área de atendimento atualizada.", [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Área de atendimento</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Radius visualizer */}
        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, alignItems: "center" }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827", marginBottom: 4 }}>
            Raio de atendimento presencial
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>
            Pacientes nessa distância podem te encontrar na busca
          </Text>

          <RadiusRing radius={radius} maxRadius={200} />

          {/* Controls */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginTop: 4 }}>
            <TouchableOpacity onPress={() => increment(-5)}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="remove" size={20} color="#16A34A" />
            </TouchableOpacity>
            <View style={{ alignItems: "center", minWidth: 80 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 32, color: "#16A34A" }}>{radius}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>quilômetros</Text>
            </View>
            <TouchableOpacity onPress={() => increment(5)}
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="add" size={20} color="#16A34A" />
            </TouchableOpacity>
          </View>

          {/* Presets */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16, justifyContent: "center" }}>
            {RADIUS_PRESETS.map((r) => (
              <TouchableOpacity key={r} onPress={() => setRadius(r)} activeOpacity={0.75}
                style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: radius === r ? "#16A34A" : "#F3F4F6", borderWidth: radius === r ? 0 : 1, borderColor: "#E5E7EB" }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: radius === r ? "#fff" : "#6B7280" }}>
                  {r} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Localização base
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 14 }}>
          <View>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>Cidade</Text>
            <TextInput
              value={city} onChangeText={setCity}
              placeholder="Sua cidade"
              placeholderTextColor="#9CA3AF"
              style={{ height: 48, borderRadius: 12, paddingHorizontal: 14, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", fontFamily: "Inter-Regular", fontSize: 15, color: "#111827" }}
            />
          </View>
          <View>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>Estado</Text>
            <TextInput
              value={state} onChangeText={setState}
              placeholder="UF"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={2}
              style={{ height: 48, borderRadius: 12, paddingHorizontal: 14, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", fontFamily: "Inter-Regular", fontSize: 15, color: "#111827" }}
            />
          </View>
        </View>

        {/* Modalities */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Modalidades
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 28 }}>
          {[
            { label: "Atendimento presencial", icon: "business-outline",  value: inPerson, set: setInPerson,
              desc: "Pacientes dentro do raio podem solicitar consultas presenciais" },
            { label: "Atendimento online",     icon: "videocam-outline",   value: online,   set: setOnline,
              desc: "Pacientes de qualquer lugar podem solicitar consultas online" },
          ].map((item, i) => (
            <View key={item.label} style={{ padding: 16, borderBottomWidth: i === 0 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: item.value ? "#F0FDF4" : "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name={item.icon as any} size={18} color={item.value ? "#16A34A" : "#9CA3AF"} />
                </View>
                <Text style={{ flex: 1, fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{item.label}</Text>
                <TouchableOpacity
                  onPress={() => item.set((v) => !v)}
                  style={{ width: 44, height: 26, borderRadius: 13, backgroundColor: item.value ? "#16A34A" : "#E5E7EB", justifyContent: "center", paddingHorizontal: 2 }}
                >
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#fff", marginLeft: item.value ? "auto" : 0 }} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginLeft: 48 }}>{item.desc}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={handleSave} activeOpacity={0.8} disabled={saving}
          style={{ backgroundColor: saving ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>
            {saving ? "Salvando..." : "Salvar área de atendimento"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
