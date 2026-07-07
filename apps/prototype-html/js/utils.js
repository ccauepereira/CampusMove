export function normalizeText(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const weekDayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function parseTimeToMinutes(timeString) {
  if (typeof timeString !== 'string') return null;
  const match = timeString.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function getCurrentMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatMinutesToTime(minutes) {
  if (!Number.isFinite(minutes)) return '—';
  const normalized = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function getMinutesUntilDeparture(nowMinutes, departureMinutes) {
  if (!Number.isFinite(nowMinutes) || !Number.isFinite(departureMinutes)) return null;
  return departureMinutes - nowMinutes;
}

export function isTodayOperationDay(operationDays = [], now = new Date()) {
  if (!Array.isArray(operationDays) || !operationDays.length) return false;
  return operationDays.includes(weekDayKeys[now.getDay()]);
}

export function getNextDeparture(times = [], now = new Date()) {
  const nowMinutes = getCurrentMinutes(now);
  const parsed = (Array.isArray(times) ? times : [])
    .map((time) => ({ time, minutes: parseTimeToMinutes(time) }))
    .filter((item) => item.minutes !== null)
    .sort((a, b) => a.minutes - b.minutes);
  const next = parsed.find((item) => item.minutes >= nowMinutes);
  return next ? { ...next, minutesUntil: next.minutes - nowMinutes } : null;
}

export function getScheduleStatus(schedule, now = new Date()) {
  if (!schedule || !Array.isArray(schedule.directions) || !schedule.directions.length) return { id: 'unavailable', label: 'Horário indisponível' };
  if (!isTodayOperationDay(schedule.operationDays, now)) return { id: 'no-service-today', label: 'Sem operação demonstrativa hoje' };
  const allTimes = schedule.directions.flatMap((direction) => direction.times || []);
  const next = getNextDeparture(allTimes, now);
  if (!next) return { id: 'ended-today', label: 'Operação encerrada hoje' };
  if (next.minutesUntil <= 15) return { id: 'active-soon', label: 'Próxima saída' };
  if (next.minutesUntil <= 180) return { id: 'active-today', label: 'Em operação demonstrativa' };
  return { id: 'in-service-window', label: 'Operação prevista para hoje' };
}

export function formatRelativeDeparture(minutes) {
  if (!Number.isFinite(minutes)) return 'Horário indisponível';
  if (minutes === 0) return 'Saindo agora';
  if (minutes < 0) {
    const elapsed = Math.abs(minutes);
    return elapsed < 60 ? `Já passou há ${elapsed} min` : `Já passou há ${Math.floor(elapsed / 60)}h${String(elapsed % 60).padStart(2, '0')}`;
  }
  if (minutes === 1) return 'Sai em 1 min';
  if (minutes < 60) return `Sai em ${minutes} min`;
  return `Sai em ${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
}


export function parseDurationToMinutes(durationText) {
  const text = normalizeText(String(durationText || '')).replace(/[–—-]/g, ' a ').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const values = text.split(/\s+a\s+/).map((part) => {
    const hourMatch = part.match(/(\d+)\s*h/);
    const minuteMatch = part.match(/h\s*(\d+)|(?:^|\s)(\d+)\s*min?/);
    const bareNumber = part.match(/^(\d+)$/);
    const hours = hourMatch ? Number(hourMatch[1]) : 0;
    const minutes = minuteMatch ? Number(minuteMatch[1] || minuteMatch[2] || 0) : bareNumber ? Number(bareNumber[1]) : 0;
    const total = hours * 60 + minutes;
    return total > 0 ? total : null;
  }).filter((value) => value !== null);
  return values.length ? Math.max(...values) : null;
}

export function calculateEstimatedArrival(departureTime, routeDurationMinutes) {
  const departureMinutes = typeof departureTime === 'number' ? departureTime : parseTimeToMinutes(departureTime);
  if (departureMinutes === null || !Number.isFinite(routeDurationMinutes)) return null;
  return departureMinutes + routeDurationMinutes;
}

export function calculateArrivalMargin(targetTime, estimatedArrivalTime) {
  const targetMinutes = typeof targetTime === 'number' ? targetTime : parseTimeToMinutes(targetTime);
  if (targetMinutes === null || !Number.isFinite(estimatedArrivalTime)) return null;
  return targetMinutes - estimatedArrivalTime;
}

export function classifyTripReadiness(marginMinutes, scheduleStatus) {
  if (scheduleStatus === 'ended-today') return 'ended';
  if (scheduleStatus === 'no-service-today') return 'no-service';
  if (!Number.isFinite(marginMinutes)) return 'unavailable';
  if (marginMinutes >= 15) return 'on-time';
  if (marginMinutes >= 5) return 'tight';
  if (marginMinutes >= 0) return 'risk';
  return 'late';
}

export function getReadinessRecommendation(status) {
  return {
    'on-time': 'Siga com a próxima saída demonstrativa e mantenha uma pequena margem.',
    tight: 'Vá direto ao ponto de embarque e evite paradas no trajeto.',
    risk: 'Considere o Plano B demonstrativo ou antecipe a saída quando possível.',
    late: 'Use o Plano B demonstrativo; esta combinação não chega no alvo informado.',
    ended: 'Consulte os horários demonstrativos do próximo dia de operação.',
    'no-service': 'Use uma rota alternativa demonstrativa sem depender do transporte institucional.',
    unavailable: 'Complete os dados de horário alvo e duração para estimar a chegada.'
  }[status] || 'Análise demonstrativa indisponível.';
}

export function getPlanBRecommendation(context = {}) {
  const reason = context.status === 'ended' ? 'a operação institucional estiver encerrada' : context.status === 'no-service' ? 'não houver operação demonstrativa' : 'houver risco de atraso';
  return {
    label: 'Transporte público demonstrativo + caminhada',
    estimatedRange: context.event ? '40–60 min' : '35–50 min',
    whenToUse: `Indicado quando ${reason}.`,
    limitation: 'Plano B demonstrativo, sem integração oficial.'
  };
}

export function getScheduleHourGroup(timeString) {
  const minutes = parseTimeToMinutes(timeString);
  if (minutes === null) return null;
  return Math.floor(minutes / 60);
}

export function getDeparturesForHour(times = [], hour) {
  if (!Number.isInteger(hour)) return [];
  return (Array.isArray(times) ? times : []).filter((time) => getScheduleHourGroup(time) === hour);
}

export function addMinutesToTime(timeString, minutesToAdd) {
  const minutes = parseTimeToMinutes(timeString);
  if (minutes === null || !Number.isFinite(minutesToAdd)) return '—';
  return formatMinutesToTime(minutes + minutesToAdd);
}

export function formatMinutesHuman(minutes) {
  if (!Number.isFinite(minutes)) return '—';
  const abs = Math.abs(Math.round(minutes));
  if (abs < 60) return `${abs} min`;
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  return mins ? `${hours}h${String(mins).padStart(2, '0')}` : `${hours}h`;
}

export function formatDelayHuman(minutes) {
  return `Atraso estimado: ${formatMinutesHuman(minutes)}`;
}

export function generatePassesForWindow(window) {
  const start = parseTimeToMinutes(window?.startTime);
  const end = parseTimeToMinutes(window?.endTime);
  const interval = Number(window?.intervalMinutes || 15);
  if (start === null || end === null || !Number.isFinite(interval) || interval <= 0) return [];
  const passes = [];
  for (let cursor = start; cursor <= end; cursor += interval) {
    passes.push({ time: formatMinutesToTime(cursor), minutes: cursor, arrivalTime: formatMinutesToTime(cursor + (window.estimatedTripDurationMinutes || 8)) });
  }
  return passes;
}

export function getCurrentOrNextOperatingWindow(windows = [], now = new Date(), direction = null) {
  const nowMinutes = getCurrentMinutes(now);
  const candidates = (Array.isArray(windows) ? windows : []).filter((window) => !direction || window.direction === direction);
  const normalized = candidates.map((window) => ({ ...window, startMinutes: parseTimeToMinutes(window.startTime), endMinutes: parseTimeToMinutes(window.endTime) })).filter((window) => window.startMinutes !== null && window.endMinutes !== null).sort((a, b) => a.startMinutes - b.startMinutes);
  const current = normalized.find((window) => nowMinutes >= window.startMinutes && nowMinutes <= window.endMinutes);
  if (current) return { window: current, state: 'current', minutesUntilWindow: 0 };
  const next = normalized.find((window) => window.startMinutes > nowMinutes);
  if (next) return { window: next, state: 'next', minutesUntilWindow: next.startMinutes - nowMinutes };
  return normalized[0] ? { window: normalized[0], state: 'tomorrow', minutesUntilWindow: (24 * 60 - nowMinutes) + normalized[0].startMinutes } : { window: null, state: 'unavailable', minutesUntilWindow: null };
}

export function getNextPassFromWindows(windows = [], now = new Date(), direction = null) {
  const nowMinutes = getCurrentMinutes(now);
  const result = getCurrentOrNextOperatingWindow(windows, now, direction);
  if (!result.window) return { ...result, pass: null, status: 'unavailable' };
  const passes = generatePassesForWindow(result.window);
  const pass = result.state === 'current' ? passes.find((item) => item.minutes >= nowMinutes) : passes[0];
  if (!pass) return { ...result, pass: null, status: 'ended' };
  return { ...result, pass: { ...pass, minutesUntil: result.state === 'tomorrow' ? result.minutesUntilWindow : pass.minutes - nowMinutes }, status: result.state === 'current' ? 'current-window' : result.state };
}

export function getOperatingWindowsForHour(windows = [], hour) {
  if (!Number.isInteger(hour)) return [];
  return (Array.isArray(windows) ? windows : []).filter((window) => {
    const start = parseTimeToMinutes(window.startTime);
    const end = parseTimeToMinutes(window.endTime);
    return start !== null && end !== null && hour * 60 <= end && hour * 60 + 59 >= start;
  });
}

export function getRealTransitTimesForHour(schedule, lineId, directionId, stationId, hour) {
  const station = schedule?.[lineId]?.directions?.[directionId]?.stations?.[stationId];
  return { station, times: station?.timesByHour?.[hour] || [], note: schedule?.[lineId]?.note, sourceLabel: schedule?.[lineId]?.sourceLabel };
}

export function getMetroDemoTimesForHour(hour) {
  if (!Number.isInteger(hour)) return [];
  return [0, 15, 30, 45].map((minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
}
