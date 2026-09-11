---
name: document-micro-app
description: Use when documenting or reviewing a micro app's routes, providers, state ownership, workflows, dependencies, limitations, architecture, testing, and decisions.
---

# Document A Micro App

1. Inspect the micro-app route tree, layouts, pages, providers, data files, and route-local styles.
2. Verify behavior from code instead of copying planned behavior.
3. Keep the flat `docs/micro-apps/<Name>.md` overview as a compatibility entry point and link it to `docs/micro-apps/<route-name>/README.md`.
4. Maintain the standardized folder set: `README.md`, `Architecture.md`, `Testing.md`, and `Decisions.md`.
5. Update the micro-app overview with route ownership, workflows, state/data ownership, dependencies, and limitations.
6. Add or update architecture, testing, and decision documents when the feature has non-trivial behavior.
7. Preserve macro rules in `docs/architecture/`; do not duplicate them in every micro-app document.
8. Keep documentation changes in the same change as implementation changes.
9. Check links and run the relevant lint/build validation when code was also changed.
