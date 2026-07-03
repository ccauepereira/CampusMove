// BRUNO: estado central do protótipo para perfil, instituição e campus.
const appState = {
  currentScreen: 'splash',
  history: ['splash'],
  role: null,
  selectedType: null,
  selectedInstitution: null,
  selectedCampus: null,
  userName: null,
  accessMode: null,
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
    simpleLanguage: false
  },
  locationMode: 'directions',
  routeDirection: 'inbound',
  routeOrigin: 'Maraponga',
  routeDestination: 'IFCE Campus Maracanaú',
  selectedScenario: 'maraponga-ifce',
  selectedEventDestination: null,
  departureEstimateResult: null
};

const roles = [
  { id: 'Aluno', icon: '🎓', title: 'Aluno', description: 'Acompanhe horários, rotas e eventos do seu campus.' },
  { id: 'Servidor', icon: '🏛️', title: 'Servidor', description: 'Acesse informações institucionais e rotas do campus.' },
  { id: 'Motorista', icon: '🚌', title: 'Motorista', description: 'Acesso restrito para operação da Jardineira.' },
  { id: 'Administrador', icon: '🛡️', title: 'Administrador', description: 'Gestão restrita para equipe autorizada.' },
  { id: 'Visitante', icon: '📍', title: 'Visitante', description: 'Rotas públicas e eventos sem login acadêmico.' }
];

const environmentTypes = [
  { id: 'if', label: 'Instituto Federal' },
  { id: 'publica', label: 'Universidade Pública' },
  { id: 'privada', label: 'Instituição Privada' },
  { id: 'outra', label: 'Outra instituição' }
];

