# Macro App Architecture

## Stack

This is a Next.js App Router application using React, TypeScript, Tailwind CSS v4, Lucide icons, and ESLint. The main validation commands are `npm run lint` and `npm run build`.

Role-specific implementation and review workflows are defined in `.github/skills/`. Use the macro architect checkpoint before feature work and the senior developer workflow during implementation and review. Apply QA, security, and UX review when the change affects those concerns.

## Composition

- `app/layout.tsx` is the root layout. It loads global CSS and provides theme and user contexts.
- `app/page.tsx` is the home dashboard composition. `app/config/dashboardRegistry.ts` is the typed registry of discoverable micro apps.
- Each micro app owns a directory under `app/` and normally provides a route-local `layout.tsx` and `page.tsx`.
- Dashboard-style micro apps compose `app/components/Layouts/DashboardLayout.tsx` with route-specific navigation groups.
- Shared navigation uses `NavGroup`, `NavItem`, and `UserSectionPosition` from `app/types/navigation.ts`.

## Shared contracts

Use shared components and utilities before creating new equivalents. Use `useTheme()` for theme tokens, `cnClassNames()` for class composition, and Lucide icons with the shared icon sizes. Keep client-only browser APIs inside client components and event handlers.

Framework-agnostic calculation APIs intentionally shared across route areas live under root `lib/`. The personal-finance calculation module has no UI or runtime framework dependencies; its Monte Carlo retirement engine exposes randomized path simulation and percentile summaries. Route-specific calculations remain with their owning micro app.

## Dependency-impact workflow

Every change to an existing component, context, type, utility, route contract, or dependency must begin with a focused impact check:

1. Search definitions, imports, call sites, tests, documentation, and runtime consumers.
2. Classify the change as additive, compatible, migration-required, or breaking.
3. Check for circular imports, client/server boundary changes, public API changes, bundle-cost changes, and security implications.
4. Choose a migration order that keeps the repository buildable, using a temporary compatibility boundary when needed.
5. Run the narrowest check immediately after the first edit, then run lint and build for application changes.
6. Record the dependency decision, risks, and deferred cleanup in the affected architecture documentation.

No new package is required for the type-module migration. The former aggregate type file has been removed after all active consumers moved to focused modules.

## Adding a micro app

1. Create the route directory under `app/`.
2. Add a route-local layout when the app needs navigation or providers.
3. Add the page entry and app-specific components.
4. Register the app in `app/config/dashboardRegistry.ts` when it should appear on the home dashboard.
5. Reuse shared layout, navigation, button, theme, and user components where applicable.
6. Update the relevant `docs/` files in the same change.
7. Run `npm run lint` and `npm run build`.

## Boundaries

Keep domain state and behavior inside the owning micro app. Shared components should remain generic. Do not introduce server persistence, APIs, or global state for a client-only feature without updating this document and its decision record.

## Architecture review

### Current strengths

- The App Router provides clear route ownership for each micro app.
- `DashboardLayout` centralizes the shared navigation shell.
- Shared `Card` supports both interactive content cards and accessible navigation cards.
- Typed navigation contracts reduce duplication between route layouts.
- Theme, user, route, and dashboard concerns have separate context modules.
- Feature-local providers, such as the playground provider, keep domain state closer to its owner.
- Strict TypeScript, shared UI documentation, and lint/build validation provide a useful baseline.

### Current risks

- The home page previously owned a hardcoded dashboard registry and was client-rendered unnecessarily. The registry now lives in `app/config/dashboardRegistry.ts`, while themed card rendering remains in a client component.
- Dashboard title state was previously duplicated in a global context and updated by route pages. It is now derived from the current pathname and the dashboard registry in `TopNavBar`.
- `ThemeProvider` and `UserProvider` remain root-scoped because shared shell components consume them. The former route context was removed because `TopNavBar` can derive breadcrumbs directly from `usePathname()`.
- The former aggregate type module mixed navigation, shared UI, playground, wallet, and domain contracts; these contracts now have focused ownership modules.
- Route navigation metadata is duplicated inside micro-app layouts.
- `UserContext` is presentation state, not authentication or authorization.
- The app now exposes a server-only auth boundary in `app/auth/session.ts`, plus a demo login flow in `app/login/page.tsx`, so the wallet routes can enforce a genuine route access check instead of relying on UI state.
- Theme palettes now use root CSS custom properties mapped to Tailwind v4 semantic utilities. `useTheme()` retains stable semantic class aliases as a migration compatibility layer.
- Theme preference is read from a validated root-readable cookie, preventing a saved-theme hydration flash. Reading it in the root layout makes all routes request-dynamic; this is an explicit tradeoff if static generation becomes important.
- Responsive navigation, focus management, and mobile shell behavior are not yet explicit shared responsibilities.

### Improvement triggers

Prioritize architectural changes when the application adds more micro apps, authenticated or persisted data, permission-aware navigation, shared server data, significant mobile workflows, or measurable rerender and navigation performance problems. The current modular monolith is appropriate while these pressures remain low.

### Recommended target architecture

