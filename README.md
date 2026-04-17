# NutriApp — React Native + Expo

Template base para o aplicativo de nutrição. Inclui autenticação, dietas, métricas, busca de nutricionistas por geolocalização e painel do nutricionista.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Expo SDK 52 + React Native 0.76 |
| Navegação | Expo Router v4 (file-based) |
| Estado servidor | TanStack Query v5 |
| Estado global | Zustand v5 |
| Formulários | React Hook Form + Zod |
| HTTP | Axios (com refresh automático) |
| Storage seguro | Expo SecureStore |
| Estilo | NativeWind v4 (Tailwind CSS) |
| Localização | Expo Location |

## Estrutura

```
app/
├── _layout.tsx              # Root layout (providers)
├── index.tsx                # Entry — redireciona por role
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
└── (app)/
    ├── (tabs)/              # Usuário comum
    │   ├── index.tsx        # Home
    │   ├── diet.tsx         # Dieta do dia
    │   ├── metrics.tsx      # Métricas corporais
    │   ├── nutritionists.tsx # Busca por geolocalização
    │   └── profile.tsx
    └── (nutritionist)/      # Painel do nutricionista
        ├── index.tsx        # Dashboard
        ├── patients.tsx
        ├── recipes.tsx
        ├── requests.tsx     # Solicitações de vínculo
        └── profile.tsx

src/
├── types/                   # Tipos TypeScript (espelham o ER)
├── lib/
│   ├── api.ts               # Axios + interceptors de auth
│   ├── storage.ts           # SecureStore abstraction
│   ├── query-client.ts      # TanStack Query config
│   └── validations.ts       # Schemas Zod
├── services/                # Chamadas de API por domínio
├── store/                   # Zustand stores
├── hooks/                   # React Query hooks por domínio
└── utils/                   # Helpers (BMI, macros, distância)
```

## Início rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite EXPO_PUBLIC_API_URL para apontar para sua API

# 3. Adicionar fontes Inter em assets/fonts/
#    Inter-Regular.ttf, Inter-Medium.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf
#    Download: https://fonts.google.com/specimen/Inter

# 4. Iniciar
npx expo start
```

## Fluxos implementados

### Autenticação
- Login e registro com validação Zod
- Seleção de role (usuário / nutricionista) no cadastro
- Refresh automático de token via interceptor do Axios
- Persistência segura com SecureStore
- Restauração de sessão no boot do app

### Usuário comum
- Home com progresso do dia e métricas recentes
- Busca de nutricionistas por geolocalização (raio configurável)
- Hooks prontos: `useActiveDietPlan`, `useLogMeal`, `useMetrics`, `useCreateMetric`

### Nutricionista
- Dashboard com contagem de pacientes e solicitações
- Lista de pacientes ativos
- Aceitar / recusar solicitações de vínculo
- Área de receitas (estrutura pronta)

## Próximos passos sugeridos

- [ ] Tela de dieta com log de refeições
- [ ] Tela de métricas com gráfico (Victory Native)
- [ ] Detalhe do nutricionista + envio de solicitação
- [ ] Notificações push (Expo Notifications)
- [ ] Onboarding de preferências alimentares
- [ ] Tela de assinatura / paywall
- [ ] Comentários do nutricionista inline
