import { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, ScrollView, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMyRecipes, useCreateRecipe, useDeleteRecipe } from "@/hooks/use-nutritionist";
import type { Recipe, RecipeVisibility } from "@/types";

const VISIBILITY: { id: RecipeVisibility; label: string; desc: string; icon: string }[] = [
  { id: "public",       label: "Público",          desc: "Todos os usuários",   icon: "globe-outline" },
  { id: "patients_only",label: "Apenas pacientes",  desc: "Seus pacientes",      icon: "people-outline" },
  { id: "private",      label: "Privado",           desc: "Só você",             icon: "lock-closed-outline" },
];

const VIS_COLOR: Record<RecipeVisibility, { label: string; color: string; bg: string }> = {
  public:        { label: "Público",         color: "#16A34A", bg: "#DCFCE7" },
  patients_only: { label: "Pacientes",       color: "#2563EB", bg: "#EFF6FF" },
  private:       { label: "Privado",         color: "#6B7280", bg: "#F3F4F6" },
};

function RecipeCard({ recipe, onDelete }: { recipe: Recipe; onDelete: () => void }) {
  const vis = VIS_COLOR[recipe.visibility];
  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12,
      shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>{recipe.title}</Text>
          {recipe.description && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", marginTop: 4, lineHeight: 18 }}>
              {recipe.description}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={onDelete} activeOpacity={0.7} style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={18} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F9FAFB", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>{recipe.prepTimeMin} min</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F9FAFB", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Ionicons name="flame-outline" size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>{recipe.caloriesPerServing} kcal/porção</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F9FAFB", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Ionicons name="restaurant-outline" size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>{recipe.servings} porções</Text>
        </View>
        <View style={{ backgroundColor: vis.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: vis.color }}>{vis.label}</Text>
        </View>
      </View>
    </View>
  );
}

const EMPTY_FORM = { title: "", description: "", prepTimeMin: "", servings: "1", calories: "", visibility: "patients_only" as RecipeVisibility };

export default function RecipesScreen() {
  const { data: recipes, isLoading } = useMyRecipes();
  const createRecipe = useCreateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleCreate() {
    if (!form.title.trim()) { Alert.alert("Obrigatório", "Adicione um título para a receita."); return; }
    const prep = parseInt(form.prepTimeMin, 10);
    const servings = parseInt(form.servings, 10);
    const cal = parseInt(form.calories, 10);
    if (isNaN(prep) || prep <= 0) { Alert.alert("Inválido", "Informe o tempo de preparo em minutos."); return; }
    if (isNaN(cal) || cal <= 0)   { Alert.alert("Inválido", "Informe as calorias por porção."); return; }

    createRecipe.mutate({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      prepTimeMin: prep,
      servings: isNaN(servings) ? 1 : servings,
      caloriesPerServing: cal,
      visibility: form.visibility,
    }, {
      onSuccess: () => { setShowModal(false); setForm(EMPTY_FORM); },
    });
  }

  function handleDelete(recipe: Recipe) {
    Alert.alert("Excluir receita", `Deseja excluir "${recipe.title}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteRecipe.mutate(recipe.id) },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>Receitas</Text>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 }}>
              {recipes?.length ?? 0} receita{(recipes?.length ?? 0) !== 1 ? "s" : ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#16A34A", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>Nova</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={recipes ?? []}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 20, paddingTop: 4 }}
          renderItem={({ item }) => <RecipeCard recipe={item} onDelete={() => handleDelete(item)} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="book-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhuma receita criada.{"\n"}Crie sua primeira receita!
              </Text>
            </View>
          )}
        />
      )}

      {/* Create modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: "90%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827" }}>Nova receita</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setForm(EMPTY_FORM); }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={labelStyle}>Título *</Text>
              <TextInput value={form.title} onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
                placeholder="Ex: Bowl de Açaí Proteico" placeholderTextColor="#9CA3AF" style={inputStyle} />

              <Text style={[labelStyle, { marginTop: 14 }]}>Descrição</Text>
              <TextInput value={form.description} onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
                placeholder="Descreva a receita brevemente..." placeholderTextColor="#9CA3AF"
                multiline numberOfLines={3} style={[inputStyle, { height: 72, textAlignVertical: "top", paddingTop: 10 }]} />

              <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Preparo (min) *</Text>
                  <TextInput value={form.prepTimeMin} onChangeText={(v) => setForm((f) => ({ ...f, prepTimeMin: v }))}
                    placeholder="15" placeholderTextColor="#9CA3AF" keyboardType="number-pad" style={inputStyle} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>Porções</Text>
                  <TextInput value={form.servings} onChangeText={(v) => setForm((f) => ({ ...f, servings: v }))}
                    placeholder="1" placeholderTextColor="#9CA3AF" keyboardType="number-pad" style={inputStyle} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={labelStyle}>kcal/porção *</Text>
                  <TextInput value={form.calories} onChangeText={(v) => setForm((f) => ({ ...f, calories: v }))}
                    placeholder="350" placeholderTextColor="#9CA3AF" keyboardType="number-pad" style={inputStyle} />
                </View>
              </View>

              <Text style={[labelStyle, { marginTop: 16 }]}>Visibilidade</Text>
              <View style={{ gap: 8 }}>
                {VISIBILITY.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setForm((f) => ({ ...f, visibility: opt.id }))}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: form.visibility === opt.id ? "#16A34A" : "#E5E7EB",
                      backgroundColor: form.visibility === opt.id ? "#F0FDF4" : "#F9FAFB",
                    }}
                  >
                    <Ionicons name={opt.icon as any} size={18} color={form.visibility === opt.id ? "#16A34A" : "#9CA3AF"} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: form.visibility === opt.id ? "#16A34A" : "#374151" }}>{opt.label}</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>{opt.desc}</Text>
                    </View>
                    {form.visibility === opt.id && <Ionicons name="checkmark-circle" size={18} color="#16A34A" />}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleCreate}
                disabled={createRecipe.isPending}
                activeOpacity={0.8}
                style={{ marginTop: 24, backgroundColor: createRecipe.isPending ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
              >
                {createRecipe.isPending
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>Salvar receita</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const labelStyle = { fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 } as const;
const inputStyle = {
  backgroundColor: "#F9FAFB", borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB",
  paddingHorizontal: 14, height: 48, fontFamily: "Inter-Regular", fontSize: 15, color: "#111827",
} as const;
