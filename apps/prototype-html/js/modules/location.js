import { appState } from '../state.js';
import { transitLines, routeScenarios, eventRoutes } from '../data/routes.js';
import { getDirectionNextDeparture } from './schedules.js';
import { formatMinutesToTime, formatRelativeDeparture } from '../utils.js';
import { events } from '../data/events.js';
import { showScreen } from '../router.js';

const locationModes = [{ id: 'directions', label: 'Como chegar' }, { id: 'shuttle', label: 'Transporte institucional' }, { id: 'live', label: 'Ao vivo' }];
const modeLabels = { walk: 'Caminhada', bus: 'Ônibus', metro: 'Metrô/VLT', vlt: 'Metrô/VLT', shuttle: 'Transporte institucional', transfer: 'Integração', event: 'Evento', intercampus: 'Intercampus', regional: 'Regional' };
const confidenceLabels = { alta: 'Alta — baseada em regra fixa institucional', media: 'Média — baseada em intervalo médio estimado', baixa: 'Baixa — depende de trânsito e não há dado no protótipo' };

export function renderLocationTabs() {
  const target = document.querySelector('#location-tabs');
  if (!target) return;
  target.innerHTML = locationModes.map((mode) => `<button class="location-tab ${appState.locationMode === mode.id ? 'active' : ''}" data-location-mode="${mode.id}">${mode.label}</button>`).join('');
}

export function setLocationMode(mode) {
  appState.locationMode = mode;
  renderLocation();
}

export function setRouteDirection(direction) {
  appState.routeDirection = direction;
  const first = routeScenarios.inbound[0];
  appState.selectedScenario = first.id;
  appState.routeOrigin = direction === 'outbound' ? 'IFCE Campus Maracanaú' : first.origin;
  appState.routeDestination = direction === 'outbound' ? first.origin : (appState.selectedEventDestination || 'IFCE Campus Maracanaú');
  renderLocation();
}

export function selectRouteScenario(id) {
  const route = [...routeScenarios.inbound, ...routeScenarios.outbound].find((item) => item.id === id);
  if (!route) return;
  appState.selectedScenario = id;
  if (appState.routeDirection === 'outbound' && routeScenarios.inbound.some((item) => item.id === id)) {
    appState.routeOrigin = 'IFCE Campus Maracanaú';
    appState.routeDestination = id === 'outro-ifce' ? '' : route.origin;
  } else {
    appState.routeDirection = route.direction;
    appState.routeOrigin = id === 'outro-ifce' ? '' : route.origin;
    appState.routeDestination = appState.selectedEventDestination || route.destination;
  }
  renderLocation();
  if (id === 'outro-ifce') setTimeout(() => document.querySelector(appState.routeDirection === 'outbound' ? '#route-destination' : '#route-origin')?.focus(), 0);
}

export function simulateRoute() {
  const originField = document.querySelector('#route-origin');
  const destinationField = document.querySelector('#route-destination');
  if (originField) appState.routeOrigin = originField.value.trim() || appState.routeOrigin;
  if (destinationField) appState.routeDestination = destinationField.value;
  renderLocation();
}

// FELIPE: computeOverallConfidence aplica a regra “menor confiança entre as etapas”.
function computeOverallConfidence(route) {
  const order = { baixa: 0, media: 1, alta: 2 };
  return route.steps.reduce((lowest, step) => order[step.confidence] < order[lowest] ? step.confidence : lowest, 'alta');
}

function routeModes(route) {
  return [...new Set(route.steps.map((step) => modeLabels[step.mode] || step.label))];
}

function invertRoute(route) {
  return {
    ...route,
    id: `${route.id}-retorno`,
    routeType: 'Saindo do campus',
    origin: 'IFCE Campus Maracanaú',
    destination: route.origin,
    mainRoute: `Retorno demonstrativo para ${route.origin}`,
    steps: [...route.steps].reverse().map((step) => ({ ...step, from: step.to, to: step.from }))
  };
}

function getRouteMapVariant(route, context = appState.routeContext || 'normal') {
  if (context === 'event') return route.mapVariant || 'event';
  if (route?.steps?.some((step) => step.mode === 'shuttle') && route.steps.length === 1) return 'institutional';
  if (route?.steps?.some((step) => step.mode === 'transfer')) return 'integrated';
  return 'campus';
}

