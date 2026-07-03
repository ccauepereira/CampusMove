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
  }
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

// FELIPE: estados selected/active controlam o LED verde dos cards.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
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
updateContinueButton();
updateAccessibilityUi();
showScreen('splash', false);
startSplash();
