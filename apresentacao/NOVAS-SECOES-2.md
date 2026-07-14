# NutriHub — Novas seções (lote 2)

> Conteúdo para injeção no Nutrihub.docx. Modelado em MindU e Retalix.
> Seções: Fundamentação (FT), Casos de Uso Estendidos (UC), Modelo de Receita (MR),
> Apresentação do Produto (AP) e Manual do Usuário (MU).

---

## Seção FT

## 3.1.1 Saúde digital e aplicativos móveis (mHealth)

O conceito de saúde móvel, ou *mHealth*, refere-se ao uso de dispositivos móveis
e de suas tecnologias associadas para apoiar a prática e a promoção da saúde.
Segundo a Organização Mundial da Saúde (WHO, 2011), a disseminação dos
smartphones criou uma oportunidade sem precedentes para aproximar o cuidado em
saúde da rotina das pessoas, permitindo o monitoramento contínuo, o registro de
hábitos e a comunicação direta entre pacientes e profissionais. O NutriHub se
insere nesse contexto ao transformar o acompanhamento nutricional — historicamente
restrito às consultas presenciais — em um processo contínuo e assistido por software.

Diferentemente de um simples registro de calorias, uma solução de mHealth voltada
à nutrição precisa integrar três dimensões: o autorregistro do paciente, a análise
de indicadores ao longo do tempo e a intervenção do profissional. É essa integração
que orienta a arquitetura de dados e as funcionalidades descritas nas seções seguintes.

## 3.1.2 Automonitoramento e adesão ao acompanhamento nutricional

A eficácia de qualquer intervenção nutricional depende diretamente da adesão do
paciente ao registro dos seus hábitos. A revisão sistemática de Burke, Wang e
Sevick (2011) demonstrou que o automonitoramento — o ato de registrar de forma
consistente a alimentação, a hidratação e as medidas corporais — é um dos preditores
mais fortes de sucesso em programas de mudança de comportamento alimentar. Contudo,
o mesmo estudo aponta que a principal barreira é o esforço exigido pelo registro manual.

A partir dessa constatação, o NutriHub prioriza a redução do atrito no registro:
o check-in de refeições é feito com um toque a partir do plano já montado, o
consumo de água é incrementado por botões rápidos e as métricas corporais alimentam
gráficos de evolução automaticamente. O objetivo de projeto é maximizar a adesão,
tornando o registro tão simples quanto possível sem sacrificar a qualidade do dado.

## 3.1.3 Proteção de dados pessoais e sensíveis em saúde

Aplicações de saúde manipulam dados que a legislação brasileira classifica como
sensíveis. A Lei Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018 (BRASIL,
2018) — estabelece que dados referentes à saúde exigem tratamento com salvaguardas
específicas, incluindo a limitação de acesso, a finalidade explícita e a segurança
técnica adequada. Esse requisito legal não é um detalhe acessório: ele condiciona
decisões centrais de arquitetura.

Por essa razão, o isolamento de dados por *Row Level Security*, o armazenamento de
senhas apenas como *hash* e a comunicação criptografada — detalhados na seção
3.2.8 (Arquitetura de Segurança) — respondem diretamente às exigências da LGPD.
A conformidade legal, portanto, foi tratada como um requisito não funcional de
primeira ordem, e não como uma preocupação posterior.

---

## Seção UC

## 3.2.4.1 Especificação Estendida dos Casos de Uso

Enquanto o diagrama de casos de uso apresenta uma visão geral das interações entre
os atores e o sistema, a especificação estendida detalha, para cada caso de uso
relevante, os atores envolvidos, as pré-condições, os fluxos principal e de exceção
e as pós-condições. A seguir, são detalhados os doze casos de uso mais representativos
do NutriHub, cobrindo tanto o perfil do paciente quanto o do nutricionista.

### 3.2.4.2 Caso de Uso 01 – Realizar Cadastro

**Descrição:** permite que um novo usuário crie uma conta no NutriHub, escolhendo o perfil de paciente ou de nutricionista.
**Ator principal:** Visitante (futuro Paciente ou Nutricionista).
**Requisitos relacionados:** RF – Cadastro e Autenticação de Usuários (Tabela 1); NF – Segurança (senha em hash).
**Pré-condições:**
- O aplicativo está instalado e com acesso à internet.
- O e-mail informado ainda não possui conta associada.

