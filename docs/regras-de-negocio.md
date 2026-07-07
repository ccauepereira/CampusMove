Regras de Negócio — CampusMove
Objetivo
Este documento descreve as principais regras de negócio usadas no protótipo do CampusMove.
As regras atuais são voltadas ao MVP do IFCE Campus Maracanaú, com foco no serviço MinhaJardineira.
Conceitos principais
CampusMove
Plataforma SaaS de mobilidade acadêmica.
MinhaJardineira
Serviço institucional usado no MVP do IFCE Campus Maracanaú.
Linha Sul
Transporte público usado como apoio ao deslocamento no protótipo.
Evento acadêmico
Atividade cadastrada de forma demonstrativa para simular deslocamento até eventos.
Regra 1 — MinhaJardineira como janela operacional
A MinhaJardineira não é tratada apenas como horários isolados.
Ela é modelada como janelas operacionais.
Exemplo:
07:00–08:15
Metrô → Campus
A cada 15 min
Isso significa que, dentro dessa janela, o transporte passa em intervalos aproximados.
Regra 2 — Frequência de 15 minutos
Dentro de cada janela operacional, o protótipo gera passagens a cada 15 minutos.
Exemplo:
Janela: 07:00–08:15

Passagens:
07:00
07:15
07:30
07:45
08:00
08:15
Se uma janela não fechar exatamente em múltiplos de 15 minutos, o sistema gera apenas horários dentro do limite.
Exemplo:
Janela: 11:40–12:20

Passagens:
11:40
11:55
12:10
O horário 12:25 não é gerado porque passa do fim da janela.
Regra 3 — Duração estimada
A duração estimada entre estação e campus é tratada separadamente da janela operacional.
Exemplo:
Passagem: 07:00
Duração estimada: 8 min
Chegada estimada: 07:08
A janela indica o período de operação.
A duração indica o tempo aproximado de deslocamento.
Regra 4 — Ao vivo sem GPS
A área “Ao vivo” não usa GPS.
Ela calcula a próxima passagem com base em:
horário atual do navegador;
janelas operacionais cadastradas;
frequência de 15 minutos;
sentido da janela.
Exemplo:
Jardineira 1
Metrô → Campus
Próxima passagem: 07:30
Sai em 8 min
Sem rastreamento real
Regra 5 — Linha Sul como dado estático
Os horários da Linha Sul são tratados como dados estáticos extraídos de grade pública.
Eles não representam integração em tempo real.
Mensagem recomendada:
Horário extraído de grade pública.
Não é integração em tempo real.
Regra 6 — Dados demonstrativos
Quando não há dado real cadastrado para determinado cenário, o protótipo pode usar uma estimativa demonstrativa.
Mensagem recomendada:
Estimativa demonstrativa.
Sem dado real cadastrado para este horário/estação.
Regra 7 — Chego a tempo?
O recurso “Chego a tempo?” calcula a margem entre a chegada estimada e o horário alvo.
Estados possíveis:
Chega a tempo
Chega com pouca margem
Risco de atraso
Não chega a tempo
Operação encerrada hoje
Análise indisponível
Critérios sugeridos:
margem >= 15 min       → Chega a tempo
margem entre 5 e 14    → Chega com pouca margem
margem entre 0 e 4     → Risco de atraso
margem < 0             → Não chega a tempo
Regra 8 — Margem negativa
O sistema não deve exibir margem negativa crua.
Errado:
Margem: -252 min
Correto:
Evento já começou há 4h12
ou:
Atraso estimado: 18 min
Regra 9 — Plano B
O Plano B aparece quando:
há risco de atraso;
o usuário não chega a tempo;
a operação foi encerrada;
não há transporte disponível;
a análise está indisponível.
Exemplos de Plano B:
transporte público + caminhada;
saída antecipada;
consultar transporte institucional;
rota alternativa demonstrativa.
O Plano B não é rota oficial.
Regra 10 — Honestidade dos dados
O protótipo deve manter três níveis de honestidade:
1. Janela operacional da MinhaJardineira
Janela operacional informada pela rotina do campus.
Pode variar conforme operação do dia.
Sem rastreamento em tempo real.
2. Grade pública estática
Horário extraído de grade pública.
Não é integração em tempo real.
3. Estimativa demonstrativa
Estimativa demonstrativa.
Sem dado real cadastrado para este horário/estação.
Regra 11 — Não prometer sistema oficial
O protótipo não deve afirmar:
sistema oficial do IFCE;
integração oficial com Metrofor;
GPS em tempo real;
garantia de chegada;
backend funcional;
banco de dados ativo;
autenticação real.
Resumo
As regras de negócio do CampusMove priorizam:
clareza;
segurança;
honestidade;
utilidade acadêmica;
apoio à decisão;
separação entre dado real, dado demonstrativo e cálculo local.