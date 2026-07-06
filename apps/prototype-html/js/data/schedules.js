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
        times: ['07:00', '07:30', '08:00', '11:40', '12:10', '13:00', '17:20', '17:50', '18:20', '21:40']
      },
      {
        id: 'station-to-campus',
        label: 'Estação Virgílio Távora → IFCE',
        shortLabel: 'Estação → Campus',
        origin: 'Estação Virgílio Távora',
        destination: 'IFCE Campus Maracanaú',
        averageDurationMinutes: 8,
        times: ['06:40', '07:10', '07:40', '11:20', '11:50', '12:40', '17:00', '17:30', '18:00', '21:20']
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
