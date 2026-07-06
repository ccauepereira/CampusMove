import { appState } from './state.js';

const screens = [...document.querySelectorAll('.screen')];
const contextLabel = document.querySelector('#screen-context');
const headerSubtitle = document.querySelector('#header-subtitle');
const bottomNav = document.querySelector('.bottom-nav');
const backButton = document.querySelector('[data-action="back"]');
const screenHooks = new Map();

export function registerScreenHook(screenId, callback) {
  screenHooks.set(screenId, callback);
}

export function showScreen(screenId, storeHistory = true) {
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
  screenHooks.get(screenId)?.();
  nextScreen.scrollTop = 0;
}

export function goBack() {
  if (appState.history.length <= 1) return showScreen('welcome', false);
  appState.history.pop();
  showScreen(appState.history.at(-1), false);
}

export function updateActiveTab() {
  document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('active', button.dataset.tab === appState.currentScreen));
}
