import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { useMyPatients, usePendingRequests, useMyTokens } from "@/hooks/use-nutritionist";
import { Ionicons } from "@expo/vector-icons";

export default function NutritionistDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: patients, isLoading: patientsLoading } = useMyPatients();
  const { data: pending } = usePendingRequests();
  const { data: tokens } = useMyTokens();

  const activeTokens = tokens?.filter((t) => t.status === "active").length ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 4 }}>
          Olá, {user?.name?.split(" ")[0]}
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginBottom: 24 }}>
          Painel do nutricionista
        </Text>

        {/* Stats row */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1, backgroundColor: "#16A34A", borderRadius: 14, padding: 16 }}>
            <Text style={{ fontSize: 28, fontFamily: "Inter-Bold", color: "#fff" }}>
              {patientsLoading ? "—" : patients?.length ?? 0}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Inter-Regular", color: "#D1FAE5", marginTop: 2 }}>
              Pacientes ativos
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/(nutritionist)/requests")}
            style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 28, fontFamily: "Inter-Bold", color: "#111827" }}>
                {pending?.length ?? 0}
              </Text>
              {(pending?.length ?? 0) > 0 && (
                <View style={{ backgroundColor: "#EF4444", borderRadius: 10, width: 20, height: 20, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 11, fontFamily: "Inter-Bold" }}>{pending!.length}</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 13, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 }}>
              Solicitações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tokens card */}
        <TouchableOpacity
          onPress={() => router.push("/(app)/(nutritionist)/convites")}
          style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: "#BBF7D0" }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="key" size={20} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#15803D" }}>
              {activeTokens} convite{activeTokens !== 1 ? "s" : ""} ativo{activeTokens !== 1 ? "s" : ""}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 1 }}>
              Gerencie seus códigos de vínculo por paciente
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#16A34A" />
        </TouchableOpacity>

        {/* Quick actions */}
        <Text style={{ fontSize: 16, fontFamily: "Inter-SemiBold", color: "#111827", marginBottom: 12 }}>
          Ações rápidas
        </Text>
        <View style={{ gap: 10 }}>
          {[
            { icon: "people-outline",      label: "Ver pacientes",          route: "/(app)/(nutritionist)/patients" },
            { icon: "key-outline",          label: "Gerar convite",          route: "/(app)/(nutritionist)/convites" },
            { icon: "book-outline",         label: "Minhas receitas",        route: "/(app)/(nutritionist)/recipes" },
            { icon: "notifications-outline",label: "Solicitações pendentes", route: "/(app)/(nutritionist)/requests" },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => router.push(action.route as any)}
              style={{
                backgroundColor: "#fff", borderRadius: 12, padding: 14,
                flexDirection: "row", alignItems: "center", gap: 12,
                shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
              }}
            >
              <Ionicons name={action.icon as any} size={20} color="#16A34A" />
              <Text style={{ fontFamily: "Inter-Medium", color: "#374151", fontSize: 14, flex: 1 }}>{action.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
