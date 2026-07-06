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
