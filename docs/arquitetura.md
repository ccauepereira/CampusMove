Arquitetura — CampusMove

Visão geral

O CampusMove é planejado como uma plataforma SaaS para mobilidade acadêmica.

A versão atual é um protótipo front-end estático, mas a arquitetura futura prevê uma aplicação completa com frontend, backend, banco de dados e integrações.


---

Arquitetura planejada



A imagem acima representa uma visão futura da arquitetura, com backend em Java Spring Boot e organização em camadas.


---

Arquitetura atual

Atualmente, o projeto possui:

apps/prototype-html/

Essa pasta contém o protótipo funcional em:

HTML;

CSS;

JavaScript modular;

assets locais;

dados estáticos.


Não existe backend funcional nesta etapa.


---

Estrutura geral

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


---

Camada de protótipo

O prototype-html é responsável por demonstrar:

navegação;

experiência mobile;

horários;

rotas;

eventos;

cálculo local;

visual do produto;

lógica da MinhaJardineira.



---

Organização do prototype-html

apps/prototype-html/
├── assets/
├── css/
├── docs/
├── js/
├── index.html
└── README.md


---

Camada de dados no protótipo

Os dados ficam em arquivos JavaScript dentro de:

apps/prototype-html/js/data/

Exemplos:

instituições;

rotas;

eventos;

horários;

janelas da MinhaJardineira;

horários estáticos da Linha Sul.



---

Camada de módulos

A lógica das telas fica em:

apps/prototype-html/js/modules/

Exemplos:

Home;

Horários;

Localização;

Eventos;

Perfil;

Instituição.



---

Estado da aplicação

O estado compartilhado fica em:

js/state.js

Regras importantes:

não reatribuir o objeto global de estado;

alterar propriedades de forma controlada;

evitar efeitos colaterais desnecessários.



---

Roteamento interno

O roteamento entre telas é feito no front-end por JavaScript.

Arquivo principal:

js/router.js


---

Arquitetura futura

A evolução planejada pode incluir:

Frontend
↓
API REST
↓
Backend Java Spring Boot
↓
Banco de dados
↓
Integrações externas


---

Backend futuro

O backend poderá ser responsável por:

autenticação;

cadastro de instituições;

cadastro de campi;

cadastro de rotas;

cadastro de horários;

gerenciamento de eventos;

painel administrativo;

integração com dados oficiais;

regras de negócio centralizadas.



---

Banco de dados futuro

Um banco relacional poderá armazenar:

usuários;

instituições;

campi;

perfis;

rotas;

veículos;

horários;

eventos;

logs operacionais;

configurações por instituição.



---

Integrações futuras

Possíveis integrações:

dados oficiais de transporte;

APIs públicas;

serviços de mapas;

geolocalização com consentimento;

notificações;

painel de operação institucional.



---

Por que começar com protótipo estático?

O protótipo estático permite:

validar a experiência;

apresentar a ideia rapidamente;

testar regras de negócio;

simular fluxos;

reduzir complexidade inicial;

separar produto de implementação final.



---

Decisão arquitetural importante

O CampusMove não deve ser confundido com a MinhaJardineira.

CampusMove = plataforma
MinhaJardineira = serviço do MVP

Essa separação permite que a solução seja escalada para outras instituições e outros serviços de mobilidade.


---

Resumo

A arquitetura atual é simples e focada em prototipação.

A arquitetura futura busca transformar o CampusMove em uma solução SaaS completa, com backend, dados persistentes, integrações oficiais e suporte multi-instituição
