export const institutionalSchedules = {
  ifceMaracanau: {
    serviceName: 'MinhaJardineira',
    disclaimer: 'Horários demonstrativos do MVP, sem integração oficial.',
    timezoneNote: 'Cálculo local baseado no horário do navegador.',
    directions: [
      {
        id: 'campus-to-station',
        label: 'IFCE → Estação Virgílio Távora',
        shortLabel: 'Campus → Estação',
        origin: 'IFCE Campus Maracanaú',
        destination: 'Estação Virgílio Távora',
        averageDurationMinutes: 8,
        times: ['07:00', '09:00', '11:00', '13:00', '15:00', '17:30']
      },
      {
        id: 'station-to-campus',
        label: 'Estação Virgílio Távora → IFCE',
        shortLabel: 'Estação → Campus',
        origin: 'Estação Virgílio Távora',
        destination: 'IFCE Campus Maracanaú',
        averageDurationMinutes: 8,
        times: ['07:30', '09:30', '11:30', '13:30', '15:30', '18:00']
      }
    ],
    operationDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    weekendMode: 'no-service',
    alerts: [
      {
        id: 'demo-normal-operation',
        type: 'info',
        title: 'Operação demonstrativa',
        message: 'Os horários exibidos são dados simulados do protótipo, sem integração oficial.',
        active: true
      }
    ]
  }
};

export const schedules = {
  outbound: institutionalSchedules.ifceMaracanau.directions[0].times,
  inbound: institutionalSchedules.ifceMaracanau.directions[1].times
};


export const transitSchedules = {
  metroSul: {
    serviceName: 'Metrô / VLT demonstrativo',
    dataStatus: 'demonstrative',
    disclaimer: 'Dados demonstrativos, sem integração oficial.',
    lines: [
      {
        id: 'linha-sul-demo',
        label: 'Linha Sul demonstrativa',
        headwayLabel: 'Intervalo demonstrativo',
        exactTimes: []
      }
    ]
  }
};
