import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMyPatients } from "@/hooks/use-nutritionist";
import type { PatientSummary, ServiceType } from "@/types";

const SERVICE_STYLE: Record<ServiceType, { label: string; color: string; bg: string }> = {
  basic:    { label: "Basic",    color: "#6B7280", bg: "#F3F4F6" },
  standard: { label: "Standard", color: "#2563EB", bg: "#EFF6FF" },
  premium:  { label: "Premium",  color: "#16A34A", bg: "#DCFCE7" },
  custom:   { label: "Custom",   color: "#9333EA", bg: "#F5F3FF" },
};

function PatientCard({ patient, onPress }: { patient: PatientSummary; onPress: () => void }) {
  const svc = patient.serviceType ? SERVICE_STYLE[patient.serviceType] : null;
  const initials = patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10,
        flexDirection: "row", alignItems: "center", gap: 12,
        shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, fontFamily: "Inter-Bold", color: "#16A34A" }}>{initials}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Inter-SemiBold", color: "#111827", fontSize: 15 }}>{patient.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 }}>
          {svc && (
            <View style={{ backgroundColor: svc.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: svc.color }}>{svc.label}</Text>
            </View>
          )}
          {patient.latestWeightKg && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
              {patient.latestWeightKg} kg
            </Text>
          )}
          {patient.connectedVia === "code" && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Ionicons name="key-outline" size={11} color="#9CA3AF" />
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>código</Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
    </TouchableOpacity>
  );
}

export default function PatientsScreen() {
  const router = useRouter();
  const { data: patients, isLoading } = useMyPatients();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 4 }}>
          Pacientes
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginBottom: 16 }}>
          {patients?.length ?? 0} pacientes ativos
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={patients ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8 }}
          renderItem={({ item }) => (
            <PatientCard
              patient={item}
              onPress={() => router.push(`/(app)/patient/${item.id}`)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhum paciente vinculado ainda.{"\n"}Gere um convite para conectar.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
