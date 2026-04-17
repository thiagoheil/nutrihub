import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUserLocation, useNearbyNutritionists } from "@/hooks/use-nutritionist";
import { NutritionistProfile } from "@/types";
import { Ionicons } from "@expo/vector-icons";

function NutritionistCard({ item, onPress }: { item: NutritionistProfile; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter-Bold", color: "#16A34A" }}>
            {item.user.name[0]}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontFamily: "Inter-SemiBold", color: "#111827" }}>
            {item.user.name}
          </Text>
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
              {item.distanceKm < 1
                ? `${(item.distanceKm * 1000).toFixed(0)}m`
                : `${item.distanceKm.toFixed(1)}km`}
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

export default function NutritionistsScreen() {
  const router = useRouter();
  const { data: coords, isLoading: locationLoading, error: locationError } = useUserLocation();
  const { data: nutritionists, isLoading: listLoading } = useNearbyNutritionists(coords ?? null);

  if (locationLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
        <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280", marginTop: 12 }}>
          Obtendo sua localização...
        </Text>
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
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>
          Nutricionistas
        </Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2, marginBottom: 16 }}>
          Profissionais próximos a você
        </Text>
      </View>

      {listLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={nutritionists ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingTop: 8 }}
          renderItem={({ item }) => (
            <NutritionistCard
              item={item}
              onPress={() => router.push(`/(app)/nutritionist/${item.id}`)}
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhum nutricionista encontrado{"\n"}na sua região ainda.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
