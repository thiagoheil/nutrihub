# NutriHub — Novas seções para o documento (modeladas em MindU e Retalix)

> **Como usar este arquivo.** Cada bloco abaixo é uma seção pronta para colar no
> `Nutrihub.docx`, com o nível de título (`#`, `##`, `###`) e a numeração já
> encaixados na estrutura atual do documento. Uma linha **`> INSERIR ...`** indica
> onde cada seção deve entrar. A numeração de figuras/quadros/tabelas continua a
> sequência existente (o documento vai até **Figura 8** e **Tabela 15**).
>
> As seções foram construídas a partir dos capítulos que os trabalhos **MindU**
> (Arquitetura de Segurança, Modelo Físico do Banco, Ferramentas e Tecnologias,
> Testes) e **Retalix** (Arquitetura, Segurança com proteção a SQL Injection,
> Modelo Físico, Testes manuais e de integração) possuem e que o NutriHub ainda
> não tinha. Todo o conteúdo técnico reflete o backend real do projeto (Supabase +
> PostgreSQL + RLS + PostgREST, schema `nutrihub`).

---

## Seção A

> INSERIR logo após **3.2.3.2 Dicionário de Dados** (antes de 3.2.4 Diagrama de Casos de Uso).

### 3.2.3.3 Modelo Físico do Banco de Dados

O Modelo Físico representa a materialização do banco de dados em scripts de
Linguagem de Definição de Dados (DDL), otimizados para a sintaxe do PostgreSQL
gerenciado pela plataforma Supabase. Enquanto o Diagrama ER (seção 3.2.3.1) e o
Dicionário de Dados (seção 3.2.3.2) apresentam a estrutura em nível lógico e em
português, para fins de leitura, o Modelo Físico adota os identificadores em
inglês efetivamente utilizados no código-fonte e organiza todas as tabelas dentro
de um schema dedicado, o schema `nutrihub`, isolado do schema público padrão.

A especificação física adota tipagens modernas de alta performance para atender
aos requisitos não funcionais de segurança e escalabilidade:

- **Identificadores únicos:** utilização do tipo `UUID` como chave primária de
  todas as tabelas, gerado pela função `gen_random_uuid()`, mitigando a
  previsibilidade de identificadores sequenciais e a colisão de dados.
- **Precisão temporal:** emprego do tipo `TIMESTAMPTZ` (timestamp com fuso
  horário) nos campos de auditoria, garantindo o sequenciamento cronológico
  correto dos registros de refeição e das métricas.
- **Separação de credenciais:** as senhas dos usuários **não** são armazenadas na
  tabela de perfil. A autenticação é delegada ao módulo *Auth* do Supabase, que
  mantém o hash da senha (algoritmo *bcrypt*) na tabela gerenciada `auth.users`.
  A tabela `profiles` referencia esse identificador e guarda apenas os dados
  públicos do usuário — uma prática de segurança que separa a identidade do
  material sensível de autenticação.

A correspondência entre as tabelas físicas e o Dicionário de Dados é direta:
`profiles` (Tabela Usuário), `nutritionist_profiles` (Tabela Perfil
Nutricionista), `connection_requests` (Tabela Vínculo), `diet_plans` (Tabela
Plano Alimentar), `meals` (Tabela Refeição), `meal_items` (Tabela Item de
Refeição), `foods` (Tabela Alimento), `meal_logs` (Tabela Registro de Refeição) e
`metrics` (Tabela Métrica Corporal).

O script de criação das principais tabelas no ambiente de produção é apresentado
no Quadro 1.

**Quadro 1 – Script de criação das tabelas (DDL)**