**Acionador:** o visitante toca em "Criar conta" na tela de acesso.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O visitante informa nome, e-mail, senha e seleciona o tipo de perfil. |
| 2 | O sistema valida os campos com as regras do formulário (Zod). |
| 3 | O sistema solicita o cadastro ao Supabase Auth (signUp), gerando o hash da senha. |
| 4 | O sistema cria o registro correspondente na tabela `profiles`. |
| 5 | O sistema inicia a sessão e redireciona o usuário para a tela inicial do seu perfil. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | E-mail já cadastrado: o sistema informa o conflito e mantém o usuário na tela. |
| E2 | Senha fora dos critérios mínimos: o sistema exibe a validação e não prossegue. |
| E3 | Sem conexão: o sistema informa a falha e permite nova tentativa. |

**Pós-condições:** conta criada em `auth.users`, perfil criado em `profiles` e usuário autenticado.

### 3.2.4.3 Caso de Uso 02 – Realizar Login

**Descrição:** autentica um usuário já cadastrado e restaura a sua sessão.
**Ator principal:** Paciente ou Nutricionista.
**Requisitos relacionados:** RF – Cadastro e Autenticação de Usuários (Tabela 1).
**Pré-condições:**
- O usuário possui uma conta ativa no sistema.

**Acionador:** o usuário informa suas credenciais e toca em "Entrar".

| Passo | Fluxo principal |
| --- | --- |
| 1 | O usuário informa e-mail e senha. |
| 2 | O sistema envia as credenciais ao Supabase Auth (signInWithPassword). |
| 3 | O backend valida o hash e emite os tokens JWT de acesso e de renovação. |
| 4 | O sistema armazena a sessão de forma segura no dispositivo. |
| 5 | O sistema carrega o perfil e direciona o usuário à sua tela inicial. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Credenciais inválidas: o sistema informa o erro sem revelar qual campo falhou. |
| E2 | Sem conexão: o sistema mantém a tela e permite nova tentativa. |

**Pós-condições:** sessão ativa, com renovação automática do token enquanto o usuário utiliza o app.

### 3.2.4.4 Caso de Uso 03 – Registrar Refeição (Check-in)

**Descrição:** registra que uma refeição prevista no plano foi consumida, alimentando o diário e o progresso do dia.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Plano Alimentar e Registro de Refeições (Tabela 2); RF – Diário Alimentar (Tabela 3).
**Pré-condições:**
- O paciente está autenticado.
- Existe um plano alimentar ativo com refeições definidas.

**Acionador:** o paciente toca em "Marcar" na refeição desejada.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O paciente seleciona a refeição no plano do dia. |
| 2 | O sistema registra o consumo na tabela `meal_logs` com data e horário. |
| 3 | A política de RLS confirma que o registro pertence ao próprio usuário. |
| 4 | O sistema atualiza o progresso diário e o diário alimentar. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Refeição já registrada no período: o sistema evita a duplicidade. |
| E2 | Falha de gravação: o sistema mantém o estado anterior e sinaliza o erro. |

**Pós-condições:** novo registro em `meal_logs` associado ao paciente e progresso do dia atualizado.

### 3.2.4.5 Caso de Uso 04 – Registrar Consumo de Água

**Descrição:** permite ao paciente incrementar o consumo diário de água e acompanhar a meta de hidratação.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Diário Alimentar e Controle de Hidratação (Tabela 3).
**Pré-condições:**
- O paciente está autenticado.

**Acionador:** o paciente toca em um dos botões de quantidade de água.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O paciente seleciona a quantidade consumida (ex.: 200 ml, 500 ml). |
| 2 | O sistema soma o valor ao total do dia e persiste o registro. |
| 3 | O sistema atualiza o indicador de progresso em relação à meta diária. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Falha de gravação: o total não é alterado e o erro é sinalizado. |

**Pós-condições:** consumo de água do dia atualizado para o paciente.

### 3.2.4.6 Caso de Uso 05 – Gerar Plano Alimentar

**Descrição:** gera um plano alimentar para o paciente a partir de um objetivo, quando ele ainda não possui acompanhamento de um nutricionista.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Plano Alimentar e Registro de Refeições (Tabela 2).
**Pré-condições:**
- O paciente está autenticado.
- O paciente informou dados básicos (objetivo e preferências).

