# CampusMove — Prototype HTML

Protótipo funcional front-end do **CampusMove**, um web app SaaS demonstrativo para mobilidade acadêmica, transporte institucional, rotas, horários e eventos.

Este protótipo representa o MVP do CampusMove com foco no contexto do **IFCE Campus Maracanaú**, usando o serviço **MinhaJardineira** como exemplo principal de transporte institucional.

---

## Sobre este protótipo

Este diretório contém a versão funcional em **HTML, CSS e JavaScript** do CampusMove.

O objetivo desta versão é demonstrar:

- a experiência do usuário;
- o fluxo de navegação do web app;
- a lógica de horários da MinhaJardineira;
- a integração demonstrativa com dados estáticos da Linha Sul;
- rotas acadêmicas;
- eventos;
- análise de chegada;
- plano alternativo de deslocamento;
- visual mobile-first para apresentação.

Esta versão **não possui backend**, **não usa banco de dados**, **não faz rastreamento GPS** e **não consome APIs externas**.

---

## Papel do prototype-html no projeto

O CampusMove é pensado como uma plataforma SaaS multi-instituição.

Este protótipo HTML funciona como uma prova visual e funcional da ideia antes da implementação completa com backend, banco de dados e integrações oficiais.

```txt
CampusMove
└── apps/
    └── prototype-html/
        └── Protótipo funcional front-end
```

---

## Como executar localmente

Entre na pasta do protótipo:

```bash
cd apps/prototype-html
```

Inicie um servidor local:

```bash
python3 -m http.server 5505
```

Acesse no navegador:

```txt
http://127.0.0.1:5505/index.html
```

Para evitar cache durante testes, use uma versão na URL:

```txt
http://127.0.0.1:5505/index.html?v=final
```

No navegador, use `CTRL + F5` para recarregar sem cache.

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript modular
- Estrutura front-end estática
- Assets locais
- Dados simulados/estáticos em arquivos JavaScript
- Servidor local simples com Python

---

## Estrutura da pasta

```txt
apps/prototype-html/
├── assets/
│   ├── assets-logo/
│   └── vehicles/
│       └── jardineira.png
│
├── css/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── maps.css
│   ├── screens.css
│   └── accessibility.css
│
├── docs/
│   └── documentos auxiliares do protótipo
│
├── js/
│   ├── data/
│   │   ├── events.js
│   │   ├── institutions.js
│   │   ├── routes.js
│   │   └── schedules.js
│   │
│   ├── modules/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── home.js
│   │   ├── institution.js
│   │   ├── location.js
│   │   ├── profile.js
│   │   └── schedules.js
│   │
│   ├── icons.js
│   ├── main.js
│   ├── router.js
│   ├── state.js
│   └── utils.js
│
├── index.html
└── README.md
```

---

## Principais telas

### Tela inicial e acesso demonstrativo

O protótipo apresenta um fluxo inicial de acesso demonstrativo para simular a entrada do usuário no CampusMove.

Este fluxo não representa autenticação real.

---

### Seletor SaaS

O seletor SaaS demonstra a possibilidade de adaptar o CampusMove para diferentes contextos institucionais.

Ele permite simular seleção por:

- tipo de instituição;
- instituição;
- campus;
- perfil de usuário.

Exemplo de uso no MVP:

```txt
Instituição: IFCE
Campus: Maracanaú
Serviço ativo: MinhaJardineira
```

---

### Home

A Home apresenta informações rápidas de mobilidade, como:

- saudação do usuário;
- data e horário do navegador;
- próxima janela/passagem da MinhaJardineira;
- acesso rápido às áreas principais;
- indicação de transporte institucional;
- elementos visuais do CampusMove.

A Home usa cálculo local baseado no horário do navegador.

---

### Horários

A tela de horários é uma das partes principais do protótipo.

Ela mostra a **MinhaJardineira** como um conjunto de **janelas operacionais**, e não como horários isolados.

Exemplo:

```txt
07:00–08:15
Metrô → Campus
A cada 15 min
```

Dentro de cada janela, o protótipo gera passagens calculadas de 15 em 15 minutos.

Exemplo:

```txt
Janela operacional:
07:00–08:15

Passagens:
07:00
07:15
07:30
07:45
08:00
08:15
```

A duração estimada entre a estação e o campus é tratada separadamente.

```txt
07:00 → chegada 07:08
07:15 → chegada 07:23
07:30 → chegada 07:38
```

A janela operacional indica quando o serviço está disponível.  
A chegada estimada indica a previsão de deslocamento de uma passagem específica.

---

### Ao vivo institucional

