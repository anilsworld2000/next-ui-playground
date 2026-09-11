# Developer Guidelines

These guidelines apply to application code and documentation in this workspace.

## Before coding

- Read the relevant macro-app and micro-app documentation before changing behavior.
- Identify the owning route, component, context, or utility before editing.
- State the smallest falsifiable hypothesis about the change and choose a focused validation check.
- Preserve unrelated user changes and existing public APIs unless the task requires a contract change.

## React and Next.js

- Preserve the App Router structure and route ownership boundaries.
- Keep browser APIs such as `window`, `document`, `navigator`, `File`, and `URL` inside client components and event handlers.
- Prefer local state inside a micro app. Promote state only when multiple route areas genuinely share ownership.
- Use effects for synchronization with external systems, not for ordinary derived values.
- Keep event handlers and component responsibilities small enough to test and review.

## TypeScript

- Prefer explicit domain types at component and utility boundaries.
- Avoid `any`; narrow unknown values at input boundaries.
- Do not use one-letter variables unless they are conventional iterator names in a very small scope.
- Preserve strict type checking and resolve new diagnostics before finishing.

## UI and CSS

- Reuse shared layout, buttons, notifications, icons, utilities, and theme tokens before adding equivalents.
- Use Tailwind v4 utilities and responsive constraints. Add route-local CSS only for behavior utilities, rich document styles, or print rules that utilities cannot express clearly.
- Keep controls accessible with names, focus states, disabled states, and appropriate status semantics.
- Use icon-only controls only with a tooltip or accessible label.
- Test narrow and wide layouts when UI changes.

## Validation

- After the first substantive edit, run the narrowest executable check that can falsify the change.
- Run `npm run lint` and `npm run build` when application code or dependencies change.
- Distinguish pre-existing warnings or environment failures from regressions introduced by the change.
- Update the affected architecture, micro-app, decision, security, UX, and testing documentation in the same change.

## Review standard

Review findings come before summaries. Order findings by severity and ground them in files and behavior. Mention missing tests, residual risks, and assumptions explicitly. Do not expand a focused task into unrelated refactoring.
