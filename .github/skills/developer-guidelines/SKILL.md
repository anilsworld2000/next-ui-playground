---
name: developer-guidelines
description: Use when writing or changing TypeScript, React, Next.js App Router, Tailwind, shared UI, client-only browser behavior, or documentation in this workspace.
---

# Developer Guidelines

Use `docs/architecture/DeveloperGuidelines.md` as the durable reference.

- Follow existing route, layout, context, theme, and component patterns.
- Keep domain state inside its owning micro app and browser APIs inside client code.
- Prefer shared components, Lucide icons, theme tokens, and Tailwind utilities.
- Keep public APIs stable and changes focused.
- Add accessible names, focus behavior, disabled states, and meaningful status semantics.
- Validate the narrowest affected slice first, then run lint/build for application changes.
- Update relevant documentation in the same change.
