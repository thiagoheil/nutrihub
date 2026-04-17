import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePendingRequests, useRespondToRequest } from "@/hooks/use-nutritionist";
import { ConnectionRequest } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function RequestCard({ item }: { item: ConnectionRequest }) {
  const respond = useRespondToRequest();

  const handleRespond = (accept: boolean) => {
    Alert.alert(
      accept ? "Aceitar paciente" : "Recusar solicitação",
      accept ? "Confirma que deseja aceitar este paciente?" : "Tem certeza que deseja recusar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: accept ? "Aceitar" : "Recusar",
          style: accept ? "default" : "destructive",
          onPress: () => respond.mutate({ requestId: item.id, accept }),
        },
      ]
    );
  };

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12,
      shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="person-outline" size={20} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", color: "#111827", fontSize: 14 }}>
            Novo paciente
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", fontSize: 12 }}>
            {format(new Date(item.requestedAt), "d 'de' MMMM", { locale: ptBR })}
          </Text>
        </View>
      </View>

      {item.message && (
        <View style={{ backgroundColor: "#F9FAFB", borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280", fontSize: 13, fontStyle: "italic" }}>
            "{item.message}"
          </Text>
        </View>
      )}

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={() => handleRespond(false)}
          disabled={respond.isPending}
          style={{ flex: 1, borderWidth: 1, borderColor: "#EF4444", borderRadius: 10, padding: 10, alignItems: "center" }}
        >
          <Text style={{ fontFamily: "Inter-Medium", color: "#EF4444", fontSize: 14 }}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRespond(true)}
          disabled={respond.isPending}
          style={{ flex: 1, backgroundColor: "#16A34A", borderRadius: 10, padding: 10, alignItems: "center" }}
        >
          <Text style={{ fontFamily: "Inter-Medium", color: "#fff", fontSize: 14 }}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RequestsScreen() {
  const { data: requests, isLoading } = usePendingRequests();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 4 }}>
          Solicitações
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginBottom: 16 }}>
          {requests?.length ?? 0} pendentes
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={requests ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8 }}
          renderItem={({ item }) => <RequestCard item={item} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="notifications-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhuma solicitação pendente.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
