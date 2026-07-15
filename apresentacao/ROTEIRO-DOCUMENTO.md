# Roteiro — Apresentação da nova seção do documento (Eduardo)

> **Vídeo:** "Documentando o que foi adicionado ao documento do projeto e explicando o funcionamento na aplicação."
> **Duração alvo:** 4 a 6 minutos.
> **Base:** as seções foram acrescentadas ao documento tendo como modelo os trabalhos **MindU** e **Retalix**, que possuíam capítulos que o NutriHub ainda não tinha (Arquitetura, Arquitetura de Segurança, Modelo Físico do Banco, Ferramentas e Tecnologias e tabelas de Testes).
> **O que deixar aberto antes de gravar:**
> 1. O `Nutrihub.docx` já com as novas seções coladas (ou o `NOVAS-SECOES.md`), rolando na seção **3.2.8 Arquitetura de Segurança** e na **Tabela 16 – Testes de segurança**.
> 2. O app rodando com **duas contas** (paciente e nutricionista) para demonstrar o isolamento de dados.
> 3. O painel do **Supabase** (Policies/RLS e Authentication), para provar no banco o que está documentado.

---

## 0:00 – 0:40 · O que foi adicionado e por quê

- "Olá, professor. Neste vídeo eu apresento **o que adicionamos ao documento do projeto** e mostro como aquilo funciona na aplicação."
- "Estudamos dois trabalhos de referência, o **MindU** e o **Retalix**. Percebemos que eles tinham capítulos que o nosso documento ainda não trazia, então incorporamos as seções equivalentes ao NutriHub: **Modelo Físico do Banco de Dados** (o script DDL e as políticas de RLS), a **Arquitetura da Solução** (visão geral, camadas e backend), a **Arquitetura de Segurança**, uma seção de **Ferramentas e Tecnologias** e **tabelas de testes realizados**."
- "Vou focar na que considero a mais importante: a **Arquitetura de Segurança**, porque ela documenta como protegemos dados pessoais e de saúde — e ela conversa diretamente com o backend do app."

## 0:40 – 1:40 · A seção no documento (3.2.8 Arquitetura de Segurança)

*(mostrar o documento na seção 3.2.8)*
- "A seção lista os **mecanismos de segurança implementados**: comunicação criptografada por HTTPS, senhas armazenadas apenas como hash `bcrypt`, isolamento de dados por **Row Level Security**, tokens JWT guardados em área segura, proteção contra **SQL Injection** e validação de entrada com Zod."
- "Repare que cada mecanismo está amarrado a um requisito não funcional que já existia no documento — por exemplo, o isolamento por RLS atende o NF 1.2 e o NF 5.5. Ou seja, a seção nova não fica solta: ela dá consequência técnica aos requisitos que já tínhamos levantado."
- "Modelamos essa estrutura exatamente como o MindU e o Retalix fazem: mecanismos, um exemplo de proteção contra injeção de SQL e uma tabela de testes de segurança ao final."

## 1:40 – 3:00 · Como funciona na aplicação: isolamento de dados (RLS)

*(app aberto com a conta do PACIENTE)*
- "Agora, como isso funciona na prática. O documento diz que 'cada usuário só acessa os próprios registros'. Aqui, logado como paciente, eu vejo o meu diário e as minhas métricas."
- *(mostrar o painel do Supabase → Policies)* "Isso não é o app escondendo dado: a regra está no banco. Esta política de RLS compara o `auth.uid()` do token com o `user_id` da linha. Se o `id` não bate, o banco simplesmente não devolve a linha."
- *(trocar para a conta do NUTRICIONISTA)* "E o profissional? Ele só passa a ver os dados de um paciente **depois** que o vínculo é aceito — como está descrito na seção. Sem vínculo aceito, o painel não acessa nada daquele paciente."

## 3:00 – 4:00 · Como funciona: autenticação e SQL Injection

- "O documento também descreve a autenticação com **JWT**. Quando eu faço login…" *(mostrar login no app)* "…o backend emite um token de acesso e um de renovação, que ficam guardados de forma segura no dispositivo e são renovados automaticamente. Por isso a sessão continua ativa sem pedir senha toda hora."
- *(mostrar aba Authentication do Supabase)* "E aqui está a prova do que a seção afirma sobre senhas: os usuários aparecem, mas a senha nunca — só o hash seguro."
- "Sobre a **proteção contra SQL Injection**, a seção mostra que toda consulta é **parametrizada**. Na busca de alimentos, por exemplo, o texto digitado vai como parâmetro, nunca colado no comando SQL. Então uma entrada maliciosa é tratada como texto comum, e não como instrução."

## 4:00 – 4:50 · A tabela de testes de segurança (Tabela 16)

*(mostrar a Tabela 16 no documento)*
- "Para fechar a seção, adicionamos a **Tabela 16 – Testes de segurança realizados**, no mesmo formato dos trabalhos de referência. Ela lista os cenários que verificamos: tentativa de SQL Injection, tentativa de ler dados de outro usuário, acesso sem autenticação, acesso cruzado entre nutricionista e paciente, senha em texto puro e comunicação em trânsito."
- "Todos com o resultado observado — bloqueado, negado ou protegido — o que dá evidência concreta de que a segurança descrita no texto de fato acontece no sistema."

## 4:50 – 5:30 · Fechamento

- "Em resumo: usando o MindU e o Retalix como modelo, enriquecemos o documento com a Arquitetura, o Modelo Físico, a segurança, as ferramentas e os testes. E, mais importante, cada item documentado tem um correspondente **real** no aplicativo — o RLS, os tokens JWT, as consultas parametrizadas e as funções no servidor. A documentação passou a refletir com fidelidade o que o sistema realmente faz. Obrigado!"

---

### Checklist do que aparece na tela
- [ ] Documento — seção **3.2.8 Arquitetura de Segurança** (mecanismos + NFs vinculados)
- [ ] Documento — **Quadro 3** (consulta parametrizada) e **Tabela 16** (testes de segurança)
- [ ] App logado como **paciente** — diário/métricas próprios
- [ ] App logado como **nutricionista** — só vê paciente com vínculo aceito
- [ ] Supabase → **Policies** (`auth.uid() = user_id`)
- [ ] Supabase → **Authentication** (usuários sem senha exposta)
