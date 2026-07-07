# CampusMove Prototype Architecture

CampusMove is a no-build static HTML/CSS/JS prototype for a SaaS academic mobility platform. The active MVP service is MinhaJardineira for IFCE Campus Maracanaú.

## Run locally

```bash
cd apps/prototype-html
python3 -m http.server 5505
```

Open `http://localhost:5505`.

## Structure

- `index.html` loads CSS files in order and starts `./js/main.js` as an ES module.
- `css/base.css`: tokens, reset, base typography and app background.
- `css/layout.css`: shell, header, screen container and bottom navigation.
- `css/components.css`: common cards, buttons, forms, badges and base reusable UI.
- `css/screens.css`: screen-specific styles for splash, institution, login, profile and SaaS selector areas.
- `css/maps.css`: location module, route cards, simulated maps, route timelines and map/icon fixes.
- `css/accessibility.css`: final accessibility/reduced-motion overrides.
- `css/style.css`: final compatibility placeholder.
- `js/state.js`: one shared `appState` object.
- `js/router.js`: screen navigation, history and bottom-tab active state.
- `js/main.js`: composition root, bootstrap, render calls and event delegation.
- `js/data/`: institutions, route scenarios, schedules and events datasets.
- `js/icons.js` and `js/utils.js`: small shared helpers/placeholders for future extraction.

## Data strategy

Institution, route, event and schedule data are separated from rendering so later prompts can replace static data without rewriting the UI.

## Do not break

Future prompts must preserve Prompt 2 access flows, Prompt 3 route scenarios, confidence/risk/diagnosis, event-to-route behavior, accessibility toggles and the no-build static runtime.