**Acionador:** o paciente solicita a geração de um plano.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O paciente seleciona o objetivo (ex.: emagrecimento, manutenção, ganho). |
| 2 | O sistema chama a função de servidor `generate_diet_plan` (RPC). |
| 3 | O backend monta as refeições e itens e persiste o plano como ativo. |
| 4 | O sistema exibe o plano gerado na tela de dieta. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Dados insuficientes: o sistema solicita as informações que faltam. |
| E2 | Falha na geração: o sistema mantém o plano anterior, se houver. |

**Pós-condições:** plano alimentar ativo associado ao paciente.

### 3.2.4.7 Caso de Uso 06 – Registrar Métrica Corporal

**Descrição:** registra medidas corporais do paciente (como peso e altura) para acompanhamento da evolução.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Registro e Acompanhamento de Métricas Corporais (Tabela 4).
**Pré-condições:**
- O paciente está autenticado.

**Acionador:** o paciente toca em "Adicionar métrica".

| Passo | Fluxo principal |
| --- | --- |
| 1 | O paciente informa a medida e a data de referência. |
| 2 | O sistema valida os valores e grava o registro na tabela `metrics`. |
| 3 | O sistema recalcula indicadores derivados (ex.: IMC) e atualiza os gráficos. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Valor inválido: o sistema exibe a validação e não grava. |

**Pós-condições:** nova métrica registrada e gráfico de evolução atualizado.

### 3.2.4.8 Caso de Uso 07 – Buscar Nutricionista por Geolocalização

**Descrição:** lista nutricionistas disponíveis, ordenados pela proximidade em relação ao paciente.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Busca e Vínculo com Nutricionistas (Tabela 5).
**Pré-condições:**
- O paciente está autenticado.
- O paciente autorizou o acesso à localização (ou informou a cidade).

**Acionador:** o paciente abre a tela "Encontrar Nutricionista".

| Passo | Fluxo principal |
| --- | --- |
| 1 | O sistema obtém a localização atual do paciente. |
| 2 | O sistema consulta os perfis de nutricionistas disponíveis. |
| 3 | O sistema calcula a distância (fórmula de haversine) e ordena os resultados. |
| 4 | O sistema exibe a lista com nome, especialidade e distância aproximada. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Localização negada: o sistema exibe a lista sem ordenação por distância. |
| E2 | Nenhum profissional encontrado: o sistema informa o resultado vazio. |

**Pós-condições:** lista de nutricionistas apresentada ao paciente.

### 3.2.4.9 Caso de Uso 08 – Vincular-se por Código de Convite

**Descrição:** permite ao paciente resgatar um código fornecido por um nutricionista para estabelecer o vínculo de acompanhamento.
**Ator principal:** Paciente.
**Requisitos relacionados:** RF – Busca e Vínculo com Nutricionistas (Tabela 5).
**Pré-condições:**
- O paciente está autenticado.
- O paciente possui um código de convite válido.

**Acionador:** o paciente informa o código e confirma.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O paciente digita o código de convite. |
| 2 | O sistema valida o código pela função `lookup_invite` (RPC). |
| 3 | O paciente confirma o vínculo e o sistema executa `redeem_code`. |
| 4 | O sistema cria o vínculo com status aceito entre paciente e nutricionista. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Código inexistente ou expirado: o sistema informa e não cria o vínculo. |
| E2 | Código já utilizado: o sistema bloqueia o resgate. |

**Pós-condições:** vínculo ativo, dando ao nutricionista acesso aos dados do paciente.

### 3.2.4.10 Caso de Uso 09 – Responder Solicitação de Vínculo

**Descrição:** permite ao nutricionista aceitar ou recusar a solicitação de acompanhamento enviada por um paciente.
**Ator principal:** Nutricionista.
**Requisitos relacionados:** RF – Painel do Nutricionista (Tabela 6); RF – Busca e Vínculo (Tabela 5).
**Pré-condições:**
- O nutricionista está autenticado.
- Existe pelo menos uma solicitação pendente.

**Acionador:** o nutricionista abre a tela de solicitações.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O sistema lista as solicitações pendentes na tabela `connection_requests`. |
| 2 | O nutricionista seleciona uma solicitação e escolhe aceitar ou recusar. |
| 3 | O sistema atualiza o status do vínculo. |
| 4 | Se aceito, o paciente passa a constar na lista de pacientes do profissional. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Solicitação já respondida: o sistema atualiza a lista e sinaliza. |

