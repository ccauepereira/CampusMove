// BRUNO: estado central do protótipo para perfil, instituição e campus.
const appState = {
  currentScreen: 'splash',
  history: ['splash'],
  role: null,
  organization: null,
  institution: null,
  campus: null,
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

// BRUNO: controla o fluxo progressivo de organização, instituição e campus.
const organizations = ['Instituto Federal', 'Universidade Federal', 'Universidade Estadual', 'Universidade Internacional', 'Centro Universitário', 'Faculdade'];
const institutions = [
  { id: 'ifce', fallback: 'IFCE', name: 'IFCE — Instituto Federal do Ceará', cleanName: 'Instituto Federal do Ceará', organization: 'Instituto Federal', status: 'MVP ativo', logo: 'assets/institutions/ifce.png', alt: 'Logo do IFCE' },
  { id: 'ufc', fallback: 'UFC', name: 'UFC — Universidade Federal do Ceará', cleanName: 'Universidade Federal do Ceará', organization: 'Universidade Federal', status: 'Em breve', logo: 'assets/institutions/ufc.png', alt: 'Logo da UFC' },
  { id: 'uece', fallback: 'UECE', name: 'UECE — Universidade Estadual do Ceará', cleanName: 'Universidade Estadual do Ceará', organization: 'Universidade Estadual', status: 'Em breve', logo: 'assets/institutions/uece.png', alt: 'Logo da UECE' },
  { id: 'unilab', fallback: 'UNILAB', name: 'UNILAB — Universidade da Integração Internacional da Lusofonia Afro-Brasileira', cleanName: 'UNILAB', organization: 'Universidade Internacional', status: 'Em breve', logo: 'assets/institutions/unilab.png', alt: 'Logo da UNILAB' },
  { id: 'fb', fallback: 'FB', name: 'FB Uni — Centro Universitário Farias Brito', cleanName: 'Centro Universitário Farias Brito', organization: 'Centro Universitário', status: 'Em breve', logo: 'assets/institutions/fb.png', alt: 'Logo da FB Uni' }
];
const campuses = {
  ifce: [
    { id: 'maracanau', name: 'Maracanaú', status: 'MVP ativo', active: true },
    { id: 'fortaleza', name: 'Fortaleza', status: 'Em breve' },
    { id: 'caucaia', name: 'Caucaia', status: 'Em breve' },
    { id: 'sobral', name: 'Sobral', status: 'Em breve' }
  ],
  ufc: [{ id: 'pici', name: 'Campus do Pici', status: 'Em breve' }, { id: 'benfica', name: 'Benfica', status: 'Em breve' }],
  uece: [{ id: 'itaperi', name: 'Itaperi', status: 'Em breve' }],
  unilab: [{ id: 'redencao', name: 'Redenção/Acarape', status: 'Em breve' }],
  fb: [{ id: 'fortaleza', name: 'Fortaleza', status: 'Em breve' }]
};

// BRUNO: credenciais demonstrativas; não representam autenticação real.
const demoCredentials = {
  student: [{ login: 'DEMO-BRUNO', password: '12345' }, { login: 'bruno@aluno.demo', password: '12345' }],
  admin: [
    { login: 'DEMO-ADMIN-01', password: '12345' },
    { login: 'DEMO-ADMIN-02', password: '12345' },
    { login: 'DEMO-ADMIN-03', password: '12345' },
    { login: 'DEMO-ADMIN-04', password: '12345' },
    { login: 'admin@campusmove.demo', password: '12345' }
  ]
};

const simpleTexts = {
  welcomeTitle: ['Mobilidade acadêmica simples, acessível e em tempo real.', 'Veja horários, rotas e informações do campus com facilidade.'],
  welcomeHelper: ['Vou te ajudar a encontrar campus, rota e horários.', 'Eu ajudo você a escolher o campus e ver informações importantes.'],
  roleHelper: ['Escolha seu perfil para eu mostrar as funções certas do CampusMove.', 'Escolha como você quer entrar no CampusMove.'],
  institutionHelper: ['Escolha sua instituição e campus. Neste MVP, Maracanaú já está ativo.', 'Escolha a instituição e o campus. Agora, só Maracanaú está disponível.'],
  institutionNote: ['CampusMove é uma plataforma multi-instituição. Neste MVP, o campus ativo é o IFCE Campus Maracanaú.', 'O CampusMove pode funcionar em várias instituições. Neste teste, use IFCE e Campus Maracanaú.'],
  loginHelper: ['Protótipo: use dados demonstrativos. No sistema real, a validação viria da instituição.', 'Use o login de teste. No app real, a instituição confirma seus dados.'],
  homeRoute: ['IFCE — Campus Maracanaú → Estação Virgílio Távora', 'Rota entre o campus Maracanaú e a estação Virgílio Távora'],
  profileHelper: ['Aqui ficam as informações visuais do seu vínculo com o campus.', 'Aqui aparecem informações simples sobre seu perfil.'],
  profilePrivacy: ['Dados acadêmicos são gerenciados pela instituição.', 'Seus dados principais vêm da instituição.']
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

function applySelection(groupSelector, selectedButton) {
  document.querySelectorAll(groupSelector).forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle('selected', isSelected);
    button.classList.toggle('dimmed', Boolean(selectedButton) && !isSelected);
  });
}

