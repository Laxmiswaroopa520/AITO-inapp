# Standalone in-app data mode

This frontend has been converted to run without the SQL/API reference-data dependency and without MSAL authentication.

## What changed

- Workflow and Huddle reference data from the fresh-install SQL scripts is embedded under `src/data/`.
- The existing UI hooks still use the `ApiClient` interface, but `useApiClient()` now returns `createLocalApiClient()`.
- MSAL packages, provider bootstrap, login gate, token acquisition, and logout integration were removed.
- No `VITE_API_BASE_URL`, tenant ID, client ID, API scope, or redirect URI is required.
- Existing page structure, navigation, components, styling, and workflows were retained.

## Local user state

Browser `localStorage` is used for user-generated state that previously relied on backend persistence:

- saved workflows
- Huddle plans
- Huddle launch planner state
- Huddle votes
- Huddle session progress

Clearing browser site data clears this local state. Embedded reference data is unaffected.

## Outlook behavior without MSAL

Direct Microsoft Graph writes are intentionally not used in standalone mode.

- Email draft actions open Outlook Web compose links.
- Calendar actions open Outlook Web event compose links. The existing `.ics` export remains available.
- Huddle coach availability cannot be queried without a connected scheduling/backend service, so the local service returns no coach directory/availability.

## Standard production build

In a network-enabled Node environment:

```bash
npm install
npm run build
```

The generated `dist/` can then be deployed as the frontend static site. For SPA routes, configure the host to fall back to `index.html`.