**Pós-condições:** vínculo aceito ou recusado; acesso aos dados condicionado ao aceite.

### 3.2.4.11 Caso de Uso 10 – Criar Plano Alimentar para o Paciente

**Descrição:** permite ao nutricionista montar e publicar um plano alimentar personalizado para um paciente vinculado.
**Ator principal:** Nutricionista.
**Requisitos relacionados:** RF – Painel do Nutricionista (Tabela 6); RF – Plano Alimentar (Tabela 2).
**Pré-condições:**
- O nutricionista está autenticado.
- Existe vínculo aceito com o paciente.

**Acionador:** o nutricionista toca em "Novo plano" para um paciente.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O nutricionista seleciona o paciente e define o objetivo do plano. |
| 2 | O nutricionista adiciona refeições, itens e alimentos ao plano. |
| 3 | O sistema persiste o plano em `diet_plans`, `meals` e `meal_items`. |
| 4 | O nutricionista publica o plano, que passa a ser exibido ao paciente. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Vínculo inexistente: o sistema impede a criação (bloqueio por RLS). |
| E2 | Plano incompleto: o sistema solicita os itens obrigatórios. |

**Pós-condições:** plano ativo visível ao paciente no aplicativo.

### 3.2.4.12 Caso de Uso 11 – Gerar Código de Convite

**Descrição:** permite ao nutricionista gerar um código de convite para vincular um novo paciente.
**Ator principal:** Nutricionista.
**Requisitos relacionados:** RF – Painel do Nutricionista (Tabela 6); RF – Busca e Vínculo (Tabela 5).
**Pré-condições:**
- O nutricionista está autenticado.

**Acionador:** o nutricionista toca em "Gerar convite".

| Passo | Fluxo principal |
| --- | --- |
| 1 | O nutricionista define os parâmetros do convite (ex.: tipo de serviço). |
| 2 | O sistema gera um token único e o armazena vinculado ao profissional. |
| 3 | O sistema exibe o código para compartilhamento com o paciente. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Falha na geração: o sistema não cria o token e sinaliza o erro. |

**Pós-condições:** código de convite ativo, pronto para ser resgatado por um paciente.

### 3.2.4.13 Caso de Uso 12 – Comentar no Diário do Paciente

**Descrição:** permite ao nutricionista registrar orientações e comentários no diário de um paciente acompanhado.
**Ator principal:** Nutricionista.
**Requisitos relacionados:** RF – Painel do Nutricionista (Tabela 6); RF – Diário Alimentar (Tabela 3).
**Pré-condições:**
- O nutricionista está autenticado.
- Existe vínculo aceito com o paciente.

**Acionador:** o nutricionista abre o diário do paciente e escreve um comentário.

| Passo | Fluxo principal |
| --- | --- |
| 1 | O nutricionista seleciona um paciente vinculado e abre o seu diário. |
| 2 | O sistema exibe os registros de refeições, hidratação e métricas. |
| 3 | O nutricionista escreve o comentário e confirma. |
| 4 | O sistema persiste o comentário e o disponibiliza ao paciente. |

| Código | Fluxo de exceção |
| --- | --- |
| E1 | Vínculo ausente: o acesso ao diário é negado pela RLS. |

**Pós-condições:** comentário registrado e visível ao paciente.

---

## Seção MR

# 3.4 MODELO DE RECEITA

Esta seção apresenta o modelo de negócio previsto para a sustentabilidade do
NutriHub. Assim como discutido por Pine II e Gilmore (2001) a respeito da geração
de valor por meio da experiência, o produto foi concebido para que o valor
percebido pelo profissional de nutrição justifique a adoção de um plano pago,
mantendo o acesso gratuito para o paciente.

## 3.4.1 Estratégia de Monetização

O NutriHub adota o modelo *freemium* em um contexto de *Software as a Service*
(SaaS) com foco B2B (business-to-business). A lógica é a seguinte:

