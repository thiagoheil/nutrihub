import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "@/hooks/use-auth";
import { UserRole } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.enum(["user", "nutritionist"]),
  phone: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const register = useRegister();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "user" },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: FormData) => {
    register.mutate(data, {
      onError: () => Alert.alert("Erro", "Não foi possível criar sua conta. Tente novamente."),
    });
  };

  const inputStyle = (hasError: boolean) => ({
    borderWidth: 1,
    borderColor: hasError ? "#EF4444" : "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter-Regular",
  });

  const roleOption = (role: UserRole, label: string, subtitle: string) => {
    const selected = selectedRole === role;
    return (
      <TouchableOpacity
        key={role}
        onPress={() => setValue("role", role)}
        style={{
          flex: 1,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? "#16A34A" : "#D1D5DB",
          borderRadius: 10,
          padding: 12,
          backgroundColor: selected ? "#F0FDF4" : "#fff",
        }}
      >
        <Text style={{ fontFamily: "Inter-SemiBold", color: selected ? "#15803D" : "#374151" }}>
          {label}
        </Text>
        <Text style={{ fontSize: 12, fontFamily: "Inter-Regular", color: "#6B7280", marginTop: 2 }}>
          {subtitle}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ fontSize: 26, fontFamily: "Inter-Bold", color: "#111827", marginBottom: 4, marginTop: 40 }}>
        Criar conta
      </Text>
      <Text style={{ fontSize: 15, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 28 }}>
        Comece sua jornada de saúde
      </Text>

      {/* Role selection */}
      <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 8 }}>
        Tipo de conta
      </Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
        {roleOption("user", "Usuário", "Acompanhe sua dieta")}
        {roleOption("nutritionist", "Nutricionista", "Atenda seus pacientes")}
      </View>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 6 }}>
              Nome completo
            </Text>
            <TextInput
              style={inputStyle(!!errors.name)}
              placeholder="João Silva"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.name && <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.name.message}</Text>}
          </View>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 6 }}>
              E-mail
            </Text>
            <TextInput
              style={inputStyle(!!errors.email)}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.email.message}</Text>}
          </View>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 6 }}>
              Senha
            </Text>
            <TextInput
              style={inputStyle(!!errors.password)}
              placeholder="••••••••"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.password && <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={register.isPending}
        style={{
          backgroundColor: register.isPending ? "#86EFAC" : "#16A34A",
          borderRadius: 10,
          paddingVertical: 14,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Inter-SemiBold" }}>
          {register.isPending ? "Criando..." : "Criar conta"}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 32 }}>
        <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280" }}>Já tem conta? </Text>
        <Link href="/(auth)/login">
          <Text style={{ fontFamily: "Inter-SemiBold", color: "#16A34A" }}>Entrar</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
