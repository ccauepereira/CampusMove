import { appState } from '../state.js';
import { institutionalSchedules } from '../data/schedules.js';
import { formatMinutesToTime, formatRelativeDeparture, getCurrentMinutes, getNextDeparture, getScheduleStatus, isTodayOperationDay, parseTimeToMinutes } from '../utils.js';

const schedule = institutionalSchedules.ifceMaracanau;

export function getIfceSchedule() { return schedule; }
export function getScheduleDirection(directionId = appState.selectedScheduleDirection || 'station-to-campus') {
  return schedule?.directions?.find((direction) => direction.id === directionId) || schedule?.directions?.[1] || schedule?.directions?.[0] || null;
}

export function getDirectionNextDeparture(directionId, now = new Date()) {
  const direction = getScheduleDirection(directionId);
  if (!schedule || !direction) return { schedule, direction, status: { id: 'unavailable', label: 'Horário indisponível' }, next: null };
  const status = getScheduleStatus({ ...schedule, directions: [direction] }, now);
  const next = isTodayOperationDay(schedule.operationDays, now) ? getNextDeparture(direction.times, now) : null;
  return { schedule, direction, status, next };
}

function statusClass(statusId) { return `schedule-status schedule-status--${statusId || 'unavailable'}`; }
function arrivalFor(time, direction) { return formatMinutesToTime((parseTimeToMinutes(time) ?? 0) + (direction?.averageDurationMinutes || 0)); }

function selectedTimeDetail(direction, next) {
  const nowMinutes = getCurrentMinutes();
  const selectedTime = appState.selectedScheduleTime || next?.time || direction?.times?.[0];
  const selectedMinutes = parseTimeToMinutes(selectedTime);
  if (!direction || selectedMinutes === null) return '<article class="schedule-detail"><h3>Horário selecionado</h3><p>Selecione um horário para ver os detalhes demonstrativos.</p></article>';
  const diff = selectedMinutes - nowMinutes;
  const chipState = next?.time === selectedTime ? 'Próxima saída' : diff < 0 ? 'Horário já passou' : 'Selecionado para hoje';
  return `<article class="schedule-detail"><span class="product-badge">${chipState}</span><h3>${selectedTime}</h3><p><strong>Sentido:</strong> ${direction.label}</p><p><strong>Status relativo:</strong> ${formatRelativeDeparture(diff)}</p><p><strong>Chegada estimada:</strong> ${arrivalFor(selectedTime, direction)}</p><small>Estimativa por dados demonstrativos. Cálculo local do protótipo, sem rastreamento real.</small></article>`;
}

function renderTimeChips(direction, next) {
  const nowMinutes = getCurrentMinutes();
  return `<div class="schedule-time-grid">${(direction?.times || []).map((time) => {
    const minutes = parseTimeToMinutes(time);
    const isSelected = (appState.selectedScheduleTime || next?.time) === time;
    const isNext = next?.time === time;
    const isPast = minutes !== null && minutes < nowMinutes && !isNext;
    const state = isNext ? 'next' : isPast ? 'past' : 'future';
    const label = isNext ? 'próxima' : isPast ? 'já passou' : 'prevista';
    return `<button type="button" class="schedule-chip schedule-chip--${state} ${isSelected ? 'selected' : ''}" data-schedule-time="${time}" aria-pressed="${isSelected}"><strong>${time}</strong><span>${label}</span></button>`;
  }).join('')}</div>`;
}

export function renderSchedules() {
  const target = document.querySelector('#schedules');
  if (!target) return;
  if (!appState.selectedScheduleDirection) appState.selectedScheduleDirection = 'station-to-campus';
  const now = new Date();
  const currentTime = formatMinutesToTime(getCurrentMinutes(now));
  const { direction, status, next } = getDirectionNextDeparture(appState.selectedScheduleDirection, now);
  const overallStatus = getScheduleStatus(schedule, now);
  const nextTime = next?.time || '—';
  const relative = next ? formatRelativeDeparture(next.minutesUntil) : status.label;
  const alert = schedule.alerts?.find((item) => item.active);
  target.innerHTML = `<div class="schedule-screen-shell"><div class="screen-heading"><div><p class="eyebrow">Transporte institucional</p><h2 id="schedules-title">Horários do transporte</h2><p class="section-subtitle">Consulte horários demonstrativos do transporte institucional.</p><small>${schedule.timezoneNote}</small></div><span class="${statusClass(overallStatus.id)}">${overallStatus.label}</span></div>
    <article class="schedule-now-card"><div><span>Agora</span><strong>${currentTime}</strong><small>Baseado no horário do navegador</small></div><div><span>Serviço</span><strong>${schedule.serviceName}</strong><small>Sem integração oficial</small></div></article>
    <div class="schedule-direction-tabs" role="group" aria-label="Selecionar sentido do transporte">${schedule.directions.map((item) => `<button type="button" class="schedule-direction-tab ${item.id === direction?.id ? 'active selected' : ''}" data-schedule-direction="${item.id}" aria-pressed="${item.id === direction?.id}"><strong>${item.shortLabel}</strong><span>${item.origin} → ${item.destination}</span></button>`).join('')}</div>
    <article class="schedule-hero ${next ? 'has-next' : ''}"><span class="${statusClass(status.id)}">${next ? 'Próxima saída' : status.label}</span><small>${direction?.label || 'Sentido indisponível'}</small><h3>${nextTime}</h3><strong>${relative}</strong><p>Chegada estimada: ${next ? arrivalFor(next.time, direction) : '—'}</p><small>Horários demonstrativos · Cálculo local do protótipo · Sem rastreamento real</small></article>
    <section class="schedule-card smart-schedule-card"><h3>Horários demonstrativos</h3>${renderTimeChips(direction, next)}</section>
    ${selectedTimeDetail(direction, next)}
    ${alert ? `<article class="schedule-alert"><strong>${alert.title}</strong><p>${alert.message}</p><small>${schedule.disclaimer}</small></article>` : ''}</div>`;
}

export function selectScheduleDirection(directionId) {
  appState.selectedScheduleDirection = directionId;
  appState.selectedScheduleTime = null;
  renderSchedules();
}

export function selectScheduleTime(time) {
  appState.selectedScheduleTime = time;
  renderSchedules();
}