function renderRouteMapLegend(route, context = appState.routeContext || 'normal') {
  const modes = routeModes(route || { steps: [] });
  const chips = [...modes, ...(context === 'event' ? ['Evento'] : [])].slice(0, 6);
  return chips.map((mode) => `<span class="enhanced-map__mode-chip">${mode}</span>`).join('');
}

function renderRouteMapMarkers(route, context = appState.routeContext || 'normal') {
  const hasIntegration = route?.steps?.some((step) => step.mode === 'transfer');
  const destinationClass = context === 'event' ? 'enhanced-map__marker--event' : 'enhanced-map__marker--destination';
  const middleLabel = hasIntegration ? 'Integração' : route?.steps?.some((step) => ['metro', 'vlt'].includes(step.mode)) ? 'Estação' : route?.steps?.some((step) => step.mode === 'shuttle') ? 'Embarque' : 'Trajeto';
  return `<span class="enhanced-map__marker enhanced-map__marker--origin"><i></i><b>Origem</b></span><span class="enhanced-map__marker enhanced-map__marker--integration"><i></i><b>${middleLabel}</b></span><span class="enhanced-map__marker ${destinationClass}"><i></i><b>${context === 'event' ? 'Evento' : 'Destino'}</b></span>`;
}

function renderEnhancedRouteMap(route, options = {}) {
  const context = options.context || appState.routeContext || 'normal';
  const variant = options.variant || getRouteMapVariant(route, context);
  const title = context === 'event' ? 'Mapa demonstrativo do evento' : variant === 'live' ? 'Operação simulada' : 'Mapa demonstrativo';
  const destination = options.destination || route?.destinationLabel || route?.destination || 'Destino';
  const eta = options.eta || route?.estimatedTime || '6 a 10 min';
  return `<div class="enhanced-map enhanced-map--${variant}" role="img" aria-label="${title}. Dados demonstrativos, sem integração oficial.">
    <div class="enhanced-map__grid" aria-hidden="true"></div><div class="enhanced-map__surface" aria-hidden="true"></div>
    <svg class="enhanced-map__svg" viewBox="0 0 360 190" aria-hidden="true" focusable="false"><path class="enhanced-map__road" d="M18 54 C90 32 130 80 190 58 S284 30 342 70"/><path class="enhanced-map__road enhanced-map__road--thin" d="M34 142 C96 118 138 150 202 124 S288 116 330 148"/><path class="enhanced-map__route-alt" d="M58 132 C118 96 154 108 184 86"/><path class="enhanced-map__route" d="M42 132 C100 102 126 104 174 86 S252 54 318 76"/></svg>
    ${renderRouteMapMarkers(route, context)}
    <div class="enhanced-map__eta"><span>${route?.routeType || title}</span><strong>${eta}</strong><small>${destination}</small></div>
    <div class="enhanced-map__legend">${renderRouteMapLegend(route, context)}<span class="enhanced-map__badge">Mapa demonstrativo</span></div>
  </div>`;
}

function renderSimulatedMap(route, variant = 'route') {
  return renderEnhancedRouteMap(route, { variant: variant === 'route' ? undefined : variant, context: variant === 'live' ? 'live' : appState.routeContext || 'normal' });
}

function shortStepText(step) {
  const to = step.to.replace('IFCE Campus Maracanaú', 'campus').replace('Estação Virgílio Távora', 'Virgílio Távora');
  const detail = step.line ? step.line : `até ${to}`;
  return `${modeLabels[step.mode] || step.label} — ${detail}`;
}

function renderTripDiagnosis(route) {
  const confidence = computeOverallConfidence(route);
  const integrations = route.steps.filter((step) => step.mode === 'transfer').length;
  const recommendation = route.risk === 'alto' ? 'sair com margem de 20 min' : route.risk === 'medio' ? 'sair com margem de 10 min' : 'sem necessidade de margem extra';
  return `<article class="trip-diagnosis"><h4>Diagnóstico da viagem</h4><p><strong>Tempo estimado:</strong> ${route.estimatedTime}</p><p><strong>Modais:</strong> ${routeModes(route).join(' + ')}</p><p><strong>Integrações:</strong> ${integrations || 'nenhuma'}</p><p><strong>Risco:</strong> ${route.risk === 'none' ? '—' : route.risk}</p><p><strong>Confiança:</strong> ${confidence}</p><p><strong>Recomendação:</strong> ${recommendation}</p></article>`;
}

