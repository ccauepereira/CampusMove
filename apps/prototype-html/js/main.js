import { appState } from './state.js';
import { roles, environmentTypes, institutions, demoCredentials } from './data/institutions.js';
import { showScreen, goBack, registerScreenHook } from './router.js';
import { updateAccessibilityUi, toggleAccessibility } from './modules/accessibility.js';
import { setLocationMode, setRouteDirection, selectRouteScenario, simulateRoute, renderLocation, goToEventRoute, selectEventDestination } from './modules/location.js';
import { renderEvents } from './modules/events.js';

function clearSelection(groupSelector) {
  document.querySelectorAll(groupSelector).forEach((button) => button.classList.remove('selected', 'active', 'dimmed'));
}

function renderRoles() {
  document.querySelector('#role-options').innerHTML = roles.map((role) => `<button class="option-card role-card" data-role="${role.id}" role="option"><span class="role-icon" aria-hidden="true">${role.icon}</span><strong>${role.title}</strong><small>${role.description}</small></button>`).join('');
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



function startSplash() {
  const delay = appState.accessibility.reduceMotion ? 100 : 2300;
  window.setTimeout(() => showScreen('welcome'), delay);
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

registerScreenHook('location', renderLocation);
registerScreenHook('events', renderEvents);

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


window.campusMove = {
  showScreen,
  setLocationMode,
  setRouteDirection,
  selectRouteScenario,
  goToEventRoute,
  toggleAccessibility,
  selectRole,
  selectInstitution,
  selectCampus
};
