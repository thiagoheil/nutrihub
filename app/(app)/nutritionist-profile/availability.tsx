import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const WEEKDAYS = [
  { id: "mon", label: "Segunda",   short: "Seg" },
  { id: "tue", label: "Terça",    short: "Ter" },
  { id: "wed", label: "Quarta",   short: "Qua" },
  { id: "thu", label: "Quinta",   short: "Qui" },
  { id: "fri", label: "Sexta",    short: "Sex" },
  { id: "sat", label: "Sábado",   short: "Sáb" },
  { id: "sun", label: "Domingo",  short: "Dom" },
] as const;

type DayId = typeof WEEKDAYS[number]["id"];

interface DaySchedule { start: number; end: number; active: boolean }

const DEFAULT_SCHEDULE: Record<DayId, DaySchedule> = {
  mon: { start: 8,  end: 18, active: true  },
  tue: { start: 8,  end: 18, active: true  },
  wed: { start: 8,  end: 18, active: true  },
  thu: { start: 8,  end: 18, active: true  },
  fri: { start: 8,  end: 17, active: true  },
  sat: { start: 9,  end: 13, active: false },
  sun: { start: 9,  end: 12, active: false },
};

function pad(n: number) { return `${n}`.padStart(2, "0"); }
function fmt(h: number) { return `${pad(h)}:00`; }

function TimeControl({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <TouchableOpacity
        onPress={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: value > min ? "#F0FDF4" : "#F3F4F6", alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name="remove" size={16} color={value > min ? "#16A34A" : "#D1D5DB"} />
      </TouchableOpacity>
      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827", minWidth: 44, textAlign: "center" }}>{fmt(value)}</Text>
      <TouchableOpacity
        onPress={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: value < max ? "#F0FDF4" : "#F3F4F6", alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name="add" size={16} color={value < max ? "#16A34A" : "#D1D5DB"} />
      </TouchableOpacity>
    </View>
  );
}

export default function AvailabilityScreen() {
  const router  = useRouter();
  const [schedule, setSchedule] = useState<Record<DayId, DaySchedule>>(DEFAULT_SCHEDULE);
  const [maxPatients, setMaxPatients] = useState(6);
  const [breakEnabled, setBreakEnabled] = useState(true);
  const [breakStart, setBreakStart]     = useState(12);
  const [breakEnd,   setBreakEnd]       = useState(13);
  const [modality, setModality] = useState<"presential" | "online" | "both">("both");
  const [saving, setSaving] = useState(false);

  function updateDay(id: DayId, patch: Partial<DaySchedule>) {
    setSchedule((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  }

  const activeDays = WEEKDAYS.filter((d) => schedule[d.id].active);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    Alert.alert("Salvo!", "Sua disponibilidade foi atualizada.", [{ text: "OK", onPress: () => router.back() }]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>Disponibilidade</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 4, paddingBottom: 40 }}>
        {/* Summary chips */}
        <View style={{ backgroundColor: "#F0FDF4", borderRadius: 14, padding: 14, marginBottom: 24, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="calendar-outline" size={20} color="#16A34A" />
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#15803D", flex: 1 }}>
            {activeDays.length} dia{activeDays.length !== 1 ? "s" : ""} ativo{activeDays.length !== 1 ? "s" : ""} · {maxPatients} consultas/dia
          </Text>
        </View>

        {/* Days */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Dias de atendimento
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2, marginBottom: 20 }}>
          {WEEKDAYS.map((day, i) => {
            const s = schedule[day.id];
            return (
              <View key={day.id}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: !s.active && i < WEEKDAYS.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
                  <Switch
                    value={s.active}
                    onValueChange={(v) => updateDay(day.id, { active: v })}
                    trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
                    thumbColor={s.active ? "#16A34A" : "#fff"}
                    ios_backgroundColor="#E5E7EB"
                  />
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: s.active ? "#111827" : "#9CA3AF", flex: 1 }}>
                    {day.label}
                  </Text>
                  {s.active && (
                    <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF" }}>
                      {fmt(s.start)} – {fmt(s.end)}
                    </Text>
                  )}
                </View>

                {s.active && (
                  <View style={{ backgroundColor: "#F9FAFB", padding: 14, paddingTop: 0, borderBottomWidth: i < WEEKDAYS.length - 1 ? 1 : 0, borderBottomColor: "#F3F4F6" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Início</Text>
                        <TimeControl value={s.start} min={6} max={s.end - 1} onChange={(v) => updateDay(day.id, { start: v })} />
                      </View>
                      <Ionicons name="arrow-forward" size={14} color="#D1D5DB" style={{ marginHorizontal: 8 }} />
                      <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Término</Text>
                        <TimeControl value={s.end} min={s.start + 1} max={22} onChange={(v) => updateDay(day.id, { end: v })} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Lunch break */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Intervalo de almoço
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: breakEnabled ? 14 : 0 }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827", flex: 1 }}>Bloquear horário de almoço</Text>
            <Switch value={breakEnabled} onValueChange={setBreakEnabled}
              trackColor={{ false: "#E5E7EB", true: "#86EFAC" }}
              thumbColor={breakEnabled ? "#16A34A" : "#fff"} ios_backgroundColor="#E5E7EB" />
          </View>
          {breakEnabled && (
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Início</Text>
                <TimeControl value={breakStart} min={10} max={breakEnd - 1} onChange={setBreakStart} />
              </View>
              <Ionicons name="arrow-forward" size={14} color="#D1D5DB" style={{ marginHorizontal: 8 }} />
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>Término</Text>
                <TimeControl value={breakEnd} min={breakStart + 1} max={16} onChange={setBreakEnd} />
              </View>
            </View>
          )}
        </View>

        {/* Max patients */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Capacidade diária
        </Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 14, color: "#111827" }}>Máximo de consultas/dia</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                Novas solicitações serão bloqueadas ao atingir o limite
              </Text>
            </View>
            <TimeControl value={maxPatients} min={1} max={30} onChange={setMaxPatients} />
          </View>
        </View>

        {/* Modality */}
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>
          Modalidade de atendimento
        </Text>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 28 }}>
          {([
            { id: "presential", label: "Presencial", icon: "business-outline" },
            { id: "online",     label: "Online",      icon: "videocam-outline" },
            { id: "both",       label: "Ambos",       icon: "layers-outline"   },
          ] as const).map((m) => {
            const active = modality === m.id;
            return (
              <TouchableOpacity key={m.id} onPress={() => setModality(m.id)} activeOpacity={0.8}
                style={{ flex: 1, backgroundColor: active ? "#16A34A" : "#fff", borderRadius: 12, padding: 14, alignItems: "center", borderWidth: 1.5, borderColor: active ? "#16A34A" : "#E5E7EB" }}>
                <Ionicons name={m.icon} size={20} color={active ? "#fff" : "#9CA3AF"} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: active ? "#fff" : "#374151", marginTop: 6 }}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Save */}
        <TouchableOpacity onPress={handleSave} activeOpacity={0.8} disabled={saving}
          style={{ backgroundColor: saving ? "#86EFAC" : "#16A34A", borderRadius: 14, height: 52, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#fff" }}>
            {saving ? "Salvando..." : "Salvar disponibilidade"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