- **Paciente sempre gratuito:** todas as funcionalidades essenciais para o paciente — diário alimentar, controle de hidratação, métricas, geração de plano e busca por nutricionistas — permanecem gratuitas. Isso maximiza a base de usuários e o valor da rede para os profissionais.
- **Nutricionista como cliente pagante:** o profissional é quem obtém retorno econômico do acompanhamento. Por isso, os recursos avançados do painel do nutricionista (número de pacientes, planos ilimitados e ferramentas de gestão) são organizados em planos de assinatura.
- **Monetização por valor entregue:** a cobrança acompanha a capacidade de atendimento do profissional, e não o volume de dados do paciente, o que mantém o incentivo à adesão do paciente alinhado ao negócio.

## 3.4.2 Planos de Assinatura

A estrutura de planos é sustentada pelas tabelas `plans` e `subscriptions` do
banco de dados, que armazenam o tipo do plano, o preço, o ciclo de cobrança e os
recursos habilitados. A Tabela 22 apresenta a proposta de planos para o profissional.

**Tabela 22 – Planos de assinatura do nutricionista**

| Plano | Preço mensal | Pacientes ativos | Recursos incluídos |
| --- | --- | --- | --- |
| Gratuito | R$ 0,00 | Até 3 | Painel básico, planos e convites limitados. |
| Profissional | R$ 49,90 | Até 40 | Planos ilimitados, receitas, comentários no diário e relatórios. |
| Clínica | R$ 129,90 | Ilimitados | Tudo do Profissional, múltiplos profissionais e prioridade de suporte. |

Fonte: Elaborado pelos autores (2026).

## 3.4.3 Estrutura de Custos

Os custos operacionais do NutriHub são majoritariamente variáveis e associados à
infraestrutura em nuvem, o que favorece a escalabilidade. A Tabela 23 estima os
custos mensais iniciais de operação.

**Tabela 23 – Estimativa de custos operacionais mensais**

| Item | Descrição | Custo estimado |
| --- | --- | --- |
| Infraestrutura (Supabase) | Banco de dados, autenticação e API gerenciada | R$ 130,00 |
| Build e distribuição (Expo EAS) | Geração dos aplicativos para as lojas | R$ 90,00 |
| Publicação nas lojas | Rateio das taxas Google Play e Apple | R$ 60,00 |
| Domínio e comunicação | Domínio, e-mail e serviços auxiliares | R$ 40,00 |
| Total | Custo fixo mensal aproximado | R$ 320,00 |

Fonte: Elaborado pelos autores (2026).

## 3.4.4 Projeção de Receita e Ponto de Equilíbrio

Considerando apenas o plano Profissional (R$ 49,90) e o custo fixo mensal estimado
de R$ 320,00, o ponto de equilíbrio é alcançado com aproximadamente sete
nutricionistas assinantes. A Tabela 24 apresenta um cenário de projeção de receita
mensal em função do número de assinantes, ignorando as taxas variáveis das lojas
para simplificação.

**Tabela 24 – Projeção de receita mensal (plano Profissional)**

| Assinantes | Receita bruta | Custo estimado | Resultado |
| --- | --- | --- | --- |
| 7 | R$ 349,30 | R$ 320,00 | R$ 29,30 |
| 20 | R$ 998,00 | R$ 380,00 | R$ 618,00 |
| 50 | R$ 2.495,00 | R$ 520,00 | R$ 1.975,00 |
| 100 | R$ 4.990,00 | R$ 760,00 | R$ 4.230,00 |

Fonte: Elaborado pelos autores (2026).

Os valores apresentados são projeções de planejamento e têm caráter ilustrativo,
servindo para demonstrar a viabilidade econômica do modelo à medida que a base de
profissionais cresce.

---

## Seção AP

## 3.5.1 Interfaces do Produto

Esta seção apresenta as principais telas do NutriHub em funcionamento, organizadas
pelos dois perfis de uso. As interfaces foram construídas com foco na simplicidade
e na redução do esforço de registro, conforme discutido na fundamentação teórica.
As Figuras 10 a 16 apresentam o aplicativo sob a perspectiva do paciente.

@IMG prints/01-login.png || Figura 10 – Tela de login e cadastro
Fonte: Elaborado pelos autores (2026).

@IMG prints/02-home.png || Figura 11 – Tela inicial (Home) do paciente
Fonte: Elaborado pelos autores (2026).

@IMG prints/03-diario.png || Figura 12 – Diário alimentar e controle de hidratação
Fonte: Elaborado pelos autores (2026).

@IMG prints/04-dieta.png || Figura 13 – Plano alimentar (dieta) do paciente
Fonte: Elaborado pelos autores (2026).

