# Contributing to CampusMove

Obrigado por contribuir com o **CampusMove**.

Este documento define um fluxo simples e seguro para colaboração no projeto.

---

## Objetivo

Queremos manter o repositório:

- organizado;
- compreensível;
- coerente com a proposta do projeto;
- seguro para evolução futura.

---

## Antes de contribuir

Leia primeiro:

- `README.md`
- `AGENTS.md`
- `docs/visao-geral.md`
- `docs/arquitetura.md`

Isso evita mudanças desalinhadas com o projeto.

---

## Tipos de contribuição aceitos

Você pode contribuir com:

- documentação;
- melhoria da organização do repositório;
- ajustes no protótipo HTML;
- correções de bugs;
- melhorias de acessibilidade;
- melhorias visuais coerentes;
- dados demonstrativos melhor organizados;
- refatorações pequenas e seguras.

---

## Tipos de contribuição que exigem cuidado extra

Esses temas devem ser tratados com mais cautela:

- mudanças grandes de arquitetura;
- backend novo;
- autenticação;
- integração externa;
- rastreamento em tempo real;
- alteração de identidade do produto;
- reestruturação total do protótipo.

---

## Fluxo recomendado

### 1. Crie uma branch
Exemplos:

```bash
git checkout -b docs/readme-melhorias
git checkout -b fix/horarios-prototipo
git checkout -b feat/melhoria-localizacao
```

---

### 2. Faça alterações pequenas e claras
Evite misturar muita coisa no mesmo commit.

Exemplo bom:
- um commit para README;
- outro para CONTRIBUTING;
- outro para ajuste no protótipo.

---

### 3. Teste o que foi alterado
No caso do protótipo HTML:

```bash
cd apps/prototype-html
python3 -m http.server 5505
```

Acesse:

```txt
http://127.0.0.1:5505/index.html
```

Verifique:

- se a Home abre;
- se a navegação funciona;
- se Horários funciona;
- se Eventos funciona;
- se Localização funciona;
- se não há erro grave no console.

---

### 4. Faça commits descritivos
Use mensagens objetivas.

Exemplos:

```bash
git commit -m "docs: adiciona contributing guide"
git commit -m "fix: corrige texto de horários demonstrativos"
git commit -m "feat: melhora visual da tela de localização"
```

---

### 5. Abra Pull Request
Ao abrir um PR, informe:

- o que foi alterado;
- por que foi alterado;
- quais arquivos principais foram afetados;
- se algo precisa de revisão especial.

---

## Convenções do projeto

### Sobre o produto
Lembre sempre:

- **CampusMove** é a plataforma.
- **MinhaJardineira** é o serviço do MVP.

Não confundir os dois.

---

### Sobre os dados
Não apresentar como real algo que é apenas demonstrativo.

Evite frases que impliquem:

- integração oficial;
- GPS em tempo real;
- horários ao vivo reais;
- backend funcional, se ele ainda não existir.

---

### Sobre o código
Prefira:

- clareza;
- modularidade;
- mudanças pequenas;
- nomes consistentes;
- comentários apenas quando agregarem valor.

Evite:

- duplicação desnecessária;
- refatorações gigantes sem motivo;
- dependências sem necessidade;
- mudanças que quebrem o protótipo aprovado.

---

## Padrão de qualidade esperado

Antes de enviar contribuição, confira:

- [ ] a estrutura do projeto continua organizada;
- [ ] a alteração respeita o escopo;
- [ ] não foi prometida funcionalidade inexistente;
- [ ] a documentação continua coerente;
- [ ] o protótipo ainda funciona;
- [ ] os textos continuam claros para apresentação.

---

## Boas práticas de documentação

Se editar arquivos Markdown:

- use títulos claros;
- organize seções;
- evite textos vagos;
- preserve coerência com a realidade do projeto;
- prefira explicar do que exagerar.

---

## Comunicação

Quando descrever uma mudança, procure responder:

1. O que mudou?
2. Por que mudou?
3. Isso afeta qual parte do projeto?
4. Há algum risco?
5. O que deve ser testado?

---

## Resumo

Contribuir com o CampusMove significa:

- melhorar sem bagunçar;
- organizar sem exagerar;
- evoluir sem perder o escopo;
- documentar com honestidade técnica.

Obrigado por colaborar.