A tela ou seção “Ao vivo” simula o acompanhamento do transporte institucional.

Importante:

```txt
Não há GPS.
Não há rastreamento em tempo real.
Não há API externa.
```

O protótipo calcula localmente a próxima passagem com base nas janelas da MinhaJardineira e no horário atual do navegador.

Exemplo:

```txt
Jardineira 1
Metrô → Campus

Em janela de operação
Próxima passagem: 07:30
Sai em 8 min
A cada 15 min

Sem rastreamento real
```

---

### Localização

A área de localização apresenta rotas demonstrativas para chegar ao campus ou sair dele.

O objetivo é mostrar como o CampusMove pode orientar o usuário em cenários de mobilidade acadêmica.

Exemplos de contexto:

- chegar ao IFCE Maracanaú;
- sair do campus;
- combinar transporte institucional e Linha Sul;
- visualizar estimativas de tempo;
- identificar riscos de atraso.

---

### Eventos

A tela de eventos simula atividades acadêmicas que exigem deslocamento.

Cada evento pode ser associado a uma rota demonstrativa.

O sistema pode exibir:

- horário do evento;
- rota sugerida;
- próxima passagem;
- chegada estimada;
- análise “Chego a tempo?”;
- Plano B demonstrativo.

---

### Chego a tempo?

O recurso “Chego a tempo?” calcula se o usuário consegue chegar antes do horário alvo.

Estados possíveis:

```txt
Chega a tempo
Chega com pouca margem
Risco de atraso
Não chega a tempo
Operação encerrada hoje
Análise indisponível
```

Quando a margem é negativa, o protótipo não mostra números crus como:

```txt
Margem: -252 min
```

Em vez disso, mostra mensagens humanas:

```txt
Evento já começou há 4h12
```

ou:

```txt
Atraso estimado: 18 min
```

---

### Plano B demonstrativo

O Plano B aparece quando o usuário está em risco de atraso, sem operação disponível ou com evento já iniciado.

Exemplos de Plano B:

- transporte público + caminhada;
- saída antecipada;
- consultar transporte institucional;
- rota alternativa demonstrativa.

O Plano B é uma sugestão demonstrativa, não uma rota oficial.

---

## MinhaJardineira no protótipo

A **MinhaJardineira** representa o transporte institucional do MVP IFCE Maracanaú.

No protótipo, ela é modelada por:

- janelas operacionais;
- frequência aproximada;
- passagens calculadas;
- duração estimada;
- cálculo local da próxima passagem.

### Modelo usado

```txt
Janela operacional:
Período em que a Jardineira está operando.

Frequência:
Intervalo aproximado entre passagens dentro da janela.

Duração estimada:
Tempo aproximado do deslocamento entre estação e campus.
```

### Exemplo de janela

```txt
Início: 07:00
Término: 08:15
Percurso: Metrô → Campus
Frequência: 15 minutos
Duração estimada: 8 minutos
```

### Passagens geradas

```txt
07:00
07:15
07:30
07:45
08:00
08:15
```

---

## Linha Sul no protótipo

O protótipo também utiliza horários estáticos da **Linha Sul** como apoio à mobilidade.

Esses horários são tratados como dados estáticos extraídos de grade pública.

Importante:

```txt
Não é integração em tempo real.
Não é API oficial.
Não é rastreamento.
```

A Linha Sul é usada principalmente para apoiar o contexto do IFCE Maracanaú, considerando estações como:

- Virgílio Távora;
- Maracanaú;
- Parangaba.

---

## Honestidade dos dados

O protótipo trabalha com três níveis de dados.

### 1. Janela operacional da MinhaJardineira

Dados informados pela rotina do campus e tratados como janelas aproximadas.

Mensagem usada:

```txt
Janela operacional informada pela rotina do campus.
Pode variar conforme operação do dia.
Sem rastreamento em tempo real.
```

### 2. Grade pública estática

Horários extraídos de grade pública e cadastrados estaticamente no protótipo.

Mensagem usada:

```txt
Horário extraído de grade pública.
Não é integração em tempo real.
```

### 3. Estimativa demonstrativa

Usada quando não há dado real cadastrado para determinado cenário.

Mensagem usada:

```txt
Estimativa demonstrativa.
Sem dado real cadastrado para este horário/estação.
```

---

## Limitações atuais

Este protótipo não possui:

- backend;
- banco de dados;
- autenticação real;
- painel administrativo;
- painel do motorista;
- rastreamento GPS;
- integração oficial em tempo real;
- consumo de APIs externas;
- notificações push;
- aplicativo nativo Android/iOS;
- mapa real com geolocalização.