// BRUNO: dataset SaaS demonstrativo; apenas IFCE Maracanaú libera o MVP.
const institutions = [
  { id: 'ifce', acronym: 'IFCE', name: 'Instituto Federal do Ceará', type: 'Instituto Federal', status: 'Ambiente ativo', service: 'MinhaJardineira', logo: 'assets/assets-logo/ifce.png', fallback: 'IFCE', alt: 'Logo do IFCE', keywords: ['IFCE', 'IF', 'Instituto Federal', 'Ceará', 'Maracanaú'], campuses: [
    { id: 'maracanau', name: 'Maracanaú', status: 'MVP ativo', service: 'MinhaJardineira ativo', active: true, keywords: ['Maracanaú', 'IFCE Maracanaú', 'Campus Maracanaú'] },
    { id: 'fortaleza', name: 'Fortaleza', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Fortaleza', 'IFCE Fortaleza'] },
    { id: 'caucaia', name: 'Caucaia', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Caucaia', 'IFCE Caucaia'] },
    { id: 'sobral', name: 'Sobral', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Sobral', 'IFCE Sobral'] }
  ] },
  { id: 'ifsp', acronym: 'IFSP', name: 'Instituto Federal de São Paulo', type: 'Instituto Federal', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: '', fallback: 'IFSP', alt: 'Logo do IFSP', keywords: ['IFSP', 'IF', 'Instituto Federal', 'São Paulo'], campuses: [
    { id: 'campinas', name: 'Campinas', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Campinas', 'IFSP Campinas'] },
    { id: 'araraquara', name: 'Araraquara', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Araraquara', 'IFSP Araraquara'] },
    { id: 'braganca', name: 'Bragança Paulista', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Bragança Paulista', 'IFSP Bragança'] }
  ] },
  { id: 'ifpb', acronym: 'IFPB', name: 'Instituto Federal da Paraíba', type: 'Instituto Federal', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: '', fallback: 'IFPB', alt: 'Logo do IFPB', keywords: ['IFPB', 'IF', 'Instituto Federal', 'Paraíba'], campuses: [
    { id: 'joao-pessoa', name: 'João Pessoa', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['João Pessoa', 'IFPB João Pessoa'] },
    { id: 'campina-grande', name: 'Campina Grande', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Campina Grande', 'IFPB Campina'] },
    { id: 'cabedelo', name: 'Cabedelo', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Cabedelo', 'IFPB Cabedelo'] }
  ] },
  { id: 'ufc', acronym: 'UFC', name: 'Universidade Federal do Ceará', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/ufc.png', fallback: 'UFC', alt: 'Logo da UFC', keywords: ['UFC', 'Universidade Federal', 'Universidade Pública', 'Ceará', 'Pici', 'Benfica'], campuses: [
    { id: 'pici', name: 'Pici', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Pici', 'UFC Pici', 'Campus do Pici'] },
    { id: 'benfica', name: 'Benfica', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Benfica', 'UFC Benfica'] }
  ] },
  { id: 'uece', acronym: 'UECE', name: 'Universidade Estadual do Ceará', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/uece.png', fallback: 'UECE', alt: 'Logo da UECE', keywords: ['UECE', 'Universidade Estadual', 'Universidade Pública', 'Itaperi'], campuses: [
    { id: 'itaperi', name: 'Itaperi', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Itaperi', 'UECE Itaperi'] }
  ] },
  { id: 'unilab', acronym: 'UNILAB', name: 'Universidade da Integração Internacional da Lusofonia Afro-Brasileira', type: 'Universidade Pública', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/unilab.png', fallback: 'UNILAB', alt: 'Logo da UNILAB', keywords: ['UNILAB', 'Universidade Pública', 'Internacional', 'Integração', 'Redenção', 'Acarape'], campuses: [
    { id: 'redencao', name: 'Redenção/Acarape', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Redenção', 'Acarape', 'UNILAB Redenção', 'UNILAB Acarape'] }
  ] },
  { id: 'fb', acronym: 'FB Uni', name: 'Centro Universitário Farias Brito', type: 'Instituição Privada', status: 'Ambiente em preparação', service: 'Serviços em preparação', logo: 'assets/assets-logo/fb.png', fallback: 'FB', alt: 'Logo da FB Uni', keywords: ['FB', 'FB Uni', 'Farias Brito', 'Centro Universitário', 'Instituição Privada', 'Particular'], campuses: [
    { id: 'fortaleza', name: 'Fortaleza', status: 'Ambiente em preparação', service: 'Serviços em preparação', keywords: ['Fortaleza', 'FB Uni Fortaleza', 'Farias Brito Fortaleza'] }
  ] }
];


// BRUNO: rotas demonstrativas sem API externa.
const transitLines = {
  'metrofor-linha-sul': { id: 'metrofor-linha-sul', name: 'Linha Sul', mode: 'metro', operatorLabel: 'Metro/VLT', colorToken: 'line-sul', operation: { start: '05:30', end: '23:00' }, headwayMinutes: 20, confidence: 'media', note: 'Estimativa por intervalo médio, sem integração oficial', stops: ['Carlito Benevides', 'Virgílio Távora', 'Maracanaú', 'Parangaba', 'Benfica', 'Chico da Silva'] },
  'metrofor-linha-oeste': { id: 'metrofor-linha-oeste', name: 'Linha Oeste', mode: 'metro', operatorLabel: 'Metro/VLT', colorToken: 'line-oeste', operation: { start: '05:30', end: '23:00' }, headwayMinutes: 30, confidence: 'media', note: 'Estimativa por intervalo médio, sem integração oficial', stops: ['Caucaia', 'Antônio Bezerra', 'Álvaro Weyne', 'Moura Brasil', 'Chico da Silva'] },
  'vlt-parangaba-mucuripe': { id: 'vlt-parangaba-mucuripe', name: 'VLT Parangaba-Mucuripe', mode: 'vlt', operatorLabel: 'Metro/VLT', colorToken: 'line-nordeste', operation: { start: '05:30', end: '23:00' }, headwayMinutes: 30, confidence: 'media', note: 'Estimativa por intervalo médio, sem integração oficial', stops: ['Parangaba', 'Montese', 'Vila União', 'Borges de Melo', 'São João do Tauape', 'Pontes Vieira', 'Antônio Sales', 'Papicu', 'Mucuripe', 'Iate'] },
  'vlt-aeroporto': { id: 'vlt-aeroporto', name: 'VLT Aeroporto', mode: 'vlt', operatorLabel: 'Metro/VLT', colorToken: 'line-aeroporto', operation: { start: '07:00', end: '17:00' }, headwayMinutes: 30, confidence: 'media', note: 'Estimativa por intervalo médio, sem integração oficial', stops: ['Aeroporto', 'Expedicionários', 'Parangaba'] }
};

const campusShuttle = { id: 'ifce-jardineira', name: 'Jardineira IFCE', mode: 'shuttle', operation: { start: '07:00', end: '18:00' }, headwayMinutes: 15, confidence: 'alta', route: ['Estação Virgílio Távora', 'IFCE Campus Maracanaú'], vehicles: ['Jardineira 1', 'Jardineira 2'], note: 'Regra institucional demonstrativa do protótipo' };

const routeScenarios = {
  inbound: [
    { id: 'bruno-ifce', label: 'Rota demonstrativa do aluno Bruno', direction: 'inbound', origin: 'Cenário Bruno — aluno mora longe do campus', destination: 'IFCE Campus Maracanaú', routeType: 'Indo para o IFCE', mainRoute: 'Cenário Bruno → Terminal de integração → Metrô Linha Sul → Estação Virgílio Távora → Jardineira IFCE', analysis: 'Aluno mora longe do campus.', estimatedTime: '1h10 a 1h35', needsBus: true, needsMetro: true, needsVlt: false, needsJardineira: true, needsIntegration: true, risk: 'medio', riskLabel: 'Risco médio — conexão exige atenção', steps: [{ mode: 'walk', label: 'Caminhada', from: 'Cenário Bruno', to: 'Ponto de ônibus próximo', durationText: '6 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Ônibus urbano demonstrativo', from: 'Ponto de ônibus próximo', to: 'Terminal de integração', durationText: '25 min', confidence: 'baixa' }, { mode: 'transfer', label: 'Integração', from: 'Terminal de integração', to: 'Estação de metrô', durationText: '10 min', confidence: 'media' }, { mode: 'metro', label: 'Metrô', line: 'Linha Sul', lineId: 'metrofor-linha-sul', from: 'Estação de metrô', to: 'Estação Virgílio Távora', durationText: '20 min', confidence: 'media' }, { mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'Estação Virgílio Távora', to: 'IFCE Campus Maracanaú', durationText: '8 min', confidence: 'alta' }] },
    { id: 'maraponga-ifce', label: 'Rota direta recomendada', direction: 'inbound', origin: 'Maraponga', destination: 'IFCE Campus Maracanaú', routeType: 'Indo para o IFCE', mainRoute: 'Linha 32201 - Conjunto Novo Maracanaú', analysis: 'A rota segue pela região da Av. Godofredo Maciel, passa pela Av. Dr. Mendel Steinbruch e entra em Maracanaú pela Av. Parque Central.', estimatedTime: '30 a 40 min', needsBus: true, needsMetro: false, needsVlt: false, needsJardineira: false, needsIntegration: false, risk: 'none', riskLabel: '', steps: [{ mode: 'walk', label: 'Caminhada', from: 'Maraponga', to: 'Ponto na região da Av. Godofredo Maciel', durationText: '5 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Linha 32201 - Conjunto Novo Maracanaú', from: 'Av. Godofredo Maciel', to: 'Próximo ao IFCE Campus Maracanaú', durationText: '30 a 40 min', confidence: 'baixa' }, { mode: 'walk', label: 'Caminhada', from: 'Ponto próximo ao campus', to: 'IFCE Campus Maracanaú', durationText: '3 min', confidence: 'media' }] },
    { id: 'timbo-ifce', label: 'Rota curta recomendada', direction: 'inbound', origin: 'Timbó', destination: 'IFCE Campus Maracanaú', routeType: 'Indo para o IFCE', mainRoute: 'Linha 002 - Linha Verde ou 32201 - Conjunto Novo Maracanaú', analysis: 'O Timbó fica próximo ao Jereissati/Distrito Industrial. A rota é curta e pode usar linhas que passam pela Av. Contorno Norte ou pela Av. Parque Central.', estimatedTime: '10 a 15 min', needsBus: true, needsMetro: false, needsVlt: false, needsJardineira: false, needsIntegration: false, risk: 'none', riskLabel: '', steps: [{ mode: 'walk', label: 'Caminhada', from: 'Timbó', to: 'Ponto próximo no Timbó', durationText: '4 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Linha 002 - Linha Verde ou 32201', from: 'Timbó', to: 'Próximo ao IFCE Campus Maracanaú', durationText: '10 a 15 min', confidence: 'baixa' }, { mode: 'walk', label: 'Caminhada', from: 'Ponto próximo ao campus', to: 'IFCE Campus Maracanaú', durationText: '3 min', confidence: 'media' }] },
    { id: 'caucaia-ifce', label: 'Rota integrada recomendada', direction: 'inbound', origin: 'Centro de Caucaia / Praça da Matriz', destination: 'IFCE Campus Maracanaú', routeType: 'Indo para o IFCE', mainRoute: 'Caucaia → Antônio Bezerra → Parangaba → Metrô Linha Sul → Estação Virgílio Távora → Jardineira IFCE', analysis: 'Cenário simulado com integração entre ônibus, Metrô e Jardineira IFCE.', estimatedTime: '1h20 a 1h45', needsBus: true, needsMetro: true, needsVlt: false, needsJardineira: true, needsIntegration: true, risk: 'medio', riskLabel: 'Risco médio — conexão exige atenção', steps: [{ mode: 'bus', label: 'Ônibus', line: 'Ônibus metropolitano', from: 'Centro de Caucaia / Praça da Matriz', to: 'Terminal Antônio Bezerra', durationText: '25 a 35 min', confidence: 'baixa' }, { mode: 'bus', label: 'Ônibus', line: 'Linha 072 - Antônio Bezerra / Parangaba', from: 'Terminal Antônio Bezerra', to: 'Terminal Parangaba', durationText: '25 a 35 min', confidence: 'baixa' }, { mode: 'transfer', label: 'Integração', from: 'Terminal Parangaba', to: 'Estação Parangaba', durationText: '8 a 12 min', confidence: 'media' }, { mode: 'metro', label: 'Metrô', line: 'Linha Sul', lineId: 'metrofor-linha-sul', from: 'Estação Parangaba', to: 'Estação Virgílio Távora', durationText: '18 a 25 min', confidence: 'media' }, { mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'Estação Virgílio Távora', to: 'IFCE Campus Maracanaú', durationText: '6 a 10 min', confidence: 'alta' }] },
    { id: 'outro-ifce', label: 'Rota simulada', direction: 'inbound', origin: 'Outro endereço', destination: 'IFCE Campus Maracanaú', routeType: 'Indo para o IFCE', mainRoute: 'Origem informada → Integração → Estação Virgílio Távora → Jardineira IFCE', analysis: 'Cenário simulado para endereço genérico informado pelo usuário.', estimatedTime: '45 a 55 min', needsBus: true, needsMetro: 'maybe', needsVlt: 'maybe', needsJardineira: 'maybe', needsIntegration: true, risk: 'alto', riskLabel: 'Risco alto — conexão pode ser perdida dependendo do horário', steps: [{ mode: 'walk', label: 'Caminhada', from: 'Origem informada', to: 'Parada mais próxima', durationText: '6 min', confidence: 'baixa' }, { mode: 'bus', label: 'Ônibus', line: 'Ônibus urbano demonstrativo', from: 'Parada mais próxima', to: 'Ponto de integração', durationText: '18 min', confidence: 'baixa' }, { mode: 'transfer', label: 'Integração', from: 'Ponto de integração', to: 'Estação Virgílio Távora', durationText: '15 min', confidence: 'media' }, { mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'Estação Virgílio Távora', to: 'IFCE Campus Maracanaú', durationText: '8 min', confidence: 'alta' }] }
  ],
  outbound: [
    { id: 'ifce-ufc-pici', label: 'Rota acadêmica para UFC — Campus do Pici', direction: 'outbound', origin: 'IFCE Campus Maracanaú', destination: 'UFC Campus do Pici', routeType: 'Saindo do IFCE', mainRoute: 'IFCE → Jardineira IFCE → Estação Virgílio Távora → Linha Sul → Benfica → Ônibus para o Pici', analysis: 'Rota acadêmica demonstrativa até outro campus.', estimatedTime: '1h a 1h15', needsBus: true, needsMetro: true, needsVlt: false, needsJardineira: true, needsIntegration: true, risk: 'medio', riskLabel: 'Risco médio — conexão exige atenção', steps: [{ mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'IFCE Campus Maracanaú', to: 'Estação Virgílio Távora', durationText: '6 a 10 min', confidence: 'alta' }, { mode: 'metro', label: 'Metrô', line: 'Linha Sul', lineId: 'metrofor-linha-sul', from: 'Estação Virgílio Távora', to: 'Estação Benfica', durationText: '20 a 25 min', confidence: 'media' }, { mode: 'transfer', label: 'Integração', from: 'Estação Benfica', to: 'Av. da Universidade / Av. 13 de Maio', durationText: '8 a 10 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Ônibus para o Pici, como 075, 011 ou 088', from: 'Av. da Universidade / Av. 13 de Maio', to: 'UFC Campus do Pici', durationText: '20 a 30 min', confidence: 'baixa' }] },
    { id: 'ifce-uece-itaperi', label: 'Rota acadêmica para UECE — Campus Itaperi', direction: 'outbound', origin: 'IFCE Campus Maracanaú', destination: 'UECE Campus Itaperi', routeType: 'Saindo do IFCE', mainRoute: 'IFCE → Jardineira IFCE → Linha Sul → Parangaba → Ônibus para Itaperi', analysis: 'Rota demonstrativa com integração na Parangaba.', estimatedTime: '40 a 55 min', needsBus: true, needsMetro: true, needsVlt: false, needsJardineira: true, needsIntegration: true, risk: 'medio', riskLabel: 'Risco médio — conexão exige atenção', steps: [{ mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'IFCE Campus Maracanaú', to: 'Estação Virgílio Távora', durationText: '6 a 10 min', confidence: 'alta' }, { mode: 'metro', label: 'Metrô', line: 'Linha Sul', lineId: 'metrofor-linha-sul', from: 'Estação Virgílio Távora', to: 'Estação Parangaba', durationText: '12 a 18 min', confidence: 'media' }, { mode: 'transfer', label: 'Integração', from: 'Estação Parangaba', to: 'Terminal Parangaba', durationText: '6 a 10 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Ônibus em direção à Av. Dr. Silas Munguba, como 024, 041, 315 ou 400', from: 'Terminal Parangaba', to: 'UECE Campus Itaperi', durationText: '15 a 25 min', confidence: 'baixa' }] },
    { id: 'ifce-unilab-redencao', label: 'Rota acadêmica para UNILAB — Redenção/Acarape', direction: 'outbound', origin: 'IFCE Campus Maracanaú', destination: 'UNILAB Redenção/Acarape', routeType: 'Saindo do IFCE', mainRoute: 'IFCE → Jardineira IFCE → Linha Sul sentido Carlito Benevides → Ônibus intermunicipal', analysis: 'Rota demonstrativa usando Linha Sul no sentido Carlito Benevides.', estimatedTime: '1h a 1h30', needsBus: true, needsMetro: true, needsVlt: false, needsJardineira: true, needsIntegration: true, intercityBus: true, risk: 'alto', riskLabel: 'Risco alto — conexão pode ser perdida dependendo do horário', steps: [{ mode: 'shuttle', label: 'Jardineira', line: 'Jardineira IFCE', lineId: 'ifce-jardineira', from: 'IFCE Campus Maracanaú', to: 'Estação Virgílio Távora', durationText: '6 a 10 min', confidence: 'alta' }, { mode: 'metro', label: 'Metrô', line: 'Linha Sul', lineId: 'metrofor-linha-sul', from: 'Estação Virgílio Távora', to: 'Estação Carlito Benevides', durationText: '10 a 15 min', confidence: 'media' }, { mode: 'transfer', label: 'Integração', from: 'Estação Carlito Benevides', to: 'Parada na região da CE-060', durationText: '8 a 12 min', confidence: 'media' }, { mode: 'bus', label: 'Ônibus', line: 'Ônibus intermunicipal sentido Redenção ou Baturité', from: 'Região da CE-060', to: 'UNILAB Redenção/Acarape', durationText: '40 a 60 min', confidence: 'baixa' }] }
  ]
};

// BRUNO: eventos podem preencher destino na tela Localização.
const events = [
  { id: 'semana-computacao', title: 'Semana da Computação', location: 'Auditório do IFCE Maracanaú', status: 'Evento acadêmico' },
  { id: 'apresentacao-projetos', title: 'Apresentação de projetos', location: 'Bloco didático', status: 'Atividade do campus' },
  { id: 'recepcao-novos-alunos', title: 'Recepção de novos alunos', location: 'Entrada principal do campus', status: 'Evento público' }
];

// BRUNO: credenciais fictícias usadas apenas para demonstração visual.
const demoCredentials = {
  student: [{ login: '20261045050612', password: '12345' }, { login: 'bruno.silva@aluno.ifce.edu.br', password: '12345' }],
  admin: [
    { login: '20261045050601', password: '12345' },
    { login: '20261045050602', password: '12345' },
    { login: '20261045050603', password: '12345' },
    { login: '20261045050604', password: '12345' },
    { login: 'admin.campus@ifce.edu.br', password: '12345' }
  ]
};

const simpleTexts = {
  welcomeTitle: ['Mobilidade acadêmica simples, acessível e em tempo real.', 'Veja rotas, horários e avisos do seu campus.'],
  welcomeHelper: ['Vou te ajudar a encontrar campus, rota e horários.', 'Eu ajudo você a escolher o campus e ver informações importantes.'],
  profileTitle: ['Como você vai usar o CampusMove hoje?', 'Escolha seu tipo de acesso.'],
  roleHelper: ['Escolha seu perfil para eu mostrar as funções certas do CampusMove.', 'Escolha seu tipo de acesso.'],
  institutionHelper: ['Escolha o ambiente institucional para acessar o serviço ativo no seu campus.', 'Escolha instituição e campus para entrar.'],
  loginHelper: ['Protótipo: use uma matrícula fictícia ou e-mail acadêmico demonstrativo.', 'Use os dados de teste para entrar.'],
  homeRoute: ['IFCE Campus Maracanaú → Estação Virgílio Távora', 'IFCE Campus Maracanaú → Estação Virgílio Távora'],
  profileHelper: ['Aqui ficam as informações visuais do seu vínculo com o campus.', 'Aqui aparecem informações simples sobre seu perfil.'],
  profilePrivacy: ['Dados acadêmicos protegidos pela instituição.', 'Dados acadêmicos protegidos pela instituição.'],
  adminRestriction: ['Ambiente restrito para administradores autorizados.', 'Área só para administradores.']
};

const screens = [...document.querySelectorAll('.screen')];
const contextLabel = document.querySelector('#screen-context');
const headerSubtitle = document.querySelector('#header-subtitle');
const bottomNav = document.querySelector('.bottom-nav');
const backButton = document.querySelector('[data-action="back"]');

function showScreen(screenId, storeHistory = true) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen) return;
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
  appState.currentScreen = screenId;
  if (storeHistory && appState.history.at(-1) !== screenId) appState.history.push(screenId);
  contextLabel.textContent = nextScreen.dataset.title || 'CampusMove';
  headerSubtitle.textContent = nextScreen.dataset.subtitle || 'IFCE Campus Maracanaú';
  bottomNav.classList.toggle('visible', nextScreen.classList.contains('internal'));
  backButton.style.visibility = ['welcome', 'splash'].includes(screenId) ? 'hidden' : 'visible';
  updateActiveTab();
  if (screenId === 'location') {
    if (!appState.locationMode) appState.locationMode = 'directions';
    renderLocation();
  }
  if (screenId === 'events') renderEvents();
  nextScreen.scrollTop = 0;
}

function goBack() {
  if (appState.history.length <= 1) return showScreen('welcome', false);
  appState.history.pop();
  showScreen(appState.history.at(-1), false);
}

function updateActiveTab() {
  document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('active', button.dataset.tab === appState.currentScreen));
}

function clearSelection(groupSelector) {
  document.querySelectorAll(groupSelector).forEach((button) => button.classList.remove('selected', 'active', 'dimmed'));
}

function renderRoles() {
  document.querySelector('#role-options').innerHTML = roles.map((role) => `<button class="option-card role-card" data-role="${role.id}" role="option"><span>${role.icon}</span><strong>${role.title}</strong><small>${role.description}</small></button>`).join('');
}

function normalize(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function keywordMatches(item, search) {
  if (!search) return true;
  const values = [item.acronym, item.name, item.type, ...(item.keywords || [])];
  return values.some((value) => normalize(value).includes(search));
}

function selectedTypeLabel() {
  return environmentTypes.find((type) => type.id === appState.selectedType)?.label || null;
}

function selectedInstitution() {
  return institutions.find((item) => item.id === appState.selectedInstitution);
}

function selectedCampus() {
  return selectedInstitution()?.campuses.find((campus) => campus.id === appState.selectedCampus);
}

function institutionsForType() {
  const label = selectedTypeLabel();
  if (!label) return [];
  if (label === 'Outra instituição') return [];
  return institutions.filter((item) => item.type === label);
}

function renderStepper() {
  const steps = [
    { id: 'type', label: 'Tipo', complete: Boolean(appState.selectedType), active: !appState.selectedType },
    { id: 'institution', label: 'Instituição', complete: Boolean(appState.selectedInstitution), active: Boolean(appState.selectedType && !appState.selectedInstitution) },
    { id: 'campus', label: 'Campus', complete: Boolean(appState.selectedCampus), active: Boolean(appState.selectedInstitution && !appState.selectedCampus) },
    { id: 'access', label: 'Acesso', complete: canContinueCampus(), active: Boolean(appState.selectedCampus) }
  ];
  document.querySelector('#saas-stepper').innerHTML = steps.map((step, index) => `<span class="saas-step ${step.complete ? 'complete' : ''} ${step.active ? 'active' : ''}"><b>${index + 1}</b>${step.label}</span>`).join('');
}

function renderTypeOptions() {
  document.querySelector('#type-options').innerHTML = environmentTypes.map((type) => `<button class="type-card ${type.id === appState.selectedType ? 'selected active' : ''}" data-type="${type.id}"><strong>${type.label}</strong><small>${type.id === 'outra' ? 'Expansão futura' : 'Ver ambientes disponíveis'}</small></button>`).join('');
}

function renderInstitutions() {
  const searchField = document.querySelector('#institution-search');
  const target = document.querySelector('#institution-options');
  searchField.disabled = !appState.selectedType || appState.selectedType === 'outra';
  if (!appState.selectedType) {
    target.innerHTML = '<p class="helper-card">Escolha o tipo de instituição para ver ambientes disponíveis.</p>';
    return;
  }
  if (appState.selectedType === 'outra') {
    target.innerHTML = '<p class="helper-card"><strong>Nenhum ambiente ativo nesta categoria ainda.</strong><span>O CampusMove foi preparado para expansão multi-instituição em fases futuras.</span></p>';
    return;
  }
  const search = normalize(searchField.value);
  const list = institutionsForType().filter((item) => keywordMatches(item, search));
  target.innerHTML = list.length
    ? list.map((item) => renderInstitutionCard(item)).join('')
    : '<p class="helper-card">Nenhuma instituição encontrada nesta categoria.</p>';
}

function renderInstitutionCard(item) {
  const logo = item.logo ? `<img src="${item.logo}" alt="${item.alt}">` : '';
  return `<button class="institution-card ${item.id === appState.selectedInstitution ? 'selected active' : ''}" data-institution="${item.id}"><span class="logo-tile ${item.logo ? '' : 'logo-fallback'}" data-fallback="${item.fallback}">${logo}</span><span class="institution-copy"><strong>${item.acronym}</strong><b>${item.name}</b><small>${item.type}</small><em>Serviço: ${item.service}</em></span><span class="status-badge">${item.status}</span></button>`;
}

// BRUNO: selecionar tipo limpa instituição e campus.
function renderCampuses() {
  const field = document.querySelector('#campus-search');
  const target = document.querySelector('#campus-options');
  field.disabled = !appState.selectedInstitution;
  if (!appState.selectedInstitution) {
    target.innerHTML = '<p class="helper-card">Escolha uma instituição antes de selecionar o campus.</p>';
    renderInstitutionSummary();
    return;
  }
  const search = normalize(field.value);
  const list = selectedInstitution().campuses.filter((campus) => keywordMatches(campus, search));
  target.innerHTML = list.length
    ? list.map((campus) => `<button class="option-card horizontal campus-card ${campus.id === appState.selectedCampus ? 'selected active' : ''} ${campus.active ? '' : 'disabled future'}" data-campus="${campus.id}"><span><strong>Campus ${campus.name}</strong><small>Serviço: ${campus.service}</small></span><span class="product-badge">${campus.status}</span></button>`).join('')
    : '<p class="helper-card">Nenhum campus encontrado para esse termo.</p>';
  renderInstitutionSummary();
}

function renderInstitutionSummary() {
  const institution = selectedInstitution();
  const campus = selectedCampus();
  const summary = document.querySelector('#institution-summary');
  if (!institution || !campus) {
    summary.hidden = true;
    summary.innerHTML = '';
    updateContinueButton();
    renderStepper();
    return;
  }
  const readyText = campus.active ? 'Ambiente pronto para acesso.' : 'Este ambiente ainda está em preparação.';
  summary.hidden = false;
  summary.innerHTML = `<h3>Ambiente selecionado</h3><dl><dt>Instituição</dt><dd>${institution.name}</dd><dt>Campus</dt><dd>${campus.name}</dd><dt>Tipo</dt><dd>${institution.type}</dd><dt>Perfil</dt><dd>${appState.role || 'Aluno'}</dd><dt>Serviço</dt><dd>${campus.service}</dd><dt>Status</dt><dd>${campus.status}</dd></dl><p>${readyText}</p>`;
  updateContinueButton();
  renderStepper();
}

function updateContinueButton() {
  const button = document.querySelector('#continue-campus-button');
  if (!button) return;
  if (!appState.selectedType) button.textContent = 'Escolha o tipo de instituição';
  else if (!appState.selectedInstitution) button.textContent = 'Escolha a instituição';
  else if (!appState.selectedCampus) button.textContent = 'Escolha o campus';
  else if (!canContinueCampus()) button.textContent = 'Ambiente em preparação';
  else button.textContent = 'Continuar para login institucional';
  button.classList.toggle('is-disabled', !canContinueCampus());
}

function canContinueCampus() {
  return appState.selectedType === 'if' && appState.selectedInstitution === 'ifce' && appState.selectedCampus === 'maracanau';
}

function selectRole(button) {
  appState.role = button.dataset.role;
  document.querySelector('#profile-alert').textContent = '';
  clearSelection('[data-role]');
  button.classList.add('selected', 'active');
  document.querySelectorAll('[data-role]').forEach((card) => card.classList.toggle('dimmed', card !== button));
}

function selectType(button) {
  appState.selectedType = button.dataset.type;
  appState.selectedInstitution = null;
  appState.selectedCampus = null;
  document.querySelector('#institution-search').value = '';
  document.querySelector('#campus-search').value = '';
  document.querySelector('#campus-alert').textContent = '';
  clearSelection('[data-type]');
  button.classList.add('selected', 'active');
  renderInstitutions();
  renderCampuses();
  updateContinueButton();
  renderStepper();
}

function selectInstitution(button) {
  appState.selectedInstitution = button.dataset.institution;
  appState.selectedCampus = null;
  document.querySelector('#campus-search').value = '';
  document.querySelector('#campus-alert').textContent = '';
  clearSelection('[data-institution]');
  button.classList.add('selected', 'active');
  renderInstitutions();
  renderCampuses();
  updateContinueButton();
  renderStepper();
}

function selectCampus(button) {
  appState.selectedCampus = button.dataset.campus;
  clearSelection('[data-campus]');
  button.classList.add('selected', 'active');
  const campus = selectedCampus();
  document.querySelector('#campus-alert').textContent = campus?.active ? '' : 'Para testar o MVP MinhaJardineira, escolha IFCE → Maracanaú.';
  renderCampuses();
  updateContinueButton();
  renderStepper();
}

function continueProfile() {
  if (!appState.role) {
    document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
    return;
  }
  if (appState.role === 'Aluno') return showScreen('campus');
  if (appState.role === 'Servidor') return showBlockedAccess('Acesso de servidor em preparação', 'No sistema real, servidores terão permissões institucionais validadas pelo campus.', 'Neste protótipo, o acesso de servidor ainda não está liberado.');
  if (appState.role === 'Motorista') return showBlockedAccess('Acesso do motorista', 'Acesso operacional em preparação.', 'Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente no sistema real.');
  if (appState.role === 'Administrador') return prepareAdminLogin();
  return showScreen('visitor-access');
}

// BRUNO: apenas IFCE Maracanaú libera o MVP.
function continueCampus() {
  if (!appState.selectedType || !appState.selectedInstitution || !appState.selectedCampus) {
    document.querySelector('#campus-alert').textContent = 'Complete as etapas para continuar.';
    return;
  }
  if (!canContinueCampus()) {
    document.querySelector('#campus-alert').textContent = 'Para testar o MVP MinhaJardineira, escolha IFCE → Maracanaú.';
    return;
  }
  showScreen('login');
}

function showBlockedAccess(title, message, detail = '') {
  const messageNode = document.querySelector('#blocked-message');
  const detailNode = document.querySelector('#blocked-detail');
  messageNode.textContent = message;
  detailNode.textContent = detail;
  delete messageNode.dataset.simpleKey;
  delete detailNode.dataset.simpleKey;
  if (title.includes('servidor')) messageNode.dataset.simpleKey = 'serverRestriction';
  if (title.includes('motorista')) detailNode.dataset.simpleKey = 'motoristRestriction';
  simpleTexts.serverRestriction = ['No sistema real, servidores terão permissões institucionais validadas pelo campus.', 'Este acesso ainda será liberado pela instituição.'];
  simpleTexts.motoristRestriction = ['Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente no sistema real.', 'Somente motoristas autorizados poderão entrar.'];
  document.querySelector('#blocked-title').textContent = title;
  updateAccessibilityUi();
  showScreen('blocked-access');
}

function prepareAdminLogin() {
  document.querySelector('#restricted-login').dataset.title = 'Acesso administrativo';
  document.querySelector('#restricted-login').dataset.subtitle = 'Ambiente restrito';
  document.querySelector('#restricted-login-title').textContent = 'Acesso administrativo';
  document.querySelector('#restricted-warning').textContent = 'Acesso administrativo restrito.';
  document.querySelector('#restricted-description').textContent = appState.accessibility.simpleLanguage ? 'Área só para administradores.' : 'Ambiente restrito para administradores autorizados.';
  document.querySelector('#restricted-user').value = '';
  document.querySelector('#restricted-password').value = '';
  document.querySelector('#restricted-alert').textContent = '';
  showScreen('restricted-login');
}

function enterApp(visitor = false) {
  appState.accessMode = visitor ? 'visitor' : 'student';
  appState.userName = visitor ? 'Visitante' : 'Bruno';
  document.querySelector('#home-title').textContent = `Olá, ${appState.userName}!`;
  document.querySelector('#home-campus-label').textContent = visitor ? 'Acesso visitante' : 'IFCE — Campus Maracanaú';
  updateProfile();
  showScreen('home');
}

function updateProfile() {
  const isVisitor = appState.accessMode === 'visitor';
  document.querySelector('.profile-card h3').textContent = isVisitor ? 'Perfil acadêmico indisponível para visitantes.' : 'Bruno';
  const profileRows = document.querySelectorAll('.profile-details p span');
  if (isVisitor) {
    profileRows[0].textContent = 'Visitante';
    profileRows[1].textContent = 'Acesso público';
    profileRows[2].textContent = 'Eventos, horários e rotas públicas';
    document.querySelector('.profile-card small').textContent = 'Sem dados acadêmicos protegidos';
  } else {
    profileRows[0].textContent = 'Aluno';
    profileRows[1].textContent = 'Instituto Federal do Ceará';
    profileRows[2].textContent = 'Maracanaú';
    document.querySelector('.profile-card small').textContent = 'Matrícula: 20261045******';
  }
  document.querySelector('.profile-card .product-badge').textContent = isVisitor ? 'Visitante' : 'Aluno do protótipo';
  document.querySelector('.avatar').textContent = isVisitor ? 'V' : 'B';
}

function login() {
  if (appState.role !== 'Aluno') {
    document.querySelector('#login-alert').textContent = 'Este acesso pertence ao perfil de aluno. Troque o perfil para continuar.';
    return;
  }
  const loginValue = document.querySelector('#login-user').value.trim();
  const passwordValue = document.querySelector('#login-password').value;
  const authorized = demoCredentials.student.some((credential) => credential.login === loginValue && credential.password === passwordValue);
  if (!authorized) {
    document.querySelector('#login-alert').textContent = 'Use 20261045050612 / 12345 ou bruno.silva@aluno.ifce.edu.br / 12345 para testar o acesso de aluno.';
    return;
  }
  document.querySelector('#login-alert').textContent = 'Acesso autorizado para demonstração.';
  enterApp(false);
}

function restrictedLogin() {
  const loginValue = document.querySelector('#restricted-user').value.trim();
  const passwordValue = document.querySelector('#restricted-password').value;
  const authorized = demoCredentials.admin.some((credential) => credential.login === loginValue && credential.password === passwordValue);
  if (!authorized) {
    document.querySelector('#restricted-alert').textContent = 'Credencial administrativa não autorizada neste protótipo.';
    return;
  }
  showScreen('admin-preparation');
}

function updateAccessibilityUi() {
  document.body.classList.toggle('large-text', appState.accessibility.largeText);
  document.body.classList.toggle('a11y-large-text', appState.accessibility.largeText);
  document.body.classList.toggle('high-contrast', appState.accessibility.highContrast);
  document.body.classList.toggle('reduce-motion', appState.accessibility.reduceMotion);
  document.body.classList.toggle('simple-language', appState.accessibility.simpleLanguage);
  document.querySelectorAll('[data-access]').forEach((button) => {
    const active = appState.accessibility[button.dataset.access];
    button.classList.toggle('selected', active);
    const label = button.querySelector('span');
    if (label) label.textContent = active ? 'ativado' : 'desativado';
  });
  document.querySelectorAll('[data-simple-key]').forEach((element) => {
    const values = simpleTexts[element.dataset.simpleKey];
    if (values) element.textContent = appState.accessibility.simpleLanguage ? values[1] : values[0];
  });
  document.querySelector('#simple-example').textContent = appState.accessibility.simpleLanguage ? 'Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.' : 'SEM_SINAL';
}

function toggleAccessibility(key) {
  appState.accessibility[key] = !appState.accessibility[key];
  updateAccessibilityUi();
}

function startSplash() {
  const delay = appState.accessibility.reduceMotion ? 100 : 2300;
  window.setTimeout(() => showScreen('welcome'), delay);
}


const locationModes = [{ id: 'directions', label: 'Como chegar' }, { id: 'shuttle', label: 'Rota da Jardineira' }, { id: 'live', label: 'Ao vivo' }];
const modeLabels = { walk: 'Caminhada', bus: 'Ônibus', metro: 'Metrô', vlt: 'VLT', shuttle: 'Jardineira', transfer: 'Integração' };
const confidenceLabels = { alta: 'Alta — baseada em regra fixa institucional', media: 'Média — baseada em intervalo médio estimado', baixa: 'Baixa — depende de trânsito e não há dado no protótipo' };

function renderLocationTabs() {
  const target = document.querySelector('#location-tabs');
  if (!target) return;
  target.innerHTML = locationModes.map((mode) => `<button class="location-tab ${appState.locationMode === mode.id ? 'active' : ''}" data-location-mode="${mode.id}">${mode.label}</button>`).join('');
}

function setLocationMode(mode) {
  appState.locationMode = mode;
  renderLocation();
}

function setRouteDirection(direction) {
  appState.routeDirection = direction;
  const first = routeScenarios[direction][0];
  appState.selectedScenario = first.id;
  appState.routeOrigin = direction === 'outbound' ? 'IFCE Campus Maracanaú' : first.origin;
  appState.routeDestination = direction === 'outbound' ? first.destination : (appState.selectedEventDestination || 'IFCE Campus Maracanaú');
  renderLocation();
}

function selectRouteScenario(id) {
  const route = [...routeScenarios.inbound, ...routeScenarios.outbound].find((item) => item.id === id);
  if (!route) return;
  appState.selectedScenario = id;
  appState.routeDirection = route.direction;
  appState.routeOrigin = id === 'outro-ifce' ? '' : route.origin;
  appState.routeDestination = appState.selectedEventDestination || route.destination;
  renderLocation();
  if (id === 'outro-ifce') setTimeout(() => document.querySelector('#route-origin')?.focus(), 0);
}

function simulateRoute() {
  const originField = document.querySelector('#route-origin');
  const destinationField = document.querySelector('#route-destination');
  if (originField) appState.routeOrigin = originField.value.trim() || appState.routeOrigin;
  if (destinationField) appState.routeDestination = destinationField.value;
  renderLocation();
}

// FELIPE: computeOverallConfidence aplica a regra “menor confiança entre as etapas”.
function computeOverallConfidence(route) {
  const order = { baixa: 0, media: 1, alta: 2 };
  return route.steps.reduce((lowest, step) => order[step.confidence] < order[lowest] ? step.confidence : lowest, 'alta');
}

function routeModes(route) {
  return [...new Set(route.steps.map((step) => modeLabels[step.mode] || step.label))];
}

function renderTripDiagnosis(route) {
  const confidence = computeOverallConfidence(route);
  const integrations = route.steps.filter((step) => step.mode === 'transfer').length;
  const recommendation = route.risk === 'alto' ? 'sair com margem de 20 min' : route.risk === 'medio' ? 'sair com margem de 10 min' : 'sem necessidade de margem extra';
  return `<article class="trip-diagnosis"><h4>Diagnóstico da viagem</h4><p><strong>Tempo estimado:</strong> ${route.estimatedTime}</p><p><strong>Modais:</strong> ${routeModes(route).join(' + ')}</p><p><strong>Integrações:</strong> ${integrations || 'nenhuma'}</p><p><strong>Risco:</strong> ${route.risk === 'none' ? '—' : route.risk}</p><p><strong>Confiança:</strong> ${confidence}</p><p><strong>Recomendação:</strong> ${recommendation}</p></article>`;
}

function minutesFromText(text) { const [h, m] = text.split(':').map(Number); return h * 60 + m; }
function timeFromMinutes(total) { const h = Math.floor((total % 1440) / 60); const m = total % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }
function nextDeparture(line, current) {
  const start = minutesFromText(line.operation.start), end = minutesFromText(line.operation.end);
  if (current < start || current > end) return null;
  return start + Math.ceil((current - start) / line.headwayMinutes) * line.headwayMinutes;
}

// BRUNO: Prompt 4 substituirá estimativas por dados reais quando houver fonte.
function estimateDepartureNow(route) {
  const timedSteps = route.steps.filter((step) => ['metro', 'vlt', 'shuttle'].includes(step.mode));
  if (!timedSteps.length) return '<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p>Esta rota não depende de Metrô/VLT ou Jardineira. A estimativa depende principalmente do trânsito e da frequência do ônibus urbano, ainda não integrada neste protótipo.</p><small>Estimativa baseada em intervalo médio, não em dado oficial em tempo real.</small></article>';
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const rows = [];
  let cursor = current;
  let gap = 99;
  for (const step of timedSteps) {
    const line = step.mode === 'shuttle' ? campusShuttle : transitLines[step.lineId];
    const dep = line ? nextDeparture(line, cursor) : null;
    if (dep === null) rows.push(`<p>Fora do horário de operação estimado da linha: ${step.line || step.label}.</p>`);
    else { if (step.mode === 'shuttle') gap = dep - cursor; rows.push(`<p><strong>${step.mode === 'shuttle' ? 'Próxima Jardineira estimada' : `Próxima partida estimada (${step.line})`}:</strong> ${timeFromMinutes(dep)}</p>`); cursor = dep + 10; }
  }
  const risk = gap < 5 ? 'Risco alto — conexão muito apertada' : gap < 12 ? 'Risco médio — conexão exige atenção' : 'Risco baixo — margem confortável';
  return `<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p><strong>Saindo agora:</strong> ${timeFromMinutes(current)}</p>${rows.join('')}<p><strong>Chegada prevista:</strong> ${timeFromMinutes(cursor + 10)}</p><p><strong>Risco:</strong> ${risk}</p><small>Estimativa baseada em intervalo médio, não em dado oficial em tempo real.</small></article>`;
}

function renderRouteResult(route) {
  const confidence = computeOverallConfidence(route);
  const needs = (value) => value === 'maybe' ? 'talvez' : value ? 'sim' : 'não';
  return `<article class="route-card"><span class="product-badge">${appState.accessMode === 'visitor' ? 'Rota pública demonstrativa' : 'Rota demonstrativa'}</span><h3>${route.label}</h3><div class="route-summary"><p><strong>Tipo de rota:</strong> ${route.routeType}</p><p><strong>Origem:</strong> ${appState.routeOrigin || route.origin}</p><p><strong>Destino:</strong> ${appState.routeDestination || route.destination}</p><p><strong>Melhor rota recomendada:</strong> ${route.mainRoute}</p><p><strong>Tempo estimado:</strong> ${route.estimatedTime}</p><p><strong>Modais usados:</strong> ${routeModes(route).join(' + ')}</p><p><strong>Precisa de ônibus?</strong> ${needs(route.needsBus)}</p><p><strong>Precisa de metrô?</strong> ${needs(route.needsMetro)}</p><p><strong>Precisa de VLT?</strong> ${needs(route.needsVlt)}</p><p><strong>Precisa da Jardineira?</strong> ${needs(route.needsJardineira)}</p><p><strong>Integração necessária?</strong> ${needs(route.needsIntegration)}</p></div><div class="route-badges">${routeModes(route).map((mode) => `<span class="route-badge">${mode}</span>`).join('')}${route.needsIntegration ? '<span class="route-badge">Integração</span>' : ''}</div><p class="route-warning">Dados demonstrativos, sem integração oficial.</p><div class="route-timeline">${route.steps.map((step) => `<div class="route-step"><span class="route-dot"></span><strong>${step.from}</strong><small>↓ <b>${modeLabels[step.mode] || step.label}</b> — ${step.durationText}${step.line ? ` · ${step.line}` : ''}</small><em>${step.to}</em><span class="route-confidence">Confiança do trecho: ${step.confidence}</span></div>`).join('')}</div><p class="route-confidence"><strong>Confiança geral:</strong> ${confidence[0].toUpperCase() + confidence.slice(1)} — estimado demonstrativo</p>${route.needsIntegration && route.riskLabel ? `<p class="route-risk">${route.riskLabel}</p>` : ''}${renderTripDiagnosis(route)}${estimateDepartureNow(route)}<p class="privacy-note">Rota demonstrativa baseada em cenários locais informados pela equipe. No sistema real, o CampusMove usaria dados oficiais de transporte e localização autorizada.</p></article>`;
}

function selectedRoute() { return routeScenarios[appState.routeDirection].find((route) => route.id === appState.selectedScenario) || routeScenarios.inbound[1]; }

function renderDirectionsPanel() {
  const route = selectedRoute();
  const inbound = appState.routeDirection === 'inbound';
  const scenarioChips = (inbound ? routeScenarios.inbound : routeScenarios.outbound).map((item) => `<button class="type-chip ${item.id === appState.selectedScenario ? 'selected active' : ''}" data-route-scenario="${item.id}">${item.id === 'bruno-ifce' ? 'Bruno' : item.id === 'outro-ifce' ? 'Outro endereço' : item.destination.replace('IFCE Campus Maracanaú', item.origin)}</button>`).join('');
  const chips = inbound ? scenarioChips : `${scenarioChips}<button class="type-chip" data-event-destination="Local do evento selecionado">Evento no campus</button>`;
  const eventMessage = appState.selectedEventDestination ? '<p class="inline-alert">Rota até o evento selecionado.</p>' : '';
  return `<section class="location-panel active"><h3>Como chegar</h3><p class="section-subtitle">Escolha uma origem e destino para ver uma rota demonstrativa.</p><div class="direction-selector"><button class="location-tab ${inbound ? 'active' : ''}" data-route-direction="inbound">Estou indo para o IFCE</button><button class="location-tab ${!inbound ? 'active' : ''}" data-route-direction="outbound">Estou saindo do IFCE</button></div><div class="chip-grid">${chips}</div><div class="form-card route-form"><label>Origem<input id="route-origin" type="text" ${inbound ? '' : 'readonly'} placeholder="Digite bairro, ponto de referência ou cenário" value="${inbound ? appState.routeOrigin : 'IFCE Campus Maracanaú'}"></label><label>Destino${inbound ? `<select id="route-destination"><option ${appState.routeDestination === 'IFCE Campus Maracanaú' ? 'selected' : ''}>IFCE Campus Maracanaú</option><option ${appState.routeDestination === 'Estação Virgílio Távora' ? 'selected' : ''}>Estação Virgílio Távora</option><option ${appState.routeDestination === 'Auditório do IFCE Maracanaú' ? 'selected' : ''}>Auditório do IFCE Maracanaú</option><option ${appState.selectedEventDestination ? 'selected' : ''}>${appState.selectedEventDestination || 'Auditório do IFCE Maracanaú'}</option></select>` : `<input id="route-destination" type="text" placeholder="Escolha uma instituição ou evento acadêmico" value="${appState.routeDestination}">`}</label><button type="button" class="primary-button" data-action="simulate-route">Simular rota</button></div>${eventMessage}${renderRouteResult(route)}</section>`;
}

function renderShuttlePanel() {
  return `<section class="location-panel active"><h3>Rota da Jardineira</h3><p class="section-subtitle">Trajeto institucional entre a Estação Virgílio Távora e o IFCE Campus Maracanaú.</p><div class="live-map shuttle-map"><span class="station-marker">Estação Virgílio Távora</span><span class="route-line"></span><span class="live-marker shuttle-one">🚌</span><span class="campus-marker">IFCE Campus Maracanaú</span></div><article class="route-card"><div class="route-timeline"><div class="route-step"><strong>Estação Virgílio Távora</strong><small>↓ Ponto de embarque — Trajeto da Jardineira</small><em>Entrada do IFCE</em><span>IFCE Campus Maracanaú</span></div></div><p><strong>Sentido principal:</strong> Estação Virgílio Távora → IFCE Campus Maracanaú</p><p><strong>Retorno:</strong> IFCE Campus Maracanaú → Estação Virgílio Távora</p><p><strong>Frequência operacional:</strong> a cada 15 minutos</p><p><strong>Tempo médio:</strong> 6 a 10 minutos</p><p><strong>Veículos:</strong> Jardineira 1 e Jardineira 2</p><p><strong>Status:</strong> Operação simulada</p><p><strong>Confiança:</strong> Alta — regra institucional fixa</p><p class="route-warning">Dados demonstrativos, sem integração oficial em tempo real.</p></article></section>`;
}

function renderLivePanel() {
  return `<section class="location-panel active"><h3>Ao vivo</h3><p class="section-subtitle">Localização simulada das jardineiras em operação.</p><div class="live-map"><span class="route-line"></span><span class="live-marker shuttle-one">🚌</span><span class="live-marker shuttle-two">🚌</span><small>Operação simulada no protótipo, atualizado no navegador.</small></div><article class="live-card"><h4>Jardineira 1</h4><p><strong>Status:</strong> Em movimento</p><p><strong>Posição simulada:</strong> Saindo da Estação Virgílio Távora</p><p><strong>Estimativa:</strong> Chega ao campus em 7 min</p><p><strong>Atualização:</strong> Atualizado no navegador</p></article><article class="live-card"><h4>Jardineira 2</h4><p><strong>Status:</strong> Aguardando próxima saída</p><p><strong>Posição simulada:</strong> IFCE Campus Maracanaú</p><p><strong>Estimativa:</strong> Próxima saída operacional</p><p><strong>Atualização:</strong> Atualizado no navegador</p></article><p class="route-warning">Sem dados oficiais em tempo real neste protótipo.</p></section>`;
}

// FELIPE: abas internas usam .active para controlar o modo visível.
function renderLocation() {
  const target = document.querySelector('#location-panels');
  if (!target) return;
  renderLocationTabs();
  target.innerHTML = appState.locationMode === 'shuttle' ? renderShuttlePanel() : appState.locationMode === 'live' ? renderLivePanel() : renderDirectionsPanel();
}

function renderEvents() {
  const target = document.querySelector('#events-list');
  if (!target) return;
  target.innerHTML = events.map((item) => `<article class="event-card"><span class="product-badge">${item.status}</span><h3>${item.title}</h3><p><strong>Local:</strong> ${item.location}</p><p>Dados demonstrativos, sem integração oficial.</p><button class="secondary-button event-route-button" data-event-route="${item.id}">Ver rota até o evento</button></article>`).join('');
}

function goToEventRoute(eventId) {
  const item = events.find((eventItem) => eventItem.id === eventId);
  if (!item) return;
  appState.selectedEventDestination = item.location;
  appState.locationMode = 'directions';
  appState.routeDirection = 'inbound';
  appState.selectedScenario = item.location.includes('Auditório') ? 'maraponga-ifce' : 'outro-ifce';
  appState.routeOrigin = appState.accessMode === 'visitor' ? 'Origem do visitante' : 'Maraponga';
  appState.routeDestination = item.location;
  showScreen('location');
  renderLocation();
}

function selectEventDestination(value) {
  appState.selectedEventDestination = value;
  appState.routeDestination = value;
  renderLocation();
}

// FELIPE: estados selected/active controlam o LED verde dos cards.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go === 'location' || button.dataset.tab === 'location') appState.locationMode = 'directions';
  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) showScreen(button.dataset.tab);
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.role) selectRole(button);
  if (button.dataset.type) selectType(button);
  if (button.dataset.institution) selectInstitution(button);
  if (button.dataset.campus) selectCampus(button);
  if (button.dataset.action === 'continue-profile') continueProfile();
  if (button.dataset.action === 'continue-campus') continueCampus();
  if (button.dataset.action === 'login') login();
  if (button.dataset.action === 'restricted-login') restrictedLogin();
  if (button.dataset.action === 'visitor-home') enterApp(true);
  if (button.dataset.action === 'help-login') document.querySelector('#login-alert').textContent = 'Use 20261045050612 / 12345 apenas para testar o protótipo.';
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
  if (button.dataset.locationMode) setLocationMode(button.dataset.locationMode);
  if (button.dataset.routeDirection) setRouteDirection(button.dataset.routeDirection);
  if (button.dataset.routeScenario) selectRouteScenario(button.dataset.routeScenario);
  if (button.dataset.action === 'simulate-route') simulateRoute();
  if (button.dataset.eventRoute) goToEventRoute(button.dataset.eventRoute);
  if (button.dataset.eventDestination) selectEventDestination(button.dataset.eventDestination);
});

document.addEventListener('input', (event) => {
  const input = event.target;
  if (input.dataset.search === 'institution') renderInstitutions();
  if (input.dataset.search === 'campus') renderCampuses();
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!image.matches('.logo-tile img, .splash-logo-box img')) return;
  image.hidden = true;
  image.parentElement.classList.add('logo-fallback', 'logo-missing');
}, true);

renderRoles();
renderTypeOptions();
renderInstitutions();
renderCampuses();
renderStepper();
renderLocation();
renderEvents();
updateContinueButton();
updateAccessibilityUi();
showScreen('splash', false);
startSplash();
