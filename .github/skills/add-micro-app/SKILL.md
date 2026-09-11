---
name: add-micro-app
description: Use when creating or expanding a micro app in this Next.js workspace, including its route, layout, navigation, dashboard registration, documentation, and validation.
---

# Add A Micro App

1. Read `docs/architecture/Architecture.md`, `docs/architecture/SharedUI.md`, and `docs/micro-apps/README.md`.
2. Inspect the nearest existing micro-app layout and page pattern.
3. Create `app/<name>/page.tsx` and a route layout only when navigation or providers are needed.
4. Reuse shared layout, theme, navigation, button, icon, and utility components.
5. Register the app in `app/page.tsx` when it belongs on the home dashboard.
6. Add or update `docs/micro-apps/<Name>.md` and feature-specific architecture/testing/decision notes.
7. Run `npm run lint` and `npm run build`.
8. Report route, files, validation, and any deliberately deferred scope.
