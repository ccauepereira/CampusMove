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
const organizations = [
  { name: 'Instituto Federal', keywords: ['IF', 'IFCE', 'Instituto', 'Instituto Federal'] },
  { name: 'Universidade Federal', keywords: ['UF', 'UFC', 'Universidade Federal', 'Federal'] },
  { name: 'Universidade Estadual', keywords: ['UE', 'UECE', 'Universidade Estadual', 'Estadual'] },
  { name: 'Universidade Internacional', keywords: ['UI', 'UNILAB', 'Internacional', 'Integração'] },
  { name: 'Centro Universitário', keywords: ['Centro', 'Centro Universitário', 'Uni', 'FB', 'Farias Brito'] },
  { name: 'Faculdade', keywords: ['Faculdade', 'Privada', 'Particular'] }
];
const institutions = [
  { id: 'ifce', fallback: 'IFCE', name: 'IFCE — Instituto Federal do Ceará', cleanName: 'Instituto Federal do Ceará', organization: 'Instituto Federal', status: 'MVP ativo', logo: 'assets/assets-logo/ifce.png', alt: 'Logo do IFCE', keywords: ['IFCE', 'IF', 'Instituto Federal', 'Ceará', 'Maracanaú'] },
  { id: 'ufc', fallback: 'UFC', name: 'UFC — Universidade Federal do Ceará', cleanName: 'Universidade Federal do Ceará', organization: 'Universidade Federal', status: 'Em breve', logo: 'assets/assets-logo/ufc.png', alt: 'Logo da UFC', keywords: ['UFC', 'UF', 'Universidade Federal', 'Ceará', 'Pici', 'Benfica'] },
  { id: 'uece', fallback: 'UECE', name: 'UECE — Universidade Estadual do Ceará', cleanName: 'Universidade Estadual do Ceará', organization: 'Universidade Estadual', status: 'Em breve', logo: 'assets/assets-logo/uece.png', alt: 'Logo da UECE', keywords: ['UECE', 'UE', 'Universidade Estadual', 'Itaperi'] },
  { id: 'unilab', fallback: 'UNILAB', name: 'UNILAB — Universidade da Integração Internacional da Lusofonia Afro-Brasileira', cleanName: 'UNILAB', organization: 'Universidade Internacional', status: 'Em breve', logo: 'assets/assets-logo/unilab.png', alt: 'Logo da UNILAB', keywords: ['UNILAB', 'UI', 'Internacional', 'Integração', 'Redenção', 'Acarape'] },
  { id: 'fb', fallback: 'FB', name: 'FB Uni — Centro Universitário Farias Brito', cleanName: 'Centro Universitário Farias Brito', organization: 'Centro Universitário', status: 'Em breve', logo: 'assets/assets-logo/fb.png', alt: 'Logo da FB Uni', keywords: ['FB', 'Farias Brito', 'Centro Universitário', 'Particular', 'Privada'] }
];
const campuses = {
  ifce: [
    { id: 'maracanau', name: 'Maracanaú', status: 'MVP ativo', active: true, keywords: ['Maracanaú', 'IFCE Maracanaú', 'Campus Maracanaú'] },
    { id: 'fortaleza', name: 'Fortaleza', status: 'Em breve', keywords: ['Fortaleza', 'IFCE Fortaleza'] },
    { id: 'caucaia', name: 'Caucaia', status: 'Em breve', keywords: ['Caucaia', 'IFCE Caucaia'] },
    { id: 'sobral', name: 'Sobral', status: 'Em breve', keywords: ['Sobral', 'IFCE Sobral'] }
  ],
  ufc: [{ id: 'pici', name: 'Pici', status: 'Em breve', keywords: ['Pici', 'Campus do Pici', 'UFC Pici'] }, { id: 'benfica', name: 'Benfica', status: 'Em breve', keywords: ['Benfica', 'UFC Benfica'] }],
  uece: [{ id: 'itaperi', name: 'Itaperi', status: 'Em breve', keywords: ['Itaperi', 'UECE Itaperi'] }],
  unilab: [{ id: 'redencao', name: 'Redenção/Acarape', status: 'Em breve', keywords: ['Redenção', 'Acarape', 'UNILAB', 'CE-060'] }],
  fb: [{ id: 'fortaleza', name: 'Fortaleza', status: 'Em breve', keywords: ['Fortaleza', 'Farias Brito', 'FB Uni'] }]
};

// BRUNO: credenciais demonstrativas; não representam autenticação real.
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
  institutionHelper: ['Escolha sua instituição e campus. Neste MVP, Maracanaú já está ativo.', 'Escolha a instituição e o campus. Agora, só Maracanaú está disponível.'],
  institutionNote: ['CampusMove é uma plataforma multi-instituição. Neste MVP, o campus ativo é o IFCE Campus Maracanaú.', 'Escolha sua instituição e seu campus.'],
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

function keywordMatches(item, search) {
  if (!search) return true;
  const values = [item.name, item.organization, ...(item.keywords || [])];
  return values.some((value) => normalize(value).includes(search));
}

function findOrganizationByKeyword(search) {
  if (!search) return null;
  return organizations.find((item) => keywordMatches(item, search));
}

