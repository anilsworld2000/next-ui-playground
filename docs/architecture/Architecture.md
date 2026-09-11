# Macro App Architecture

## Stack

This is a Next.js App Router application using React, TypeScript, Tailwind CSS v4, Lucide icons, and ESLint. The main validation commands are `npm run lint` and `npm run build`.

Role-specific implementation and review workflows are defined in `.github/skills/`. Use the macro architect checkpoint before feature work and the senior developer workflow during implementation and review. Apply QA, security, and UX review when the change affects those concerns.

## Composition

- `app/layout.tsx` is the root layout. It loads global CSS and provides theme, route, dashboard-selection, and user contexts.
- `app/page.tsx` is the home dashboard and the manual registry of discoverable micro apps.
- Each micro app owns a directory under `app/` and normally provides a route-local `layout.tsx` and `page.tsx`.
- Dashboard-style micro apps compose `app/components/Layouts/DashboardLayout.tsx` with route-specific navigation groups.
- Shared navigation uses `NavGroup`, `NavItem`, and `UserSectionPosition` from `app/types.ts`.

## Shared contracts

Use shared components and utilities before creating new equivalents. Use `useTheme()` for theme tokens, `cnClassNames()` for class composition, and Lucide icons with the shared icon sizes. Keep client-only browser APIs inside client components and event handlers.

## Adding a micro app

1. Create the route directory under `app/`.
2. Add a route-local layout when the app needs navigation or providers.
3. Add the page entry and app-specific components.
4. Register the app in `app/page.tsx` when it should appear on the home dashboard.
5. Reuse shared layout, navigation, button, theme, and user components where applicable.
6. Update the relevant `docs/` files in the same change.
7. Run `npm run lint` and `npm run build`.

## Boundaries

Keep domain state and behavior inside the owning micro app. Shared components should remain generic. Do not introduce server persistence, APIs, or global state for a client-only feature without updating this document and its decision record.

## Architecture review

### Current strengths

- The App Router provides clear route ownership for each micro app.
- `DashboardLayout` centralizes the shared navigation shell.
- Typed navigation contracts reduce duplication between route layouts.
- Theme, user, route, and dashboard concerns have separate context modules.
- Feature-local providers, such as the playground provider, keep domain state closer to its owner.
- Strict TypeScript, shared UI documentation, and lint/build validation provide a useful baseline.

### Current risks

- The home page owns a hardcoded dashboard registry and is client-rendered unnecessarily.
- The home page updates selected-dashboard state during render; this should be derived from the route or synchronized in an effect.
- Root-level providers are broader than necessary and may cause avoidable rerenders as the application grows.
- `app/types.ts` mixes navigation, shared UI, playground, wallet, and domain contracts.
- Route navigation metadata is duplicated inside micro-app layouts.
- `UserContext` is presentation state, not authentication or authorization.
- Theme persistence depends on `localStorage`, so the server cannot render the stored theme initially.
- Theme values are coupled to Tailwind class names rather than fully semantic design tokens.
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
- `app/api/`: server-side validation, authorization, and persistence access.
- `app/types/`: only contracts shared by multiple domains.

### Recommended migration order

1. Move the dashboard registry out of `app/page.tsx`.
2. Remove the render-time selected-dashboard update.
3. Derive dashboard identity from the pathname where possible.
4. Split `app/types.ts` into shared navigation/UI types and domain-local types.
5. Keep only truly global providers in the root layout.
6. Add typed, route-local navigation configuration files.
7. Add server-side schema validation and authorization before persistence.
8. Make `DashboardLayout` own responsive desktop/mobile navigation behavior.
9. Add tests for domain calculations, shared shell behavior, navigation, and API boundaries.

### Security and scalability principles

- Treat client contexts as UI state, never as an access-control boundary.
- Validate and authorize every server mutation independently.
- Keep secrets, database clients, and repositories in server-only modules.
- Validate uploaded content by size, type, and content where applicable.
- Avoid dynamically evaluating generated JSX or JavaScript.
- Use semantic theme tokens and server-readable theme initialization when theme persistence becomes important.
- Add rate limiting, security headers, structured error handling, and audit logging when server-backed workflows are introduced.
