import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMyPatients, useAllPatientPlans } from "@/hooks/use-nutritionist";
import type { PatientSummary, DietPlan, ServiceType } from "@/types";
import { format, parseISO, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const SERVICE_STYLE: Record<ServiceType, { color: string; bg: string }> = {
  basic:    { color: "#6B7280", bg: "#F3F4F6" },
  standard: { color: "#2563EB", bg: "#EFF6FF" },
  premium:  { color: "#16A34A", bg: "#DCFCE7" },
  custom:   { color: "#9333EA", bg: "#F5F3FF" },
};

function progressPct(plan: DietPlan): number {
  const start = new Date(plan.startDate).getTime();
  const end   = new Date(plan.endDate).getTime();
  const now   = Date.now();
  return Math.min(100, Math.max(0, Math.round(((now - start) / (end - start)) * 100)));
}

function daysLeft(plan: DietPlan): number {
  return Math.max(0, differenceInDays(new Date(plan.endDate), new Date()));
}

function PatientPlanCard({
  patient, plan, onPress,
}: {
  patient: PatientSummary;
  plan?: DietPlan;
  onPress: () => void;
}) {
  const svc = patient.serviceType ? SERVICE_STYLE[patient.serviceType] : null;
  const initials = patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
      }}
    >
      {/* Patient row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: plan ? 12 : 0 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 15, fontFamily: "Inter-Bold", color: "#16A34A" }}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>{patient.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
            {svc && patient.serviceType && (
              <View style={{ backgroundColor: svc.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: svc.color, textTransform: "capitalize" }}>
                  {patient.serviceType}
                </Text>
              </View>
            )}
            {plan ? (
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#16A34A" }}>Plano ativo</Text>
              </View>
            ) : (
              <View style={{ backgroundColor: "#FEF3C7", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#D97706" }}>Sem plano</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      </View>

      {/* Plan summary */}
      {plan && (
        <View style={{ backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#111827" }} numberOfLines={1}>
            {plan.title}
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 2 }} numberOfLines={2}>
            {plan.goal}
          </Text>

          {/* Progress */}
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
                Progresso do plano
              </Text>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#374151" }}>
                {progressPct(plan)}% · {daysLeft(plan)} dias restantes
              </Text>
            </View>
            <View style={{ height: 5, backgroundColor: "#E5E7EB", borderRadius: 10 }}>
              <View
                style={{ height: 5, borderRadius: 10, backgroundColor: "#16A34A", width: `${progressPct(plan)}%` }}
              />
            </View>
          </View>

          {/* Meals + macros */}
          <View style={{ flexDirection: "row", gap: 12, marginTop: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="restaurant-outline" size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
                {plan.meals.length} refeições
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="flame-outline" size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
                {plan.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.calories, 0), 0)} kcal/dia
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="barbell-outline" size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
                {plan.meals.reduce((sum, m) => sum + m.items.reduce((s, i) => s + i.proteinG, 0), 0).toFixed(0)}g prot
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* No plan CTA */}
      {!plan && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
          <Ionicons name="add-circle-outline" size={14} color="#D97706" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#D97706" }}>
            Nenhum plano atribuído — toque para criar
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function PlansScreen() {
  const router = useRouter();
  const { data: patients = [], isLoading: patientsLoading } = useMyPatients();
  const { data: plans = [], isLoading: plansLoading } = useAllPatientPlans();
  const [search, setSearch] = useState("");

  const planByUserId = Object.fromEntries(plans.map((p) => [p.userId, p]));

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const withPlan    = filtered.filter((p) => !!planByUserId[p.userId]);
  const withoutPlan = filtered.filter((p) => !planByUserId[p.userId]);
  const ordered     = [...withPlan, ...withoutPlan];

  const isLoading = patientsLoading || plansLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>Planos</Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 }}>
          Dietas atribuídas aos seus pacientes
        </Text>
      </View>

      {/* Stats row */}
      {!isLoading && (
        <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 20, marginBottom: 16 }}>
          {[
            { label: "Total",      value: patients.length,               color: "#111827", bg: "#fff"    },
            { label: "Com plano",  value: withPlan.length,               color: "#16A34A", bg: "#F0FDF4" },
            { label: "Sem plano",  value: patients.length - withPlan.length, color: "#D97706", bg: "#FFFBEB" },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 12, padding: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: s.color }}>{s.value}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Search */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 12, height: 44, gap: 8 }}>
          <Ionicons name="search-outline" size={16} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar paciente..."
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 14, color: "#111827" }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={ordered}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <PatientPlanCard
              patient={item}
              plan={planByUserId[item.userId]}
              onPress={() => router.push(`/(app)/patient-plan/${item.userId}`)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="clipboard-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                {search ? "Nenhum paciente encontrado." : "Nenhum paciente vinculado ainda."}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