@IMG prints/05-metricas.png || Figura 14 – Acompanhamento de métricas corporais
Fonte: Elaborado pelos autores (2026).

@IMG prints/06-nutricionistas.png || Figura 15 – Busca de nutricionistas por geolocalização
Fonte: Elaborado pelos autores (2026).

@IMG prints/07-perfil.png || Figura 16 – Perfil do paciente
Fonte: Elaborado pelos autores (2026).

As Figuras 17 a 22 apresentam o aplicativo sob a perspectiva do nutricionista,
com as ferramentas de gestão de pacientes, planos, convites e receitas.

@IMG prints/08-nutri-painel.png || Figura 17 – Painel do nutricionista
Fonte: Elaborado pelos autores (2026).

@IMG prints/09-nutri-pacientes.png || Figura 18 – Lista de pacientes vinculados
Fonte: Elaborado pelos autores (2026).

@IMG prints/10-nutri-planos.png || Figura 19 – Criação de planos alimentares
Fonte: Elaborado pelos autores (2026).

@IMG prints/11-nutri-convites.png || Figura 20 – Geração de códigos de convite
Fonte: Elaborado pelos autores (2026).

@IMG prints/12-nutri-receitas.png || Figura 21 – Cadastro de receitas
Fonte: Elaborado pelos autores (2026).

@IMG prints/13-nutri-solicitacoes.png || Figura 22 – Solicitações de vínculo
Fonte: Elaborado pelos autores (2026).

## 3.5.2 Trechos de Código-Fonte

Para ilustrar a implementação, apresentam-se dois trechos representativos da camada
de serviços do aplicativo. O Quadro 4 mostra o registro de uma refeição (check-in),
em que o identificador do usuário é obtido da sessão autenticada e a política de RLS
garante que o registro pertença ao próprio paciente.

**Quadro 4 – Registro de refeição na camada de serviços**

```typescript
// src/services/diet.service.ts
export async function logMeal(input: LogMealInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("meal_logs")
    .insert({
      user_id: user.id,
      meal_id: input.mealId,
      logged_at: new Date().toISOString(),
      status: "done",
    })
    .select()
    .single();

  if (error) throw error;
  return mapMealLog(data);
}
```

Fonte: Elaborado pelos autores (2026).

O Quadro 5 apresenta a consulta que carrega o plano alimentar ativo com refeições,
itens e alimentos aninhados em uma única requisição, aproveitando os relacionamentos
resolvidos automaticamente pela API (PostgREST) do Supabase.

**Quadro 5 – Consulta aninhada do plano alimentar ativo**

```typescript
// src/services/diet.service.ts
const PLAN_SELECT = `
  id, title, goal, is_active,
  meals (
    id, name, time,
    meal_items (
      id, quantity,
      foods ( id, name, calories, protein, carbs, fat )
    )
  )
`;

export async function getActivePlan(userId: string) {
  const { data, error } = await supabase
    .from("diet_plans")
    .select(PLAN_SELECT)
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapDietPlan(data) : null;
}
```

Fonte: Elaborado pelos autores (2026).

---

## Seção MU

# 3.6 MANUAL DO USUÁRIO

Esta seção apresenta o manual de utilização do NutriHub, descrevendo, passo a passo,
as principais operações disponíveis para cada perfil. O manual está organizado em
três partes: o acesso ao aplicativo, o uso pelo perfil do paciente e o uso pelo
perfil do nutricionista.

## 3.6.1 Acesso ao Aplicativo

Ao abrir o NutriHub pela primeira vez, o usuário é apresentado à tela de acesso,
onde pode entrar com uma conta existente ou criar uma nova.

- Para **criar uma conta**, toque em "Criar conta", informe nome, e-mail e senha e selecione o tipo de perfil (paciente ou nutricionista).
- Para **entrar**, informe o e-mail e a senha cadastrados e toque em "Entrar".
- A sessão é mantida de forma segura no dispositivo; nas próximas vezes, o acesso é automático.

@IMG prints/01-login.png || Tela de acesso: login e criação de conta.
Fonte: Elaborado pelos autores (2026).

## 3.6.2 Perfil do Paciente

### 3.6.2.1 Tela Inicial (Home)

A tela inicial reúne o resumo do dia: as refeições previstas, o progresso de
hidratação e os atalhos para as demais áreas. Para marcar uma refeição como
consumida, basta tocar em "Marcar" no item correspondente.

