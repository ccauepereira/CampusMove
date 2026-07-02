// BRUNO: estado central do protótipo para perfil, instituição e campus.
const appState = {
  currentScreen: 'welcome',
  history: ['welcome'],
  role: null,
  institutionType: 'Instituto Federal',
  institution: 'ifce',
  campus: null,
  userName: null,
  accessMode: null,
  selectedAdmin: 'Bruno',
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

// BRUNO: dados simulados das instituições e campus.
const institutionTypes = ['Instituto Federal', 'Universidade Federal', 'Universidade Estadual', 'Universidade da Integração', 'Faculdade / Centro Universitário'];
const institutions = [
  { id: 'ifce', fallback: 'IFCE', name: 'IFCE — Instituto Federal do Ceará', type: 'Instituto Federal', status: 'MVP ativo', logo: 'assets/institutions/ifce.png', alt: 'Logo do IFCE' },
  { id: 'ufc', fallback: 'UFC', name: 'UFC — Universidade Federal do Ceará', type: 'Universidade Federal', status: 'Em breve', logo: 'assets/institutions/ufc.png', alt: 'Logo da UFC' },
  { id: 'uece', fallback: 'UECE', name: 'UECE — Universidade Estadual do Ceará', type: 'Universidade Estadual', status: 'Em breve', logo: 'assets/institutions/uece.png', alt: 'Logo da UECE' },
  { id: 'unilab', fallback: 'UNILAB', name: 'UNILAB — Universidade da Integração Internacional da Lusofonia Afro-Brasileira', type: 'Universidade da Integração', status: 'Em breve', logo: 'assets/institutions/unilab.png', alt: 'Logo da UNILAB' },
  { id: 'fb', fallback: 'FB', name: 'FB Uni — Centro Universitário Farias Brito', type: 'Faculdade / Centro Universitário', status: 'Em breve', logo: 'assets/institutions/fb.png', alt: 'Logo da FB Uni' }
];
const campuses = {
  ifce: [
    { id: 'ifce-maracanau', name: 'IFCE Campus Maracanaú', status: 'MVP ativo', active: true },
    { id: 'ifce-fortaleza', name: 'IFCE Campus Fortaleza', status: 'Em breve' },
    { id: 'ifce-caucaia', name: 'IFCE Campus Caucaia', status: 'Em breve' },
    { id: 'ifce-sobral', name: 'IFCE Campus Sobral', status: 'Em breve' }
  ],
  ufc: [{ id: 'ufc-pici', name: 'UFC Campus do Pici', status: 'Em breve' }, { id: 'ufc-benfica', name: 'UFC Benfica', status: 'Em breve' }],
  uece: [{ id: 'uece-itaperi', name: 'UECE Itaperi', status: 'Em breve' }],
  unilab: [{ id: 'unilab-redencao', name: 'UNILAB Redenção/Acarape', status: 'Em breve' }],
  fb: [{ id: 'fb-fortaleza', name: 'FB Uni Fortaleza', status: 'Em breve' }]
};
const demoAdmins = [
  { name: 'Cauê', id: 'DEMO-CAUE' },
  { name: 'Bruno', id: 'DEMO-BRUNO' },
  { name: 'Felipe', id: 'DEMO-FELIPE' },
  { name: 'Pedro', id: 'DEMO-PEDRO' }
];

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
  backButton.style.visibility = screenId === 'welcome' ? 'hidden' : 'visible';
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

// BRUNO: classes .selected e .dimmed são aplicadas pelo JavaScript.
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

function renderInstitutionTypes() {
  document.querySelector('#institution-type-options').innerHTML = institutionTypes.map((type) => `<button class="type-chip ${type === appState.institutionType ? 'selected' : ''}" data-institution-type="${type}">${type}</button>`).join('');
}

function renderInstitutions() {
  document.querySelector('#institution-options').innerHTML = institutions.map((item) => {
    const selected = item.id === appState.institution ? 'selected' : '';
    const dimmed = item.id !== appState.institution ? 'dimmed' : '';
    const emphasized = item.type === appState.institutionType ? '' : 'type-muted';
    return `<button class="institution-card ${selected} ${dimmed} ${emphasized}" data-institution="${item.id}"><span class="logo-tile" data-fallback="${item.fallback}"><img src="${item.logo}" alt="${item.alt}"></span><span class="institution-copy"><strong>${item.name}</strong><small>${item.type}</small></span><span class="status-badge">${item.status}</span></button>`;
  }).join('');
}

// BRUNO: atualiza campus conforme instituição selecionada.
function renderCampuses() {
  const list = campuses[appState.institution] || [];
  document.querySelector('#campus-options').innerHTML = list.map((campus) => {
    const selected = campus.id === appState.campus ? 'selected' : '';
    const disabled = campus.active ? '' : 'disabled future';
    return `<button class="option-card horizontal campus-card ${selected} ${disabled}" data-campus="${campus.id}"><strong>${campus.name}</strong><span class="product-badge">${campus.status}</span></button>`;
  }).join('');
}

function renderAdmins() {
  document.querySelector('#admin-selector').innerHTML = demoAdmins.map((admin) => `<button class="admin-chip ${admin.name === appState.selectedAdmin ? 'selected' : ''}" data-admin-name="${admin.name}" data-demo-id="${admin.id}"><strong>${admin.name}</strong><small>${admin.id}</small></button>`).join('');
}

function selectRole(button) {
  appState.role = button.dataset.role;
  document.querySelector('#profile-alert').textContent = '';
  applySelection('[data-role]', button);
}

function selectInstitutionType(button) {
  appState.institutionType = button.dataset.institutionType;
  renderInstitutionTypes();
  renderInstitutions();
}

function selectInstitution(button) {
  appState.institution = button.dataset.institution;
  appState.campus = null;
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
  document.querySelector('#campus-alert').textContent = '';
  renderCampuses();
}

function continueProfile() {
  if (!appState.role) {
    document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
    return;
  }
  if (['Aluno', 'Servidor'].includes(appState.role)) return showScreen('campus');
  if (appState.role === 'Administrador') return prepareRestrictedLogin('Administrador');
  if (appState.role === 'Motorista') return prepareRestrictedLogin('Motorista');
  return showScreen('visitor-access');
}

function continueCampus() {
  if (appState.campus !== 'ifce-maracanau') {
    document.querySelector('#campus-alert').textContent = 'Selecione o IFCE Campus Maracanaú para acessar o MVP MinhaJardineira.';
    return;
  }
  showScreen('login');
}

function prepareRestrictedLogin(role) {
  appState.role = role;
  const isAdmin = role === 'Administrador';
  document.querySelector('#restricted-login').dataset.title = isAdmin ? 'Acesso administrativo' : 'Acesso do motorista';
  document.querySelector('#restricted-login').dataset.subtitle = isAdmin ? 'Ambiente restrito' : 'Operação do campus';
  document.querySelector('#restricted-login-title').textContent = isAdmin ? 'Acesso administrativo' : 'Acesso do motorista';
  document.querySelector('#restricted-warning').textContent = isAdmin ? 'Acesso administrativo restrito.' : 'Acesso operacional restrito.';
  document.querySelector('#restricted-description').textContent = isAdmin ? 'Somente administradores autorizados podem acessar este ambiente.' : 'O acesso do motorista depende da liberação da operação do campus.';
  document.querySelector('#admin-selector').hidden = !isAdmin;
  document.querySelector('#restricted-user').placeholder = isAdmin ? 'DEMO-BRUNO' : 'Matrícula ou e-mail demonstrativo';
  document.querySelector('#restricted-alert').textContent = '';
  renderAdmins();
  showScreen('restricted-login');
}

// BRUNO: controla fluxo de login visual por perfil.
function enterApp(visitor = false) {
  appState.userName = visitor ? 'Visitante' : (appState.role === 'Servidor' ? 'Servidor' : 'Bruno');
  document.querySelector('#home-title').textContent = `Olá, ${appState.userName}!`;
  document.querySelector('.profile-card h3').textContent = visitor ? 'Visitante' : appState.userName;
  document.querySelector('.profile-card p').textContent = visitor ? 'Acesso público sem dados acadêmicos protegidos' : 'IFCE — Instituto Federal do Ceará';
  document.querySelector('.profile-card small').textContent = visitor ? 'Eventos, horários e rotas públicas' : 'Campus: IFCE Campus Maracanaú';
  document.querySelector('.avatar').textContent = appState.userName[0];
  showScreen('home');
}

function login() {
  const message = appState.role === 'Servidor' ? 'Acesso de servidor autorizado para demonstração.' : 'Acesso autorizado para demonstração.';
  document.querySelector('#login-alert').textContent = message;
  enterApp(false);
}

function restrictedLogin() {
  if (appState.role === 'Administrador') {
    showAuthorization('Administrador', 'Aguardando autorização do sistema.', `Olá, ${appState.selectedAdmin}!`, 'Ambiente administrativo em preparação para próximas fases do CampusMove.');
    return;
  }
  showAuthorization('Motorista', 'Aguardando autorização da operação do campus.', 'Acesso operacional em preparação.', 'No sistema real, este ambiente controlará status da Jardineira, saída e localização autorizada.');
}

function showAuthorization(role, title, greeting, note) {
  document.querySelector('#authorization-role').textContent = role;
  document.querySelector('#authorization-title').textContent = title;
  document.querySelector('#authorization-greeting').textContent = greeting;
  document.querySelector('#authorization-note').textContent = note;
  document.querySelector('#authorization-continue').hidden = role !== 'Aluno' && role !== 'Servidor';
  showScreen('authorization');
}

function selectAdmin(button) {
  appState.selectedAdmin = button.dataset.adminName;
  document.querySelector('#restricted-user').value = button.dataset.demoId;
  renderAdmins();
}

function updateAccessibilityUi() {
  document.body.classList.toggle('large-text', appState.accessibility.largeText);
  document.body.classList.toggle('high-contrast', appState.accessibility.highContrast);
  document.body.classList.toggle('reduce-motion', appState.accessibility.reduceMotion);
  document.querySelectorAll('[data-access]').forEach((button) => {
    const active = appState.accessibility[button.dataset.access];
    button.classList.toggle('selected', active);
    const label = button.querySelector('span');
    if (label) label.textContent = active ? 'ativado' : 'desativado';
  });
  document.querySelector('#simple-example').textContent = appState.accessibility.simpleLanguage ? 'Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.' : 'SEM_SINAL';
}

function toggleAccessibility(key) {
  appState.accessibility[key] = !appState.accessibility[key];
  updateAccessibilityUi();
}

// FELIPE: não renomear classes usadas nos seletores sem atualizar o JS.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) showScreen(button.dataset.tab);
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.role) selectRole(button);
  if (button.dataset.institutionType) selectInstitutionType(button);
  if (button.dataset.institution) selectInstitution(button);
  if (button.dataset.campus) selectCampus(button);
  if (button.dataset.adminName) selectAdmin(button);
  if (button.dataset.action === 'continue-profile') continueProfile();
  if (button.dataset.action === 'continue-campus') continueCampus();
  if (button.dataset.action === 'login') login();
  if (button.dataset.action === 'restricted-login') restrictedLogin();
  if (button.dataset.action === 'visitor-home') enterApp(true);
  if (button.dataset.action === 'authorization-continue') enterApp(false);
  if (button.dataset.action === 'help-login') document.querySelector('#login-alert').textContent = 'Protótipo visual: use dados demonstrativos. A senha sugerida é 12345.';
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!image.matches('.logo-tile img')) return;
  image.hidden = true;
  image.parentElement.classList.add('logo-fallback');
}, true);

renderRoles();
renderInstitutionTypes();
renderInstitutions();
renderCampuses();
renderAdmins();
updateAccessibilityUi();
showScreen('welcome', false);