function minutesFromText(text) { const [h, m] = text.split(':').map(Number); return h * 60 + m; }
function timeFromMinutes(total) { const h = Math.floor((total % 1440) / 60); const m = total % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }
function nextDeparture(line, current) {
  const start = minutesFromText(line.operation.start), end = minutesFromText(line.operation.end);
  if (current < start || current > end) return null;
  return start + Math.ceil((current - start) / line.headwayMinutes) * line.headwayMinutes;
}

function institutionalDirectionForRoute(route) {
  if (!route?.steps?.some((step) => step.mode === 'shuttle')) return null;
  if (appState.routeContext === 'event') {
    const first = route.steps[0];
    if (first?.from?.includes('IFCE')) return 'campus-to-station';
    if (route.destination?.includes('IFCE') || route.destinationLabel?.includes('IFCE')) return 'station-to-campus';
    return null;
  }
  return appState.routeDirection === 'outbound' ? 'campus-to-station' : 'station-to-campus';
}

function renderInstitutionalScheduleEstimate(route) {
  const directionId = institutionalDirectionForRoute(route);
  if (!directionId) return '<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p>Esta rota não depende do transporte institucional no trecho principal.</p><small>Estimativa por dados demonstrativos, sem rastreamento real.</small></article>';
  const { schedule, direction, status, next } = getDirectionNextDeparture(directionId);
  if (!next) {
    const message = status.id === 'no-service-today' ? 'Sem operação demonstrativa hoje.' : status.id === 'ended-today' ? 'Transporte institucional encerrado hoje no dado demonstrativo.' : status.label;
    return `<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p>${message}</p><small>${schedule.disclaimer} ${schedule.timezoneNote}</small></article>`;
  }
  const arrival = formatMinutesToTime(next.minutes + (direction.averageDurationMinutes || 0));
  return `<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p><strong>${schedule.serviceName}:</strong> ${direction.label}</p><p><strong>Próxima saída demonstrativa:</strong> ${next.time} · ${formatRelativeDeparture(next.minutesUntil)}</p><p><strong>Chegada estimada:</strong> ${arrival}</p><small>Estimativa por dados demonstrativos. Cálculo local baseado no horário do navegador, sem integração oficial.</small></article>`;
}

function estimateDepartureNow(route) {
  if (route.steps.some((step) => step.mode === 'shuttle')) return renderInstitutionalScheduleEstimate(route);
  const timedSteps = route.steps.filter((step) => ['metro', 'vlt'].includes(step.mode));
  if (!timedSteps.length) return '<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p>Esta rota não depende do transporte institucional no trecho principal.</p><small>Estimativa baseada em intervalo médio, não em dado oficial em tempo real.</small></article>';
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();
  const rows = [];
  let cursor = current;
  for (const step of timedSteps) {
    const line = transitLines[step.lineId];
    const dep = line ? nextDeparture(line, cursor) : null;
    if (dep === null) rows.push(`<p>Fora do horário de operação estimado da linha: ${step.line || step.label}.</p>`);
    else { rows.push(`<p><strong>Próxima partida estimada (${step.line}):</strong> ${timeFromMinutes(dep)}</p>`); cursor = dep + 10; }
  }
  return `<article class="departure-estimate"><h4>Estimativa saindo agora</h4><p><strong>Saindo agora:</strong> ${timeFromMinutes(current)}</p>${rows.join('')}<p><strong>Chegada prevista:</strong> ${timeFromMinutes(cursor + 10)}</p><small>Estimativa baseada em intervalo médio, não em dado oficial em tempo real.</small></article>`;
}