@IMG prints/02-home.png || Tela inicial do paciente, com o resumo do dia.
Fonte: Elaborado pelos autores (2026).

### 3.6.2.2 Diário Alimentar e Hidratação

No diário, o paciente acompanha o histórico de refeições registradas e controla o
consumo de água. Utilize os botões de quantidade para somar o consumo à meta diária.

@IMG prints/03-diario.png || Diário alimentar e controle de hidratação.
Fonte: Elaborado pelos autores (2026).

### 3.6.2.3 Plano Alimentar

A tela de dieta exibe o plano ativo, organizado por refeições e seus itens. Quando
o paciente não possui acompanhamento profissional, é possível gerar um plano a
partir de um objetivo.

@IMG prints/04-dieta.png || Plano alimentar do paciente.
Fonte: Elaborado pelos autores (2026).

### 3.6.2.4 Métricas Corporais

Na área de métricas, o paciente registra medidas como peso e acompanha a evolução
por meio de gráficos. Para adicionar uma medida, toque em "Adicionar métrica".

@IMG prints/05-metricas.png || Acompanhamento de métricas corporais.
Fonte: Elaborado pelos autores (2026).

### 3.6.2.5 Encontrar Nutricionista

Nesta tela, o paciente visualiza os nutricionistas disponíveis, ordenados por
proximidade. Também é possível vincular-se a um profissional informando um código
de convite.

@IMG prints/06-nutricionistas.png || Busca de nutricionistas por geolocalização.
Fonte: Elaborado pelos autores (2026).

### 3.6.2.6 Perfil

Na área de perfil, o paciente consulta e edita seus dados pessoais e gerencia a sua
conta, incluindo o encerramento da sessão.

@IMG prints/07-perfil.png || Perfil do paciente.
Fonte: Elaborado pelos autores (2026).

## 3.6.3 Perfil do Nutricionista

### 3.6.3.1 Painel

O painel do nutricionista apresenta uma visão consolidada da sua atuação: pacientes
acompanhados, solicitações pendentes e atalhos para as ferramentas de gestão.

@IMG prints/08-nutri-painel.png || Painel do nutricionista.
Fonte: Elaborado pelos autores (2026).

### 3.6.3.2 Pacientes

Nesta tela, o profissional visualiza a lista de pacientes vinculados e acessa o
diário e as métricas de cada um para acompanhamento.

@IMG prints/09-nutri-pacientes.png || Lista de pacientes vinculados.
Fonte: Elaborado pelos autores (2026).

### 3.6.3.3 Planos

O nutricionista monta e publica planos alimentares personalizados, definindo
refeições, itens e alimentos para cada paciente.

@IMG prints/10-nutri-planos.png || Criação de planos alimentares.
Fonte: Elaborado pelos autores (2026).

### 3.6.3.4 Convites

Nesta área, o profissional gera códigos de convite para vincular novos pacientes ao
seu acompanhamento.

@IMG prints/11-nutri-convites.png || Geração de códigos de convite.
Fonte: Elaborado pelos autores (2026).

### 3.6.3.5 Receitas

O nutricionista cadastra e gerencia receitas que podem ser associadas aos planos e
compartilhadas com os pacientes.

@IMG prints/12-nutri-receitas.png || Cadastro de receitas.
Fonte: Elaborado pelos autores (2026).

### 3.6.3.6 Solicitações

Nesta tela, o profissional responde às solicitações de vínculo enviadas pelos
pacientes, aceitando ou recusando cada pedido.

@IMG prints/13-nutri-solicitacoes.png || Solicitações de vínculo pendentes.
Fonte: Elaborado pelos autores (2026).

---

## Seção REF

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018.** Lei Geral de Proteção de Dados Pessoais (LGPD). Brasília, DF: Presidência da República, 2018.

BURKE, Lora E.; WANG, Jing; SEVICK, Mary Ann. Self-monitoring in weight loss: a systematic review of the literature. **Journal of the American Dietetic Association**, v. 111, n. 1, p. 92-102, 2011.

EXPO. **Expo documentation.** Expo, 2026. Disponível em: https://docs.expo.dev. Acesso em: jul. 2026.

WORLD HEALTH ORGANIZATION. **mHealth: new horizons for health through mobile technologies.** Geneva: WHO, 2011.
