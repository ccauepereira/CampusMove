export const minhaJardineiraHonestyNote = 'Janela operacional informada pela rotina do campus. Pode variar conforme operação do dia. Sem rastreamento em tempo real.';

export const minhaJardineiraOperatingWindows = [
  { id: 'metro-to-campus-0700', startTime: '07:00', endTime: '08:15', direction: 'station-to-campus', label: 'Metrô → Campus', shortLabel: 'Estação → Campus', origin: 'Estação Virgílio Távora', destination: 'IFCE Campus Maracanaú', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-0945', startTime: '09:45', endTime: '10:00', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'metro-to-campus-1000', startTime: '10:00', endTime: '10:15', direction: 'station-to-campus', label: 'Metrô → Campus', shortLabel: 'Estação → Campus', origin: 'Estação Virgílio Távora', destination: 'IFCE Campus Maracanaú', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-1140', startTime: '11:40', endTime: '12:20', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'metro-to-campus-1300', startTime: '13:00', endTime: '13:40', direction: 'station-to-campus', label: 'Metrô → Campus', shortLabel: 'Estação → Campus', origin: 'Estação Virgílio Távora', destination: 'IFCE Campus Maracanaú', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-1530', startTime: '15:30', endTime: '16:15', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-1700', startTime: '17:00', endTime: '18:05', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'metro-to-campus-1820', startTime: '18:20', endTime: '18:30', direction: 'station-to-campus', label: 'Metrô → Campus', shortLabel: 'Estação → Campus', origin: 'Estação Virgílio Távora', destination: 'IFCE Campus Maracanaú', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-2010', startTime: '20:10', endTime: '20:35', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' },
  { id: 'campus-to-metro-2145', startTime: '21:45', endTime: '22:00', direction: 'campus-to-station', label: 'Campus → Metrô', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', intervalMinutes: 15, estimatedTripDurationMinutes: 8, confidence: 'approximate', honestyTier: 'operating-window', sourceLabel: 'Horário informado pela rotina do campus' }
];

export const transitRealSchedules = {
  linhaSul: {
    id: 'linha-sul',
    label: 'Linha Sul',
    honestyTier: 'extracted',
    sourceLabel: 'Grade pública Metrofor — dado estático do protótipo',
    realtime: false,
    note: 'Horário extraído de grade pública. Não é integração em tempo real.',
    directions: {
      'sentido-chico-da-silva': {
        label: 'Sentido Chico da Silva',
        stations: {
          'virgilio-tavora': { label: 'Virgílio Távora', timesByHour: { 5: ['05:35', '05:51'], 7: ['07:11', '07:27', '07:43', '07:59'] } },
          maracanau: { label: 'Maracanaú', timesByHour: { 5: ['05:33', '05:49'], 7: ['07:09', '07:25', '07:41', '07:57'] } },
          parangaba: { label: 'Parangaba', timesByHour: { 5: ['05:51'], 6: ['06:07'], 7: ['07:27', '07:43', '07:59'] } }
        }
      },
      'sentido-carlito-benevides': {
        label: 'Sentido Carlito Benevides',
        stations: {
          'virgilio-tavora': { label: 'Virgílio Távora', timesByHour: { 22: ['22:48'], 23: ['23:04', '23:20'] } },
          maracanau: { label: 'Maracanaú', timesByHour: { 22: ['22:46'], 23: ['23:02', '23:18'] } },
          parangaba: { label: 'Parangaba', timesByHour: { 22: ['22:59'], 23: ['23:15', '23:31'] } }
        }
      }
    }
  }
};

export const transitSchedules = {
  metroSul: {
    serviceName: 'Metrô / VLT demonstrativo',
    dataStatus: 'demonstrative',
    disclaimer: 'Estimativa demonstrativa — sem dado real cadastrado para este horário/estação.',
    lines: [{ id: 'linha-sul-demo', label: 'Linha Sul demonstrativa', headwayLabel: 'Intervalo demonstrativo', exactTimes: [] }]
  }
};

function legacyTimesFor(direction) {
  return minhaJardineiraOperatingWindows.filter((window) => window.direction === direction).map((window) => window.startTime);
}

export const institutionalSchedules = {
  ifceMaracanau: {
    serviceName: 'MinhaJardineira',
    disclaimer: minhaJardineiraHonestyNote,
    timezoneNote: 'Cálculo local baseado no horário do navegador.',
    operatingWindows: minhaJardineiraOperatingWindows,
    directions: [
      { id: 'campus-to-station', label: 'IFCE → Estação Virgílio Távora', shortLabel: 'Campus → Estação', origin: 'IFCE Campus Maracanaú', destination: 'Estação Virgílio Távora', averageDurationMinutes: 8, times: legacyTimesFor('campus-to-station') },
      { id: 'station-to-campus', label: 'Estação Virgílio Távora → IFCE', shortLabel: 'Estação → Campus', origin: 'Estação Virgílio Távora', destination: 'IFCE Campus Maracanaú', averageDurationMinutes: 8, times: legacyTimesFor('station-to-campus') }
    ],
    operationDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    weekendMode: 'no-service',
    alerts: [{ id: 'operating-window-note', type: 'info', title: 'Operação por janelas', message: minhaJardineiraHonestyNote, active: true }]
  }
};

export const schedules = {
  outbound: institutionalSchedules.ifceMaracanau.directions[0].times,
  inbound: institutionalSchedules.ifceMaracanau.directions[1].times
};
