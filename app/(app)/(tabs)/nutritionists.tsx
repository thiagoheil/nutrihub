import { useState, useRef } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  TextInput, Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useUserLocation, useNearbyNutritionists,
  useFindNutritionistByCode, useFindTokenByCode, useConnectByCode, useMyConnectionRequest,
} from "@/hooks/use-nutritionist";
import type { NutritionistProfile, ServiceType } from "@/types";

const SERVICE_LABEL: Record<ServiceType, { label: string; color: string; bg: string }> = {
  basic:    { label: "Basic",    color: "#6B7280", bg: "#F3F4F6" },
  standard: { label: "Standard", color: "#2563EB", bg: "#EFF6FF" },
  premium:  { label: "Premium",  color: "#16A34A", bg: "#DCFCE7" },
  custom:   { label: "Custom",   color: "#9333EA", bg: "#F5F3FF" },
};

// ─── Nutritionist card (list) ─────────────────────────────────────────────────
function NutritionistCard({ item, onPress }: { item: NutritionistProfile; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter-Bold", color: "#16A34A" }}>
            {item.user.name[0]}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: "#111827" }}>{item.user.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
            <Ionicons name="star" size={13} color="#F59E0B" />
            <Text style={{ fontSize: 13, fontFamily: "Inter-Regular", color: "#6B7280" }}>
              {item.ratingAvg.toFixed(1)} ({item.ratingCount})
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          {item.distanceKm !== undefined && (
            <Text style={{ fontSize: 13, fontFamily: "Inter-Medium", color: "#16A34A" }}>
              {item.distanceKm < 1 ? `${(item.distanceKm * 1000).toFixed(0)}m` : `${item.distanceKm.toFixed(1)}km`}
            </Text>
          )}
          {item.isVerified && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 2, marginTop: 4 }}>
              <Ionicons name="shield-checkmark" size={12} color="#16A34A" />
              <Text style={{ fontSize: 11, fontFamily: "Inter-Medium", color: "#16A34A" }}>Verificado</Text>
            </View>
          )}
        </View>
      </View>
      {item.specialties?.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {item.specialties.slice(0, 3).map((s) => (
            <View key={s} style={{ backgroundColor: "#F3F4F6", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: "Inter-Regular", color: "#6B7280" }}>{s}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Code search card ─────────────────────────────────────────────────────────
function CodeSearchCard() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const findByCode = useFindNutritionistByCode();
  const findToken  = useFindTokenByCode();
  const connectByCode = useConnectByCode();
  const { data: myRequest } = useMyConnectionRequest();

  const found = findByCode.data ?? null;
  const token = findToken.data ?? null;
  const alreadyConnected = found && myRequest?.nutritionistId === found.id && myRequest.status === "accepted";
  const alreadyPending   = found && myRequest?.nutritionistId === found.id && myRequest.status === "pending";

  function handleSearch() {
    if (!code.trim()) return;
    Keyboard.dismiss();
    setNotFound(false);
    const trimmed = code.trim();
    findByCode.mutate(trimmed, {
      onSuccess: (result) => { if (!result) setNotFound(true); },
    });
    findToken.mutate(trimmed);
  }

  function handleClear() {
    setCode("");
    setNotFound(false);
    findByCode.reset();
    findToken.reset();
    inputRef.current?.focus();
  }

  function handleConnect() {
    if (!found) return;
    connectByCode.mutate({ nutritionistId: found.id, code: code.trim() }, {
      onSuccess: () => router.push(`/(app)/nutritionist/${found.id}`),
    });
  }

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="key-outline" size={18} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>Código do nutricionista</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
            Conecte-se diretamente via código
          </Text>
        </View>
      </View>

      {/* Input row */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{
          flex: 1, flexDirection: "row", alignItems: "center",
          backgroundColor: "#F9FAFB", borderRadius: 12,
          borderWidth: 1.5, borderColor: notFound ? "#FCA5A5" : found ? "#86EFAC" : "#E5E7EB",
          paddingHorizontal: 14, height: 48,
        }}>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(t) => { setCode(t.toUpperCase()); setNotFound(false); if (found) findByCode.reset(); }}
            placeholder="Ex: ANA001"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            style={{ flex: 1, fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", letterSpacing: 1.5 }}
          />
          {code.length > 0 && (
            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={handleSearch}
          activeOpacity={0.8}
          disabled={!code.trim() || findByCode.isPending}
          style={{
            width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center",
            backgroundColor: code.trim() ? "#16A34A" : "#E5E7EB",
          }}
        >
          {findByCode.isPending
            ? <ActivityIndicator color="#fff" size="small" />
            : <Ionicons name="search" size={20} color={code.trim() ? "#fff" : "#9CA3AF"} />
          }
        </TouchableOpacity>
      </View>

      {/* Not found */}
      {notFound && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 }}>
          <Ionicons name="alert-circle-outline" size={14} color="#DC2626" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#DC2626" }}>
            Código não encontrado. Verifique e tente novamente.
          </Text>
        </View>
      )}

      {/* Found result */}
      {found && !notFound && (
        <View style={{ marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: "#BBF7D0", backgroundColor: "#F0FDF4", overflow: "hidden" }}>
          {/* Profile row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 14 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 16, color: "#fff" }}>{found.user.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{found.user.name}</Text>
                {found.isVerified && <Ionicons name="shield-checkmark" size={13} color="#16A34A" />}
              </View>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280", marginTop: 1 }}>{found.crnNumber}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 }}>
                <Ionicons name="star" size={11} color="#F59E0B" />
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6B7280" }}>
                  {found.ratingAvg.toFixed(1)} · {found.distanceKm?.toFixed(1)}km
                </Text>
              </View>
            </View>
            <View style={{ alignItems: "flex-end", gap: 4 }}>
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: "#15803D" }}>✓ Código válido</Text>
              </View>
              {token?.serviceType && (() => {
                const svc = SERVICE_LABEL[token.serviceType];
                return (
                  <View style={{ backgroundColor: svc.bg, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: svc.color }}>{svc.label}</Text>
                  </View>
                );
              })()}
            </View>
          </View>

          {/* Token service detail */}
          {token && (
            <View style={{ marginHorizontal: 14, marginBottom: 10, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10 }}>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#374151" }}>{token.label}</Text>
              {token.priceRcents > 0 && (
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  Valor: {(token.priceRcents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </Text>
              )}
            </View>
          )}

          {/* Specialties */}
          {found.specialties.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, paddingHorizontal: 14, paddingBottom: 12 }}>
              {found.specialties.slice(0, 3).map((s) => (
                <View key={s} style={{ backgroundColor: "#D1FAE5", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 10, fontFamily: "Inter-Regular", color: "#15803D" }}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Divider + modules unlocked preview */}
          <View style={{ borderTopWidth: 1, borderTopColor: "#BBF7D0", padding: 14, backgroundColor: "#ECFDF5" }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#15803D", marginBottom: 8 }}>
              🔓 Módulos que serão desbloqueados
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["📋 Dieta", "📊 Métricas", "📅 Diário"].map((m) => (
                <View key={m} style={{ flex: 1, backgroundColor: "#fff", borderRadius: 8, paddingVertical: 6, alignItems: "center", borderWidth: 1, borderColor: "#BBF7D0" }}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, color: "#15803D", textAlign: "center" }}>{m}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: "row", gap: 10, padding: 14, paddingTop: 0 }}>
            <TouchableOpacity
              onPress={() => router.push(`/(app)/nutritionist/${found.id}`)}
              activeOpacity={0.7}
              style={{ flex: 1, height: 42, borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#16A34A" }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#16A34A" }}>Ver perfil</Text>
            </TouchableOpacity>

            {alreadyConnected ? (
              <View style={{ flex: 2, height: 42, borderRadius: 10, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#15803D" }}>✓ Já conectado</Text>
              </View>
            ) : alreadyPending ? (
              <View style={{ flex: 2, height: 42, borderRadius: 10, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#D97706" }}>Aguardando resposta</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleConnect}
                activeOpacity={0.8}
                disabled={connectByCode.isPending}
                style={{ flex: 2, height: 42, borderRadius: 10, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}
              >
                {connectByCode.isPending
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>⚡ Conectar agora</Text>
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function NutritionistsScreen() {
  const router = useRouter();
  const { data: coords, isLoading: locationLoading, error: locationError } = useUserLocation();
  const { data: nutritionists, isLoading: listLoading } = useNearbyNutritionists(coords ?? null);

  if (locationLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280", marginTop: 12 }}>Obtendo sua localização...</Text>
      </SafeAreaView>
    );
  }

  if (locationError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Ionicons name="location-outline" size={48} color="#D1D5DB" />
        <Text style={{ fontFamily: "Inter-SemiBold", color: "#374151", fontSize: 16, marginTop: 16, textAlign: "center" }}>
          Localização necessária
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 8, textAlign: "center" }}>
          Permita o acesso à localização para encontrar nutricionistas perto de você.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <FlatList
        data={nutritionists ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={() => (
          <>
            <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>Nutricionistas</Text>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2, marginBottom: 20 }}>
              Profissionais próximos a você
            </Text>
            <CodeSearchCard />
            <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: "#111827", marginBottom: 12 }}>
              Próximos a você
            </Text>
          </>
        )}
        renderItem={({ item }) => (
          <NutritionistCard
            item={item}
            onPress={() => router.push(`/(app)/nutritionist/${item.id}`)}
          />
        )}
        ListEmptyComponent={() => (
          listLoading
            ? <ActivityIndicator color="#16A34A" style={{ marginTop: 20 }} />
            : (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <Ionicons name="people-outline" size={48} color="#D1D5DB" />
                <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                  Nenhum nutricionista encontrado{"\n"}na sua região ainda.
                </Text>
              </View>
            )
        )}
      />
    </SafeAreaView>
  );
}
