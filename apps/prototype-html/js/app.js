// ================================
// JAVASCRIPT: DADOS SIMULADOS
// ================================
// MOCK: dados fixos do pitch, sem backend real e sem endereço pessoal salvo.
const mockData = {
  student: { name: 'Bruno', role: 'Aluno', institution: 'IFCE — Instituto Federal do Ceará', campus: 'IFCE Campus Maracanaú' },
  route: 'IFCE Campus Maracanaú ↔ Estação Virgílio Távora',
  schedules: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:30'],
  reverseSchedules: ['07:30', '09:30', '11:30', '13:30', '15:30', '18:00'],
  adminNames: ['Cauê', 'Bruno', 'Felipe', 'Pedro'],
  institutionTypes: ['Instituto Federal', 'Universidade Federal', 'Universidade Estadual', 'Universidade da Integração', 'Faculdade / Centro Universitário'],
  institutions: [
    { type: 'Instituto Federal', name: 'IFCE — Instituto Federal do Ceará', campuses: ['IFCE Campus Maracanaú', 'IFCE Campus Fortaleza', 'IFCE Campus Caucaia', 'IFCE Campus Sobral'] },
    { type: 'Universidade Federal', name: 'UFC — Universidade Federal do Ceará', campuses: ['UFC Campus do Pici', 'UFC Benfica'] },
    { type: 'Universidade Estadual', name: 'UECE — Universidade Estadual do Ceará', campuses: ['UECE Itaperi'] },
    { type: 'Universidade da Integração', name: 'UNILAB — Universidade da Integração Internacional da Lusofonia Afro-Brasileira', campuses: ['UNILAB Redenção'] },
    { type: 'Faculdade / Centro Universitário', name: 'FB Uni — Centro Universitário Farias Brito', campuses: ['FB Uni Fortaleza'] }
  ]
};

const appState = {
  currentScreen: 'welcome', history: ['welcome'], selectedProfile: null, selectedType: 'Instituto Federal', selectedInstitution: 'IFCE — Instituto Federal do Ceará', selectedCampus: null, selectedAdmin: 'Cauê', visitorMode: false, eventRoute: false, avatarIndex: 0,
  accessibility: { largeText: false, highContrast: false, reduceMotion: false, simpleLanguage: false, colorSafe: true, colorBlind: false }
};

const screens = [...document.querySelectorAll('.screen')];
const bottomNav = document.querySelector('.bottom-nav');
const contextLabel = document.querySelector('#screen-context');
const headerSubtitle = document.querySelector('#header-subtitle');
const backButton = document.querySelector('[data-action="back"]');
const avatarOptions = ['B', '🎓', '🚌', '📍'];

