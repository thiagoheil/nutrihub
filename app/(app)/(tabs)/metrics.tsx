import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMetrics, useCreateMetric } from "@/hooks/use-metrics";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Metric, MetricPayload } from "@/types";

// ─── chart tab config ──────────────────────────────────────────────────────────
type ChartTab = "weight" | "waist" | "hip";
const TABS: { key: ChartTab; label: string; field: keyof Metric; unit: string }[] = [
  { key: "weight", label: "⚖️ Peso",    field: "weightKg", unit: "kg" },
  { key: "waist",  label: "📏 Cintura", field: "waistCm",  unit: "cm" },
  { key: "hip",    label: "〰️ Quadril", field: "hipCm",    unit: "cm" },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return format(new Date(iso), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
}
function fmtShort(iso: string) {
  return format(new Date(iso), "d MMM", { locale: ptBR });
}
function fmtVariation(diff: number) {
  return `${diff > 0 ? "+" : ""}${diff.toFixed(1)} kg`;
}

// ─── form state ───────────────────────────────────────────────────────────────
const emptyForm = {
  weightKg: "", armCm: "", waistCm: "", abdomenCm: "",
  hipCm: "", thighCm: "", calfCm: "", observation: "",
};
type FormKey = keyof typeof emptyForm;

// ─── sub-components ───────────────────────────────────────────────────────────
function SummaryCard({ icon, value, label, valueColor }: {
  icon: string; value: string; label: string; valueColor?: string;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", borderRadius: 14, padding: 14, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 }}>
      <Text style={{ fontSize: 20, marginBottom: 4 }}>{icon}</Text>
      <Text style={{ fontFamily: "Inter-Bold", fontSize: 20, color: valueColor ?? "#111827" }}>{value}</Text>
      <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginTop: 2, textAlign: "center" }}>{label}</Text>
    </View>
  );
}