function renderRouteResult(route, options = {}) {
  const confidence = computeOverallConfidence(route);
  const isEvent = options.context === 'event';
  const title = isEvent ? 'Rota para evento' : 'Sua rota multimodal';
  const badge = isEvent ? 'Evento acadêmico · rota demonstrativa' : appState.accessMode === 'visitor' ? 'Rota pública demonstrativa' : 'Rota demonstrativa';
  const origin = options.origin || appState.routeOrigin || route.originLabel || route.origin;
  const destination = options.destination || appState.routeDestination || route.destinationLabel || route.destination;
  const estimate = isEvent ? '' : estimateDepartureNow(route);
  return `<article class="route-card polished-route ${isEvent ? 'event-route-card' : ''}"><div class="route-card-header"><span class="product-badge">${badge}</span><h3>${title}</h3>${options.eventTitle ? `<p>${options.eventTitle}</p>` : ''}</div><div class="route-hero-summary"><p><strong>Origem</strong><span>${origin}</span></p><p><strong>Destino</strong><span>${destination}</span></p><p><strong>Tempo estimado</strong><span>${route.estimatedTime}</span></p></div>${renderEnhancedRouteMap(route, { context: isEvent ? 'event' : 'normal', destination })}<div class="route-badges mode-chip-row">${routeModes(route).map((mode) => `<span class="route-badge mode-chip">${mode}</span>`).join('')}${route.needsIntegration ? '<span class="route-badge mode-chip">Integração</span>' : ''}${isEvent ? '<span class="route-badge mode-chip">Evento</span>' : ''}</div><div class="route-timeline compact-timeline">${route.steps.map((step) => `<div class="route-step"><span class="route-dot"></span><strong>${shortStepText(step)}</strong><small>${step.durationText}</small><span class="route-confidence">${step.confidence}</span></div>`).join('')}</div><p class="route-confidence"><strong>Confiança geral:</strong> ${confidence[0].toUpperCase() + confidence.slice(1)} — estimado demonstrativo</p>${route.needsIntegration && route.riskLabel ? `<p class="route-risk">${route.riskLabel}</p>` : ''}${renderTripDiagnosis(route)}${estimate}<p class="privacy-note">${route.dataNote || 'Rota demonstrativa baseada em cenários locais.'} Dados demonstrativos, sem integração oficial.</p></article>`;
}

function selectedRoute() {
  const baseRoute = routeScenarios.inbound.find((route) => route.id === appState.selectedScenario) || routeScenarios.outbound.find((route) => route.id === appState.selectedScenario) || routeScenarios.inbound[1];
  return appState.routeDirection === 'outbound' && routeScenarios.inbound.some((route) => route.id === appState.selectedScenario) ? invertRoute(baseRoute) : baseRoute;
}

function selectedEventRoute() {
  if (!appState.selectedEventId) return null;
  const event = events.find((item) => item.id === appState.selectedEventId);
  const route = eventRoutes[appState.selectedEventId];
  return event && route ? { event, route } : null;
}

function renderEventRoutePanel() {
  const selected = selectedEventRoute();
  if (!selected) return '';
  const { event, route } = selected;
  return `<section class="location-panel active event-route-panel"><article class="event-route-hero"><span class="product-badge">Rota para evento</span><h3>${event.title}</h3><p><strong>Destino:</strong> ${event.locationLabel}</p><p>Esta é uma rota demonstrativa para evento acadêmico.</p><button type="button" class="secondary-button" data-action="clear-event-route">Voltar para rotas comuns</button></article>${renderRouteResult(route, { context: 'event', eventTitle: event.title, origin: route.originLabel, destination: route.destinationLabel })}</section>`;
}

function renderDirectionsPanel() {
  if (appState.routeContext === 'event') return renderEventRoutePanel();
  const route = selectedRoute();
  const inbound = appState.routeDirection === 'inbound';
  const scenarioChips = routeScenarios.inbound.map((item) => `<button class="type-chip ${item.id === appState.selectedScenario ? 'selected active' : ''}" data-route-scenario="${item.id}">${item.id === 'bruno-ifce' ? (appState.accessMode === 'visitor' ? 'Aluno — mora longe do campus' : 'Bruno') : item.id === 'outro-ifce' ? 'Outro endereço' : item.destination.replace('IFCE Campus Maracanaú', item.origin)}</button>`).join('');
  const chips = scenarioChips;
  const eventMessage = appState.selectedEventDestination ? '<p class="inline-alert">Rota até o evento selecionado.</p>' : '';
  return `<section class="location-panel active"><h3>Como chegar</h3><p class="section-subtitle">Escolha uma origem e destino para ver uma rota demonstrativa.</p><div class="direction-selector"><button class="location-tab ${inbound ? 'active' : ''}" data-route-direction="inbound">Chegar ao campus</button><button class="location-tab ${!inbound ? 'active' : ''}" data-route-direction="outbound">Sair do campus</button></div><div class="chip-grid">${chips}</div><div class="form-card route-form"><label>Origem<input id="route-origin" type="text" ${inbound ? '' : 'readonly'} placeholder="Digite bairro, ponto de referência ou cenário" value="${inbound ? appState.routeOrigin : 'IFCE Campus Maracanaú'}"></label><label>Destino${inbound ? `<select id="route-destination"><option ${appState.routeDestination === 'IFCE Campus Maracanaú' ? 'selected' : ''}>IFCE Campus Maracanaú</option><option ${appState.routeDestination === 'Estação Virgílio Távora' ? 'selected' : ''}>Estação Virgílio Távora</option><option ${appState.routeDestination === 'Auditório do IFCE Maracanaú' ? 'selected' : ''}>Auditório do IFCE Maracanaú</option><option ${appState.selectedEventDestination ? 'selected' : ''}>${appState.selectedEventDestination || 'Auditório do IFCE Maracanaú'}</option></select>` : `<input id="route-destination" type="text" placeholder="Digite bairro, ponto de referência ou cenário" value="${appState.routeDestination}">`}</label><button type="button" class="primary-button" data-action="simulate-route">Simular rota</button></div>${eventMessage}${renderRouteResult(route)}</section>`;
}