// ================================
// JAVASCRIPT: NAVEGAÇÃO
// ================================
function showScreen(screenId, storeHistory = true) {
  const nextScreen = document.getElementById(screenId);
  if (!nextScreen) return;
  screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
  appState.currentScreen = screenId;
  if (storeHistory && appState.history.at(-1) !== screenId) appState.history.push(screenId);
  contextLabel.textContent = nextScreen.dataset.title || 'CampusMove';
  headerSubtitle.textContent = appState.visitorMode ? 'Acesso visitante' : 'IFCE Campus Maracanaú';
  bottomNav.classList.toggle('visible', nextScreen.classList.contains('internal') && !appState.visitorMode);
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

// ================================
// JAVASCRIPT: INSTITUIÇÕES E PERFIS
// ================================
function renderInstitutionOptions() {
  const typeBox = document.querySelector('#institution-types');
  const institutionBox = document.querySelector('#institutions');
  const campusBox = document.querySelector('#campuses');
  typeBox.innerHTML = mockData.institutionTypes.map((type) => `<button class="${type === appState.selectedType ? 'selected' : ''}" data-type="${type}">${type}</button>`).join('');
  const institutions = mockData.institutions.filter((item) => item.type === appState.selectedType);
  if (!institutions.some((item) => item.name === appState.selectedInstitution)) appState.selectedInstitution = institutions[0].name;
  institutionBox.innerHTML = institutions.map((item) => `<button class="${item.name === appState.selectedInstitution ? 'selected' : ''}" data-institution="${item.name}"><strong>${item.name}</strong><span>${item.name.startsWith('IFCE') ? 'MVP' : 'em breve'}</span></button>`).join('');
  const selected = mockData.institutions.find((item) => item.name === appState.selectedInstitution);
  campusBox.innerHTML = selected.campuses.map((campus) => {
    const active = campus === 'IFCE Campus Maracanaú';
    return `<button class="${campus === appState.selectedCampus ? 'selected' : ''} ${active ? '' : 'soon'}" data-campus="${campus}"><strong>${campus}</strong><span>${active ? 'MVP ativo' : 'em breve'}</span></button>`;
  }).join('');
}

function selectProfile(profile) {
  appState.selectedProfile = profile;
  document.querySelector('#profile-alert').textContent = '';
  document.querySelectorAll('[data-profile]').forEach((button) => button.classList.toggle('selected', button.dataset.profile === profile));
}

function continueFromProfile() {
  if (!appState.selectedProfile) return document.querySelector('#profile-alert').textContent = 'Escolha um perfil para continuar.';
  if (appState.selectedProfile === 'Visitante') return enterVisitor();
  renderInstitutionOptions();
  showScreen('campus');
}

function continueFromCampus() {
  if (appState.selectedCampus !== 'IFCE Campus Maracanaú') return document.querySelector('#campus-alert').textContent = 'Neste MVP, apenas IFCE Campus Maracanaú está ativo.';
  prepareLogin();
  showScreen('login');
}

function prepareLogin() {
  const restricted = ['Motorista', 'Administrador'].includes(appState.selectedProfile);
  document.querySelector('#login-mode').textContent = restricted ? 'Acesso restrito' : 'Login visual';
  document.querySelector('#admin-list').classList.toggle('hidden', appState.selectedProfile !== 'Administrador');
  document.querySelector('#visitor-note').classList.add('hidden');
}

function enterVisitor() {
  appState.visitorMode = true;
  document.querySelector('#visitor-note').classList.remove('hidden');
  document.querySelector('#event-route-context').classList.add('hidden');
  showScreen('events');
}

function enterPrototype() {
  if (appState.selectedProfile === 'Motorista') return showAuthorization('Olá, motorista!', 'Aguardando autorização da operação do campus.', 'O acesso do motorista depende da liberação da equipe responsável pela rota.');
  if (appState.selectedProfile === 'Administrador') return showAuthorization(`Olá, ${appState.selectedAdmin}!`, 'Aguardando autorização do sistema.', 'Acesso administrativo restrito. Somente administradores autorizados podem acessar este ambiente.');
  appState.visitorMode = false;
  document.querySelector('#home-title').textContent = 'Olá, Bruno!';
  updateScheduleUi();
  showScreen('home');
}

function showAuthorization(greeting, title, message) {
  document.querySelector('#authorization-title').textContent = title;
  document.querySelector('#authorization-greeting').textContent = greeting;
  document.querySelector('#authorization-message').textContent = message;
  showScreen('authorization');
}

// ================================
// JAVASCRIPT: HORÁRIOS E ROTAS
// ================================
function minutesFromTime(time) { const [h, m] = time.split(':').map(Number); return h * 60 + m; }
function formatClock(date) { return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); }
function formatMinutes(total) { return total > 0 ? `${total} min` : 'agora'; }
function getNextTrip(now = new Date()) {
  const current = now.getHours() * 60 + now.getMinutes();
  const next = mockData.schedules.map(minutesFromTime).find((time) => time >= current);
  if (next === undefined) return { status: 'Encerrado por hoje', nextLabel: '--:--', remaining: null };
  const label = `${String(Math.floor(next / 60)).padStart(2, '0')}:${String(next % 60).padStart(2, '0')}`;
  return { status: next === current ? 'Em operação' : 'Próxima viagem', nextLabel: label, remaining: next - current };
}
function averageInterval() {
  const values = mockData.schedules.map(minutesFromTime); const gaps = values.slice(1).map((value, index) => value - values[index]);
  return `${Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)} min`;
}
function updateScheduleUi() {
  const now = new Date(); const trip = getNextTrip(now);
  document.querySelector('#current-time').textContent = formatClock(now);
  document.querySelector('#next-departure').textContent = trip.nextLabel;
  document.querySelector('#schedule-countdown').textContent = trip.remaining === null ? 'Encerrado' : formatMinutes(trip.remaining);
  document.querySelector('#service-status').textContent = trip.status;
  document.querySelector('#average-interval').textContent = averageInterval();
  document.querySelector('#home-next-time').textContent = trip.nextLabel;
  document.querySelector('#home-countdown').innerHTML = trip.remaining === null ? 'Encerrado por hoje' : `Faltam <span>${trip.remaining}</span> min`;
  document.querySelector('#home-service-status').textContent = trip.status === 'Encerrado por hoje' ? '⏹️ Encerrado por hoje' : `🗓️ ${trip.status}`;
}
function deterministicTimes(text) {
  const length = Math.max(1, text.length);
  return { walk: 4 + (length % 7), bus: 10 + (length % 9), metro: 6 + (length % 7), shuttle: 5 + (length % 6) };
}
function simulateRoute() {
  const start = document.querySelector('#start-point').value.trim();
  const ref = document.querySelector('#reference-point').value.trim();
  const typed = [start, ref].filter(Boolean).join(' — ');
  const trip = getNextTrip(new Date());
  const times = deterministicTimes(typed || 'IFCE Campus Maracanaú');
  const total = times.walk + times.bus + times.metro + times.shuttle;
  document.querySelector('#route-origin').textContent = typed ? `Partida simulada: ${typed}` : 'Localização simulada: próximo ao IFCE Campus Maracanaú.';
  document.querySelector('#route-total').textContent = `${total} min`;
  document.querySelector('#route-next-shuttle').textContent = trip.remaining === null ? 'Sem viagem hoje' : trip.nextLabel;
  document.querySelector('#route-recommended').textContent = trip.remaining === null ? 'Operação encerrada por hoje. Consulte o próximo dia letivo.' : formatClock(new Date(Date.now() + Math.max(0, trip.remaining - total) * 60000));
  document.querySelector('#route-steps').innerHTML = `<li>Caminhada até a parada mais próxima — ${times.walk} min</li><li>Ônibus até a estação — ${times.bus} min</li><li>Metrô até Virgílio Távora — ${times.metro} min</li><li>Jardineira IFCE até o campus — ${times.shuttle} min</li>`;
}

