// ================================
// JAVASCRIPT: DADOS SIMULADOS
// ================================
// MOCK: dados fixos do pitch, não representam backend real.
const mockData = {
  institutionType: 'Instituto Federal',
  institution: 'IFCE — Instituto Federal do Ceará',
  activeCampus: 'IFCE Campus Maracanaú',
  route: 'IFCE Campus Maracanaú ↔ Estação Virgílio Távora',
  ifceToStation: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:30'],
  stationToIfce: ['07:30', '09:30', '11:30', '13:30', '15:30', '18:00'],
  tripStates: ['AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'ATRASADA', 'CANCELADA'],
  locationStates: ['ONLINE', 'SEM_SINAL', 'SINAL_INSTAVEL', 'ULTIMA_POSICAO_CONHECIDA'],
  vehicleStates: ['DISPONIVEL', 'EM_MOVIMENTO', 'EM_MANUTENCAO', 'INDISPONIVEL']
};

const appState = {
  currentScreen: 'welcome',
  history: ['welcome'],
  selectedProfile: null,
  selectedCampus: null,
  visitorMode: false,
  remainingMinutes: 18,
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
    simpleLanguage: false,
    colorSafe: true
  }
};

const screens = [...document.querySelectorAll('.screen')];
const contextLabel = document.querySelector('#screen-context');
const bottomNav = document.querySelector('.bottom-nav');
const backButton = document.querySelector('[data-action="back"]');

// ================================
// JAVASCRIPT: NAVEGAÇÃO
// ================================
function showScreen(screenId, shouldStoreHistory = true) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen) return;

  screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
  appState.currentScreen = screenId;

  if (shouldStoreHistory && appState.history.at(-1) !== screenId) {
    appState.history.push(screenId);
  }

  contextLabel.textContent = nextScreen.dataset.title || 'MinhaJardineira';
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
// JAVASCRIPT: SELEÇÕES E LOGIN VISUAL
// ================================
function selectProfile(profile) {
  appState.selectedProfile = profile;
  document.querySelector('#profile-alert').textContent = '';
  document.querySelectorAll('[data-profile]').forEach((button) => {
    button.classList.toggle('selected', button.dataset.profile === profile);
  });
}

function selectCampus(campus) {
  appState.selectedCampus = campus;
  document.querySelector('#campus-alert').textContent = '';
  document.querySelectorAll('[data-campus]').forEach((button) => {
    button.classList.toggle('selected', button.dataset.campus === campus);
  });
}

function continueFromProfile() {
  if (!appState.selectedProfile) {
    document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
    return;
  }
  showScreen('campus');
}

function continueFromCampus() {
  if (appState.selectedCampus !== mockData.activeCampus) {
    document.querySelector('#campus-alert').textContent = 'Selecione IFCE Campus Maracanaú para continuar.';
    return;
  }
  showScreen('login');
}

function enterPrototype(asVisitor = false) {
  // FUTURO BACKEND: aqui entraria validação real de matrícula/e-mail institucional.
  appState.visitorMode = asVisitor;
  appState.selectedProfile = appState.selectedProfile || 'Visitante';
  appState.selectedCampus = appState.selectedCampus || mockData.activeCampus;
  document.querySelector('#home-title').textContent = asVisitor ? 'Olá, visitante!' : 'Olá, aluno!';
  showScreen('home');
}

// ================================
// JAVASCRIPT: ACESSIBILIDADE
// ================================
function updateAccessibilityUi() {
  document.body.classList.toggle('large-text', appState.accessibility.largeText);
  document.body.classList.toggle('high-contrast', appState.accessibility.highContrast);
  document.body.classList.toggle('reduce-motion', appState.accessibility.reduceMotion);
  document.body.classList.toggle('color-safe', appState.accessibility.colorSafe);

  document.querySelectorAll('[data-access]').forEach((button) => {
    const key = button.dataset.access;
    const isActive = appState.accessibility[key];
    button.classList.toggle('selected', isActive);
    const label = button.querySelector('span');
    if (label) label.textContent = isActive ? 'ativado' : 'desativado';
  });

  const simpleMessage = 'Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.';
  document.querySelector('#simple-example').textContent = appState.accessibility.simpleLanguage ? simpleMessage : 'SEM_SINAL';
  document.querySelector('[data-status-explanation]').textContent = appState.accessibility.simpleLanguage
    ? 'A jardineira está enviando localização agora.'
    : 'Localização recebida normalmente.';
}

function toggleAccessibility(key) {
  // ACESSIBILIDADE: classes ativadas pelos botões Texto maior, Alto contraste, Reduzir animações e Linguagem simples.
  appState.accessibility[key] = !appState.accessibility[key];
  updateAccessibilityUi();
}

// ================================
// JAVASCRIPT: TEMPO REAL SIMULADO
// ================================
function updateCountdown() {
  document.querySelector('#countdown-minutes').textContent = appState.remainingMinutes;
}

setInterval(() => {
  if (appState.remainingMinutes > 1) appState.remainingMinutes -= 1;
  updateCountdown();
}, 60000);

// ================================
// JAVASCRIPT: EVENTOS DA INTERFACE
// ================================
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) showScreen(button.dataset.tab);
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.action === 'continue-profile') continueFromProfile();
  if (button.dataset.action === 'continue-campus') continueFromCampus();
  if (button.dataset.action === 'login') enterPrototype(false);
  if (button.dataset.action === 'visitor') enterPrototype(true);
  if (button.dataset.action === 'help-login') {
    document.querySelector('#login-alert').textContent = 'No protótipo, o acesso é apenas visual. Toque em Entrar ou Entrar como visitante.';
  }
  if (button.dataset.profile) selectProfile(button.dataset.profile);
  if (button.dataset.campus) selectCampus(button.dataset.campus);
  if (button.dataset.soon !== undefined) {
    document.querySelector('#campus-alert').textContent = 'Este campus está marcado como em breve no piloto.';
  }
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
});

// BRUNO: centralizar a inicialização facilita substituir os mocks por chamadas de API no futuro.
// FELIPE: a tela de localização concentra o impacto visual do pitch e pode guiar ajustes finos de UI.
updateAccessibilityUi();
updateCountdown();
showScreen('welcome', false);