function renderShuttlePanel() {
  const route = { steps: [{ mode: 'shuttle', from: 'Estação Virgílio Távora', to: 'IFCE Campus Maracanaú' }] };
  return `<section class="location-panel active"><h3>Transporte institucional</h3><p class="section-subtitle">Trajeto demonstrativo entre ponto de embarque e campus.</p>${renderSimulatedMap(route, 'institutional')}<article class="route-card institutional-card"><span class="product-badge">Serviço ativo: MinhaJardineira</span><p><strong>Sentido principal:</strong> Estação Virgílio Távora → IFCE Campus Maracanaú</p><p><strong>Retorno:</strong> IFCE Campus Maracanaú → Estação Virgílio Távora</p><p><strong>Tempo médio:</strong> 6 a 10 minutos</p><p><strong>Status:</strong> Operação simulada</p><p><strong>Dados:</strong> demonstrativos, sem rastreamento real</p><p><strong>Confiança:</strong> Alta — regra institucional fixa</p></article></section>`;
}

function renderLivePanel() {
  const route = { steps: [{ mode: 'shuttle', from: 'Ponto de embarque', to: 'Campus' }] };
  return `<section class="location-panel active"><h3>Ao vivo institucional</h3><p class="section-subtitle">Visualização simulada da operação do transporte institucional.</p>${renderSimulatedMap(route, 'live')}<article class="live-card"><h4>Jardineira 1</h4><p><strong>Status:</strong> Em movimento</p><p><strong>Posição simulada:</strong> Saindo do ponto de embarque</p><p><strong>Estimativa:</strong> Chega ao campus em 7 min</p></article><article class="live-card"><h4>Jardineira 2</h4><p><strong>Status:</strong> Aguardando saída</p><p><strong>Posição simulada:</strong> Campus</p><p><strong>Estimativa:</strong> Próxima saída operacional</p></article><p class="route-warning">Protótipo sem rastreamento real.</p></section>`;
}

// FELIPE: abas internas usam .active para controlar o modo visível.
export function renderLocation() {
  const target = document.querySelector('#location-panels');
  if (!target) return;
  renderLocationTabs();
  target.innerHTML = appState.locationMode === 'shuttle' ? renderShuttlePanel() : appState.locationMode === 'live' ? renderLivePanel() : renderDirectionsPanel();
}

export function goToEventRoute(eventId) {
  const item = events.find((eventItem) => eventItem.id === eventId);
  if (!item) return;
  appState.routeContext = 'event';
  appState.selectedEventId = eventId;
  appState.selectedSpecialRouteId = item.routeProfile;
  appState.selectedEventDestination = item.routeDestination || item.location;
  appState.locationMode = 'directions';
  appState.routeDirection = 'inbound';
  appState.routeDestination = item.routeDestination || item.location;
  showScreen('location');
  renderLocation();
}

export function clearEventRoute() {
  appState.routeContext = 'normal';
  appState.selectedEventId = null;
  appState.selectedSpecialRouteId = null;
  appState.selectedEventDestination = null;
  renderLocation();
}

export function selectEventDestination(value) {
  appState.selectedEventDestination = value;
  appState.routeDestination = value;
  renderLocation();
}