function HistoryItem({ metric, expanded, onToggle }: {
  metric: Metric; expanded: boolean; onToggle: () => void;
}) {
  const measurements = [
    metric.armCm     && { label: "Braço",      value: `${metric.armCm}cm` },
    metric.waistCm   && { label: "Cintura",    value: `${metric.waistCm}cm` },
    metric.abdomenCm && { label: "Abdômen",    value: `${metric.abdomenCm}cm` },
    metric.hipCm     && { label: "Quadril",    value: `${metric.hipCm}cm` },
    metric.thighCm   && { label: "Coxa",       value: `${metric.thighCm}cm` },
    metric.calfCm    && { label: "Panturrilha",value: `${metric.calfCm}cm` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 14, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, overflow: "hidden" }}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}
        style={{ padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
      >
        <View>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>{fmtDate(metric.measuredAt)}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {metric.weightKg && (
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#16A34A" }}>{metric.weightKg} kg</Text>
            )}
            {measurements.slice(0, 3).map(m => (
              <Text key={m.label} style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>
                {m.label}: {m.value}
              </Text>
            ))}
          </View>
          {(metric.photos?.length ?? 0) > 0 && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#16A34A", marginTop: 4 }}>
              📷 {metric.photos!.length} foto{metric.photos!.length > 1 ? "s" : ""}
            </Text>
          )}
        </View>
        <Text style={{ fontSize: 18, color: "#9CA3AF" }}>{expanded ? "∧" : "∨"}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderTopColor: "#F3F4F6" }}>
          {measurements.length > 0 && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              {measurements.map(m => (
                <View key={m.label} style={{ backgroundColor: "#F9FAFB", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>{m.label}</Text>
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#111827" }}>{m.value}</Text>
                </View>
              ))}
            </View>
          )}
          {metric.bmi != null && (
            <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#6B7280" }}>IMC:</Text>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#111827" }}>{metric.bmi.toFixed(1)} kg/m²</Text>
            </View>
          )}
          {metric.observation ? (
            <View style={{ marginTop: 10, backgroundColor: "#FFFBEB", borderRadius: 8, padding: 10 }}>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#92400E" }}>💬 {metric.observation}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

function FormField({ label, value, onChange, placeholder, half = false }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; half?: boolean;
}) {
  return (
    <View style={{ flex: half ? 1 : undefined, marginBottom: 12 }}>
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? ""}
        placeholderTextColor="#9CA3AF"
        keyboardType="decimal-pad"
        style={{ backgroundColor: "#F3F4F6", borderRadius: 12, height: 48, paddingHorizontal: 14, fontFamily: "Inter-Regular", fontSize: 14, color: "#111827" }}
      />
    </View>
  );
}

// ─── bar chart ────────────────────────────────────────────────────────────────
const BAR_H = 150;

function BarChart({ points, labels, unit }: {
  points: { x: number; y: number }[];
  labels: string[];
  unit: string;
}) {
  const yValues = points.map(p => p.y);
  const maxY = Math.max(...yValues);
  const minY = Math.min(...yValues);
  const range = maxY - minY || 1;

  const yTicks = [maxY, (maxY + minY) / 2, minY].map(v => Math.round(v * 10) / 10);

  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: "row" }}>
        {/* Y-axis labels */}
        <View style={{ width: 36, height: BAR_H, justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6 }}>
          {yTicks.map((v, i) => (
            <Text key={i} style={{ fontFamily: "Inter-Regular", fontSize: 9, color: "#9CA3AF" }}>{v}</Text>
          ))}
        </View>
        {/* Bars */}
        <View style={{ flex: 1, height: BAR_H, flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
          {points.map((p, i) => {
            const pct = (p.y - minY) / range;
            const barHeight = Math.max(pct * (BAR_H - 8), 4);
            const isLast = i === points.length - 1;
            return (
              <View key={i} style={{ flex: 1, alignItems: "center", height: BAR_H, justifyContent: "flex-end" }}>
                {isLast && (
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 9, color: "#16A34A", marginBottom: 2 }}>
                    {p.y}{unit}
                  </Text>
                )}
                <View style={{
                  width: "100%",
                  height: barHeight,
                  backgroundColor: isLast ? "#16A34A" : "#D1FAE5",
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }} />
              </View>
            );
          })}
        </View>
      </View>
      {/* X-axis labels */}
      <View style={{ flexDirection: "row", marginLeft: 36, marginTop: 6, gap: 4 }}>
        {labels.map((label, i) => (
          <Text key={i} style={{ flex: 1, textAlign: "center", fontFamily: "Inter-Regular", fontSize: 8, color: "#9CA3AF" }}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─── main screen ──────────────────────────────────────────────────────────────
export default function MetricsScreen() {
  const insets = useSafeAreaInsets();
  const { data: metrics = [], isLoading } = useMetrics();
  const createMetric = useCreateMetric();

  const [activeTab, setActiveTab] = useState<ChartTab>("weight");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const sorted = [...metrics].sort((a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime());
  const latest = sorted[sorted.length - 1];
  const oldest = sorted[0];
  const weightVariation = latest && oldest && latest.weightKg != null && oldest.weightKg != null
    ? latest.weightKg - oldest.weightKg
    : null;

  // Chart data
  const tabConfig = TABS.find(t => t.key === activeTab)!;
  const chartPoints = sorted
    .filter(m => m[tabConfig.field] != null)
    .map((m, i) => ({ x: i, y: m[tabConfig.field] as number }));
  const chartLabels = sorted
    .filter(m => m[tabConfig.field] != null)
    .map(m => fmtShort(m.measuredAt));

  function updateForm(key: FormKey, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const payload: MetricPayload = {
      measuredAt: new Date().toISOString(),
      weightKg:   form.weightKg   ? parseFloat(form.weightKg)   : undefined,
      armCm:      form.armCm      ? parseFloat(form.armCm)      : undefined,
      waistCm:    form.waistCm    ? parseFloat(form.waistCm)    : undefined,
      abdomenCm:  form.abdomenCm  ? parseFloat(form.abdomenCm)  : undefined,
      hipCm:      form.hipCm      ? parseFloat(form.hipCm)      : undefined,
      thighCm:    form.thighCm    ? parseFloat(form.thighCm)    : undefined,
      calfCm:     form.calfCm     ? parseFloat(form.calfCm)     : undefined,
      observation: form.observation || undefined,
    };

    if (!payload.weightKg) return;

    createMetric.mutate(payload, {
      onSuccess: () => {
        setShowModal(false);
        setForm(emptyForm);
      },
    });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Header */}
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={{ fontFamily: "Inter-Bold", fontSize: 22, color: "#111827" }}>Medidas Corporais</Text>
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", marginTop: 2, marginBottom: 16 }}>
            Acompanhe sua evolução
          </Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            activeOpacity={0.8}
            style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
          >
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#fff" }}>+ Adicionar Registro</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Summary cards */}
            <View style={{ flexDirection: "row", gap: 10, padding: 20, paddingBottom: 0 }}>
              <SummaryCard
                icon="⚖️"
                value={latest?.weightKg != null ? `${latest.weightKg} kg` : "—"}
                label="Peso atual"
              />
              <SummaryCard
                icon={weightVariation != null && weightVariation < 0 ? "📉" : "📈"}
                value={weightVariation != null ? fmtVariation(weightVariation) : "—"}
                label="Variação"
                valueColor={weightVariation != null && weightVariation < 0 ? "#16A34A" : "#DC2626"}
              />
              <SummaryCard
                icon="📅"
                value={String(metrics.length)}
                label="Registros"
              />
            </View>

            {/* Chart */}
            <View style={{ margin: 20, marginBottom: 0, backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              {/* Tabs */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
                {TABS.map(tab => (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: activeTab === tab.key ? "#16A34A" : "#F3F4F6",
                    }}
                  >
                    <Text style={{
                      fontFamily: "Inter-SemiBold",
                      fontSize: 12,
                      color: activeTab === tab.key ? "#fff" : "#6B7280",
                    }}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {chartPoints.length >= 2 ? (
                <BarChart
                  points={chartPoints}
                  labels={chartLabels}
                  unit={tabConfig.unit}
                />
              ) : (
                <View style={{ height: 120, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF" }}>
                    Adicione pelo menos 2 registros para ver o gráfico.
                  </Text>
                </View>
              )}
            </View>

            {/* History */}
            <View style={{ padding: 20 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#111827", marginBottom: 14 }}>
                Histórico
              </Text>
              {[...sorted].reverse().map(metric => (
                <HistoryItem
                  key={metric.id}
                  metric={metric}
                  expanded={expandedId === metric.id}
                  onToggle={() => setExpandedId(expandedId === metric.id ? null : metric.id)}
                />
              ))}
              {metrics.length === 0 && (
                <View style={{ alignItems: "center", padding: 32 }}>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#9CA3AF", textAlign: "center" }}>
                    Nenhum registro ainda.{"\n"}Adicione seu primeiro registro!
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Add Record Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#fff" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Modal header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" }}>
              <Text style={{ fontFamily: "Inter-Bold", fontSize: 18, color: "#111827" }}>Novo Registro</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setForm(emptyForm); }} activeOpacity={0.7}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 15, color: "#6B7280" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

              {/* Date (read-only, always today) */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>
                  Data de Registro *
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, height: 48, paddingHorizontal: 14, gap: 10 }}>
                  <Text style={{ fontSize: 16 }}>📅</Text>
                  <Text style={{ fontFamily: "Inter-Regular", fontSize: 14, color: "#374151" }}>
                    {format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </Text>
                </View>
              </View>

              {/* Row: Peso + Braço */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormField label="Peso (kg) *" value={form.weightKg} onChange={v => updateForm("weightKg", v)} placeholder={`${latest?.weightKg ?? "70"}`} half />
                </View>
                <View style={{ flex: 1 }}>
                  <FormField label="Braço relaxado (cm)" value={form.armCm} onChange={v => updateForm("armCm", v)} placeholder={`${latest?.armCm ?? "35"}`} half />
                </View>
              </View>

              {/* Row: Cintura + Abdômen */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormField label="Cintura (cm)" value={form.waistCm} onChange={v => updateForm("waistCm", v)} placeholder={`${latest?.waistCm ?? "80"}`} half />
                </View>
                <View style={{ flex: 1 }}>
                  <FormField label="Abdômen (cm)" value={form.abdomenCm} onChange={v => updateForm("abdomenCm", v)} placeholder={`${latest?.abdomenCm ?? "85"}`} half />
                </View>
              </View>

              {/* Row: Quadril + Coxa */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormField label="Quadril (cm)" value={form.hipCm} onChange={v => updateForm("hipCm", v)} placeholder={`${latest?.hipCm ?? "95"}`} half />
                </View>
                <View style={{ flex: 1 }}>
                  <FormField label="Coxa (cm)" value={form.thighCm} onChange={v => updateForm("thighCm", v)} placeholder={`${latest?.thighCm ?? "55"}`} half />
                </View>
              </View>

              {/* Panturrilha */}
              <View style={{ width: "50%", paddingRight: 6 }}>
                <FormField label="Panturrilha (cm)" value={form.calfCm} onChange={v => updateForm("calfCm", v)} placeholder={`${latest?.calfCm ?? "35"}`} />
              </View>

              {/* Observação */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 6 }}>Observação</Text>
                <TextInput
                  value={form.observation}
                  onChangeText={v => updateForm("observation", v)}
                  placeholder="Ex: Após treino, em jejum..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                  style={{ backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontFamily: "Inter-Regular", fontSize: 14, color: "#111827", textAlignVertical: "top", minHeight: 80 }}
                />
              </View>

              {/* Photos placeholder */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#374151", marginBottom: 10 }}>
                  📷 Fotos de Progresso (opcional)
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {(["Frente", "Lado", "Costas"] as const).map(label => (
                    <View
                      key={label}
                      style={{ flex: 1, aspectRatio: 0.75, borderRadius: 12, borderWidth: 1.5, borderColor: "#E5E7EB", borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "#F9FAFB" }}
                    >
                      <Text style={{ fontSize: 24, marginBottom: 6 }}>📷</Text>
                      <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>{label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Submit */}
              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={createMetric.isPending || !form.weightKg}
                style={{
                  backgroundColor: !form.weightKg ? "#D1FAE5" : "#16A34A",
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: "center",
                }}
              >
                {createMetric.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#fff" }}>
                    Salvar Registro
                  </Text>
                )}
              </TouchableOpacity>

            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
