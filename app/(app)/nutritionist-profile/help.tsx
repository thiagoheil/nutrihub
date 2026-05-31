import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const APP_VERSION = "1.0.0";

const FAQ = [
  { q: "Como gerar um convite para um paciente?",         a: "Acesse a aba Convites, toque em 'Novo Convite', defina o tipo de serviço e o preço. O código gerado pode ser compartilhado por qualquer canal." },
  { q: "Posso ter diferentes planos para cada paciente?", a: "Sim! Cada convite pode ter tipo de serviço e preço diferentes (Basic, Standard, Premium ou Custom), permitindo personalizar o acordo com cada paciente." },
  { q: "Como ver o diário de refeições de um paciente?",  a: "Acesse a aba Pacientes, toque no paciente desejado e depois em 'Diário'. Você verá o calendário mensal com registros, fotos e pode deixar comentários." },
  { q: "Como atribuir um plano de dieta a um paciente?",  a: "Acesse a aba Planos, localize o paciente e toque no card. Você visualiza o plano ativo ou pode criar um novo personalizado." },
  { q: "Minha verificação de CRN está demorando. O que faço?", a: "A análise leva até 2 dias úteis. Se ultrapassar esse prazo, entre em contato com o suporte pelo e-mail abaixo informando o número do CRN." },
  { q: "Como alterar meu horário de atendimento?",        a: "Em Perfil > Disponibilidade você configura os dias da semana, horários de início e fim, intervalo de almoço e máximo de consultas por dia." },
  { q: "Posso usar o app em mais de um dispositivo?",     a: "Sim, sua conta funciona em múltiplos dispositivos simultaneamente. Os dados são sincronizados automaticamente." },
  { q: "Como cancelar minha assinatura?",                 a: "Acesse Perfil > Assinatura e selecione 'Cancelar plano'. A assinatura permanece ativa até o fim do período pago sem cobranças adicionais." },
];

const CONTACT = [
  { icon: "mail-outline",      label: "suporte@nutrihub.com.br",   action: () => Linking.openURL("mailto:suporte@nutrihub.com.br?subject=Suporte NutriHub Pro") },
  { icon: "logo-whatsapp",     label: "Chat via WhatsApp",         action: () => Alert.alert("WhatsApp", "Suporte via WhatsApp em breve!") },
  { icon: "document-outline",  label: "Central de ajuda online",   action: () => Alert.alert("Em breve", "Portal de ajuda em desenvolvimento.") },
];

export default function NutritionistHelpScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
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
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#fff" }}>Central de ajuda</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4, textAlign: "center" }}>
            Perguntas frequentes e contato com suporte especializado
          </Text>
        </View>

        {/* FAQ */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Perguntas frequentes
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 }}>
          {FAQ.map((item, i) => (
            <View key={i} style={{ borderBottomWidth: i < FAQ.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
              <TouchableOpacity onPress={() => setOpenIndex(openIndex === i ? null : i)} activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
                <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111827", lineHeight: 20 }}>
                  {item.q}
                </Text>
                <Ionicons name={openIndex === i ? "chevron-up" : "chevron-down"} size={16} color="#9CA3AF" />
              </TouchableOpacity>
              {openIndex === i && (
                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", lineHeight: 20 }}>
                    {item.a}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Falar com suporte
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 32 }}>
          {CONTACT.map((item, i) => (
            <TouchableOpacity key={item.label} onPress={item.action} activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12, borderBottomWidth: i < CONTACT.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={item.icon as any} size={18} color="#16A34A" />
              </View>
              <Text style={{ flex: 1, fontFamily: "Inter-Regular", fontSize: 14, color: "#374151" }}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App info */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
            <Ionicons name="leaf" size={20} color="#16A34A" />
          </View>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#374151" }}>NutriHub Pro</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
            Versão {APP_VERSION} · Para nutricionistas
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
