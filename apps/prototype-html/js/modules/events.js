import { events } from '../data/events.js';

export function renderEvents() {
  const target = document.querySelector('#events-list');
  if (!target) return;
  target.innerHTML = events.map((item) => `<article class="event-card"><span class="product-badge">${item.status}</span><h3>${item.title}</h3><p><strong>Local:</strong> ${item.location}</p><p>Rota sugerida disponível · Dados demonstrativos.</p><button class="secondary-button event-route-button" data-event-route="${item.id}">Ver rota</button></article>`).join('');
}