function renderRoles() {
  document.querySelector('#role-options').innerHTML = roles.map((role) => `<button class="option-card role-card" data-role="${role.id}" role="option"><span>${role.icon}</span><strong>${role.title}</strong><small>${role.description}</small></button>`).join('');
}

function renderOrganizations() {
  const search = normalize(document.querySelector('#organization-search').value);
  const filtered = organizations.filter((item) => normalize(item).includes(search));
  document.querySelector('#organization-options').innerHTML = filtered.map((item) => `<button class="type-chip ${item === appState.organization ? 'selected' : ''}" data-organization="${item}">${item}</button>`).join('');
}

function filteredInstitutions() {
  if (!appState.organization) return [];
  const search = normalize(document.querySelector('#institution-search').value);
  return institutions.filter((item) => item.organization === appState.organization && normalize(item.name).includes(search));
}

function selectedInstitution() {
  return institutions.find((item) => item.id === appState.institution);
}

function selectedCampus() {
  return (campuses[appState.institution] || []).find((item) => item.id === appState.campus);
}

function renderInstitutions() {
  const field = document.querySelector('#institution-search');
  field.disabled = !appState.organization;
  field.placeholder = appState.organization ? 'Escolha ou digite a instituição' : 'Escolha primeiro a organização acadêmica';
  const list = filteredInstitutions();
  document.querySelector('#institution-options').innerHTML = list.map((item) => `<button class="institution-card ${item.id === appState.institution ? 'selected' : ''}" data-institution="${item.id}"><span class="logo-tile" data-fallback="${item.fallback}"><img src="${item.logo}" alt="${item.alt}"></span><span class="institution-copy"><strong>${item.name}</strong><small>${item.organization}</small></span><span class="status-badge">${item.status}</span></button>`).join('');
}

// BRUNO: atualiza campus conforme instituição selecionada.
function renderCampuses() {
  const field = document.querySelector('#campus-search');
  field.disabled = !appState.institution;
  field.placeholder = appState.institution ? 'Escolha ou digite o campus' : 'Escolha primeiro a instituição';
  const search = normalize(field.value);
  const list = appState.institution ? (campuses[appState.institution] || []).filter((item) => normalize(item.name).includes(search)) : [];
  document.querySelector('#campus-options').innerHTML = list.map((campus) => `<button class="option-card horizontal campus-card ${campus.id === appState.campus ? 'selected' : ''} ${campus.active ? '' : 'disabled future'}" data-campus="${campus.id}"><strong>${campus.name}</strong><span class="product-badge">${campus.status}</span></button>`).join('');
  renderInstitutionSummary();
}

function renderInstitutionSummary() {
  const institution = selectedInstitution();
  const campus = selectedCampus();
  const summary = document.querySelector('#institution-summary');
  if (!institution || !campus) {
    summary.hidden = true;
    summary.innerHTML = '';
    return;
  }
  summary.hidden = false;
  summary.innerHTML = `<span class="logo-tile compact-logo" data-fallback="${institution.fallback}"><img src="${institution.logo}" alt="${institution.alt}"></span><div><strong>${institution.name}</strong><small>Campus ${campus.name}</small><span class="product-badge">${campus.status}</span></div>`;
}

function selectRole(button) {
  appState.role = button.dataset.role;
  document.querySelector('#profile-alert').textContent = '';
  applySelection('[data-role]', button);
}

function selectOrganization(value) {
  appState.organization = value;
  appState.institution = null;
  appState.campus = null;
  document.querySelector('#organization-search').value = value;
  document.querySelector('#institution-search').value = '';
  document.querySelector('#campus-search').value = '';
  document.querySelector('#campus-alert').textContent = '';
  renderOrganizations();
  renderInstitutions();
  renderCampuses();
}

function selectInstitution(button) {
  appState.institution = button.dataset.institution;
  appState.campus = null;
  document.querySelector('#institution-search').value = selectedInstitution()?.name || '';
  document.querySelector('#campus-search').value = '';
  document.querySelector('#campus-alert').textContent = '';
  renderInstitutions();
  renderCampuses();
}

