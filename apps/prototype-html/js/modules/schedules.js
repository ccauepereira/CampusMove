import { appState } from '../state.js';
import { institutionalSchedules, minhaJardineiraHonestyNote, minhaJardineiraOperatingWindows, transitRealSchedules } from '../data/schedules.js';
import { formatMinutesToTime, formatRelativeDeparture, generatePassesForWindow, getCurrentMinutes, getCurrentOrNextOperatingWindow, getMetroDemoTimesForHour, getNextPassFromWindows, getOperatingWindowsForHour, getRealTransitTimesForHour, parseTimeToMinutes } from '../utils.js';

const schedule = institutionalSchedules.ifceMaracanau;
const jardineiraImage = 'assets/vehicles/jardineira.png';

export function getIfceSchedule() { return schedule; }
export function getScheduleDirection(directionId = appState.selectedScheduleDirection || 'station-to-campus') {
  return schedule?.directions?.find((direction) => direction.id === directionId) || schedule?.directions?.[1] || schedule?.directions?.[0] || null;
}

export function getDirectionNextDeparture(directionId, now = new Date()) {
  const direction = getScheduleDirection(directionId);
  const result = getNextPassFromWindows(minhaJardineiraOperatingWindows, now, directionId);
  const status = result.status === 'current-window' ? { id: 'active-soon', label: 'Em janela de operação' } : result.status === 'next' ? { id: 'active-today', label: 'Próxima janela' } : result.status === 'tomorrow' ? { id: 'ended-today', label: 'Operação encerrada hoje' } : { id: 'unavailable', label: 'Horário indisponível' };
  const next = result.pass ? { time: result.pass.time, minutes: result.pass.minutes, minutesUntil: result.pass.minutesUntil, arrivalTime: result.pass.arrivalTime, window: result.window } : null;
  return { schedule, direction, status, next, window: result.window, windowState: result.state };
}

export function getInstitutionalLiveStatus(now = new Date()) {
  return getNextPassFromWindows(minhaJardineiraOperatingWindows, now);
}

function statusClass(statusId) { return `schedule-status schedule-status--${statusId || 'unavailable'}`; }
function selectedWindow() { return minhaJardineiraOperatingWindows.find((window) => window.id === appState.selectedScheduleWindow) || getCurrentOrNextOperatingWindow(minhaJardineiraOperatingWindows).window || minhaJardineiraOperatingWindows[0]; }
function windowStatus(window, now = new Date()) {
  const nowMinutes = getCurrentMinutes(now);
  const start = parseTimeToMinutes(window.startTime);
  const end = parseTimeToMinutes(window.endTime);
  if (start === null || end === null) return { state: 'unavailable', label: 'Indisponível' };
  if (nowMinutes >= start && nowMinutes <= end) return { state: 'next', label: 'Em janela de operação' };
  if (nowMinutes < start) return { state: 'future', label: 'Próxima janela' };
  return { state: 'past', label: 'Encerrada hoje' };
}
function passRows(window) {
  return generatePassesForWindow(window).map((pass) => `<p><strong>${pass.time}</strong><span>chegada ${pass.arrivalTime}</span></p>`).join('');
}
function realTransitBlock(hour) {
  const stations = ['virgilio-tavora', 'maracanau', 'parangaba'];
  const directionId = 'sentido-chico-da-silva';
  const rows = stations.map((stationId) => {
    const real = getRealTransitTimesForHour(transitRealSchedules, 'linhaSul', directionId, stationId, hour);
    const times = real.times.length ? real.times.join(', ') : getMetroDemoTimesForHour(hour).join(', ');
    const tier = real.times.length ? 'Horário extraído de grade pública. Não é integração em tempo real.' : 'Estimativa demonstrativa — sem dado real cadastrado para este horário/estação.';
    return `<p><strong>${real.station?.label || stationId}</strong><span>${times}</span><small>${tier}</small></p>`;
  }).join('');
  return `<section class="schedule-hour-group"><h4>Linha Sul · faixa ${String(hour).padStart(2, '0')}h</h4>${rows}<small>Grade pública Metrofor — dado estático do protótipo.</small></section>`;
}

function selectedWindowDetail(window) {
  if (!window) return '';
  const passes = generatePassesForWindow(window);
  const hour = Math.floor((parseTimeToMinutes(window.startTime) || 0) / 60);
  return `<article class="schedule-detail"><div class="schedule-detail-header"><span class="product-badge">Janela operacional</span><img class="schedule-service-visual" src="${jardineiraImage}" alt="Imagem ilustrativa da MinhaJardineira"></div><h3>Janela selecionada: ${window.startTime}–${window.endTime}</h3><div class="schedule-detail-grid"><p><strong>Serviço</strong><span>${schedule.serviceName}</span></p><p><strong>Sentido</strong><span>${window.label}</span></p><p><strong>Frequência</strong><span>A cada ${window.intervalMinutes} min</span></p><p><strong>Duração estimada</strong><span>${window.estimatedTripDurationMinutes} min</span></p></div><section class="schedule-hour-group"><h4>Faixa das ${String(hour).padStart(2, '0')}h</h4><p><strong>MinhaJardineira</strong><span>${passes.length} passagens geradas</span></p><div class="pass-list">${passRows(window)}</div></section>${realTransitBlock(hour)}<small>${minhaJardineiraHonestyNote}</small></article>`;
}

