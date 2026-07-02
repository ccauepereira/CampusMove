// ================================
// JAVASCRIPT: ESTADO BASE DO PROTÓTIPO
// ================================
const appState = {
  currentScreen: 'welcome',
  history: ['welcome'],
  selectedProfile: null,
  selectedCampus: null,
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
    simpleLanguage: false
  }
};

const screens = [...document.querySelectorAll('.screen')];
const contextLabel = document.querySelector('#screen-context');
const headerSubtitle = document.querySelector('#header-subtitle');
const bottomNav = document.querySelector('.bottom-nav');
const backButton = document.querySelector('[data-action="back"]');

// ================================
// JAVASCRIPT: NAVEGAÇÃO
// ================================
// BRUNO: controla a troca de telas principais do protótipo.
function showScreen(screenId, storeHistory = true) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen) return;

  screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
  appState.currentScreen = screenId;

  if (storeHistory && appState.history.at(-1) !== screenId) {
    appState.history.push(screenId);
  }

  contextLabel.textContent = nextScreen.dataset.title || 'CampusMove';
  headerSubtitle.textContent = nextScreen.dataset.subtitle || 'IFCE Campus Maracanaú';
  bottomNav.classList.toggle('visible', nextScreen.classList.contains('internal'));
  backButton.style.visibility = screenId === 'welcome' ? 'hidden' : 'visible';
  updateActiveTab();
  nextScreen.scrollTop = 0;
}

function goBack() {
  if (appState.history.length <= 1) {
    showScreen('welcome', false);
    return;
  }

  appState.history.pop();
  showScreen(appState.history.at(-1), false);
}

function updateActiveTab() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.classList.toggle('active', button.dataset.tab === appState.currentScreen);
  });
}

// ================================
// JAVASCRIPT: ESTADOS VISUAIS
// ================================
// BRUNO: aplica estado visual nos cards selecionáveis sem alterar dados reais.
function applySelection(groupSelector, selectedButton) {
  document.querySelectorAll(groupSelector).forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle('selected', isSelected);
    button.classList.toggle('dimmed', Boolean(selectedButton) && !isSelected);
  });
}

function selectProfile(button) {
  appState.selectedProfile = button.dataset.profile;
  document.querySelector('#profile-alert').textContent = '';
  applySelection('[data-profile]', button);
}

function selectCampus(button) {
  if (button.dataset.soon !== undefined) {
    document.querySelector('#campus-alert').textContent = 'Este campus aparece como em breve no protótipo.';
    return;
  }

  appState.selectedCampus = button.dataset.campus;
  document.querySelector('#campus-alert').textContent = '';
  applySelection('[data-campus]', button);
}

function continueProfile() {
  if (!appState.selectedProfile) {
    document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
    return;
  }
  showScreen('campus');
}

function continueCampus() {
  if (appState.selectedCampus !== 'IFCE Campus Maracanaú') {
    document.querySelector('#campus-alert').textContent = 'Selecione IFCE Campus Maracanaú para continuar.';
    return;
  }
  showScreen('login');
}

function enterApp(visitor = false) {
  document.querySelector('#home-title').textContent = visitor ? 'Olá, visitante!' : 'Olá, aluno!';
  showScreen('home');
}

// ================================
// JAVASCRIPT: ACESSIBILIDADE VISUAL
// ================================
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

  document.querySelector('#simple-example').textContent = appState.accessibility.simpleLanguage
    ? 'Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.'
    : 'SEM_SINAL';
}

function toggleAccessibility(key) {
  appState.accessibility[key] = !appState.accessibility[key];
  updateAccessibilityUi();
}

// ================================
// JAVASCRIPT: EVENTOS DA INTERFACE
// ================================
// FELIPE: não renomear classes usadas pelo JS sem atualizar estes seletores.
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) showScreen(button.dataset.tab);
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.profile) selectProfile(button);
  if (button.dataset.campus || button.dataset.soon !== undefined) selectCampus(button);
  if (button.dataset.action === 'continue-profile') continueProfile();
  if (button.dataset.action === 'continue-campus') continueCampus();
  if (button.dataset.action === 'login') enterApp(false);
  if (button.dataset.action === 'visitor') enterApp(true);
  if (button.dataset.action === 'help-login') {
    document.querySelector('#login-alert').textContent = 'Este é um acesso visual do protótipo. Não há autenticação real.';
  }
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
});

updateAccessibilityUi();
showScreen('welcome', false);
