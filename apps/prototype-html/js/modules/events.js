import { events } from '../data/events.js';

export function renderEvents() {
  const target = document.querySelector('#events-list');
  if (!target) return;
  target.innerHTML = events.map((item) => `<article class="event-card event-product-card"><div class="event-card__badges"><span class="product-badge">${item.institution}</span><span class="product-badge muted">${item.eventType}</span></div><h3>${item.title}</h3><p><strong>${item.locationLabel}</strong></p><p>${item.timeLabel} · ${item.status}</p><div class="route-badges mode-chip-row"><span class="route-badge mode-chip">${item.routeModeSummary}</span></div><small>${item.routeNote || 'Dados demonstrativos, sem integração oficial.'}</small><button class="secondary-button event-route-button" data-event-route="${item.id}">Ver rota</button></article>`).join('');
}
