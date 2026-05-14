import { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, ScrollView, Alert, Clipboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMyTokens, useCreateToken, useRevokeToken } from "@/hooks/use-nutritionist";
import type { InviteToken, ServiceType } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS: { id: ServiceType; label: string; color: string; bg: string }[] = [
  { id: "basic",    label: "Basic",    color: "#6B7280", bg: "#F3F4F6" },
  { id: "standard", label: "Standard", color: "#2563EB", bg: "#EFF6FF" },
  { id: "premium",  label: "Premium",  color: "#16A34A", bg: "#F0FDF4" },
  { id: "custom",   label: "Custom",   color: "#9333EA", bg: "#F5F3FF" },
];

const STATUS_CONFIG = {
  active:  { label: "Ativo",    color: "#16A34A", bg: "#DCFCE7" },
  used:    { label: "Usado",    color: "#6B7280", bg: "#F3F4F6" },
  expired: { label: "Expirado", color: "#D97706", bg: "#FEF3C7" },
  revoked: { label: "Revogado", color: "#EF4444", bg: "#FEF2F2" },
};

function serviceBadge(type?: ServiceType) {
  const opt = SERVICE_OPTIONS.find((o) => o.id === type) ?? SERVICE_OPTIONS[0];
  return opt;
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ─── Token card ───────────────────────────────────────────────────────────────

function TokenCard({ token, onRevoke }: { token: InviteToken; onRevoke: () => void }) {
  const status = STATUS_CONFIG[token.status];
  const service = serviceBadge(token.serviceType);

  function handleCopy() {
    Clipboard.setString(token.code);
    Alert.alert("Copiado!", `Código ${token.code} copiado para a área de transferência.`);
  }

  return (
    <View style={{
      backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 12,
      shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    }}>
      {/* Top row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{token.label}</Text>
          {token.usedByName && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Usado por: {token.usedByName}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <View style={{ backgroundColor: service.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: service.color }}>{service.label}</Text>
          </View>
          <View style={{ backgroundColor: status.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 10, color: status.color }}>{status.label}</Text>
          </View>
        </View>
      </View>

      {/* Code row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <View style={{
          flex: 1, backgroundColor: "#F9FAFB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
          borderWidth: 1, borderColor: "#E5E7EB",
        }}>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827", letterSpacing: 3 }}>{token.code}</Text>
        </View>
        {token.status === "active" && (
          <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#F0FDF4", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="copy-outline" size={20} color="#16A34A" />
          </TouchableOpacity>
        )}
      </View>

      {/* Meta row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 2 }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{formatPrice(token.priceRcents)}</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>
            Criado {format(new Date(token.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            {token.expiresAt ? ` · expira ${format(new Date(token.expiresAt), "dd/MM/yy")}` : ""}
          </Text>
          {token.notes && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#6B7280", marginTop: 2 }}>{token.notes}</Text>
          )}
        </View>
        {token.status === "active" && (
          <TouchableOpacity onPress={onRevoke} activeOpacity={0.7}
            style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: "#FCA5A5" }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: "#EF4444" }}>Revogar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

const EMPTY_FORM = { label: "", serviceType: "standard" as ServiceType, price: "", notes: "" };

export default function ConvitesScreen() {
  const { data: tokens, isLoading } = useMyTokens();
  const createToken = useCreateToken();
  const revokeToken = useRevokeToken();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState<"all" | "active" | "used">("all");

  const activeCount = tokens?.filter((t) => t.status === "active").length ?? 0;
  const usedCount   = tokens?.filter((t) => t.status === "used").length ?? 0;

  const filtered = (tokens ?? []).filter((t) => {
    if (filter === "active") return t.status === "active";
    if (filter === "used")   return t.status === "used";
    return true;
  });

  function handleCreate() {
    if (!form.label.trim()) { Alert.alert("Campo obrigatório", "Adicione um nome/label para o convite."); return; }
    const price = parseFloat(form.price.replace(",", "."));
    if (isNaN(price) || price < 0) { Alert.alert("Preço inválido", "Informe um valor numérico."); return; }
    createToken.mutate({
      label: form.label.trim(),
      serviceType: form.serviceType,
      priceRcents: Math.round(price * 100),
      notes: form.notes.trim() || undefined,
    }, {
      onSuccess: () => { setShowModal(false); setForm(EMPTY_FORM); },
    });
  }

  function handleRevoke(token: InviteToken) {
    Alert.alert("Revogar convite", `Tem certeza que deseja revogar o código ${token.code}? O paciente não conseguirá mais usá-lo.`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Revogar", style: "destructive", onPress: () => revokeToken.mutate(token.id) },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 22, fontFamily: "Inter-Bold", color: "#111827" }}>Convites</Text>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 2 }}>
              Códigos únicos por paciente
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#16A34A", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#fff" }}>Novo</Text>
          </TouchableOpacity>
        </View>

        {/* Stats pills */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
          {[
            { key: "all",    label: `Todos (${(tokens ?? []).length})` },
            { key: "active", label: `Ativos (${activeCount})` },
            { key: "used",   label: `Usados (${usedCount})` },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key as any)}
              style={{
                paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
                backgroundColor: filter === f.key ? "#16A34A" : "#fff",
                borderWidth: 1, borderColor: filter === f.key ? "#16A34A" : "#E5E7EB",
              }}
            >
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: filter === f.key ? "#fff" : "#6B7280" }}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(t) => t.id}
          contentContainerStyle={{ padding: 20, paddingTop: 4 }}
          renderItem={({ item }) => <TokenCard token={item} onRevoke={() => handleRevoke(item)} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="key-outline" size={48} color="#D1D5DB" />
              <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 12, textAlign: "center" }}>
                Nenhum convite encontrado.{"\n"}Crie um novo convite.
              </Text>
            </View>
          )}
        />
      )}

      {/* Create modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827" }}>Novo convite</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setForm(EMPTY_FORM); }}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Label */}
              <Text style={labelStyle}>Nome / Label interno *</Text>
              <TextInput
                value={form.label}
                onChangeText={(v) => setForm((f) => ({ ...f, label: v }))}
                placeholder="Ex: Plano Premium – João Silva"
                placeholderTextColor="#9CA3AF"
                style={inputStyle}
              />

              {/* Service type */}
              <Text style={[labelStyle, { marginTop: 16 }]}>Tipo de serviço</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                {SERVICE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => setForm((f) => ({ ...f, serviceType: opt.id }))}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                      backgroundColor: form.serviceType === opt.id ? opt.bg : "#F9FAFB",
                      borderWidth: 1.5,
                      borderColor: form.serviceType === opt.id ? opt.color : "#E5E7EB",
                    }}
                  >
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: form.serviceType === opt.id ? opt.color : "#6B7280" }}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Price */}
              <Text style={[labelStyle, { marginTop: 16 }]}>Valor (R$) *</Text>
              <TextInput
                value={form.price}
                onChangeText={(v) => setForm((f) => ({ ...f, price: v }))}
                placeholder="Ex: 199,90"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                style={inputStyle}
              />

              {/* Notes */}
              <Text style={[labelStyle, { marginTop: 16 }]}>Observações (interno)</Text>
              <TextInput
                value={form.notes}
                onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
                placeholder="Notas internas sobre este convite..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={2}
                style={[inputStyle, { height: 70, textAlignVertical: "top", paddingTop: 10 }]}
              />

              <TouchableOpacity
                onPress={handleCreate}
                disabled={createToken.isPending}
                activeOpacity={0.8}
                style={{ marginTop: 24, backgroundColor: createToken.isPending ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}
              >
                {createToken.isPending
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>Gerar código</Text>
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