function selectCampus(button) {
  const campus = (campuses[appState.institution] || []).find((item) => item.id === button.dataset.campus);
  if (!campus?.active) {
    appState.campus = null;
    renderCampuses();
    document.querySelector('#campus-alert').textContent = 'Este campus ainda está em preparação para futuras fases do CampusMove.';
    return;
  }
  appState.campus = campus.id;
  document.querySelector('#campus-search').value = campus.name;
  document.querySelector('#campus-alert').textContent = '';
  renderCampuses();
}

function continueProfile() {
  if (!appState.role) {
    document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
    return;
  }
  if (appState.role === 'Aluno') return showScreen('campus');
  if (appState.role === 'Servidor') return showBlockedAccess('Acesso de servidor em preparação', 'No sistema real, servidores terão permissões institucionais específicas. Neste protótipo, o acesso de servidor ainda está bloqueado.');
  if (appState.role === 'Motorista') return showBlockedAccess('Acesso do motorista em preparação', 'Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente. O painel operacional será desenvolvido em etapa futura.');
  if (appState.role === 'Administrador') return prepareAdminLogin();
  return showScreen('visitor-access');
}

function continueCampus() {
  if (appState.organization !== 'Instituto Federal' || appState.institution !== 'ifce' || appState.campus !== 'maracanau') {
    document.querySelector('#campus-alert').textContent = 'Selecione IFCE e Campus Maracanaú para acessar o MVP MinhaJardineira.';
    return;
  }
  showScreen('login');
}

function showBlockedAccess(title, message) {
  document.querySelector('#blocked-title').textContent = title;
  document.querySelector('#blocked-message').textContent = message;
  showScreen('blocked-access');
}

function prepareAdminLogin() {
  document.querySelector('#restricted-login').dataset.title = 'Acesso administrativo';
  document.querySelector('#restricted-login').dataset.subtitle = 'Ambiente restrito';
  document.querySelector('#restricted-login-title').textContent = 'Acesso administrativo';
  document.querySelector('#restricted-warning').textContent = 'Acesso administrativo restrito.';
  document.querySelector('#restricted-description').textContent = 'Somente administradores autorizados podem acessar este ambiente.';
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
  document.querySelector('.profile-card p').textContent = isVisitor ? 'Acesso público sem dados acadêmicos protegidos' : 'Instituição: Instituto Federal do Ceará';
  document.querySelector('.profile-card small').textContent = isVisitor ? 'Eventos, horários e rotas públicas' : 'Campus: Maracanaú · Matrícula: DEMO-****';
  document.querySelector('.profile-card .product-badge').textContent = isVisitor ? 'Visitante' : 'Aluno do protótipo';
  document.querySelector('.avatar').textContent = isVisitor ? 'V' : 'B';
}

function login() {
  const loginValue = document.querySelector('#login-user').value.trim();
  const passwordValue = document.querySelector('#login-password').value;
  const authorized = demoCredentials.student.some((credential) => credential.login === loginValue && credential.password === passwordValue);
  if (!authorized) {
    document.querySelector('#login-alert').textContent = 'Use DEMO-BRUNO / 12345 para testar o acesso de aluno.';
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

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function startSplash() {
  const delay = appState.accessibility.reduceMotion ? 100 : 2300;
  window.setTimeout(() => showScreen('welcome'), delay);
}

// FELIPE: não renomear classes usadas pelo JS sem atualizar os seletores.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) showScreen(button.dataset.tab);
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.role) selectRole(button);
  if (button.dataset.organization) selectOrganization(button.dataset.organization);
  if (button.dataset.institution) selectInstitution(button);
  if (button.dataset.campus) selectCampus(button);
  if (button.dataset.action === 'continue-profile') continueProfile();
  if (button.dataset.action === 'continue-campus') continueCampus();
  if (button.dataset.action === 'login') login();
  if (button.dataset.action === 'restricted-login') restrictedLogin();
  if (button.dataset.action === 'visitor-home') enterApp(true);
  if (button.dataset.action === 'help-login') document.querySelector('#login-alert').textContent = 'Use DEMO-BRUNO / 12345 apenas para testar o protótipo.';
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
});

document.addEventListener('input', (event) => {
  const input = event.target;
  if (input.dataset.search === 'organization') renderOrganizations();
  if (input.dataset.search === 'institution') renderInstitutions();
  if (input.dataset.search === 'campus') renderCampuses();
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!image.matches('.logo-tile img, .splash-logo-box img')) return;
  image.hidden = true;
  image.parentElement.classList.add('logo-fallback');
}, true);

renderRoles();
renderOrganizations();
renderInstitutions();
renderCampuses();
updateAccessibilityUi();
showScreen('splash', false);
startSplash();
