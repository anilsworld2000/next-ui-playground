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
