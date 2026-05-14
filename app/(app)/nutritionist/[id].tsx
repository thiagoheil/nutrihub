import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useNutritionistDetail,
  useMyConnectionRequest,
  useSendConnectionRequest,
  useCancelConnectionRequest,
} from "@/hooks/use-nutritionist";

// ─── helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function StarRow({ rating, count }: { rating: number; count: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={14}
          color="#F59E0B"
        />
      ))}
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "rgba(255,255,255,0.9)", marginLeft: 4 }}>
        {rating.toFixed(1)} ({count} avaliações)
      </Text>
    </View>
  );
}

// ─── connection section ───────────────────────────────────────────────────────
function ConnectionSection({ nutritionistId }: { nutritionistId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { data: myRequest, isLoading } = useMyConnectionRequest();
  const sendRequest = useSendConnectionRequest();
  const cancelRequest = useCancelConnectionRequest();

  const requestForThis = myRequest?.nutritionistId === nutritionistId ? myRequest : null;

  function handleSend() {
    sendRequest.mutate(
      { nutritionistId, message: message.trim() || undefined },
      { onSuccess: () => { setMessage(""); setShowInput(false); } }
    );
  }

  function handleCancel() {
    Alert.alert("Cancelar solicitação", "Deseja cancelar sua solicitação de acompanhamento?", [
      { text: "Não", style: "cancel" },
      {
        text: "Cancelar solicitação", style: "destructive",
        onPress: () => cancelRequest.mutate(myRequest!.id),
      },
    ]);
  }

  if (isLoading) return <ActivityIndicator color="#16A34A" style={{ marginTop: 12 }} />;

  // ── Accepted ──────────────────────────────────────────────────────────────
  if (requestForThis?.status === "accepted") {
    return (
      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
          </View>
          <View>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111827" }}>Você está conectado!</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Acompanhamento ativo com este nutricionista
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#15803D", lineHeight: 20 }}>
            🎉 O nutricionista já tem acesso ao seu plano alimentar, métricas corporais e diário alimentar para acompanhar seu progresso.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(app)/(tabs)/metrics")}
          activeOpacity={0.8}
          style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#fff" }}>📊 Ver meu progresso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.8}
          style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#FCA5A5" }}
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#DC2626" }}>Encerrar acompanhamento</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Pending ───────────────────────────────────────────────────────────────
  if (requestForThis?.status === "pending") {
    return (
      <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="time-outline" size={22} color="#D97706" />
          </View>
          <View>
            <Text style={{ fontFamily: "Inter-Bold", fontSize: 15, color: "#111827" }}>Solicitação enviada</Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Aguardando confirmação do nutricionista
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: "#FFFBEB", borderRadius: 12, padding: 14, marginBottom: 14 }}>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#92400E", lineHeight: 20 }}>
            ⏳ Sua solicitação foi enviada. Você será notificado quando o nutricionista aceitar ou recusar o pedido.
          </Text>
          {requestForThis.message && (
            <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#FDE68A" }}>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#92400E", marginBottom: 2 }}>Sua mensagem:</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#78350F" }}>"{requestForThis.message}"</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.8}
          disabled={cancelRequest.isPending}
          style={{ borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" }}
        >
          {cancelRequest.isPending
            ? <ActivityIndicator color="#6B7280" size="small" />
            : <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#6B7280" }}>Cancelar solicitação</Text>
          }
        </TouchableOpacity>
      </View>
    );
  }

  // ── Already connected with another nutritionist ───────────────────────────
  if (myRequest && myRequest.nutritionistId !== nutritionistId) {
    return (
      <View style={{ backgroundColor: "#F9FAFB", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#E5E7EB" }}>
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#374151", marginBottom: 6 }}>Acompanhamento em andamento</Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
          Você já possui uma solicitação ativa com outro nutricionista. Cancele-a primeiro para solicitar um novo acompanhamento.
        </Text>
      </View>
    );
  }

  // ── No request yet ────────────────────────────────────────────────────────
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#111827", marginBottom: 6 }}>
        Solicitar Acompanhamento
      </Text>
      <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", lineHeight: 20, marginBottom: 16 }}>
        Ao solicitar, o nutricionista terá acesso ao seu plano alimentar, métricas corporais e diário alimentar para acompanhar seu progresso de forma completa.
      </Text>

      <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
        {["📋 Plano alimentar", "📊 Métricas", "📅 Diário"].map((item) => (
          <View key={item} style={{ flex: 1, backgroundColor: "#F0FDF4", borderRadius: 10, padding: 10, alignItems: "center" }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#15803D", textAlign: "center" }}>{item}</Text>
          </View>
        ))}
      </View>

      {showInput ? (
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 8 }}>
            Mensagem (opcional)
          </Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ex: Olá! Gostaria de iniciar meu acompanhamento..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              padding: 14,
              fontFamily: "Inter-Regular",
              fontSize: 14,
              color: "#111827",
              textAlignVertical: "top",
              minHeight: 90,
              marginBottom: 12,
            }}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => setShowInput(false)}
              activeOpacity={0.7}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#6B7280" }}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={sendRequest.isPending}
              style={{ flex: 2, backgroundColor: "#16A34A", borderRadius: 12, paddingVertical: 13, alignItems: "center" }}
            >
              {sendRequest.isPending
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#fff" }}>Enviar Solicitação</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setShowInput(true)}
          activeOpacity={0.8}
          style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingVertical: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
        >
          <Ionicons name="person-add-outline" size={18} color="#fff" />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#fff" }}>Solicitar Acompanhamento</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── screen ───────────────────────────────────────────────────────────────────
export default function NutritionistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: profile, isLoading, error } = useNutritionistDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
        <Text style={{ fontFamily: "Inter-SemiBold", color: "#374151", fontSize: 16, marginTop: 16 }}>
          Nutricionista não encontrado
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: "Inter-Medium", color: "#16A34A", fontSize: 14 }}>Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Hero ── */}
        <View style={{ backgroundColor: "#16A34A", paddingBottom: 32 }}>
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#fff" }}>Nutricionistas</Text>
          </TouchableOpacity>

          {/* Avatar + name */}
          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 3, borderColor: "rgba(255,255,255,0.5)" }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 30, color: "#fff" }}>{initials(profile.user.name)}</Text>
            </View>

            <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#fff", textAlign: "center" }}>
              {profile.user.name}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                {profile.crnNumber}
              </Text>
              {profile.isVerified && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Ionicons name="shield-checkmark" size={12} color="#fff" />
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#fff" }}>Verificado</Text>
                </View>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <StarRow rating={profile.ratingAvg} count={profile.ratingCount} />
            </View>

            {profile.distanceKm !== undefined && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 }}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                  {profile.distanceKm < 1
                    ? `${(profile.distanceKm * 1000).toFixed(0)}m de você`
                    : `${profile.distanceKm.toFixed(1)}km de você`}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Stats ── */}
        <View style={{ flexDirection: "row", gap: 1, marginTop: -1, backgroundColor: "#E5E7EB" }}>
          {[
            { label: "Avaliações", value: String(profile.ratingCount), icon: "⭐" },
            { label: "Raio de atend.", value: `${profile.serviceRadiusKm}km`, icon: "📍" },
            { label: "Nota", value: profile.ratingAvg.toFixed(1), icon: "🏅" },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: "#fff", padding: 14, alignItems: "center" }}>
              <Text style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</Text>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#111827" }}>{stat.value}</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ padding: 20, gap: 16 }}>
          {/* ── Bio ── */}
          {profile.bio && (
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 10 }}>
                Sobre
              </Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#374151", lineHeight: 22 }}>
                {profile.bio}
              </Text>
            </View>
          )}

          {/* ── Especialidades ── */}
          {profile.specialties.length > 0 && (
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 12 }}>
                Especialidades
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {profile.specialties.map((s) => (
                  <View key={s} style={{ backgroundColor: "#F0FDF4", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: "#BBF7D0" }}>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#15803D" }}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── O que o nutricionista poderá acessar ── */}
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", marginBottom: 14 }}>
              Visibilidade do acompanhamento
            </Text>
            {[
              { icon: "🥗", title: "Plano alimentar", desc: "O nutricionista poderá criar e ajustar seu plano de dieta personalizado" },
              { icon: "📊", title: "Métricas corporais", desc: "Peso, medidas e evolução corporal ao longo do tempo" },
              { icon: "📅", title: "Diário alimentar", desc: "Registro diário de refeições e hidratação" },
            ].map((item) => (
              <View key={item.title} style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{item.title}</Text>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 2, lineHeight: 18 }}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Connection ── */}
          <ConnectionSection nutritionistId={profile.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
