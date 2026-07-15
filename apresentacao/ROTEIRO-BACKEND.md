# Roteiro — Apresentação do Backend (Eduardo)

> **Vídeo:** "Explicando / mostrando a minha parte no projeto — o backend do NutriHub."
> **Duração alvo:** 4 a 6 minutos.
> **O que deixar aberto antes de gravar:**
> 1. VS Code na pasta `src/` (arquivos: `lib/supabase.ts`, `services/auth.service.ts`, `services/diet.service.ts`, `lib/mappers.ts`).
> 2. O painel do **Supabase** (Table Editor no schema `nutrihub`, aba Authentication e aba Database → Functions).
> 3. O app rodando (`npx expo start --web`) com a conta demo, para mostrar um dado real chegando do backend.

---

## 0:00 – 0:30 · Abertura e minha responsabilidade

- "Olá, professor. Meu nome é Eduardo e, no projeto NutriHub, fui o responsável pelo **backend** — ou seja, por tudo o que sustenta o aplicativo por trás das telas: o banco de dados, a autenticação, a segurança dos dados e a API que o app consome."
- "O NutriHub tem uma arquitetura **cliente-servidor**: o app é o cliente, e o backend inteiro roda na plataforma **Supabase**, que me entrega três coisas integradas — um banco **PostgreSQL**, a **autenticação** e uma **API REST** gerada automaticamente."

## 0:30 – 1:30 · O banco de dados (schema `nutrihub`)

*(mostrar o Table Editor do Supabase)*
- "Modelei todo o banco dentro de um schema dedicado chamado `nutrihub`, separado do schema público, por organização e segurança."
- "Estas são as tabelas principais: `profiles` (o usuário), `nutritionist_profiles` (o perfil do profissional), `diet_plans`, `meals`, `meal_items` e `foods` (o plano alimentar e seus itens), `meal_logs` (o check-in de refeição), `metrics` (as métricas corporais) e `connection_requests` (o vínculo entre paciente e nutricionista)."
- "Cada tabela usa **UUID** como chave primária e tem chaves estrangeiras com exclusão em cascata, garantindo a integridade referencial — se um usuário é removido, seus registros vão junto, sem deixar dados órfãos."

## 1:30 – 2:45 · Autenticação e sessão (Supabase Auth + JWT)

*(abrir `src/lib/supabase.ts` e `src/services/auth.service.ts`)*
- "A autenticação usa o módulo **Supabase Auth**. No cadastro, chamo `signUp`; no login, `signInWithPassword`. As senhas **nunca** são guardadas na minha tabela de perfil — elas ficam com o hash `bcrypt` na tabela gerenciada `auth.users`. Isso separa o dado sensível de credencial do resto do sistema."
- "O login devolve dois tokens **JWT**: um de acesso, de curta duração, e um de renovação. Aqui em `supabase.ts` eu configurei `autoRefreshToken` e `persistSession` — o token é renovado sozinho e guardado de forma segura no dispositivo, então o usuário não precisa logar de novo a cada uso."
- *(mostrar a aba Authentication do Supabase com os usuários)* "No painel dá para ver os usuários autenticados — e nenhuma senha aparece, só o registro seguro."

## 2:45 – 4:00 · Segurança dos dados: RLS e a API

*(mostrar Database → Policies no Supabase, ou explicar sobre o Table Editor)*
- "O ponto mais importante do backend é o **Row Level Security**, o RLS. Em vez de confiar que o app vai filtrar os dados certos, a regra fica no **próprio banco**: cada linha só é visível para o dono dela. A política compara o `auth.uid()` do token com o `user_id` da linha."
- "Com isso, um paciente só enxerga os próprios registros, e o nutricionista só acessa os dados de um paciente **depois** que o vínculo é aceito. Mesmo que alguém tente burlar o app, o banco recusa."
- *(abrir `src/services/diet.service.ts`)* "A API é gerada automaticamente pelo Supabase (PostgREST). Repare que eu consigo trazer o plano com refeições, itens e alimentos aninhados numa única consulta — `diet_plans → meals → meal_items → foods` — o que reduz o número de chamadas de rede."
- "E as consultas são sempre **parametrizadas**: o valor digitado pelo usuário vai como parâmetro, nunca concatenado no SQL — o que elimina o risco de **SQL Injection**."

## 4:00 – 5:00 · Lógica no servidor (RPC) e camada de dados

*(mostrar Database → Functions no Supabase e `src/lib/mappers.ts`)*
- "As regras de negócio mais sensíveis eu implementei como **funções no PostgreSQL**, chamadas por RPC — para a lógica não depender do cliente. Por exemplo: `redeem_code` e `lookup_invite`, que validam e resgatam o código de convite do nutricionista; `generate_diet_plan`, que monta um plano a partir de um objetivo; e `get_my_patients`, que lista os pacientes vinculados respeitando o vínculo aceito."
- "No lado do app, organizei o acesso em **serviços por domínio** (`auth`, `diet`, `metrics`, `nutritionist`) e criei os **mappers**, que traduzem o formato do banco (`snake_case`) para os tipos do aplicativo (`camelCase`). Isso mantém o código limpo e desacoplado do banco."

## 5:00 – 5:45 · Demonstração rápida (dado real)

*(voltar ao app rodando)*
- "Para fechar, um exemplo prático: quando eu marco uma refeição aqui no app…" *(clicar em "Marcar")* "…o app chama o serviço, que insere na tabela `meal_logs`. O RLS confirma que sou o dono, a linha é gravada e o progresso do dia atualiza na hora."
- *(voltar ao Supabase Table Editor em `meal_logs`)* "E aqui está o registro que acabou de chegar no banco — com o meu `user_id`, a data e o horário. É o backend funcionando de ponta a ponta."

## 5:45 – 6:00 · Fechamento

- "Resumindo, a minha parte foi montar e proteger a espinha dorsal do NutriHub: o banco no schema `nutrihub`, a autenticação com JWT, o isolamento de dados por RLS, as funções de negócio no servidor e a camada de serviços que o app consome. Obrigado!"

---

### Checklist do que aparece na tela (para não esquecer)
- [ ] Table Editor do Supabase (schema `nutrihub`) — tabelas e relacionamentos
- [ ] Aba Authentication — usuários sem senha exposta
- [ ] Policies / RLS — política `auth.uid() = user_id`
- [ ] `src/lib/supabase.ts` — `autoRefreshToken`, `persistSession`, `db: { schema: "nutrihub" }`
- [ ] `src/services/diet.service.ts` — consulta aninhada e `ilike` parametrizado
- [ ] Database → Functions — `redeem_code`, `generate_diet_plan`, `get_my_patients`
- [ ] `src/lib/mappers.ts` — tradução snake_case → camelCase
- [ ] App: "Marcar" refeição → registro aparecendo na tabela `meal_logs`
