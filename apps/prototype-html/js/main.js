import { appState } from './state.js';
import { roles, environmentTypes, institutions, demoCredentials } from './data/institutions.js';
import { showScreen, goBack, registerScreenHook } from './router.js';
import { updateAccessibilityUi, toggleAccessibility } from './modules/accessibility.js';
import { setLocationMode, setRouteDirection, selectRouteScenario, simulateRoute, renderLocation, goToEventRoute, selectEventDestination, clearEventRoute } from './modules/location.js';
import { renderEvents } from './modules/events.js';
import { renderSchedules, selectScheduleDirection, selectScheduleTime } from './modules/schedules.js';
import { renderHome } from './modules/home.js';

const selectorUi = {
  openField: null,
  filters: { type: '', institution: '', campus: '', access: '' }
};

function clearSelection(groupSelector) {
  document.querySelectorAll(groupSelector).forEach((button) => button.classList.remove('selected', 'active', 'dimmed'));
}

function renderRoles() {
  document.querySelector('#role-options').innerHTML = roles.map((role) => `<button class="option-card role-card ${role.id === appState.role ? 'selected active' : ''} ${appState.role && role.id !== appState.role ? 'dimmed' : ''}" data-role="${role.id}" role="option"><span class="role-icon" aria-hidden="true">${role.icon}</span><strong>${role.title}</strong><small>${role.description}</small></button>`).join('');
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


function roleOptions() {
  return roles.map((role) => ({
    id: role.id,
    title: role.title,
    description: role.description,
    status: ['Servidor', 'Motorista'].includes(role.id) ? 'Em preparação' : role.id === 'Administrador' ? 'Acesso restrito' : 'Disponível'
  }));
}

function selectorStatusForInstitution(institution) {
  if (!institution) return 'Seleção necessária';
  if (institution.id === 'ifce') return 'MVP disponível no Campus Maracanaú';
  return institution.status || 'Em preparação';
}

function selectorOptions(field) {
  if (field === 'type') {
    return environmentTypes.map((type) => ({
      id: type.id,
      title: type.label,
      description: type.id === 'outra' ? 'Cadastro futuro para novas instituições' : 'Ambientes institucionais disponíveis',
      status: type.id === 'outra' ? 'Sob configuração' : 'Demonstrativo'
    }));
  }
  if (field === 'institution') {
    return institutionsForType().map((institution) => ({
      id: institution.id,
      title: institution.acronym,
      description: institution.name,
      status: selectorStatusForInstitution(institution),
      keywords: institution.keywords
    }));
  }
  if (field === 'campus') {
    const institution = selectedInstitution();
    return (institution?.campuses || []).map((campus) => ({
      id: campus.id,
      title: `Campus ${campus.name}`,
      description: campus.service,
      status: campus.status,
      keywords: campus.keywords
    }));
  }
  return roleOptions();
}

function selectedSelectorOption(field) {
  if (field === 'type') return selectorOptions(field).find((option) => option.id === appState.selectedType);
  if (field === 'institution') return selectorOptions(field).find((option) => option.id === appState.selectedInstitution);
  if (field === 'campus') return selectorOptions(field).find((option) => option.id === appState.selectedCampus);
  return selectorOptions(field).find((option) => option.id === appState.role);
}

function selectorPlaceholder(field) {
  return { type: 'Escolha o tipo', institution: 'Escolha a instituição', campus: 'Escolha o campus', access: 'Escolha o perfil' }[field];
}

function selectorHelper(field) {
  return { type: 'Categoria do ambiente institucional.', institution: 'Filtrado pelo tipo selecionado.', campus: 'Unidades configuradas nesta instituição.', access: 'Sincronizado com o perfil de acesso.' }[field];
}

function selectorDisabled(field) {
  if (field === 'institution') return !appState.selectedType || appState.selectedType === 'outra';
  if (field === 'campus') return !appState.selectedInstitution;
  return false;
}

function selectorMatches(option, filter) {
  if (!filter) return true;
  const values = [option.title, option.description, option.status, ...(option.keywords || [])];
  return values.some((value) => normalize(value).includes(filter));
}

function renderSelectorField(field, label) {
  const selected = selectedSelectorOption(field);
  const disabled = selectorDisabled(field);
  const isOpen = selectorUi.openField === field && !disabled;
  const filter = selectorUi.filters[field] || '';
  const filtered = selectorOptions(field).filter((option) => selectorMatches(option, normalize(filter)));
  const listId = `saas-${field}-listbox`;
  const badge = selected?.status ? `<span class="selector-status">${selected.status}</span>` : '';
  return `<article class="saas-select ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}">
    <span class="selector-label">${label}</span>
    <button class="selector-trigger" type="button" data-selector-trigger="${field}" aria-expanded="${isOpen}" aria-controls="${listId}" ${disabled ? 'disabled' : ''}>
      <span><strong>${selected?.title || selectorPlaceholder(field)}</strong><small>${selected?.description || selectorHelper(field)}</small></span>
      ${badge}<span class="selector-chevron" aria-hidden="true"></span>
    </button>
    ${isOpen ? `<div class="selector-popover" id="${listId}" role="listbox" aria-label="${label}">
      <label class="selector-search"><span>Filtrar ${label.toLowerCase()}</span><input type="text" value="${filter}" data-selector-filter="${field}" placeholder="Digite para filtrar" autocomplete="off"></label>
      <div class="selector-option-list">${filtered.length ? filtered.map((option) => `<button class="selector-option ${selected?.id === option.id ? 'selected' : ''}" type="button" data-selector-option="${field}" data-selector-value="${option.id}" role="option" aria-selected="${selected?.id === option.id}"><span class="check-mark" aria-hidden="true">${selected?.id === option.id ? '✓' : ''}</span><span><strong>${option.title}</strong><small>${option.description}</small></span><em>${option.status}</em></button>`).join('') : '<p class="helper-card">Nenhum resultado encontrado.</p>'}</div>
    </div>` : ''}
  </article>`;
}

function renderSaasSelector() {
  renderTypeOptions();
  renderInstitutions();
  renderCampuses();
  renderAccessOptions();
  renderStepper();
  updateContinueButton();
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
  document.querySelector('#type-options').innerHTML = renderSelectorField('type', 'Tipo de instituição');
}

function renderInstitutions() {
  document.querySelector('#institution-options').innerHTML = renderSelectorField('institution', 'Instituição');
}

function renderInstitutionCard(item) {
  const logo = item.logo ? `<img src="${item.logo}" alt="${item.alt}">` : '';
  return `<button class="institution-card ${item.id === appState.selectedInstitution ? 'selected active' : ''}" data-institution="${item.id}"><span class="logo-tile ${item.logo ? '' : 'logo-fallback'}" data-fallback="${item.fallback}">${logo}</span><span class="institution-copy"><strong>${item.acronym}</strong><b>${item.name}</b><small>${item.type}</small><em>Serviço: ${item.service}</em></span><span class="status-badge">${item.status}</span></button>`;
}

// BRUNO: selecionar tipo limpa instituição e campus.
function renderCampuses() {
  document.querySelector('#campus-options').innerHTML = renderSelectorField('campus', 'Campus/unidade');
  renderInstitutionSummary();
}

function renderAccessOptions() {
  const target = document.querySelector('#access-options');
  if (!target) return;
  target.innerHTML = renderSelectorField('access', 'Perfil de acesso');
}

function roleIsRestricted() {
  return ['Servidor', 'Motorista'].includes(appState.role);
}

function roleIsVisitor() {
  return appState.role === 'Visitante';
}

function roleIsAdmin() {
  return appState.role === 'Administrador';
}

function renderInstitutionSummary() {
  const institution = selectedInstitution();
  const campus = selectedCampus();
  const summary = document.querySelector('#institution-summary');
  if (appState.selectedType === 'outra') {
    summary.hidden = false;
    summary.innerHTML = `<div><span class="product-badge">Sob configuração</span><h3>Nova instituição</h3><p>CampusMove pode ser configurado para novas instituições.</p></div><dl><dt>Tipo</dt><dd>Outra instituição</dd><dt>Perfil</dt><dd>${appState.role || 'Aluno'}</dd><dt>Status</dt><dd>Sob configuração</dd></dl><p>Ambiente previsto para expansão multi-instituição.</p>`;
    updateContinueButton();
    renderStepper();
    return;
  }
  if (!institution || !campus) {
    summary.hidden = true;
    summary.innerHTML = '';
    updateContinueButton();
    renderStepper();
    return;
  }
  const activeMvp = canContinueCampus();
  const status = activeMvp ? 'MVP disponível' : 'Em preparação';
  const readyText = activeMvp ? 'Este ambiente demonstrativo libera o protótipo CampusMove.' : 'Ambiente previsto para expansão multi-instituição.';
  const serviceNote = activeMvp ? '<p class="service-note">Serviço ativo neste ambiente: MinhaJardineira.</p>' : '';
  summary.hidden = false;
  summary.innerHTML = `<div><span class="product-badge">${status}</span><h3>${institution.acronym} · Campus ${campus.name}</h3><p>${institution.name}</p></div><dl><dt>Tipo</dt><dd>${institution.type}</dd><dt>Perfil</dt><dd>${appState.role || 'Aluno'}</dd><dt>Serviços por campus</dt><dd>${campus.service}</dd><dt>Status</dt><dd>${campus.status}</dd></dl><p>${readyText}</p>${serviceNote}`;
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
  else if (roleIsRestricted()) button.textContent = 'Perfil em preparação';
  else if (roleIsVisitor()) button.textContent = 'Entrar como visitante';
  else if (roleIsAdmin()) button.textContent = 'Continuar para acesso restrito';
  else button.textContent = 'Continuar para login institucional';
  const disabled = !canContinueCampus() || roleIsRestricted();
  button.classList.toggle('is-disabled', disabled);
  button.disabled = disabled;
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
  selectorUi.openField = null;
  selectorUi.filters.institution = '';
  selectorUi.filters.campus = '';
  document.querySelector('#campus-alert').textContent = '';
  renderSaasSelector();
}

function selectInstitution(button) {
  appState.selectedInstitution = button.dataset.institution;
  appState.selectedCampus = null;
  selectorUi.openField = null;
  selectorUi.filters.campus = '';
  document.querySelector('#campus-alert').textContent = '';
  renderSaasSelector();
}

function selectCampus(button) {
  appState.selectedCampus = button.dataset.campus;
  selectorUi.openField = null;
  const campus = selectedCampus();
  document.querySelector('#campus-alert').textContent = campus?.active ? '' : 'Para testar o MVP MinhaJardineira, escolha IFCE → Maracanaú.';
  renderSaasSelector();
}

function selectAccessRole(roleId) {
  appState.role = roleId;
  selectorUi.openField = null;
  document.querySelector('#profile-alert').textContent = '';
  renderRoles();
  renderSaasSelector();
}

function selectSelectorOption(field, value) {
  if (field === 'type') return selectType({ dataset: { type: value } });
  if (field === 'institution') return selectInstitution({ dataset: { institution: value } });
  if (field === 'campus') return selectCampus({ dataset: { campus: value } });
  if (field === 'access') return selectAccessRole(value);
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
  if (roleIsVisitor()) return enterApp(true);
  if (appState.role === 'Servidor') return showBlockedAccess('Acesso de servidor em preparação', 'No sistema real, servidores terão permissões institucionais validadas pelo campus.', 'Neste protótipo, o acesso de servidor ainda não está liberado.');
  if (appState.role === 'Motorista') return showBlockedAccess('Acesso do motorista', 'Acesso operacional em preparação.', 'Apenas motoristas autorizados pela operação do campus poderão acessar este ambiente no sistema real.');
  if (roleIsAdmin()) return prepareAdminLogin();
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
  if (button.dataset.selectorTrigger) {
    selectorUi.openField = selectorUi.openField === button.dataset.selectorTrigger ? null : button.dataset.selectorTrigger;
    renderSaasSelector();
    return;
  }
  if (button.dataset.selectorOption) {
    selectSelectorOption(button.dataset.selectorOption, button.dataset.selectorValue);
    return;
  }
  if (!button.closest('.saas-select') && selectorUi.openField) {
    selectorUi.openField = null;
    renderSaasSelector();
  }
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
  if (button.dataset.action === 'clear-event-route') clearEventRoute();
  if (button.dataset.eventRoute) goToEventRoute(button.dataset.eventRoute);
  if (button.dataset.eventDestination) selectEventDestination(button.dataset.eventDestination);
  if (button.dataset.scheduleDirection) selectScheduleDirection(button.dataset.scheduleDirection);
  if (button.dataset.scheduleTime) selectScheduleTime(button.dataset.scheduleTime);
});

document.addEventListener('click', (event) => {
  if (selectorUi.openField && !event.target.closest('.saas-select')) {
    selectorUi.openField = null;
    renderSaasSelector();
  }
});

document.addEventListener('input', (event) => {
  const input = event.target;
  if (input.dataset.selectorFilter) {
    selectorUi.filters[input.dataset.selectorFilter] = input.value;
    renderSaasSelector();
    setTimeout(() => document.querySelector(`[data-selector-filter="${input.dataset.selectorFilter}"]`)?.focus(), 0);
  }
  if (input.dataset.search === 'institution') renderInstitutions();
  if (input.dataset.search === 'campus') renderCampuses();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && selectorUi.openField) {
    selectorUi.openField = null;
    renderSaasSelector();
  }
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!image.matches('.logo-tile img, .splash-logo-box img')) return;
  image.hidden = true;
  image.parentElement.classList.add('logo-fallback', 'logo-missing');
}, true);

registerScreenHook('home', renderHome);
registerScreenHook('schedules', renderSchedules);
registerScreenHook('location', renderLocation);
registerScreenHook('events', renderEvents);

renderRoles();
renderSaasSelector();
renderHome();
renderSchedules();
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