// ================================
// JAVASCRIPT: ACESSIBILIDADE
// ================================
function updateAccessibilityUi() {
  Object.entries(appState.accessibility).forEach(([key, value]) => document.body.classList.toggle(key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), value));
  document.querySelectorAll('[data-access]').forEach((button) => { const active = appState.accessibility[button.dataset.access]; button.classList.toggle('selected', active); const span = button.querySelector('span'); if (span) span.textContent = active ? 'ativado' : 'desativado'; });
  const simple = appState.accessibility.simpleLanguage;
  document.querySelector('#welcome-title').textContent = simple ? 'Veja sua rota e os horários com facilidade.' : 'Mobilidade acadêmica simples, acessível e em tempo real.';
  document.querySelector('#simple-example').textContent = simple ? 'Não estamos recebendo a localização da jardineira agora. Mostrando a última posição conhecida.' : 'SEM_SINAL';
  document.querySelector('[data-route-note]').textContent = simple ? 'Esta rota é só um exemplo. Nenhum endereço é salvo.' : 'Esta rota é uma simulação para o protótipo. Nenhum endereço é salvo.';
  document.querySelector('[data-status-explanation]').textContent = simple ? 'A jardineira está enviando localização agora.' : 'Localização recebida normalmente.';
}
function toggleAccessibility(key) { appState.accessibility[key] = !appState.accessibility[key]; updateAccessibilityUi(); }

// ================================
// JAVASCRIPT: EVENTOS DA INTERFACE
// ================================
document.addEventListener('click', (event) => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.go) showScreen(button.dataset.go);
  if (button.dataset.tab) { updateScheduleUi(); showScreen(button.dataset.tab); }
  if (button.dataset.action === 'back') goBack();
  if (button.dataset.profile) selectProfile(button.dataset.profile);
  if (button.dataset.action === 'continue-profile') continueFromProfile();
  if (button.dataset.type) { appState.selectedType = button.dataset.type; appState.selectedInstitution = ''; appState.selectedCampus = null; renderInstitutionOptions(); }
  if (button.dataset.institution) { appState.selectedInstitution = button.dataset.institution; appState.selectedCampus = null; renderInstitutionOptions(); }
  if (button.dataset.campus) { appState.selectedCampus = button.dataset.campus; document.querySelector('#campus-alert').textContent = button.dataset.campus === 'IFCE Campus Maracanaú' ? '' : 'Este campus está em breve.'; renderInstitutionOptions(); }
  if (button.dataset.admin) { appState.selectedAdmin = button.dataset.admin; document.querySelectorAll('[data-admin]').forEach((item) => item.classList.toggle('selected', item.dataset.admin === appState.selectedAdmin)); }
  if (button.dataset.action === 'continue-campus') continueFromCampus();
  if (button.dataset.action === 'login') enterPrototype();
  if (button.dataset.action === 'visitor') enterVisitor();
  if (button.dataset.action === 'help-login') document.querySelector('#login-alert').textContent = 'Este é um acesso visual do protótipo. Não há autenticação real.';
  if (button.dataset.action === 'simulate-route') simulateRoute();
  if (button.dataset.action === 'event-route') { appState.eventRoute = true; document.querySelector('#event-route-context').classList.remove('hidden'); showScreen('location'); }
  if (button.dataset.action === 'change-avatar') { appState.avatarIndex = (appState.avatarIndex + 1) % avatarOptions.length; document.querySelector('#profile-avatar').textContent = avatarOptions[appState.avatarIndex]; }
  if (button.dataset.action === 'message-shuttle') document.querySelector('#profile-feedback').textContent = 'Mensagem simulada enviada para o responsável da jardineira.';
  if (button.dataset.access) toggleAccessibility(button.dataset.access);
});

// BRUNO: este bloco mantém o protótipo sem API e calcula horários com Date do navegador.
renderInstitutionOptions();
updateAccessibilityUi();
updateScheduleUi();
simulateRoute();
showScreen('welcome', false);
setInterval(updateScheduleUi, 30000);
