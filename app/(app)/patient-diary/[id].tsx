import { useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
  Image, TextInput, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  usePatientDetail, usePatientDiary, usePatientDiaryDates,
  useCommentsForLog, useAddComment, useDeleteComment, usePatientPlan,
} from "@/hooks/use-nutritionist";
import type { MealLog, NutritionistComment } from "@/types";

type MealInfo = { name: string; scheduledTime: string };
import {
  format, parseISO, isToday, isFuture, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth,
} from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS = {
  eaten:   { label: "Realizada",  color: "#16A34A", bg: "#DCFCE7", icon: "checkmark-circle" },
  partial: { label: "Parcial",    color: "#D97706", bg: "#FEF3C7", icon: "remove-circle"    },
  skipped: { label: "Pulada",     color: "#EF4444", bg: "#FEF2F2", icon: "close-circle"     },
} as const;

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// ─── Month calendar ───────────────────────────────────────────────────────────

function MonthCalendar({
  currentMonth, diaryDates, selectedDate,
  onChangeMonth, onSelectDate,
}: {
  currentMonth: Date;
  diaryDates: string[];
  selectedDate: string;
  onChangeMonth: (d: Date) => void;
  onSelectDate: (s: string) => void;
}) {
  const datesSet = new Set(diaryDates);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd   = endOfMonth(currentMonth);
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const leadingBlanks = getDay(monthStart); // 0=Sun

  // Days in this month that have logs
  const loggedThisMonth = diaryDates.filter((d) => d.startsWith(format(currentMonth, "yyyy-MM"))).length;

  return (
    <View style={{ backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16 }}>
      {/* Month navigation */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <TouchableOpacity
          onPress={() => onChangeMonth(subMonths(currentMonth, 1))}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="chevron-back" size={18} color="#374151" />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, color: "#111827", textTransform: "capitalize" }}>
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </Text>
          {loggedThisMonth > 0 && (
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#16A34A", marginTop: 2 }}>
              {loggedThisMonth} dia{loggedThisMonth !== 1 ? "s" : ""} com registros
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onChangeMonth(addMonths(currentMonth, 1))}
          disabled={isSameMonth(currentMonth, new Date())}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center", opacity: isSameMonth(currentMonth, new Date()) ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-forward" size={18} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={{ flexDirection: "row", marginBottom: 6 }}>
        {WEEKDAYS.map((w) => (
          <View key={w} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#9CA3AF" }}>{w}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <View key={`blank-${i}`} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />
        ))}

        {days.map((day) => {
          const str       = format(day, "yyyy-MM-dd");
          const isSelected = str === selectedDate;
          const hasLogs   = datesSet.has(str);
          const today     = isToday(day);
          const future    = isFuture(day) && !today;

          return (
            <TouchableOpacity
              key={str}
              onPress={() => !future && onSelectDate(str)}
              activeOpacity={future ? 1 : 0.7}
              style={{
                width: `${100 / 7}%`, aspectRatio: 1,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <View style={{
                width: 34, height: 34, borderRadius: 17,
                alignItems: "center", justifyContent: "center",
                backgroundColor: isSelected ? "#16A34A" : "transparent",
                borderWidth: today && !isSelected ? 1.5 : 0,
                borderColor: "#16A34A",
              }}>
                <Text style={{
                  fontFamily: isSelected ? "Inter-Bold" : "Inter-Regular",
                  fontSize: 14,
                  color: isSelected ? "#fff" : future ? "#D1D5DB" : today ? "#16A34A" : "#111827",
                }}>
                  {format(day, "d")}
                </Text>
              </View>
              {hasLogs && (
                <View style={{
                  width: 5, height: 5, borderRadius: 3, marginTop: 2,
                  backgroundColor: isSelected ? "#86EFAC" : "#16A34A",
                }} />
              )}
              {!hasLogs && <View style={{ width: 5, height: 5, marginTop: 2 }} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: "row", gap: 16, marginTop: 10, justifyContent: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A" }} />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>Com registros</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: "#16A34A" }} />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>Hoje</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Comment item ─────────────────────────────────────────────────────────────

function CommentItem({ comment, logId, onDelete }: { comment: NutritionistComment; logId: string; onDelete: () => void }) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 11, color: "#16A34A" }}>
          {comment.nutritionist.user.name[0]}
        </Text>
      </View>
      <View style={{ flex: 1, backgroundColor: "#F9FAFB", borderRadius: 10, padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#16A34A" }}>
              {comment.nutritionist.user.name}
            </Text>
            {comment.isPinned && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                <Ionicons name="pin" size={10} color="#6B7280" />
                <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#9CA3AF" }}>fixado</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={13} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#374151", lineHeight: 19 }}>
          {comment.content}
        </Text>
        <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
          {format(parseISO(comment.createdAt), "dd/MM · HH:mm")}
        </Text>
      </View>
    </View>
  );
}

// ─── Comment input ────────────────────────────────────────────────────────────

function CommentInput({ patientId, logId }: { patientId: string; logId: string }) {
  const [text, setText] = useState("");
  const addComment = useAddComment();

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment.mutate({ patientId, logId, content: trimmed }, { onSuccess: () => setText("") });
  }

  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 10, alignItems: "flex-end" }}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Escreva um comentário..."
        placeholderTextColor="#9CA3AF"
        multiline
        style={{
          flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: "#F9FAFB",
          borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB",
          paddingHorizontal: 12, paddingVertical: 8,
          fontFamily: "Inter-Regular", fontSize: 13, color: "#111827",
        }}
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!text.trim() || addComment.isPending}
        activeOpacity={0.8}
        style={{
          width: 40, height: 40, borderRadius: 12,
          backgroundColor: text.trim() ? "#16A34A" : "#E5E7EB",
          alignItems: "center", justifyContent: "center",
        }}
      >
        {addComment.isPending
          ? <ActivityIndicator size="small" color="#fff" />
          : <Ionicons name="send" size={16} color={text.trim() ? "#fff" : "#9CA3AF"} />
        }
      </TouchableOpacity>
    </View>
  );
}

// ─── Log card ─────────────────────────────────────────────────────────────────

function LogCard({ log, patientId, mealMap }: { log: MealLog; patientId: string; mealMap: Record<string, MealInfo> }) {
  const meal = mealMap[log.mealId];
  const st   = STATUS[log.status] ?? STATUS.eaten;
  const [showComments, setShowComments] = useState(true);
  const { data: comments = [], isLoading } = useCommentsForLog(log.id);
  const deleteComment = useDeleteComment();

  function handleDeleteComment(commentId: string) {
    Alert.alert("Excluir comentário", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deleteComment.mutate({ commentId, logId: log.id }) },
    ]);
  }

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, marginBottom: 14, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
      {log.photoUri ? (
        <Image source={{ uri: log.photoUri }} style={{ width: "100%", height: 180 }} resizeMode="cover" />
      ) : (
        <View style={{ width: "100%", height: 72, backgroundColor: "#F9FAFB", alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="image-outline" size={22} color="#D1D5DB" />
          <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#D1D5DB", marginTop: 3 }}>Sem foto</Text>
        </View>
      )}

      <View style={{ padding: 14 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15, color: "#111827" }}>
              {meal?.name ?? log.mealId}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>
              Previsto {meal?.scheduledTime} · Registrado {format(parseISO(log.loggedAt), "HH:mm")}
            </Text>
          </View>
          <View style={{ backgroundColor: st.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name={st.icon as any} size={12} color={st.color} />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: st.color }}>{st.label}</Text>
          </View>
        </View>

        {/* Adherence bar */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 11, color: "#9CA3AF" }}>Aderência ao plano</Text>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, color: "#374151" }}>{log.adherencePct}%</Text>
          </View>
          <View style={{ height: 5, backgroundColor: "#F3F4F6", borderRadius: 10 }}>
            <View style={{
              height: 5, borderRadius: 10, width: `${log.adherencePct}%`,
              backgroundColor: log.adherencePct >= 80 ? "#16A34A" : log.adherencePct >= 50 ? "#F59E0B" : "#EF4444",
            }} />
          </View>
        </View>

        {/* Patient note */}
        {log.notes && (
          <View style={{ backgroundColor: "#FFFBEB", borderRadius: 8, padding: 10, marginBottom: 8, flexDirection: "row", gap: 6 }}>
            <Ionicons name="document-text-outline" size={14} color="#D97706" style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 11, color: "#92400E", marginBottom: 2 }}>Nota do paciente</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 13, color: "#92400E" }}>{log.notes}</Text>
            </View>
          </View>
        )}

        {/* Comments */}
        <TouchableOpacity
          onPress={() => setShowComments((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 4, marginBottom: showComments ? 4 : 0 }}
        >
          <Ionicons name="chatbubble-outline" size={14} color="#6B7280" />
          <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: "#6B7280", flex: 1 }}>
            {isLoading ? "..." : `${comments.length} comentário${comments.length !== 1 ? "s" : ""}`}
          </Text>
          <Ionicons name={showComments ? "chevron-up" : "chevron-down"} size={14} color="#9CA3AF" />
        </TouchableOpacity>

        {showComments && (
          <View>
            {isLoading
              ? <ActivityIndicator size="small" color="#16A34A" style={{ marginVertical: 8 }} />
              : comments.map((c) => (
                  <CommentItem key={c.id} comment={c} logId={log.id} onDelete={() => handleDeleteComment(c.id)} />
                ))
            }
            <CommentInput patientId={patientId} logId={log.id} />
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PatientDiaryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const today = new Date();
  const [currentMonth, setCurrentMonth]   = useState(today);
  const [selectedDate, setSelectedDate]   = useState(format(today, "yyyy-MM-dd"));

  const { data: patient, isLoading: patientLoading } = usePatientDetail(id);
  const { data: diaryDates = [] }                    = usePatientDiaryDates(patient?.userId ?? "");
  const { data: logs = [], isLoading: logsLoading }  = usePatientDiary(patient?.userId ?? "", selectedDate);
  const { data: plan }                               = usePatientPlan(patient?.userId ?? "");

  const mealMap = useMemo<Record<string, MealInfo>>(
    () => Object.fromEntries((plan?.meals ?? []).map((m) => [m.id, { name: m.name, scheduledTime: m.scheduledTime }])),
    [plan]
  );

  if (patientLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </SafeAreaView>
    );
  }

  const formattedDate = format(parseISO(selectedDate), "EEEE, d 'de' MMMM", { locale: ptBR });
  const adherenceAvg  = logs.length
    ? Math.round(logs.reduce((s, l) => s + l.adherencePct, 0) / logs.length)
    : null;

  function handleSelectDate(str: string) {
    setSelectedDate(str);
    // If selected date is in a different month, navigate there
    const d = parseISO(str);
    if (!isSameMonth(d, currentMonth)) setCurrentMonth(startOfMonth(d));
  }

  function jumpToToday() {
    const str = format(today, "yyyy-MM-dd");
    setSelectedDate(str);
    setCurrentMonth(today);
  }

  const isViewingToday = selectedDate === format(today, "yyyy-MM-dd");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", padding: 20, paddingBottom: 12, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontFamily: "Inter-SemiBold", color: "#111827" }}>
              Diário — {patient?.name?.split(" ")[0]}
            </Text>
            <Text style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#9CA3AF", marginTop: 1, textTransform: "capitalize" }}>
              {formattedDate}
            </Text>
          </View>

          {!isViewingToday && (
            <TouchableOpacity
              onPress={jumpToToday}
              style={{ backgroundColor: "#F0FDF4", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: "#BBF7D0" }}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 12, color: "#16A34A" }}>Hoje</Text>
            </TouchableOpacity>
          )}

          {adherenceAvg !== null && (
            <View style={{
              backgroundColor: adherenceAvg >= 80 ? "#DCFCE7" : adherenceAvg >= 50 ? "#FEF3C7" : "#FEF2F2",
              borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignItems: "center",
            }}>
              <Text style={{
                fontFamily: "Inter-Bold", fontSize: 14,
                color: adherenceAvg >= 80 ? "#16A34A" : adherenceAvg >= 50 ? "#D97706" : "#EF4444",
              }}>{adherenceAvg}%</Text>
              <Text style={{ fontFamily: "Inter-Regular", fontSize: 10, color: "#9CA3AF" }}>aderência</Text>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
          {/* Month calendar */}
          <MonthCalendar
            currentMonth={currentMonth}
            diaryDates={diaryDates}
            selectedDate={selectedDate}
            onChangeMonth={setCurrentMonth}
            onSelectDate={handleSelectDate}
          />

          {/* Day logs */}
          <View style={{ paddingHorizontal: 20 }}>
            {logsLoading ? (
              <ActivityIndicator color="#16A34A" style={{ marginTop: 40 }} />
            ) : logs.length === 0 ? (
              <View style={{ alignItems: "center", marginTop: 40, marginBottom: 20 }}>
                <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Ionicons name="calendar-outline" size={28} color="#D1D5DB" />
                </View>
                <Text style={{ fontFamily: "Inter-SemiBold", color: "#374151", fontSize: 15 }}>
                  Sem registros neste dia
                </Text>
                <Text style={{ fontFamily: "Inter-Regular", color: "#9CA3AF", marginTop: 6, textAlign: "center" }}>
                  O paciente não registrou{"\n"}refeições nesta data.
                </Text>
              </View>
            ) : (
              logs.map((log) => (
                <LogCard key={log.id} log={log} patientId={patient?.userId ?? ""} mealMap={mealMap} />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
