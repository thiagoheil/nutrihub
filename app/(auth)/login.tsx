import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const login = useLogin();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    login.mutate(data, {
      onError: () => Alert.alert("Erro", "E-mail ou senha incorretos."),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 28, fontFamily: "Inter-Bold", color: "#16A34A", marginBottom: 8 }}>
          NutriApp
        </Text>
        <Text style={{ fontSize: 16, fontFamily: "Inter-Regular", color: "#6B7280", marginBottom: 32 }}>
          Entre na sua conta
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 6 }}>
                E-mail
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.email ? "#EF4444" : "#D1D5DB",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  fontFamily: "Inter-Regular",
                }}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.email && (
                <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>
                  {errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontFamily: "Inter-Medium", color: "#374151", marginBottom: 6 }}>
                Senha
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: errors.password ? "#EF4444" : "#D1D5DB",
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  fontFamily: "Inter-Regular",
                }}
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && (
                <Text style={{ fontSize: 12, color: "#EF4444", marginTop: 4 }}>
                  {errors.password.message}
                </Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={login.isPending}
          style={{
            backgroundColor: login.isPending ? "#86EFAC" : "#16A34A",
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Inter-SemiBold" }}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontFamily: "Inter-Regular", color: "#6B7280" }}>Não tem conta? </Text>
          <Link href="/(auth)/register">
            <Text style={{ fontFamily: "Inter-SemiBold", color: "#16A34A" }}>Cadastre-se</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
