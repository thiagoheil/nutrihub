import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Section { title: string; content: string }

const TERMS_SECTIONS: Section[] = [
  {
    title: "1. Aceitação dos Termos",
    content: "Ao acessar e utilizar a plataforma NutriHub como profissional nutricionista, você concorda com estes Termos de Uso e com nossa Política de Privacidade. Caso não concorde com alguma das condições, interrompa o uso imediatamente.",
  },
  {
    title: "2. Elegibilidade e Cadastro",
    content: "O uso da plataforma como nutricionista requer registro ativo no Conselho Regional de Nutrição (CRN). Você é responsável pela veracidade das informações cadastradas, incluindo o número de CRN, e pela manutenção da regularidade do seu registro profissional.",
  },
  {
    title: "3. Responsabilidade Profissional",
    content: "Você, como nutricionista, é o único responsável pelas orientações nutricionais fornecidas aos seus pacientes através da plataforma. O NutriHub é uma ferramenta de apoio e não substitui o julgamento clínico profissional. Todos os planos alimentares e recomendações devem seguir as normas do CFN (Conselho Federal de Nutricionistas).",
  },
  {
    title: "4. Dados dos Pacientes",
    content: "Os dados de saúde dos seus pacientes são tratados como informação confidencial e protegida pelo sigilo profissional. Você se compromete a não compartilhar, exportar ou utilizar tais dados para finalidades diversas da prestação do serviço de saúde ao paciente. O NutriHub aplica criptografia AES-256 em todos os dados sensíveis armazenados.",
  },
  {
    title: "5. Privacidade e LGPD",
    content: "Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018), coletamos apenas os dados necessários para a operação da plataforma. O paciente tem o direito de solicitar a exclusão de seus dados a qualquer momento, e você será notificado quando isso ocorrer.",
  },
  {
    title: "6. Assinatura e Pagamentos",
    content: "Os planos de assinatura são cobrados mensalmente no cartão cadastrado. Cancelamentos podem ser feitos a qualquer momento; o acesso permanece ativo até o final do período pago. Não há reembolso proporcional por cancelamento antecipado, exceto em casos previstos pelo Código de Defesa do Consumidor.",
  },
  {
    title: "7. Propriedade Intelectual",
    content: "As receitas, planos alimentares e conteúdos criados por você na plataforma permanecem de sua propriedade intelectual. Ao publicá-los como 'público', você concede ao NutriHub licença não-exclusiva para exibição na plataforma. Receitas privadas ou restritas a pacientes não são acessíveis pela equipe NutriHub.",
  },
  {
    title: "8. Suspensão e Encerramento",
    content: "O NutriHub reserva-se o direito de suspender contas que violem estes termos, apresentem registros CRN inválidos, ou cuja conduta viole o Código de Ética do Nutricionista. Em caso de suspensão, você será notificado por e-mail com o motivo e prazo para contestação.",
  },
  {
    title: "9. Limitação de Responsabilidade",
    content: "O NutriHub não se responsabiliza por danos decorrentes do uso indevido da plataforma, orientações nutricionais inadequadas, falhas de conectividade ou perdas de dados originadas fora do nosso controle. Nossa responsabilidade máxima limita-se ao valor pago nos últimos 3 meses de assinatura.",
  },
  {
    title: "10. Alterações nos Termos",
    content: "Estes termos podem ser atualizados periodicamente. Você será notificado por e-mail e na plataforma com antecedência mínima de 15 dias antes de qualquer alteração relevante entrar em vigor. O uso continuado da plataforma após esse período implica aceitação das novas condições.",
  },
];

const PRIVACY_HIGHLIGHTS = [
  { icon: "lock-closed-outline",  text: "Dados criptografados com AES-256" },
  { icon: "eye-off-outline",      text: "Nunca vendemos dados a terceiros" },
  { icon: "trash-outline",        text: "Exclusão completa disponível a qualquer momento" },
  { icon: "server-outline",       text: "Servidores no Brasil (LGPD compliant)" },
];

export default function TermsScreen() {
  const router = useRouter();
  const [openSection, setOpenSection] = useState<number | null>(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Termos de uso</Text>
          <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 1 }}>
            Atualizado em 01/01/2026
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Privacy highlights */}
        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#15803D", marginBottom: 12 }}>
            Nossos compromissos com você
          </Text>
          <View style={{ gap: 10 }}>
            {PRIVACY_HIGHLIGHTS.map((h) => (
              <View key={h.text} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name={h.icon as any} size={15} color="#16A34A" />
                </View>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#374151", flex: 1 }}>{h.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Terms accordion */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Termos completos
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 24 }}>
          {TERMS_SECTIONS.map((section, i) => (
            <View key={i} style={{ borderBottomWidth: i < TERMS_SECTIONS.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
              <TouchableOpacity
                onPress={() => setOpenSection(openSection === i ? null : i)}
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}
              >
                <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>
                  {section.title}
                </Text>
                <Ionicons name={openSection === i ? "chevron-up" : "chevron-down"} size={16} color="#9CA3AF" />
              </TouchableOpacity>
              {openSection === i && (
                <View style={{ paddingHorizontal: 14, paddingBottom: 16 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", lineHeight: 21 }}>
                    {section.content}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity
            onPress={() => Alert.alert("Download", "Exportação de PDF em desenvolvimento.")}
            activeOpacity={0.75}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 14, height: 48, borderWidth: 1, borderColor: "#E5E7EB" }}
          >
            <Ionicons name="download-outline" size={18} color="#374151" />
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#374151" }}>Baixar PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Alert.alert("Contato", "Para dúvidas jurídicas: juridico@nutrihub.com.br")}
            activeOpacity={0.75}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderRadius: 14, height: 48, borderWidth: 1, borderColor: "#E5E7EB" }}
          >
            <Ionicons name="mail-outline" size={18} color="#374151" />
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#374151" }}>Dúvidas jurídicas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
