import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { usePatientDetail, usePatientMetrics } from "@/hooks/use-nutritionist";
import type { ServiceType } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SERVICE_STYLE: Record<ServiceType, { label: string; color: string; bg: string }> = {
  basic:    { label: "Basic",    color: "#6B7280", bg: "#F3F4F6" },
  standard: { label: "Standard", color: "#2563EB", bg: "#EFF6FF" },
  premium:  { label: "Premium",  color: "#16A34A", bg: "#DCFCE7" },
  custom:   { label: "Custom",   color: "#9333EA", bg: "#F5F3FF" },
};

function formatPrice(cents?: number) {
  if (!cents) return "—";
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Mini bar chart for weight trend ─────────────────────────────────────────

function WeightMiniChart({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const BAR_H = 48;

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, height: BAR_H + 16 }}>
      {values.map((v, i) => {
        const h = ((v - min) / (max - min)) * BAR_H;
        const isLast = i === values.length - 1;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center", gap: 3 }}>
            <View style={{ width: "100%", height: Math.max(h, 4), borderRadius: 4, backgroundColor: isLast ? "#16A34A" : "#D1FAE5" }} />
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 9, color: "#9CA3AF" }}>{v}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PatientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: patient, isLoading: patientLoading } = usePatientDetail(id);
  const { data: metrics, isLoading: metricsLoading } = usePatientMetrics(patient?.userId ?? "");

  if (patientLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  if (!patient) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text style={{ fontFamily: "Inter-SemiBold", color: "#374151", fontSize: 16 }}>Paciente não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: "Inter-Medium", color: "#16A34A" }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const svc = patient.serviceType ? SERVICE_STYLE[patient.serviceType] : null;
  const latest = metrics?.at(-1);
  const weightHistory = (metrics ?? []).map((m) => m.weightKg).filter(Boolean) as number[];
  const initials = patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const trend = weightHistory.length >= 2
    ? weightHistory.at(-1)! - weightHistory.at(-2)!
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827", flex: 1 }}>Paciente</Text>
        <TouchableOpacity
          onPress={() => router.push(`/(app)/patient-diary/${id}`)}
          activeOpacity={0.8}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0FDF4", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#BBF7D0" }}
        >
          <Ionicons name="calendar-outline" size={16} color="#16A34A" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#16A34A" }}>Diário</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Profile card */}
        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#16A34A" }}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827" }}>{patient.name}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                Vinculado em {format(new Date(patient.connectedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </Text>
            </View>
          </View>

          {/* Service + price row */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            {svc && (
              <View style={{ flex: 1, backgroundColor: svc.bg, borderRadius: 12, padding: 12, alignItems: "center" }}>
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: svc.color }}>{svc.label}</Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Serviço</Text>
              </View>
            )}
            <View style={{ flex: 1, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12, alignItems: "center" }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: "#111827" }}>{formatPrice(patient.priceRcents)}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Valor</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#F9FAFB", borderRadius: 12, padding: 12, alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Ionicons name={patient.connectedVia === "code" ? "key-outline" : "mail-outline"} size={13} color="#9CA3AF" />
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 14, color: "#111827" }}>
                  {patient.connectedVia === "code" ? "Código" : "Solicit."}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>Via</Text>
            </View>
          </View>
        </View>

        {/* Metrics card */}
        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 14 }}>
            Métricas
          </Text>

          {metricsLoading ? (
            <ActivityIndicator color="#16A34A" />
          ) : latest ? (
            <>
              {/* Latest values */}
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Peso", value: latest.weightKg ? `${latest.weightKg} kg` : "—" },
                  { label: "IMC", value: latest.bmi ? latest.bmi.toFixed(1) : "—" },
                  { label: "% Gordura", value: latest.bodyFatPct ? `${latest.bodyFatPct}%` : "—" },
                ].map((stat) => (
                  <View key={stat.label} style={{ flex: 1, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10, alignItems: "center" }}>
                    <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111827" }}>{stat.value}</Text>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{stat.label}</Text>
                  </View>
                ))}
              </View>

              {/* Trend */}
              {trend !== null && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
                  <Ionicons
                    name={trend < 0 ? "trending-down" : trend > 0 ? "trending-up" : "remove"}
                    size={16}
                    color={trend < 0 ? "#16A34A" : trend > 0 ? "#EF4444" : "#9CA3AF"}
                  />
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: trend < 0 ? "#16A34A" : trend > 0 ? "#EF4444" : "#9CA3AF" }}>
                    {trend > 0 ? "+" : ""}{trend.toFixed(1)} kg desde a última medição
                  </Text>
                </View>
              )}

              {/* Weight chart */}
              {weightHistory.length >= 2 && (
                <>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginBottom: 8 }}>Evolução do peso</Text>
                  <WeightMiniChart values={weightHistory} />
                </>
              )}

              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 8 }}>
                Última medição: {format(new Date(latest.measuredAt), "dd/MM/yyyy", { locale: ptBR })}
              </Text>
            </>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Ionicons name="bar-chart-outline" size={36} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
                Nenhuma métrica registrada ainda.
              </Text>
            </View>
          )}
        </View>

        {/* History */}
        {(metrics?.length ?? 0) > 1 && (
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 12 }}>
              Histórico de medições
            </Text>
            {[...(metrics ?? [])].reverse().map((m, i) => (
              <View key={m.id} style={{
                flexDirection: "row", alignItems: "center", paddingVertical: 10,
                borderBottomWidth: i < (metrics?.length ?? 0) - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", width: 80 }}>
                  {format(new Date(m.measuredAt), "dd/MM/yy")}
                </Text>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827", flex: 1 }}>
                  {m.weightKg} kg
                </Text>
                {m.waistCm && (
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
                    Cintura: {m.waistCm} cm
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Notes placeholder */}
        <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>Anotações</Text>
            <TouchableOpacity activeOpacity={0.7}
              style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: "#F0FDF4" }}>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#16A34A" }}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", paddingVertical: 16 }}>
            <Ionicons name="document-text-outline" size={32} color="#D1D5DB" />
            <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 8, textAlign: "center", fontSize: 13 }}>
              Nenhuma anotação sobre este paciente.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
