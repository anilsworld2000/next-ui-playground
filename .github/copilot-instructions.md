# Project Agent Instructions

- Read the relevant `docs/` files before changing architecture or a micro app.
- Preserve existing Next.js App Router, shared layout, theme, navigation, and component patterns.
- Use Tailwind v4 utilities and existing theme tokens before adding new CSS or abstractions.
- Keep client-only browser APIs inside client components and event handlers.
- Prefer shared components and Lucide icons over new equivalents.
- Keep changes focused; do not revert unrelated user work.
- Update the relevant architecture, micro-app, decisions, and testing documentation in the same change as every implementation change.
- Use the `macro-architect` skill before feature work, the `senior-developer` skill for implementation or review, and the focused QA, security, or UX skill when those concerns are affected.
- Treat `docs/architecture/DeveloperGuidelines.md` as the durable coding standard for this workspace.
- Run `npm run lint` and `npm run build` when application code or dependencies change.
