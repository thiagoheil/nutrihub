import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipesScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>Receitas</Text>
        <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 4 }}>
          Liste e crie receitas para seus pacientes.
        </Text>
      </View>
    </SafeAreaView>
  );
}