function renderWindowChips(directionId, now = new Date()) {
  const windows = minhaJardineiraOperatingWindows.filter((window) => window.direction === directionId);
  return `<div class="schedule-time-grid schedule-window-grid">${windows.map((window) => {
    const status = windowStatus(window, now);
    const selected = (appState.selectedScheduleWindow || selectedWindow()?.id) === window.id;
    return `<button type="button" class="schedule-chip schedule-window-chip schedule-chip--${status.state} ${selected ? 'selected' : ''}" data-schedule-window="${window.id}" aria-pressed="${selected}"><strong>${window.startTime}–${window.endTime}</strong><span>${window.label}</span><small>A cada ${window.intervalMinutes} min · ${status.label}</small></button>`;
  }).join('')}</div>`;
}

export function renderSchedules() {
  const target = document.querySelector('#schedules');
  if (!target) return;
  if (!appState.selectedScheduleDirection) appState.selectedScheduleDirection = 'station-to-campus';
  const now = new Date();
  const currentTime = formatMinutesToTime(getCurrentMinutes(now));
  const { direction, status, next, window } = getDirectionNextDeparture(appState.selectedScheduleDirection, now);
  if (!appState.selectedScheduleWindow && window) appState.selectedScheduleWindow = window.id;
  const activeWindow = selectedWindow();
  const relative = next ? formatRelativeDeparture(next.minutesUntil) : status.label;
  target.innerHTML = `<div class="schedule-screen-shell"><div class="screen-heading"><div><p class="eyebrow">Transporte institucional</p><h2 id="schedules-title">Horários do transporte</h2><p class="section-subtitle">Consulte janelas operacionais demonstrativas da MinhaJardineira.</p><small>${schedule.timezoneNote}</small></div><span class="${statusClass(status.id)}">${status.label}</span></div>
    <article class="schedule-now-card"><img class="vehicle-visual" src="${jardineiraImage}" alt="Imagem ilustrativa da MinhaJardineira"><div><span>Agora</span><strong>${currentTime}</strong><small>Baseado no horário do navegador</small></div><div><span>Serviço</span><strong>${schedule.serviceName}</strong><small>Sem rastreamento real</small></div></article>
    <div class="schedule-direction-tabs" role="group" aria-label="Selecionar sentido do transporte">${schedule.directions.map((item) => `<button type="button" class="schedule-direction-tab ${item.id === direction?.id ? 'active selected' : ''}" data-schedule-direction="${item.id}" aria-pressed="${item.id === direction?.id}"><strong>${item.shortLabel}</strong><span>${item.origin} → ${item.destination}</span></button>`).join('')}</div>
    <article class="schedule-hero ${next ? 'has-next' : ''}"><span class="${statusClass(status.id)}">${status.label}</span><small>${window ? `${window.startTime}–${window.endTime} · ${window.label}` : 'Sem janela operacional'}</small><h3>${next?.time || '—'}</h3><strong>${relative}</strong><p>Chegada estimada: ${next?.arrivalTime || '—'} · A cada ${window?.intervalMinutes || 15} min</p><small>${minhaJardineiraHonestyNote}</small></article>
    <section class="schedule-card smart-schedule-card"><h3>Janelas operacionais</h3>${renderWindowChips(appState.selectedScheduleDirection, now)}</section>
    ${selectedWindowDetail(activeWindow)}
    <article class="schedule-alert"><strong>Dados sem tempo real</strong><p>${minhaJardineiraHonestyNote}</p><small>Horários da Linha Sul exibidos como grade pública estática quando cadastrados.</small></article></div>`;
}

export function selectScheduleDirection(directionId) {
  appState.selectedScheduleDirection = directionId;
  appState.selectedScheduleWindow = minhaJardineiraOperatingWindows.find((window) => window.direction === directionId)?.id || null;
  renderSchedules();
}

export function selectScheduleTime(time) {
  appState.selectedScheduleTime = time;
  renderSchedules();
}

export function selectScheduleWindow(windowId) {
  const window = minhaJardineiraOperatingWindows.find((item) => item.id === windowId);
  if (!window) return;
  appState.selectedScheduleWindow = windowId;
  appState.selectedScheduleDirection = window.direction;
  renderSchedules();
}