```sql
-- Schema dedicado da aplicação
CREATE SCHEMA IF NOT EXISTS nutrihub;

-- Perfil público do usuário (credenciais ficam em auth.users, gerenciado pelo Supabase)
CREATE TABLE nutrihub.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        varchar(100) NOT NULL,
  email       varchar(100) NOT NULL UNIQUE,
  role        varchar(15)  NOT NULL CHECK (role IN ('patient','nutritionist')),
  phone       varchar(15),
  avatar_url  varchar(255),
  latitude    numeric(9,6),
  longitude   numeric(9,6),
  created_at  timestamptz  NOT NULL DEFAULT now()
);

-- Perfil profissional do nutricionista
CREATE TABLE nutrihub.nutritionist_profiles (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES nutrihub.profiles(id) ON DELETE CASCADE,
  crn_number         varchar(15) NOT NULL UNIQUE,
  bio                text,
  specialties        text[]      NOT NULL DEFAULT '{}',
  is_verified        boolean     NOT NULL DEFAULT false,
  service_radius_km  integer     NOT NULL DEFAULT 10,
  rating_avg         numeric(3,2) NOT NULL DEFAULT 0,
  rating_count       integer      NOT NULL DEFAULT 0,
  invite_code        varchar(20) UNIQUE
);

-- Vínculo paciente–nutricionista (solicitação de conexão)
CREATE TABLE nutrihub.connection_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES nutrihub.profiles(id) ON DELETE CASCADE,
  nutritionist_id  uuid NOT NULL REFERENCES nutrihub.nutritionist_profiles(id) ON DELETE CASCADE,
  status           varchar(10) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','accepted','rejected','cancelled')),
  message          varchar(255),
  connected_via    varchar(10),
  service_type     varchar(10),
  price_rcents     integer,
  requested_at     timestamptz NOT NULL DEFAULT now(),
  responded_at     timestamptz
);

-- Plano alimentar
CREATE TABLE nutrihub.diet_plans (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES nutrihub.profiles(id) ON DELETE CASCADE,
  nutritionist_id  uuid REFERENCES nutrihub.nutritionist_profiles(id) ON DELETE SET NULL,
  source           varchar(15) NOT NULL DEFAULT 'manual',
  title            varchar(100) NOT NULL,
  goal             varchar(20),
  start_date       date,
  end_date         date,
  status           varchar(10) NOT NULL DEFAULT 'active'
                   CHECK (status IN ('draft','active','completed')),
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Registro de refeição (check-in alimentar)
CREATE TABLE nutrihub.meal_logs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES nutrihub.profiles(id) ON DELETE CASCADE,
  meal_id        uuid NOT NULL REFERENCES nutrihub.meals(id) ON DELETE CASCADE,
  status         varchar(10) NOT NULL CHECK (status IN ('eaten','partial','skipped')),
  adherence_pct  integer NOT NULL DEFAULT 0,
  notes          varchar(255),
  photo_uri      varchar(255),
  logged_at      timestamptz NOT NULL DEFAULT now(),
  log_date       date NOT NULL DEFAULT current_date
);
```
Fonte: Elaborado pelos autores (2026).

Além da estrutura das tabelas, o Modelo Físico contempla as políticas de
segurança em nível de linha (*Row Level Security* – RLS). Essas políticas
garantem, no próprio banco de dados, que cada usuário só acesse os seus próprios
registros, independentemente da requisição enviada pelo aplicativo. O Quadro 2
apresenta um exemplo aplicado à tabela de registros de refeição.

**Quadro 2 – Exemplo de política de segurança em nível de linha (RLS)**

```sql
-- Habilita o RLS na tabela
ALTER TABLE nutrihub.meal_logs ENABLE ROW LEVEL SECURITY;

-- O paciente só enxerga e altera os próprios registros
CREATE POLICY "meal_logs_owner" ON nutrihub.meal_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- O nutricionista vinculado (vínculo aceito) pode consultar os registros do paciente
CREATE POLICY "meal_logs_linked_nutritionist" ON nutrihub.meal_logs
  FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM nutrihub.connection_requests c
    JOIN nutrihub.nutritionist_profiles np ON np.id = c.nutritionist_id
    WHERE c.user_id = nutrihub.meal_logs.user_id
      AND np.user_id = auth.uid()
      AND c.status  = 'accepted'
  ));
```
Fonte: Elaborado pelos autores (2026).

