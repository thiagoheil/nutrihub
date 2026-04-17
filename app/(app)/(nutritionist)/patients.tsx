import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMyPatients } from "@/hooks/use-nutritionist";

export default function PatientsScreen() {
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
            <View style={{
              backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 10,
              flexDirection: "row", alignItems: "center", gap: 12,
              shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
            }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, fontFamily: "Inter-Bold", color: "#16A34A" }}>
                  {item.user.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", color: "#111827", fontSize: 15 }}>{item.user.name}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhum paciente vinculado ainda.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