Use a **modular monolith** with **vertical feature slices**, lightweight **layered boundaries** inside data-heavy domains, and Next.js Route Handlers as a **backend-for-frontend** boundary. Do not introduce microservices until independent deployment, scaling, or team ownership becomes a demonstrated requirement.

Recommended ownership:

- `app/config/`: server-safe dashboard and application metadata.
- `app/components/ui/`: generic reusable controls.
- `app/components/navigation/`: shared navigation behavior and visuals.
- `app/providers/`: only genuinely application-wide providers.
- `app/<micro-app>/`: route-owned UI, state, domain types, calculations, and navigation configuration.
- `lib/`: pure, framework-agnostic calculations intentionally shared across route areas.
- `app/api/`: server-side validation, authorization, and persistence access.
- `app/types/`: only contracts shared by multiple domains.

### Recommended migration order

1. Move the dashboard registry out of `app/page.tsx`. **Completed:** the registry is now in `app/config/dashboardRegistry.ts`.
2. Remove the render-time selected-dashboard update. **Completed:** route pages no longer update global dashboard state.
3. Derive dashboard identity from the pathname where possible. **Completed:** `TopNavBar` derives the title from `dashboardRegistry`.
4. Split the former aggregate type file into shared navigation/UI types and domain-local types. **Completed:** active consumers now import from focused modules under `app/types`, `app/playground`, and `app/wallet`.
5. Keep only truly global providers in the root layout. **Completed for current providers:** theme and user state are shell-wide; route breadcrumbs are derived locally in `TopNavBar`.
6. Add typed, route-local navigation configuration files. **Completed:** feature-level nav metadata now lives beside each route in a typed config module.
7. Add server-side schema validation and authorization before persistence. **Completed for the route boundary:** wallet routes now enforce access with `app/auth/session.ts` and a cookie-backed demo login flow in `app/login/page.tsx`.
8. Make `DashboardLayout` own responsive desktop/mobile navigation behavior.
9. Add tests for domain calculations, shared shell behavior, navigation, and API boundaries.
10. Replace palette-specific theme classes with root CSS-variable tokens. **Completed:** root palettes and server initialization are in place; active shared and route-owned surfaces use semantic utilities; the styling compatibility facade has been removed.

### Theme migration status

- **Complete — palette and initialization:** five CSS-variable palettes live in `app/globals.css`; validated `app-theme` cookie initializes `html[data-theme]` before render. The root cookie makes every route request-dynamic.
- **Complete — shared UI:** shared controls, cards, charts, navigation shell, forms, menus/portals, notifications, and `DataGrid` use semantic utilities directly. `useTheme()` exposes selection state only.
- **Complete — route-owned consumers:** home, login, counter, playground shell/editor controls, devotional, finance calculators, Reading chrome, and Wallet screens use semantic utilities. No active styling consumer uses a React theme class map.
- **Complete with intentional exceptions — authored/data palettes:** active warning/success/error/goal status styling uses semantic status tokens. Preserve the playground's editable component preview/variants, print-specific black-on-white styling, and data-coded portfolio/chart series unless their design semantics change. Dormant wallet detail surfaces remain outside the active-route migration scope.
- **Pending — visual verification:** theme key tests, lint, and build pass; visually inspect all five palettes across routes and body-level portals. The full suite currently has three unrelated finance-calculation expected-value failures; track those separately.

### Current assistant-owned follow-through

Keep the remaining automated work narrow and explicit:

- verify the final migration boundary stays limited to selection state in `useTheme()` and the selector UI
- keep the architecture docs aligned with the actual state and the remaining manual verification scopes
- track unrelated finance calculation mismatches separately from the theme migration in `lib/financeCalculations.test.ts`
- avoid reintroducing compatibility abstractions that would re-expand the current cleanup scope

Manual browser validation remains outside the assistant scope: all five palettes, portaled overlays, focus states, mobile responsiveness, and reading/print behavior should be checked by the human reviewer.

Next action: complete browser visual verification of all five palettes, including body-level portals, focus states, and narrow layouts. Revisit the root-cookie dynamic rendering tradeoff only if static generation becomes a requirement.

### Security and scalability principles

- Treat client contexts as UI state, never as an access-control boundary.
- Add a server-only auth boundary for session validation, authorization, and protected routes; the current `UserContext` remains profile-only presentation data and the app now uses `app/auth/session.ts` plus cookie-based login in `app/login/page.tsx` to guard wallet routes.
- Validate and authorize every server mutation independently.
- Keep secrets, database clients, and repositories in server-only modules.
- Validate uploaded content by size, type, and content where applicable.
- Avoid dynamically evaluating generated JSX or JavaScript.
- Use semantic theme tokens and server-readable theme initialization when theme persistence becomes important.
- Keep theme palette values in CSS custom properties on the document root; use semantic Tailwind utilities for surfaces, text, borders, focus, and status states. Do not introduce new palette-specific color classes into application UI.
- Keep the non-sensitive theme preference separate from authentication cookies and validate the theme key before applying it.
- Add rate limiting, security headers, structured error handling, and audit logging when server-backed workflows are introduced.
