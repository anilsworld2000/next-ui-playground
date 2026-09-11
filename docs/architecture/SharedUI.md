# Shared UI

## Layouts and navigation

`DashboardLayout` composes the vertical navigation, horizontal navigation, and content area. `VerticalNavBar` consumes `NavGroup[]`; route layouts define the groups and hrefs. `TopNavBar` uses the current route and selected dashboard contexts for global navigation and title display.

## Theme

`ThemeProvider` and `useTheme()` define the supported themes and expose semantic class tokens such as `bg`, `sidebar`, `card`, `border`, `button`, `textMuted`, and `textMain`. New UI should use these tokens rather than hardcoded theme colors.

## Controls

Use the shared `Button` component for action buttons. Use Lucide icons and `ICON_SIZES` from `app/utils.ts`. Icon-only controls need a tooltip, title, or accessible label. Prefer existing controls and composition patterns over new one-off primitives.

## Notifications

Use `app/components/Notifications/Notification.tsx` for transient success and error feedback. It provides accessible `status`/`alert` semantics, a manual dismiss action, and automatic dismissal after a short timeout. Keep persistent validation or inline form guidance in the owning feature instead.

## Styling

Tailwind v4 is loaded through `app/globals.css`. Use responsive utility classes and stable dimensions for controls and panels. Route-specific styles may use a CSS module or a route-local stylesheet when utilities are not sufficient, especially for print rules or rich document content.

## Accessibility and behavior

Interactive controls must have an accessible name, visible focus behavior, and disabled states where an action is unavailable. Keep browser-only APIs in client components. Validate file input at runtime in addition to the input `accept` attribute.
