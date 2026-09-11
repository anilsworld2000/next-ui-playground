# Playground Architecture

## Route and provider

`app/playground/layout.tsx` provides `SelectedComponentProvider` for the `/playground` route. `app/playground/page.tsx` renders the dashboard.

## Registry contract

`app/customComponents/componentRegistry.tsx` is the source of available components. Each registry entry supplies an id, name, renderer, optional JSX/HTML code generators, category, tags, and default properties. The current registry contains a Button entry.

## State ownership

`SelectedComponentContext` owns the selected component name. `Dashboard` owns the current property values and loading state. Components, preview, and properties sections own their local UI state such as filtering, expansion, and copy feedback.

## Workflow

Users select a component, edit its properties, view the rendered preview, inspect generated JSX/HTML, and copy output. Clipboard access is client-only. The loading component exists, but the current loading branch does not return it.

Update this document when the registry contract, provider boundaries, state ownership, or preview workflow changes.
