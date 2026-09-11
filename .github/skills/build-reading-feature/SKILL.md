---
name: build-reading-feature
description: Use when implementing or changing the client-only Markdown Reading micro app for upload, rendering, raw view, copy, download, responsive layout, or printing.
---

# Build The Reading Feature

1. Read all files under `docs/reading/` and the shared architecture docs.
2. Keep the implementation client-only and one document at a time unless scope is explicitly changed.
3. Accept `.md` files, validate at runtime, and read them with `File.text()`.
4. Render with `react-markdown` and `remark-gfm`; do not hand-parse Markdown.
5. Keep raw source available for copy and download. Revoke temporary download object URLs.
6. Use shared buttons, Lucide icons, theme tokens, and Tailwind utilities.
7. Keep print-only rules explicit: hide app chrome and controls, then print the document on a white page.
8. Update `docs/reading/Architecture.md`, `Testing.md`, and `Decisions.md` for behavior or scope changes.
9. Read `docs/reading/Scalability.md` before adding large-document, multi-document, persistence, plugin, export, or collaboration behavior.
10. Run `npm run lint` and `npm run build`, then manually exercise upload, rendering, actions, responsive layout, themes, and print preview.
