---
name: macro-app-instructions
description: Apply when changing the root layout, home dashboard registry, shared components, contexts, types, utilities, themes, navigation, or global styling.
applyTo: "app/layout.tsx,app/page.tsx,app/components/**,app/hooks/**,app/types.ts,app/utils.ts,app/globals.css,package.json"
---

Read `docs/architecture/Architecture.md` and `docs/architecture/SharedUI.md` before editing. Preserve provider order and shared contracts. Use semantic theme tokens and existing component APIs. If a shared contract or macro-app behavior changes, update the architecture documentation in the same change and run lint/build.
