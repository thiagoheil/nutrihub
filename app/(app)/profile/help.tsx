import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const APP_VERSION = "1.0.0";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ: FaqItem[] = [
  {
    q: "Como conecto um nutricionista?",
    a: "Acesse a aba Nutricionistas e busque por profissionais próximos a você ou insira o código fornecido pelo seu nutricionista para se conectar diretamente.",
  },
  {
    q: "Como registro minhas refeições?",
    a: "No Diário Alimentar, selecione o dia desejado, toque em 'Registrar refeição' e escolha qual refeição do seu plano foi realizada.",
  },
  {
    q: "Meu plano de dieta pode ser gerado automaticamente?",
    a: "Sim! Na aba Dieta, você pode usar nossa IA para gerar um plano baseado nas suas métricas e objetivos cadastrados.",
  },
  {
    q: "Como atualizo minhas métricas?",
    a: "Acesse a aba Métricas e toque em 'Novo Registro'. Preencha as medidas disponíveis e salve. O histórico ficará disponível em gráficos.",
  },
  {
    q: "O app funciona sem internet?",
    a: "Dados já carregados ficam disponíveis offline. Para sincronizar novos registros ou buscar nutricionistas, é necessária conexão.",
  },
  {
    q: "Como cancelo minha assinatura?",
    a: "Acesse Perfil > Assinatura e selecione a opção de cancelamento. A assinatura permanece ativa até o fim do período pago.",
  },
];

const SUPPORT_LINKS = [
  { icon: "mail-outline", label: "Enviar e-mail ao suporte", action: "email" },
  { icon: "logo-whatsapp", label: "Chat pelo WhatsApp", action: "whatsapp" },
  { icon: "star-outline", label: "Avaliar o app", action: "rate" },
];

export default function HelpScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleSupport(action: string) {
    if (action === "email") {
      Linking.openURL("mailto:suporte@nutrihub.com.br?subject=Suporte NutriHub");
    } else if (action === "whatsapp") {
      Alert.alert("WhatsApp", "Suporte via WhatsApp em breve!");
    } else if (action === "rate") {
      Alert.alert("Avaliar o app", "Obrigado! Em breve você poderá avaliar nas lojas.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Ajuda</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Hero */}
        <View style={{ backgroundColor: "#16A34A", borderRadius: 16, padding: 20, marginBottom: 24, alignItems: "center" }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <Ionicons name="help-circle" size={28} color="#fff" />
          </View>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#fff" }}>Como podemos ajudar?</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4, textAlign: "center" }}>
            Veja as perguntas frequentes ou fale com nossa equipe
          </Text>
        </View>

        {/* FAQ */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Perguntas frequentes
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 }}>
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <View key={i} style={{ borderBottomWidth: i < FAQ.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
                <TouchableOpacity
                  onPress={() => setOpenIndex(isOpen ? null : i)}
                  activeOpacity={0.7}
                  style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}
                >
                  <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111827", lineHeight: 20 }}>
                    {item.q}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#6B7280", lineHeight: 21 }}>
                      {item.a}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Support */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Falar com suporte
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 32 }}>
          {SUPPORT_LINKS.map((link, i) => (
            <TouchableOpacity
              key={link.label}
              onPress={() => handleSupport(link.action)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row", alignItems: "center", padding: 16, gap: 12,
                borderBottomWidth: i < SUPPORT_LINKS.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={link.icon as any} size={18} color="#16A34A" />
              </View>
              <Text style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 15, color: "#374151" }}>{link.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Version */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <Ionicons name="leaf" size={20} color="#16A34A" />
          </View>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#374151" }}>NutriHub</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            Versão {APP_VERSION}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
