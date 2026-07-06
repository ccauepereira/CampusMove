import { getDirectionNextDeparture } from './schedules.js';
import { formatMinutesToTime, formatRelativeDeparture } from '../utils.js';

export function renderHome() {
  const hero = document.querySelector('#home .hero-card');
  if (!hero) return;
  const now = new Date();
  const dateTime = `${formatMinutesToTime(now.getHours() * 60 + now.getMinutes())} · ${now.toLocaleDateString('pt-BR')}`;
  const heading = document.querySelector('#home .screen-heading small');
  if (heading) heading.textContent = `Agora: ${dateTime} · Atualizado no navegador`;
  const { schedule, direction, status, next } = getDirectionNextDeparture('station-to-campus');
  const arrival = next ? formatMinutesToTime(next.minutes + (direction?.averageDurationMinutes || 0)) : '—';
  hero.innerHTML = `<div class="hero-kicker">Próxima viagem</div><div class="hero-route"><small>${schedule.serviceName}</small><h3 data-simple-key="homeRoute">${direction?.label || 'Transporte institucional'}</h3></div><div class="hero-meta"><span>Saída: <time>${next?.time || '—'}</time></span><span class="status-pill scheduled">${next ? 'Próxima saída' : status.label}</span><span class="vehicle-badge" aria-label="Transporte institucional" role="img"></span></div><strong class="countdown">${next ? formatRelativeDeparture(next.minutesUntil) : status.label}</strong><p class="home-arrival">Chegada estimada: ${arrival}</p><button type="button" class="secondary-button" data-go="schedules">Ver horários</button><small>Horários demonstrativos · Baseado no horário do navegador · Sem integração oficial</small>`;
  const statusCards = document.querySelectorAll('#home .status-card');
  if (statusCards[0]) statusCards[0].innerHTML = `<span class="pulse-dot"></span><strong>${status.label}</strong><small>Cálculo local do protótipo</small>`;
}
