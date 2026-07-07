# AGENTS.md

## Objetivo

Este arquivo orienta agentes de IA, assistentes de código e colaboradores automatizados que atuarem no repositório **CampusMove**.

O objetivo principal é garantir que alterações no projeto sejam feitas com segurança, coerência arquitetural e respeito ao escopo de cada parte do sistema.

---

## Visão geral do projeto

**CampusMove** é uma proposta de plataforma SaaS para mobilidade acadêmica.

No estágio atual, o projeto contém principalmente:

- documentação de visão e arquitetura;
- dados iniciais;
- um protótipo front-end em HTML/CSS/JavaScript;
- estrutura base para evolução futura.

### Conceitos importantes

- **CampusMove** = plataforma SaaS.
- **MinhaJardineira** = serviço institucional usado no MVP do IFCE Maracanaú.
- **apps/prototype-html** = protótipo funcional front-end.

---

## Princípios obrigatórios

### 1. Não confundir produto com serviço
Nunca tratar **MinhaJardineira** como se fosse o produto inteiro.

- Correto:
  - CampusMove é a plataforma.
  - MinhaJardineira é o serviço do MVP.
- Incorreto:
  - tratar CampusMove e MinhaJardineira como sinônimos.

---

### 2. Preservar honestidade dos dados
Não inventar integração real quando ela não existe.

Nunca afirmar sem existir de fato:

- GPS em tempo real;
- integração oficial com IFCE;
- integração oficial com Metrofor;
- backend funcional;
- autenticação real;
- banco de dados operacional.

Se um dado for demonstrativo, isso deve continuar explícito.

---

### 3. Respeitar o estágio do projeto
Hoje o projeto é majoritariamente um **protótipo**.

Portanto:

- não transformar automaticamente o protótipo em sistema final;
- não adicionar complexidade desnecessária;
- não criar backend fictício só para “parecer completo”;
- não inventar integrações sem solicitação clara.

---

### 4. Mudanças devem ser pequenas e justificáveis
Ao modificar código:

- prefira mudanças pequenas;
- preserve comportamento aprovado;
- evite refatorações gigantescas sem necessidade;
- não reescreva o projeto inteiro.

---

## Estrutura principal do repositório

```txt
CampusMove/
├── apps/
│   └── prototype-html/
├── backend/
├── data/
├── docs/
├── frontend/
├── AGENTS.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Regras para atuar no protótipo HTML

Diretório principal:

```txt
apps/prototype-html/
```

### O que fazer
- manter o app funcional;
- preservar layout mobile-first;
- manter coerência visual;
- preservar navegação;
- melhorar código com segurança;
- documentar mudanças importantes.

### O que não fazer
- adicionar dependências pesadas sem necessidade;
- transformar tudo em framework sem pedido;
- inventar API externa;
- quebrar o fluxo do protótipo;
- remover avisos de “demonstrativo”.

---

## Regras para dados e horários

Quando trabalhar com horários, rotas e eventos:

- distinguir dado fixo, dado público cadastrado e dado demonstrativo;
- não misturar “estimativa” com “tempo real”;
- não expor números crus confusos ao usuário se houver forma humana melhor;
- preservar clareza do produto.

---

## Regras para documentação

Se alterar documentação:

- manter linguagem clara;
- manter coerência entre README, docs e estrutura real;
- evitar prometer funcionalidades não implementadas;
- atualizar exemplos se a estrutura mudar.

---

## Convenções recomendadas

### Commits
Preferir mensagens como:

- `docs: atualiza README principal`
- `docs: adiciona AGENTS e CONTRIBUTING`
- `feat: melhora fluxo de horários no protótipo`
- `fix: corrige cálculo de próxima passagem`
- `refactor: reorganiza módulos do prototype-html`

---

## Prioridades do agente

Ao ajudar no projeto, a ordem de prioridade deve ser:

1. não quebrar o que já funciona;
2. respeitar o escopo do protótipo;
3. manter honestidade técnica;
4. preservar clareza da arquitetura;
5. melhorar organização e documentação;
6. só depois pensar em expansão.

---

## Em caso de dúvida

Se houver dúvida entre:

- “deixar mais bonito” vs “preservar o comportamento aprovado”  
  → preservar comportamento aprovado.

Se houver dúvida entre:

- “inventar algo plausível” vs “admitir que é demonstrativo”  
  → admitir que é demonstrativo.

Se houver dúvida entre:

- “refatorar tudo” vs “ajustar pontualmente”  
  → ajustar pontualmente.

---

## Resumo final

O agente deve atuar como:

- mantenedor cuidadoso;
- revisor de arquitetura;
- colaborador disciplinado;
- apoio técnico fiel ao escopo do CampusMove.

Não atuar como alguém que “reinventa o projeto” sem necessidade.