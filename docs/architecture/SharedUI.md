# Shared UI

## Layouts and navigation

`DashboardLayout` composes the vertical navigation, horizontal navigation, and content area. `VerticalNavBar` consumes `NavGroup[]`; route layouts define the groups and hrefs. `TopNavBar` derives breadcrumbs and dashboard title from the current pathname.

## Theme

The active theme is applied to `html` with a validated `data-theme` key. Palette values live in CSS custom properties in `app/globals.css`, and Tailwind v4 `@theme inline` exposes semantic utilities such as `bg-canvas`, `bg-surface`, `text-main`, `text-muted`, `border-border-subtle`, `bg-primary`, and `text-danger`.

Shared UI and route-owned components use semantic utilities directly. `ThemeProvider` and `useTheme()` expose only theme selection state; they are not a styling API. Use tokens such as `bg-canvas`, `bg-surface`, `text-main`, `text-muted`, `border-border-subtle`, and `bg-primary` rather than palette-specific classes. Use paired status tokens such as `text-warning` with `bg-warning-surface` for status feedback. Keep fixed chart/portfolio series colors only when color encodes data meaning, and keep the playground's editable preview and print styling intentionally independent.

The selected theme preference is stored in the non-sensitive `app-theme` cookie. The root layout validates it and provides the initial theme to prevent a post-hydration palette flash. Because the root reads cookies, routes are rendered dynamically; revisit this tradeoff if static generation becomes a requirement. Theme variables are defined on the document root so overlays portaled to `document.body` inherit the same palette.

## Controls

Use the shared `Button` component for action buttons. Use Lucide icons and `ICON_SIZES` from `app/utils.ts`. Icon-only controls need a tooltip, title, or accessible label. Prefer existing controls and composition patterns over new one-off primitives.

`Card` supports both content cards with `onClick` and navigation cards with `href`. Use `href` for cards whose entire surface navigates to another route; do not nest a `Link` inside a `Card`.

Shared UI contracts such as `DropdownOption` are defined in `app/types/ui.ts`. Components should import those contracts instead of redeclaring equivalent local interfaces.

## Notifications

Use `app/components/Notifications/Notification.tsx` for transient success and error feedback. It provides accessible `status`/`alert` semantics, a manual dismiss action, and automatic dismissal after a short timeout. Keep persistent validation or inline form guidance in the owning feature instead.

## Styling

Tailwind v4 is loaded through `app/globals.css`. Use responsive utility classes and stable dimensions for controls and panels. Route-specific styles may use a CSS module or a route-local stylesheet when utilities are not sufficient, especially for print rules or rich document content.

The shared shell uses restrained borders, compact rounded surfaces, deliberate spacing, and the theme's semantic color tokens. Keep shared chrome scannable on narrow screens: breadcrumbs may scroll horizontally, centered titles may hide, and command rows should stack before controls become cramped. The sidebar toggle closes automatically on route changes on small screens and exposes explicit `aria` state so the mobile navigation remains predictable.

## Remaining assistant-owned work

The migration is complete from the codebase side. The remaining work that still belongs to the automated/code path is intentionally small and bounded:

- validate that the final theme boundary stays limited to selection state and selector UI
- keep the shared shell architecture aligned with the documented responsiveness goals
- keep unrelated finance-calculation test failures separate from the theme migration status
- update the documentation when the implementation state changes

Manual visual verification remains a human QA responsibility: all five theme palettes, interactive focus states, overlay surfaces, print/reading output, and narrow layouts should still be reviewed in the browser.

## Accessibility and behavior

Interactive controls must have an accessible name, visible focus behavior, and disabled states where an action is unavailable. Keep browser-only APIs in client components. Validate file input at runtime in addition to the input `accept` attribute.

`DataGrid` keeps `enableSelection` as the legacy checkbox-selection switch. New consumers can set `selectionMode` to `"checkbox"`, `"row"`, or `"cell"`; row selections use `onSelectionChange`, while cell selections use `onCellSelectionChange`. Focus and selected-cell outlines use inset rings so the rounded grid container does not clip the outer edges of corner cells.
