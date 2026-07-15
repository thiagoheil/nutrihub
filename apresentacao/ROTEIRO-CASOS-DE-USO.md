# Roteiro — Apresentação da nova seção do documento: Casos de Uso Estendidos (Eduardo)

> **Vídeo:** "Documentando o que foi adicionado ao documento do projeto e explicando o funcionamento na aplicação."
> **Seção escolhida:** 3.2.4 – Casos de Uso (agora com a **Especificação Estendida dos Casos de Uso**, itens 3.2.4.1 a 3.2.4.13).
> **Duração alvo:** 4 a 6 minutos.
> **De onde tiramos:** os trabalhos de referência **MindU** e **Retalix**, que dedicam um capítulo inteiro aos **casos de uso estendidos** — dezenas deles, cada um detalhado em atores, fluxos e exceções. Era o principal capítulo que o NutriHub ainda não tinha nesse nível de detalhe.
> **O que deixar aberto antes de gravar:**
> 1. O `Nutrihub.docx` na seção **3.2.4**, rolando pelos casos de uso (ex.: **3.2.4.4 – Registrar Refeição**).
> 2. Um dos PDFs de referência (**Retalix** ou **MindU**) aberto no capítulo de **Casos de Uso Estendidos**, para comparar o formato.
> 3. O app rodando com a conta de **paciente**, na tela inicial (Home), pronto para marcar uma refeição.

---

## 0:00 – 0:40 · O que foi adicionado e por quê

- "Olá, professor. Neste vídeo eu apresento **uma das seções que adicionamos ao documento** e mostro como ela funciona na aplicação. A seção que escolhi é a **Especificação Estendida dos Casos de Uso**, dentro do item 3.2.4."
- "Antes, o nosso documento tinha o **diagrama** de casos de uso e apenas **dois** casos descritos em texto corrido. Isso mostrava *que* as interações existiam, mas não detalhava *como* cada uma acontece — os passos, as condições e o que dá errado."
- "Então padronizamos e detalhamos **doze casos de uso**, cobrindo os dois perfis: paciente e nutricionista."

## 0:40 – 1:40 · De onde tiramos a seção (MindU e Retalix)

*(mostrar o PDF do Retalix — ou do MindU — no capítulo de Casos de Uso Estendidos)*
- "Essa estrutura não foi inventada por nós: usamos como modelo os trabalhos **MindU** e **Retalix**. Repare que os dois dedicam um **capítulo inteiro** aos casos de uso estendidos — no Retalix são dezenas deles, um após o outro."
- "E é exatamente aqui que está boa parte da diferença de tamanho entre os documentos: esse detalhamento, sozinho, ocupa dezenas de páginas nesses trabalhos. Faltava isso no nosso."
- "Cada caso de uso deles segue sempre o **mesmo esqueleto**: descrição, atores, pré-condições, um fluxo principal em tabela, os fluxos de exceção e as pós-condições. Nós adotamos esse mesmo formato para o NutriHub."

## 1:40 – 2:50 · O que a seção mudou no nosso documento

*(voltar ao `Nutrihub.docx`, seção 3.2.4)*
- "No documento, agora, cada caso de uso tem uma **estrutura fixa**. Vou usar o **3.2.4.4 – Registrar Refeição** como exemplo."
- "Primeiro, a **descrição** e o **ator principal** — aqui, o paciente. Depois, os **requisitos relacionados**: eu amarrei cada caso de uso aos requisitos funcionais que já existiam no documento, as Tabelas 1 a 6. Ou seja, o caso de uso não fica solto: ele dá consequência aos requisitos que já tínhamos levantado."
- "Em seguida vêm as **pré-condições**, o **fluxo principal** — numa tabela, passo a passo — e, o mais importante, os **fluxos de exceção**: o que o sistema faz quando algo sai do esperado. Por fim, as **pós-condições**, dizendo em que estado o sistema fica."
- "Então o que mudou? Saímos de dois casos em texto solto para **doze casos padronizados e rastreáveis** — o documento passou de 'descritivo' para 'especificado', no mesmo nível dos trabalhos de referência."

## 2:50 – 4:10 · Como funciona na aplicação (o caso de uso rodando)

*(app aberto na conta do PACIENTE, tela inicial)*
- "Agora a parte que fecha o raciocínio: esse caso de uso **não é teoria**, ele descreve o que o app realmente faz. Vou seguir o fluxo principal da tabela, passo a passo."
- *(tocar em "Marcar" numa refeição)* "Passo 1 da tabela: o paciente seleciona a refeição no plano do dia. Passo 2: o sistema registra o consumo — na prática, ele grava na tabela `meal_logs` com data e horário."
- "Passo 3: a política de segurança confirma que o registro é meu, do próprio usuário. Passo 4: o progresso do dia atualiza na hora — repare que a barra/indicador já mudou aqui na tela."
- *(tentar marcar a mesma refeição de novo, ou mostrar o comportamento previsto)* "E os **fluxos de exceção** que documentamos também acontecem: se eu tentar registrar a mesma refeição duas vezes no período, o sistema evita a duplicidade — é a exceção E1 da tabela. Ou seja, o documento descreve tanto o caminho feliz quanto os desvios, e ambos batem com o app."

## 4:10 – 4:50 · Por que isso importa

- "Detalhar os casos de uso desse jeito traz três ganhos concretos para o documento:"
- "Primeiro, **rastreabilidade**: dá para seguir do requisito (Tabela 1 a 6) até o caso de uso e até a tela. Segundo, **testabilidade**: cada fluxo de exceção vira, naturalmente, um caso de teste. E terceiro, **alinhamento com a referência**: o NutriHub passou a ter o mesmo nível de especificação do MindU e do Retalix."

## 4:50 – 5:30 · Fechamento

- "Resumindo: escolhi a **Especificação Estendida dos Casos de Uso**. Tiramos o formato dos trabalhos **MindU** e **Retalix**, que a tratam como um capítulo central. Ela mudou o nosso documento ao transformar dois casos em texto em **doze casos padronizados**, ligados aos requisitos e com fluxos de exceção. E, como mostrei, cada passo documentado tem um correspondente **real** no aplicativo. A documentação passou a descrever o sistema com precisão. Obrigado!"

---

### Checklist do que aparece na tela
- [ ] PDF de referência (**Retalix**/**MindU**) — capítulo de **Casos de Uso Estendidos** (formato modelo)
- [ ] `Nutrihub.docx` — seção **3.2.4** com a especificação estendida (3.2.4.1 a 3.2.4.13)
- [ ] Documento — caso **3.2.4.4 Registrar Refeição**: descrição, requisitos (Tabelas 1–6), fluxo principal e **fluxo de exceção**
- [ ] App (paciente) — **marcar uma refeição** e o progresso do dia atualizando (fluxo principal)
- [ ] App (paciente) — tentativa de **registro duplicado** sendo evitada (fluxo de exceção E1)
