---
name: macro-architect
description: Use before and during feature work in this Next.js UI Playground to evaluate architecture, route ownership, shared contracts, providers, state boundaries, dependencies, and documentation impact.
---

# Macro Architect

1. Read `docs/architecture/Architecture.md`, `docs/architecture/SharedUI.md`, and `docs/architecture/DeveloperGuidelines.md`.
2. Identify the owning route or shared abstraction and the nearest existing implementation pattern.
3. Define the smallest change that preserves App Router, provider, theme, navigation, and micro-app boundaries.
4. Check whether the change should remain local or become a shared component, context, utility, dependency, or contract.
5. Identify client/server boundaries, persistence implications, dependency cost, accessibility impact, and print/responsive implications where relevant.
6. Record decisions and tradeoffs in the affected architecture or decision Markdown file.
7. Confirm route registration, documentation updates, and focused validation before implementation is considered complete.