---

## Seção B

> INSERIR após **3.2.6 Definições técnicas** (após 3.2.6.3.3 Reusabilidade), como nova seção 3.2.7.

## 3.2.7 Arquitetura da Solução

Esta seção detalha a organização arquitetural do NutriHub sob três perspectivas:
a visão geral dos componentes, a arquitetura lógica em camadas e o backend com os
serviços de API que sustentam a aplicação.

### 3.2.7.1 Visão geral

O NutriHub adota uma arquitetura **cliente-servidor**. O aplicativo (cliente),
construído com React Native e Expo, executa em Android, iOS e Web a partir de uma
única base de código e consome uma API segura fornecida pela plataforma
**Supabase**, responsável pela persistência e pelo controle de acesso aos dados.
Não há um servidor intermediário próprio: o cliente conversa diretamente com os
serviços gerenciados do Supabase (banco de dados, autenticação e API REST) sobre
o protocolo HTTPS, e todas as regras de isolamento de dados são aplicadas no
próprio banco por meio de *Row Level Security*. A Figura 9 ilustra o fluxo entre
os componentes.

**Figura 9 – Arquitetura em camadas do NutriHub**
*(inserir diagrama: Cliente Expo → HTTPS → API Supabase (Auth + PostgREST) → PostgreSQL com RLS)*
Fonte: Elaborado pelos autores (2026).

### 3.2.7.2 Camadas da solução

A aplicação está organizada em três grandes camadas, com responsabilidades bem
delimitadas:

- **Camada de Apresentação:** interfaces construídas com React Native, Expo Router
  (navegação baseada em arquivos) e NativeWind (estilização). É responsável pela
  experiência do usuário e não acessa o banco diretamente — toda leitura e escrita
  passa pela camada de serviços.
- **Camada de Serviços / Acesso a Dados:** implementada em TypeScript, encapsula a
  comunicação com o Supabase em serviços por domínio (`auth.service`,
  `diet.service`, `metrics.service`, `nutritionist.service`,
  `subscription.service`). Nessa camada residem as chamadas à API, a validação
  com Zod, o cache de dados com TanStack Query e os *mappers*, que traduzem os
  dados do banco (formato *snake_case*) para os tipos da aplicação (*camelCase*).
- **Camada de Persistência:** o banco de dados PostgreSQL gerenciado pelo
  Supabase, responsável por armazenar de forma consistente os usuários, perfis,
  planos alimentares, refeições, registros, métricas e vínculos, além de abrigar
  as regras de segurança (RLS) e a lógica de negócio encapsulada em funções.

### 3.2.7.3 Backend e serviços de API

O backend do NutriHub é integralmente provido pela plataforma Supabase, que
disponibiliza quatro serviços consumidos pela aplicação:

- **Banco de dados PostgreSQL:** repositório central dos dados, com integridade
  referencial garantida por chaves estrangeiras e regras de exclusão em cascata.
- **Autenticação (Supabase Auth):** gerencia o cadastro, o login por e-mail e
  senha e a emissão de tokens JWT (acesso e renovação), detalhados na seção de
  Arquitetura de Segurança.
- **API REST automática (PostgREST):** expõe cada tabela como um recurso REST
  seguro. O acesso é sempre parametrizado e submetido às políticas de RLS. Um
  recurso importante dessa API é o *embedding* de recursos relacionados em uma
  única requisição — por exemplo, a consulta ao plano ativo já retorna as
  refeições, os itens e os alimentos aninhados
  (`diet_plans → meals → meal_items → foods`), reduzindo o número de chamadas de
  rede.
