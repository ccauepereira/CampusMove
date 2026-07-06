// BRUNO: estado central do protótipo para perfil, instituição e campus.
export const appState = {
  currentScreen: 'splash',
  history: ['splash'],
  role: null,
  selectedType: null,
  selectedInstitution: null,
  selectedCampus: null,
  userName: null,
  accessMode: null,
  accessibility: {
    largeText: false,
    highContrast: false,
    reduceMotion: false,
    simpleLanguage: false
  },
  locationMode: 'directions',
  routeDirection: 'inbound',
  routeOrigin: 'Maraponga',
  routeDestination: 'IFCE Campus Maracanaú',
  selectedScenario: 'maraponga-ifce',
  selectedEventDestination: null,
  routeContext: 'normal',
  selectedEventId: null,
  selectedSpecialRouteId: null,
  departureEstimateResult: null
};

export function updateState(patch) {
  Object.assign(appState, patch);
}
