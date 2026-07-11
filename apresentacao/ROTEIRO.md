# NutriHub — Roteiro de apresentação (10 minutos)

> O mesmo roteiro está embutido no PPTX como **notas do apresentador** em cada slide.
> Contas demo (Supabase staging): paciente `mariana.demo@nutrihub-demo.com` · nutricionista `camila.demo@nutrihub-demo.com` · senha `NutriDemo123!`

## 0:00 – 0:45 · Slide 1 — Capa
- Apresente-se e diga a frase-síntese: **"O NutriHub conecta pacientes e nutricionistas em um só app: o paciente vive a dieta no dia a dia, o nutricionista acompanha em tempo real."**
- Anuncie a estrutura: visão do paciente → visão do nutricionista → tecnologia → próximos passos.

## 0:45 – 1:45 · Slide 2 — O problema
- A dieta hoje vive em um PDF entregue na consulta — o paciente esquece em dias.
- O nutricionista só descobre se o plano funcionou na consulta seguinte, semanas depois.
- Sem registro simples (refeições, água, medidas), a adesão despenca.
- **Proposta:** transformar o plano alimentar em rotina viva, com feedback nos dois lados.

## 1:45 – 2:30 · Slide 3 — Um app, dois perfis
- No cadastro a pessoa escolhe o perfil: **paciente** ou **nutricionista** — experiências distintas no mesmo app.
- O coração do produto é o **vínculo** entre eles: busca geolocalizada ou código de convite, com aceite do profissional.

## 2:30 – 3:30 · Slide 4 — Paciente: Home e Diário
- Home: progresso de refeições do dia, peso/IMC, plano ativo.
- Hidratação com meta automática (**35 ml/kg de peso**) e botões rápidos.
- Diário alimentar: calendário do mês, calorias consumidas vs. meta e macros (proteína/carbo/gordura).

## 3:30 – 4:30 · Slide 5 — Paciente: Dieta do dia
- Refeições com horário, alimentos, quantidades, kcal e proteína por item.
- **Registrar refeição = 2 toques** ("Marcar") — atualiza home, diário e a visão do nutricionista.
- Sem nutricionista? O paciente monta a própria dieta no construtor do app.

## 4:30 – 5:15 · Slide 6 — Paciente: Métricas
- Peso, cintura, quadril e outras medidas com gráfico de evolução e histórico.
- Exemplo real da demo: **-3,5 kg em 8 semanas** — feedback visual que motiva.
- Tudo visível para o nutricionista avaliar a eficácia do plano.

## 5:15 – 6:00 · Slide 7 — Encontrar nutricionista
- Lista geolocalizada: distância, avaliação, selo de verificado, especialidades.
- Ou conexão direta por **código do nutricionista** (ideal para consultórios).
- O profissional aceita a solicitação e o vínculo é criado.

## 6:00 – 7:00 · Slide 8 — Nutricionista: Painel
- Cockpit do profissional: pacientes ativos, solicitações pendentes (com badge), convites ativos.
- Tela de solicitações: aceitar/recusar novos pacientes com contexto.

## 7:00 – 7:45 · Slide 9 — Nutricionista: ferramentas
- **Pacientes:** acesso ao diário, plano e métricas de cada um.
- **Convites:** códigos com tipo de serviço e preço (mensal, premium…) — canal de captação.
- **Receitas:** acervo público ou exclusivo para pacientes.

## 7:45 – 8:45 · Slide 10 — Tecnologia
- **Expo + React Native:** um código para iOS, Android e Web.
- **Supabase (Postgres + Auth + RLS):** cada usuário só enxerga os próprios dados; o nutricionista, só os pacientes vinculados.
- **TanStack Query** (sincronização), **Zustand** (estado), **Zod** (validação), **Expo Router/Location**.
- Mensagem: stack que permite iterar rápido com time enxuto.

## 8:45 – 10:00 · Slide 11 — Roadmap e fechamento
- Próximos passos: notificações push, comentários do nutricionista no diário, assinaturas in-app, fotos das refeições.
- Frase final: **"O NutriHub tira o plano alimentar do papel e o coloca no bolso do paciente — com o nutricionista acompanhando de perto."**
- Agradeça e abra para perguntas.

---

### Dicas rápidas
- Ensaie uma vez cronometrando; se passar de 10 min, corte detalhes dos slides 4 e 10 (são os mais densos).
- Se houver internet no local, uma demo ao vivo de "Marcar refeição" (slide 5) vale mais que qualquer fala — `npx expo start --web` e logue com a conta demo.