- **Funções de banco (RPC):** regras de negócio sensíveis são implementadas como
  funções PostgreSQL executadas no servidor e invocadas via RPC, garantindo que a
  lógica não dependa do cliente. Destacam-se `generate_diet_plan` (geração
  automática de um plano a partir de um objetivo), `redeem_code` e `lookup_invite`
  (validação e resgate de códigos de convite de nutricionistas) e `get_my_patients`
  (listagem dos pacientes vinculados a um profissional, respeitando o vínculo
  aceito).

Esse desenho concentra a segurança e a integridade dos dados no banco, permitindo
que a equipe evolua rapidamente as funcionalidades sem reescrever regras de
proteção a cada nova tela.

---

## Seção C

> INSERIR após a seção 3.2.7 (Arquitetura da Solução), como nova seção 3.2.8.

## 3.2.8 Arquitetura de Segurança

O NutriHub trata dados pessoais e de saúde — registros alimentares, métricas
corporais e vínculos com profissionais —, o que impõe requisitos de segurança que
atravessam todas as camadas da solução. Esta seção descreve os mecanismos de
segurança implementados, ilustra a proteção contra injeção de SQL e apresenta os
testes de segurança realizados.

### 3.2.8.1 Mecanismos de segurança implementados

- **Comunicação criptografada (HTTPS/TLS):** toda a comunicação entre o aplicativo
  e o Supabase trafega sobre TLS, protegendo os dados em trânsito (associado ao
  NF 1.5 e NF 1.7).
- **Armazenamento de senhas (bcrypt):** as senhas nunca são gravadas em texto
  puro. O módulo Supabase Auth armazena apenas o *hash* da senha, gerado com o
  algoritmo *bcrypt*, na tabela gerenciada `auth.users` (associado ao NF 1.1).
- **Isolamento de dados (Row Level Security):** políticas de RLS aplicadas no
  PostgreSQL garantem que cada usuário acesse exclusivamente os próprios registros
  e que o nutricionista visualize apenas os dados dos pacientes com vínculo aceito.
  A proteção reside no banco de dados, prevenindo acessos indevidos mesmo em caso
  de falha na camada de aplicação (associado ao NF 1.2 e NF 5.5).
- **Sessão e tokens (JWT + armazenamento seguro):** a autenticação produz um token
  de acesso (JWT) de curta duração e um token de renovação. Os tokens são
  guardados em área segura do dispositivo (Expo SecureStore no dispositivo físico;
  armazenamento cifrado via MMKV para a sessão do Supabase) e renovados
  automaticamente, sem exigir novo login a cada uso (associado ao NF 1.3 e NF 1.7).
- **Proteção contra injeção de SQL:** o acesso ao banco é sempre mediado pelo
  cliente Supabase e pela API PostgREST, que enviam consultas parametrizadas —
  os valores informados pelo usuário trafegam como parâmetros e nunca são
  concatenados ao texto SQL (seção 3.2.8.2).
- **Chave pública por design (anon key):** a chave utilizada pelo aplicativo é a
  *anon key*, uma credencial pública cuja segurança é delegada integralmente às
  políticas de RLS — modelo documentado e recomendado pela própria plataforma para
  clientes móveis.
- **Validação de entrada (Zod):** todos os formulários (cadastro, login, métricas,
  planos) são validados com esquemas Zod antes do envio, com mensagens de erro
  claras, reduzindo dados malformados e entradas inesperadas (associado ao NF 1.4).

### 3.2.8.2 Proteção contra SQL Injection

A injeção de SQL consiste na inserção de comandos maliciosos em campos de entrada
com o objetivo de manipular ou expor dados do banco. No NutriHub, o vetor clássico
é neutralizado **por construção**: o projeto não monta consultas concatenando
texto. Toda operação é expressa por meio do cliente Supabase, que traduz a chamada
em uma requisição parametrizada à API PostgREST. O Quadro 3 exemplifica a busca de
alimentos por nome — mesmo em uma busca por texto livre (`ilike`), o termo
informado pelo usuário é tratado como dado, e não como instrução SQL.

**Quadro 3 – Exemplo de consulta parametrizada (busca de alimentos)**

