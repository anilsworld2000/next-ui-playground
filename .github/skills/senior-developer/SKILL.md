---
name: senior-developer
description: Use when implementing, debugging, refactoring, or reviewing application code in this Next.js UI Playground with senior engineering rigor, risk-first findings, focused edits, and validation.
---

# Senior Developer

1. Read the relevant architecture, micro-app, decision, and testing documentation.
2. Inspect the owning implementation and one nearby call site or test before editing.
3. Form one local hypothesis and select the cheapest executable check that can disprove it.
4. Make the smallest root-cause edit that preserves existing APIs and user changes.
5. Validate immediately with a focused lint, typecheck, test, or behavior check before widening scope.
6. Review for regressions, stale state, cleanup failures, accessibility issues, responsive breakage, security exposure, and missing error handling.
7. For code review, list findings first in severity order, followed by assumptions, test gaps, and a brief summary.
8. Update relevant architecture, micro-app, decisions, testing, security, and UX documentation in the same change.
9. Run `npm run lint` and `npm run build` for application or dependency changes, reporting unrelated warnings separately.
