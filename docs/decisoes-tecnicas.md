
Decisões Técnicas — CampusMove

Objetivo

Este documento registra decisões técnicas importantes tomadas durante a construção do CampusMove.

A ideia é preservar o raciocínio por trás do projeto e evitar mudanças futuras desalinhadas.


---

1. Começar com protótipo HTML

O projeto começou com um protótipo em HTML, CSS e JavaScript.

Motivos:

rapidez para validar a ideia;

facilidade de apresentação;

baixo custo técnico inicial;

foco em experiência do usuário;

simplicidade para testar fluxos;

independência de backend.



---

2. Não criar backend no início

O backend ficou para uma etapa futura.

Motivos:

o objetivo inicial era demonstrar o produto;

ainda havia regras de negócio sendo validadas;

criar backend cedo demais aumentaria a complexidade;

o protótipo precisava ser simples de executar.



---

3. Usar dados estáticos

Os dados do protótipo são estáticos.

Isso permite simular:

instituições;

campi;

rotas;

eventos;

horários;

janelas operacionais.


Sem depender de servidor, banco ou API.


---

4. Separar CampusMove de MinhaJardineira

Uma decisão central foi separar claramente:

CampusMove = plataforma SaaS
MinhaJardineira = serviço institucional do MVP

Isso evita limitar o produto a um único campus ou transporte.


---

5. Modelar a Jardineira como janelas operacionais

A MinhaJardineira foi modelada como janelas de operação com passagens de 15 em 15 minutos.

Essa decisão representa melhor a rotina observada do serviço.

Exemplo:

07:00–08:15
Metrô → Campus
A cada 15 minutos


---

6. Não usar GPS

O protótipo não usa GPS.

Motivos:

não há integração real;

não há backend;

não há autorização de localização;

evitar falsa promessa de tempo real;

preservar honestidade técnica.


A área “Ao vivo” usa cálculo local com base no horário do navegador.


---

7. Não usar API externa

O protótipo não consome APIs externas.

Motivos:

manter execução simples;

evitar dependência de conexão;

evitar promessa de integração oficial;

manter o projeto estático.



---

8. Usar JavaScript modular

O código foi organizado em módulos para facilitar manutenção.

Exemplos:

módulos de tela;

dados separados;

utilitários;

estado compartilhado;

roteamento.



---

9. Manter honestidade dos dados

O projeto diferencia:

janela operacional informada;

horário extraído de grade pública;

estimativa demonstrativa.


Essa decisão evita apresentar dados simulados como oficiais.


---

10. Manter visual mobile-first

O protótipo foi pensado como web app mobile-first.

Motivos:

mobilidade é uso de celular;

estudantes provavelmente acessariam pelo smartphone;

apresentação fica mais próxima de aplicativo;

facilita futura evolução para PWA.



---

11. Não transformar em app nativo agora

A decisão foi manter como web app.

Motivos:

app nativo exigiria mais tempo;

deploy web é mais simples;

PWA pode ser evolução intermediária;

o foco atual é apresentação do produto.



---

12. Usar Java/Spring como visão futura

A arquitetura futura considera Java Spring Boot como possibilidade para backend.

Motivos:

boa estrutura para APIs;

uso comum em sistemas corporativos;

compatível com arquitetura em camadas;

adequado para produto SaaS.



---

Resumo

As decisões técnicas priorizam:

simplicidade;

clareza;

honestidade;

evolução gradual;

foco no produto;

segurança para apresentação. 