```typescript
// O termo `query` é enviado como parâmetro — não há concatenação de SQL.
const { data, error } = await supabase
  .from("foods")
  .select("*")
  .ilike("name", `%${query}%`)
  .limit(30);
```
Fonte: Elaborado pelos autores (2026).

Complementarmente, as regras de negócio mais sensíveis (resgate de código de
convite, geração de plano, listagem de pacientes) são implementadas como funções
do PostgreSQL invocadas via RPC, o que impede que a lógica seja contornada pelo
cliente e reforça o controle de acesso no servidor.

### 3.2.8.3 Testes de segurança realizados

A Tabela 16 consolida os cenários de segurança verificados sobre o NutriHub e o
resultado observado.

**Tabela 16 – Testes de segurança realizados**

| Teste | Cenário verificado | Resultado |
|---|---|---|
| SQL Injection | Envio de `' OR '1'='1` no campo de busca e no login | Bloqueado — consultas parametrizadas via Supabase/PostgREST |
| Isolamento de dados (RLS) | Tentativa de leitura dos registros de outro usuário | Negado — política de RLS ativa (`auth.uid() = user_id`) |
| Acesso sem autenticação | Requisição a recurso protegido sem sessão válida | Negado — token JWT ausente/expirado |
| Acesso cruzado nutricionista–paciente | Nutricionista sem vínculo tentando acessar dados do paciente | Negado — só com vínculo `accepted` |
| Senha em texto puro | Inspeção da persistência das credenciais | Protegido — apenas hash *bcrypt* em `auth.users` |
| Comunicação em trânsito | Verificação do tráfego cliente–servidor | Confirmado — HTTPS/TLS em todas as requisições |

Fonte: Elaborado pelos autores (2026).

---

## Seção D

> INSERIR após a seção 3.2.8 (Arquitetura de Segurança), como nova seção 3.2.9.

## 3.2.9 Ferramentas e Tecnologias

Esta seção consolida, por finalidade, o conjunto de ferramentas e tecnologias
empregadas no desenvolvimento do NutriHub.

**Tabela 17 – Ferramentas de desenvolvimento e aplicação**

| Ferramenta | Finalidade |
|---|---|
| Expo (SDK 52) + React Native 0.76 | Construção da aplicação multiplataforma (Android, iOS e Web) a partir de uma única base de código |
| Expo Router v4 | Navegação baseada em arquivos (file-based routing) |
| TypeScript | Tipagem estática, reduzindo erros em tempo de desenvolvimento |
| NativeWind v4 (Tailwind CSS) | Estilização utilitária das interfaces |
| TanStack Query v5 | Sincronização e cache dos dados do servidor |
| Zustand v5 | Gerenciamento de estado global do aplicativo |
| React Hook Form + Zod | Formulários e validação de dados |
| Expo Location | Geolocalização para a busca de nutricionistas próximos |
| Victory Native | Gráficos de evolução das métricas corporais |

Fonte: Elaborado pelos autores (2026).

**Tabela 18 – Ferramentas de backend e banco de dados**

| Ferramenta | Finalidade |
|---|---|
| Supabase | Plataforma de backend (banco, autenticação e API gerenciados) |
| PostgreSQL | Sistema gerenciador de banco de dados relacional |
| PostgREST | API REST gerada automaticamente a partir do schema do banco |
| Supabase Auth | Autenticação por e-mail/senha e emissão de tokens JWT |
| Row Level Security (RLS) | Isolamento de dados por usuário no nível do banco |
| Funções PostgreSQL (RPC) | Regras de negócio executadas no servidor |
| Expo SecureStore | Armazenamento seguro de tokens no dispositivo |

Fonte: Elaborado pelos autores (2026).

**Tabela 19 – Ferramentas de versionamento e gestão do projeto**

| Ferramenta | Finalidade |
|---|---|
| Git / GitHub | Versionamento do código-fonte e hospedagem do repositório |
| Visual Studio Code | Ambiente de desenvolvimento (editor principal) |
| Metodologia SCRUM | Gestão ágil do projeto, com entregas incrementais |

