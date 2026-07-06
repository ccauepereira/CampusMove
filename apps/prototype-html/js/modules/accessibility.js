import { appState } from '../state.js';
import { simpleTexts } from '../data/institutions.js';

export function updateAccessibilityUi() {
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
  document.querySelector('#simple-example').textContent = appState.accessibility.simpleLanguage ? 'Este protótipo não usa rastreamento real. Mostrando uma posição simulada.' : 'SEM_SINAL';
}

export function toggleAccessibility(key) {
  appState.accessibility[key] = !appState.accessibility[key];
  updateAccessibilityUi();
}
