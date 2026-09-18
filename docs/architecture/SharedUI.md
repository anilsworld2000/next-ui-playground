# Shared UI

## Layouts and navigation

`DashboardLayout` composes the vertical navigation, horizontal navigation, and content area. `VerticalNavBar` consumes `NavGroup[]`; route layouts define the groups and hrefs. `TopNavBar` derives breadcrumbs and dashboard title from the current pathname.

## Theme

`ThemeProvider` and `useTheme()` define the supported themes and expose semantic class tokens such as `bg`, `sidebar`, `card`, `border`, `button`, `textMuted`, and `textMain`. New UI should use these tokens rather than hardcoded theme colors.

## Controls

Use the shared `Button` component for action buttons. Use Lucide icons and `ICON_SIZES` from `app/utils.ts`. Icon-only controls need a tooltip, title, or accessible label. Prefer existing controls and composition patterns over new one-off primitives.

`Card` supports both content cards with `onClick` and navigation cards with `href`. Use `href` for cards whose entire surface navigates to another route; do not nest a `Link` inside a `Card`.

Shared UI contracts such as `DropdownOption` are defined in `app/types/ui.ts`. Components should import those contracts instead of redeclaring equivalent local interfaces.

## Notifications

Use `app/components/Notifications/Notification.tsx` for transient success and error feedback. It provides accessible `status`/`alert` semantics, a manual dismiss action, and automatic dismissal after a short timeout. Keep persistent validation or inline form guidance in the owning feature instead.

## Styling

Tailwind v4 is loaded through `app/globals.css`. Use responsive utility classes and stable dimensions for controls and panels. Route-specific styles may use a CSS module or a route-local stylesheet when utilities are not sufficient, especially for print rules or rich document content.

The shared shell uses restrained borders, compact rounded surfaces, deliberate spacing, and the theme's semantic color tokens. Keep shared chrome scannable on narrow screens: breadcrumbs may scroll horizontally, centered titles may hide, and command rows should stack before controls become cramped.

## Accessibility and behavior

Interactive controls must have an accessible name, visible focus behavior, and disabled states where an action is unavailable. Keep browser-only APIs in client components. Validate file input at runtime in addition to the input `accept` attribute.

`DataGrid` keeps `enableSelection` as the legacy checkbox-selection switch. New consumers can set `selectionMode` to `"checkbox"`, `"row"`, or `"cell"`; row selections use `onSelectionChange`, while cell selections use `onCellSelectionChange`. Focus and selected-cell outlines use inset rings so the rounded grid container does not clip the outer edges of corner cells.