function renderOrganizations() {
  const search = normalize(document.querySelector('#organization-search').value);
  const keywordMatch = findOrganizationByKeyword(search);
  if (keywordMatch && appState.organization !== keywordMatch.name) {
    appState.organization = keywordMatch.name;
    appState.institution = null;
    appState.campus = null;
    document.querySelector('#institution-search').value = '';
    document.querySelector('#campus-search').value = '';
  }
  if (search && !keywordMatch) {
    appState.organization = null;
    appState.institution = null;
    appState.campus = null;
  }
  const filtered = organizations.filter((item) => keywordMatches(item, search));
  document.querySelector('#organization-options').innerHTML = filtered.length
    ? filtered.map((item) => `<button class="type-chip compact-chip ${item.name === appState.organization ? 'selected' : ''}" data-organization="${item.name}">${item.name}</button>`).join('')
    : '<p class="helper-card">Nenhuma organização encontrada para esse termo.</p>';
  renderInstitutions();
  renderCampuses();
}

function filteredInstitutions() {
  const search = normalize(document.querySelector('#institution-search').value);
  if (!appState.organization && !search) return [];
  return institutions.filter((item) => {
    const organizationMatches = appState.organization ? item.organization === appState.organization : true;
    return organizationMatches && keywordMatches(item, search);
  });
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
  field.placeholder = appState.organization ? 'Digite IFCE, UFC, UECE, UNILAB, FB ou o nome da instituição' : 'Escolha primeiro a organização acadêmica';
  const list = filteredInstitutions();
  const target = document.querySelector('#institution-options');
  if (!appState.organization) {
    target.innerHTML = '<p class="helper-card">Escolha uma organização acadêmica para ver instituições disponíveis.</p>';
    return;
  }
  if (appState.organization === 'Faculdade') {
    target.innerHTML = '<p class="helper-card">Nenhuma faculdade ativa neste MVP. Tente Centro Universitário para ver a FB Uni.</p>';
    return;
  }
  target.innerHTML = list.length
    ? list.map((item) => `<button class="institution-card ${item.id === appState.institution ? 'selected' : ''}" data-institution="${item.id}"><span class="logo-tile" data-fallback="${item.fallback}"><img src="${item.logo}" alt="${item.alt}"></span><span class="institution-copy"><strong>${item.name}</strong><small>${item.organization}</small></span><span class="status-badge">${item.status}</span></button>`).join('')
    : '<p class="helper-card">Nenhuma instituição encontrada para esse termo.</p>';
}

// BRUNO: atualiza campus conforme instituição selecionada.
function renderCampuses() {
  const field = document.querySelector('#campus-search');
  field.disabled = !appState.institution;
  field.placeholder = appState.institution ? 'Digite Maracanaú, Fortaleza, Pici, Itaperi, Redenção...' : 'Escolha primeiro a instituição';
  const search = normalize(field.value);
  const target = document.querySelector('#campus-options');
  if (!appState.institution) {
    target.innerHTML = '<p class="helper-card">Escolha uma instituição antes de selecionar o campus.</p>';
    renderInstitutionSummary();
    return;
  }
  const list = (campuses[appState.institution] || []).filter((item) => keywordMatches(item, search));
  target.innerHTML = list.length
    ? list.map((campus) => `<button class="option-card horizontal campus-card ${campus.id === appState.campus ? 'selected' : ''} ${campus.active ? '' : 'disabled future'}" data-campus="${campus.id}"><strong>Campus ${campus.name}</strong><span class="product-badge">${campus.status}</span></button>`).join('')
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
    document.querySelector('#campus-alert').textContent = 'Este campus ainda está em preparação. Para testar o MVP, escolha IFCE Maracanaú.';
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
  if (appState.role === 'Servidor') return showBlockedAccess('Acesso de servidor em preparação', 'No sistema real, servidores terão permissões institucionais validadas pelo campus.', 'Neste protótipo, o acesso de servidor ainda não está liberado.');
  if (appState.role === 'Motorista') return showBlockedAccess('Acesso do motorista', 'Acesso operacional em preparação.', 'Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente no sistema real. Este painel controlará status da Jardineira, saída e localização autorizada em fases futuras.');
  if (appState.role === 'Administrador') return prepareAdminLogin();
  return showScreen('visitor-access');
}

function continueCampus() {
  if (appState.organization !== 'Instituto Federal' || appState.institution !== 'ifce' || appState.campus !== 'maracanau') {
    document.querySelector('#campus-alert').textContent = 'Para acessar o MVP MinhaJardineira, escolha IFCE → Maracanaú.';
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
  simpleTexts.motoristRestriction = ['Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente no sistema real. Este painel controlará status da Jardineira, saída e localização autorizada em fases futuras.', 'Somente motoristas autorizados poderão entrar.'];
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
  if (button.dataset.action === 'help-login') document.querySelector('#login-alert').textContent = 'Use 20261045050612 / 12345 apenas para testar o protótipo.';
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
  image.parentElement.classList.add('logo-fallback', 'logo-missing');
}, true);

renderRoles();
renderOrganizations();
renderInstitutions();
renderCampuses();
updateAccessibilityUi();
showScreen('splash', false);
startSplash();
