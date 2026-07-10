import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMyNutritionistProfile } from "@/hooks/use-nutritionist";

const STEPS = [
  { icon: "document-text-outline",  label: "Informe o CRN",         desc: "Digite seu número de registro no Conselho Regional de Nutrição" },
  { icon: "cloud-upload-outline",   label: "Envie o documento",     desc: "Foto ou PDF da carteirinha CRN (frente e verso)" },
  { icon: "time-outline",           label: "Análise em andamento",  desc: "Nossa equipe analisa em até 2 dias úteis" },
  { icon: "shield-checkmark-outline", label: "Conta verificada",    desc: "Badge de verificado aparece no seu perfil" },
];

const FAQ = [
  { q: "Quanto tempo leva a verificação?", a: "Nossa equipe analisa os documentos em até 2 dias úteis após o envio." },
  { q: "Quais documentos são aceitos?", a: "Carteirinha física ou digital do CRN, anuidade quitada e documento de identidade." },
  { q: "A verificação expira?", a: "O badge é renovado automaticamente todo ano mediante pagamento da anuidade ao CRN." },
  { q: "Meu CRN é de outro estado, posso verificar?", a: "Sim. Aceitamos registros de todos os CRNs do Brasil (CRN-1 ao CRN-9)." },
];

export default function CrnVerificationScreen() {
  const router = useRouter();
  const { data: profile } = useMyNutritionistProfile();

  const isVerified = profile?.isVerified ?? false;
  const [crnInput, setCrnInput] = useState("");
  const [openFaq, setOpenFaq]   = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated]   = useState(false);

  if (profile && !hydrated) {
    setCrnInput(profile.crnNumber ?? "");
    setHydrated(true);
  }

  function handleSubmit() {
    if (!crnInput.trim()) {
      Alert.alert("Campo obrigatório", "Informe seu número de CRN.");
      return;
    }
    Alert.alert(
      "Enviar para verificação",
      "Após confirmar, você será guiado para o envio dos documentos.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => setSubmitted(true) },
      ]
    );
  }

  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Verificação CRN</Text>
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Ionicons name="checkmark-circle" size={40} color="#16A34A" />
          </View>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#111827", textAlign: "center" }}>
            Solicitação enviada!
          </Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#6B7280", marginTop: 10, textAlign: "center", lineHeight: 22 }}>
            Nossa equipe irá analisar seu CRN <Text style={{ fontFamily: "Inter-SemiBold" }}>{crnInput}</Text> em até 2 dias úteis. Você receberá uma notificação quando a verificação for concluída.
          </Text>
          <View style={{ backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14, marginTop: 24, width: "100%", flexDirection: "row", gap: 10 }}>
            <Ionicons name="information-circle-outline" size={18} color="#D97706" style={{ marginTop: 1 }} />
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#92400E", flex: 1, lineHeight: 19 }}>
              Você pode continuar usando o app normalmente. O badge aparecerá automaticamente após a aprovação.
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}
            style={{ marginTop: 28, backgroundColor: "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>Voltar ao perfil</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Verificação CRN</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Status banner */}
        {isVerified ? (
          <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="shield-checkmark" size={28} color="#16A34A" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#15803D" }}>Conta verificada</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                {profile?.crnNumber} · Renovação em Jan/2027
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: "#FFFBEB", borderRadius: 14, padding: 16, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="time-outline" size={28} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#92400E" }}>Verificação pendente</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                Verifique sua conta para aumentar a confiança dos pacientes
              </Text>
            </View>
          </View>
        )}

        {/* How it works */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>
          Como funciona
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {STEPS.map((step, i) => (
            <View key={step.label} style={{ flexDirection: "row", gap: 12, marginBottom: i < STEPS.length - 1 ? 16 : 0 }}>
              <View style={{ alignItems: "center" }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: i < (isVerified ? 4 : 0) ? "#16A34A" : "#F3F4F6",
                  alignItems: "center", justifyContent: "center",
                }}>
                  {i < (isVerified ? 4 : 0)
                    ? <Ionicons name="checkmark" size={18} color="#fff" />
                    : <Text style={{ fontFamily: "Inter-Bold", fontSize: 13, color: "#6B7280" }}>{i + 1}</Text>
                  }
                </View>
                {i < STEPS.length - 1 && (
                  <View style={{ width: 2, flex: 1, backgroundColor: "#F3F4F6", marginTop: 4 }} />
                )}
              </View>
              <View style={{ flex: 1, paddingTop: 6, paddingBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{step.label}</Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginTop: 2, lineHeight: 18 }}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CRN form */}
        {!isVerified && (
          <>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
              Iniciar verificação
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, gap: 12 }}>
              <View>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>Número do CRN</Text>
                <TextInput
                  value={crnInput} onChangeText={setCrnInput}
                  placeholder="Ex: CRN-3 12345"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                  style={{ height: 50, borderRadius: 12, paddingHorizontal: 16, backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", fontFamily: "Inter-Regular", fontSize: 15, color: "#111827" }}
                />
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert("Upload", "Funcionalidade de upload de documentos em desenvolvimento.")}
                activeOpacity={0.75}
                style={{ borderWidth: 1.5, borderColor: "#E5E7EB", borderStyle: "dashed", borderRadius: 12, padding: 20, alignItems: "center", gap: 8, backgroundColor: "#F9FAFB" }}
              >
                <Ionicons name="cloud-upload-outline" size={28} color="#9CA3AF" />
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#6B7280" }}>Enviar documento CRN</Text>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>JPG, PNG ou PDF · Máx. 5MB</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit} activeOpacity={0.8}
                style={{ backgroundColor: "#16A34A", borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#fff" }}>Solicitar verificação</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* FAQ */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Perguntas frequentes
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          {FAQ.map((item, i) => (
            <View key={i} style={{ borderBottomWidth: i < FAQ.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
              <TouchableOpacity onPress={() => setOpenFaq(openFaq === i ? null : i)} activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12 }}>
                <Text style={{ flex: 1, fontFamily: "Inter-Medium", fontSize: 14, color: "#111827", lineHeight: 20 }}>{item.q}</Text>
                <Ionicons name={openFaq === i ? "chevron-up" : "chevron-down"} size={16} color="#9CA3AF" />
              </TouchableOpacity>
              {openFaq === i && (
                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#6B7280", lineHeight: 20 }}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
