import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface PrivacySetting {
  id: string;
  icon: string;
  label: string;
  description: string;
  sensitive?: boolean;
}

const PRIVACY_SETTINGS: PrivacySetting[] = [
  { id: "share_health", icon: "heart-outline", label: "Compartilhar dados com nutricionista", description: "Peso, métricas e registros de refeições", sensitive: false },
  { id: "location", icon: "location-outline", label: "Localização para busca", description: "Usada para encontrar nutricionistas próximos", sensitive: false },
  { id: "analytics", icon: "stats-chart-outline", label: "Analytics anônimos", description: "Ajuda a melhorar o app sem identificar você", sensitive: false },
  { id: "crash_reports", icon: "bug-outline", label: "Relatórios de erros", description: "Envia erros técnicos automaticamente", sensitive: false },
];

const LINKS = [
  { icon: "document-text-outline", label: "Termos de Uso" },
  { icon: "shield-checkmark-outline", label: "Política de Privacidade" },
  { icon: "trash-outline", label: "Excluir minha conta", danger: true },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    share_health: true,
    location: true,
    analytics: false,
    crash_reports: true,
  });

  function handleLink(label: string) {
    if (label === "Excluir minha conta") {
      Alert.alert(
        "Excluir conta",
        "Esta ação é irreversível. Todos os seus dados serão removidos permanentemente.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Excluir", style: "destructive", onPress: () => Alert.alert("Solicitação enviada", "Você receberá um e-mail de confirmação.") },
        ]
      );
    } else {
      Alert.alert(label, "Em breve disponível no app.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Privacidade</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Info banner */}
        <View style={{ backgroundColor: "#EFF6FF", borderRadius: 14, padding: 14, marginBottom: 24, flexDirection: "row", gap: 10, alignItems: "flex-start" }}>
          <Ionicons name="information-circle-outline" size={18} color="#3B82F6" style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 13, color: "#1D4ED8", lineHeight: 19 }}>
            Seus dados de saúde são armazenados com criptografia e nunca vendidos a terceiros.
          </Text>
        </View>

        {/* Toggles */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          Permissões de dados
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 }}>
          {PRIVACY_SETTINGS.map((item, i) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row", alignItems: "center", padding: 14, gap: 12,
                borderBottomWidth: i < PRIVACY_SETTINGS.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={item.icon as any} size={18} color="#6B7280" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>{item.label}</Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{item.description}</Text>
              </View>
              <Switch
                value={settings[item.id]}
                onValueChange={(v) => setSettings((prev) => ({ ...prev, [item.id]: v }))}
                trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                thumbColor={settings[item.id] ? "#16A34A" : "#fff"}
                ios_backgroundColor="#E5E7EB"
              />
            </View>
          ))}
        </View>

        {/* Links */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>
          Legal e conta
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {LINKS.map((link, i) => (
            <TouchableOpacity
              key={link.label}
              onPress={() => handleLink(link.label)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row", alignItems: "center", padding: 16, gap: 12,
                borderBottomWidth: i < LINKS.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <Ionicons name={link.icon as any} size={20} color={(link as any).danger ? "#EF4444" : "#6B7280"} />
              <Text style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 15, color: (link as any).danger ? "#EF4444" : "#374151" }}>
                {link.label}
              </Text>
              {!(link as any).danger && <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