A proposta atual é demonstrar a experiência e a lógica do produto.

---

## Estado atual

O `prototype-html` está em estado de protótipo funcional.

O foco desta versão é:

```txt
demonstrar o produto
validar a ideia
apresentar a experiência
simular regras de mobilidade
preparar a evolução técnica futura
```

---

## Arquitetura front-end

O protótipo foi organizado com separação entre:

```txt
HTML
CSS
JavaScript
dados
módulos
estado
utilitários
assets
```

A estrutura modular facilita futuras migrações para uma aplicação mais robusta.

---

## Organização dos arquivos JavaScript

### `js/data/`

Contém dados do protótipo.

Exemplos:

- instituições;
- eventos;
- rotas;
- horários;
- janelas da MinhaJardineira;
- horários estáticos da Linha Sul.

### `js/modules/`

Contém a lógica das telas.

Exemplos:

- Home;
- Horários;
- Localização;
- Eventos;
- Perfil;
- Instituição.

### `js/state.js`

Mantém o estado compartilhado do protótipo.

### `js/router.js`

Controla a navegação entre telas.

### `js/utils.js`

Contém funções auxiliares.

---

## Organização dos arquivos CSS

A estilização está separada por responsabilidade.

Exemplos:

- estilos base;
- layout;
- componentes;
- telas;
- mapas simulados;
- acessibilidade.

---

## Assets visuais

O protótipo usa assets locais para identidade visual.

Exemplo:

```txt
assets/vehicles/jardineira.png
```

Essa imagem representa visualmente a MinhaJardineira no protótipo.

Importante:

```txt
Imagem ilustrativa.
Não é logo oficial.
Não representa ativo oficial do IFCE.
```

---

## Padrões importantes para manutenção

Ao alterar este protótipo, preserve as seguintes regras:

- não transformar o protótipo em backend;
- não adicionar API sem planejamento;
- não inventar dados oficiais;
- não chamar dados demonstrativos de oficiais;
- não afirmar rastreamento GPS;
- não reatribuir o objeto global de estado;
- não duplicar nomes de funções auxiliares;
- não quebrar a navegação mobile;
- não remover avisos de honestidade dos dados;
- não trocar MinhaJardineira por CampusMove;
- lembrar que MinhaJardineira é serviço do MVP, não o produto inteiro.

---

## Como testar após alterações

Após qualquer alteração, executar o protótipo localmente:

```bash
cd apps/prototype-html
python3 -m http.server 5505
```

Abrir:

```txt
http://127.0.0.1:5505/index.html?v=teste
```

Testar o fluxo principal:

```txt
Home
Horários
Selecionar janela da MinhaJardineira
Ao vivo
Localização
Eventos
Ver rota
Chego a tempo?
Plano B
Perfil
Seletor SaaS
```

---

## Checklist visual

Antes de considerar o protótipo pronto, verificar:

```txt
[ ] Home carrega corretamente
[ ] Horários aparecem como janelas operacionais
[ ] Passagens são geradas de 15 em 15 minutos
[ ] Ao vivo calcula próxima passagem
[ ] Jardineira aparece como imagem ilustrativa
[ ] Localização funciona
[ ] Eventos funcionam
[ ] Chego a tempo? não exibe margem negativa crua
[ ] Plano B aparece quando necessário
[ ] Bottom nav não cobre conteúdo
[ ] Não existe scroll horizontal indesejado
[ ] Textos deixam claro que não há rastreamento real
[ ] Console não apresenta erro crítico
```

---

## Próximos passos técnicos

Possíveis evoluções futuras:

- transformar o protótipo em PWA;
- migrar para framework front-end;
- criar backend com Java Spring Boot;
- modelar banco de dados;
- criar autenticação;
- cadastrar instituições reais;
- criar painel administrativo;
- criar painel de operação/motorista;
- integrar dados oficiais;
- adicionar geolocalização com consentimento;
- validar com usuários reais.

---

## Relação com o CampusMove completo

Este protótipo é apenas uma parte do CampusMove.

```txt
CampusMove = plataforma SaaS de mobilidade acadêmica
MinhaJardineira = serviço institucional usado no MVP
prototype-html = protótipo funcional front-end
```

O produto completo poderá atender múltiplas instituições, múltiplos campi e diferentes serviços de transporte.

---

## Observação final

Este diretório deve ser tratado como a versão demonstrativa funcional do CampusMove.

Ele não representa o produto final, mas demonstra com clareza a proposta, a experiência e as principais regras de mobilidade acadêmica imaginadas para a plataforma.