Fonte: Elaborado pelos autores (2026).

---

## Seção E

> INSERIR dentro de **3.3 Estratégia de Teste**, como subseção final (após 3.3.4 Critérios de Aceitação), numerada como 3.3.5. Complementa a estratégia com os resultados efetivamente obtidos, no formato de tabela adotado nos trabalhos de referência.

### 3.3.5 Testes Realizados

Além da estratégia planejada, foram executados testes manuais de funcionalidade e
de integração sobre os fluxos principais do NutriHub, validados em ambiente de
demonstração com contas de teste. As Tabelas 20 e 21 apresentam os cenários e os
resultados obtidos.

**Tabela 20 – Testes manuais de funcionalidade**

| ID | Funcionalidade | Requisito | Resultado |
|---|---|---|---|
| TM01 | Cadastro e login com criação de sessão segura | F1 | Aprovado |
| TM02 | Login com credenciais inválidas exibe mensagem de erro | F1 | Aprovado |
| TM03 | Registro de refeição (check-in) em dois toques | F2 | Aprovado |
| TM04 | Atualização imediata do progresso do dia após o check-in | F2 | Aprovado |
| TM05 | Diário alimentar com calorias e macronutrientes por dia | F3 | Aprovado |
| TM06 | Meta de hidratação recalculada ao atualizar o peso | F3 | Aprovado |
| TM07 | Registro de métricas com cálculo automático de IMC | F4 | Aprovado |
| TM08 | Busca de nutricionistas por geolocalização | F5 | Aprovado |
| TM09 | Vínculo por código de convite com aceite do profissional | F5 | Aprovado |
| TM10 | Painel do nutricionista com pacientes e solicitações | F6 | Aprovado |

Fonte: Elaborado pelos autores (2026).

**Tabela 21 – Testes de integração**

| ID | Cenário | Componentes envolvidos | Resultado |
|---|---|---|---|
| TI01 | Check-in do paciente é persistido e refletido no diário | App → API Supabase → PostgreSQL | Aprovado |
| TI02 | Registro do paciente fica visível ao nutricionista vinculado | App → RLS → Painel do nutricionista | Aprovado |
| TI03 | Nutricionista publica plano e o paciente passa a visualizá-lo | Painel → PostgreSQL → App do paciente | Aprovado |
| TI04 | Código de convite gerado é validado e resgatado (RPC) | App → RPC `redeem_code` → PostgreSQL | Aprovado |
| TI05 | Dados de um usuário não são acessíveis por outro usuário | RLS no PostgreSQL | Aprovado |

Fonte: Elaborado pelos autores (2026).

---

## Seção F

> INSERIR após **3.5 CONSIDERAÇÕES FINAIS**, como nova seção (sugestão: 3.6 TRABALHOS FUTUROS), no mesmo padrão que MindU e Retalix adotam para trabalhos futuros.

## 3.6 TRABALHOS FUTUROS

Embora o NutriHub atenda aos objetivos definidos para esta versão, foram
identificadas oportunidades de evolução que ampliam o valor entregue a pacientes e
nutricionistas:

- **Notificações push (Expo Notifications):** lembretes de refeições, de
  hidratação e de novas mensagens do nutricionista, aumentando a adesão.
- **Comentários do nutricionista no diário:** feedback do profissional diretamente
  sobre cada registro do paciente (a estrutura de dados já contempla a entidade de
  comentários).
- **Assinaturas dentro do aplicativo:** cobrança recorrente dos planos de serviço
  do nutricionista, com integração a um provedor de pagamentos.
- **Registro de refeições por foto:** anexo de imagens ao check-in, dando ao
  nutricionista uma visão mais realista da alimentação.
- **Evolução dos recursos de segurança:** auditoria e registro das ações
  (logs), além da revisão contínua das políticas de RLS conforme novas
  funcionalidades forem adicionadas.
