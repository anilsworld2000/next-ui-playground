# Reading Decisions

## Client-only first

Uploaded files remain in browser memory. This keeps the first version private and simple but means content is lost on reload and is unavailable on another device.

## Markdown renderer

Use `react-markdown` and `remark-gfm` instead of hand-written parsing. The renderer provides a safer and more complete boundary for Markdown and GitHub-flavored syntax.

## One document at a time

The first version optimizes for a focused reading flow. Multi-document history, editing, persistence, and server storage are intentionally deferred.

## Tailwind styling

Use existing Tailwind v4 utilities and explicit element styles. Do not add the Typography plugin solely for this feature unless the project adopts it more broadly.

## Documentation maintenance

Architecture, workflow, testing, and decision documents are part of the feature. Any implementation change must update the affected documents in the same change.

## Current implementation

The route uses a shared dashboard shell, shared themed buttons, a client-side hidden file input, explicit Markdown element styles, and print rules in `app/reading/reading.css`. The initial reader intentionally does not provide editing, drag-and-drop, multi-document history, or persistence.

## Scaling boundary

The current architecture scales first through browser-side hardening and performance work. Workers, selective rendering, IndexedDB, and server persistence are separate steps triggered by measured document size, performance, storage, sharing, or collaboration requirements. See [Scalability](Scalability.md).
