# Micro Apps

Micro apps are independent route areas under `app/`. Each owns its domain behavior while reusing the macro app's layout, theme, navigation, and shared controls.

## Current apps

- [Wallet](Wallet.md): financial dashboard with asset and goal sections. See the [structured Wallet docs](wallet/README.md).
- [Counter](Counter.md): keyboard-friendly interactive counter. See the [structured Counter docs](counter/README.md).
- [Devotional](Devotional.md): data-driven devotional content by deity and category. See the [structured Devotional docs](devotional/README.md).
- [Playground](Playground.md): component preview and property editing workspace. See the [structured Playground docs](playground/README.md).
- [Reading](../reading/README.md): client-only Markdown upload and reading workspace.

## Standard shape

A micro app should define its route entry in `app/<name>/page.tsx`. Use `layout.tsx` for route navigation or providers, keep domain components beside the route, and register the app in `app/page.tsx` when it belongs on the home dashboard.

Each micro app has a flat overview for quick discovery plus a route-named folder containing `README.md`, `Architecture.md`, `Testing.md`, and `Decisions.md`. Update the matching overview and structured documents whenever routes, state ownership, dependencies, workflows, or limitations change.
