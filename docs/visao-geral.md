# Visão Geral — CampusMove

## O que é o CampusMove

O **CampusMove** é uma proposta de plataforma SaaS para mobilidade acadêmica.

A ideia central é reunir, em um único web app, informações sobre transporte institucional, rotas, horários, eventos acadêmicos e apoio à decisão para deslocamento dentro do contexto de instituições de ensino.

O projeto nasce a partir de um problema comum em ambientes acadêmicos: estudantes, servidores e visitantes muitas vezes precisam combinar transporte público, transporte institucional e informações dispersas para conseguir chegar ao campus, sair dele ou participar de eventos.

---

## Problema

Em muitos campi, as informações de mobilidade ficam espalhadas em:

- grupos de mensagens;
- murais físicos;
- conversas informais;
- sites institucionais;
- horários em PDF;
- aplicativos genéricos de transporte;
- informações internas não centralizadas.

Isso gera dificuldade para responder perguntas simples, como:

- Qual o próximo transporte institucional?
- Ainda consigo chegar a tempo?
- Qual a melhor rota até o campus?
- Existe alternativa se eu perder a próxima saída?
- Como chegar a um evento acadêmico?
- Qual estação ou parada faz mais sentido usar?

---

## Solução proposta

O CampusMove propõe uma experiência centralizada para mobilidade acadêmica.

A plataforma pode integrar:

- transporte institucional;
- transporte público;
- rotas demonstrativas;
- eventos acadêmicos;
- perfis de usuário;
- múltiplas instituições;
- múltiplos campi;
- análise de chegada;
- plano alternativo de deslocamento.

---

## MVP atual

O MVP atual utiliza como cenário principal o **IFCE Campus Maracanaú**, com foco no serviço **MinhaJardineira**.

Neste MVP, a MinhaJardineira é tratada como transporte institucional do campus.

A lógica do protótipo considera:

- janelas operacionais da Jardineira;
- passagens calculadas a cada 15 minutos dentro das janelas;
- duração estimada entre estação e campus;
- horários estáticos da Linha Sul;
- eventos acadêmicos demonstrativos;
- cálculo local de próxima passagem;
- análise “Chego a tempo?”;
- Plano B demonstrativo.

---

## CampusMove x MinhaJardineira

É importante separar os conceitos:

```txt
CampusMove = plataforma SaaS de mobilidade acadêmica
MinhaJardineira = serviço institucional usado no MVP IFCE Maracanaú