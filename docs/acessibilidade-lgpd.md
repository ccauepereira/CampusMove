Acessibilidade e LGPD — CampusMove

Objetivo

Este documento descreve cuidados de acessibilidade e proteção de dados considerados no protótipo do CampusMove.

O projeto ainda é um protótipo front-end, mas já adota princípios importantes para evolução futura.


---

Acessibilidade

O CampusMove busca oferecer uma experiência clara e acessível.

Pontos considerados:

interface mobile-first;

textos objetivos;

botões com áreas clicáveis;

contraste visual;

navegação por telas simples;

status descritos em texto;

uso responsável de cores;

redução de excesso visual.



---

Clareza textual

As informações principais devem ser compreensíveis.

Exemplo:

Em vez de mostrar apenas:

-252 min

O sistema deve mostrar:

Evento já começou há 4h12

Isso melhora a compreensão e reduz erro de interpretação.


---

Status não dependente apenas de cor

O protótipo não deve depender apenas de cor para indicar estados.

Exemplo correto:

Status: Risco de atraso

A cor pode reforçar, mas o texto precisa explicar.


---

Mobilidade e inclusão

O CampusMove pode ajudar usuários que precisam planejar deslocamento com antecedência.

Isso inclui:

estudantes com horários apertados;

visitantes que não conhecem o campus;

participantes de eventos;

pessoas que dependem de transporte institucional;

usuários que precisam de previsibilidade.



---

LGPD

A LGPD trata da proteção de dados pessoais.

O protótipo atual não coleta dados reais sensíveis.

Atualmente, o projeto não possui:

login real;

banco de dados;

coleta de CPF;

coleta de matrícula;

rastreamento GPS;

armazenamento de localização;

envio de dados para servidor.



---

Localização

O protótipo não acessa localização real do usuário.

Qualquer informação de rota ou horário é demonstrativa ou calculada localmente.

Mensagem importante:

Sem rastreamento real.


---

Dados pessoais

Como o projeto ainda não possui autenticação real, os nomes e perfis usados são demonstrativos.

Em uma versão futura, será necessário definir:

base legal;

política de privacidade;

consentimento;

retenção de dados;

exclusão de dados;

controle de acesso;

segurança da informação.



---

Dados de transporte

Os horários usados no protótipo podem ter origem em:

rotina do campus;

grade pública;

estimativa demonstrativa.


Esses dados não devem ser tratados como integração oficial em tempo real.


---

Cuidados futuros

Em uma versão completa, o CampusMove deverá considerar:

autenticação segura;

criptografia;

controle de permissões;

consentimento para localização;

minimização de dados;

logs responsáveis;

política de privacidade;

acessibilidade WCAG;

testes com usuários reais.



---

Resumo

O protótipo atual busca ser claro, honesto e seguro.

Ele não coleta dados reais sensíveis e não realiza rastreamento.

A evolução futura deverá incorporar requisitos formais de acessibilidade, privacidade e segurança. 
