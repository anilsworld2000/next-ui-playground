# Reading Micro App

## Purpose

Reading is a client-only workspace for opening, reading, inspecting, copying, downloading, and printing one Markdown file at a time. The route is available at `/reading` and is registered on the home dashboard.

## Scope

The first implementation accepts local `.md` files in the browser. The file is read with browser APIs and held in React state. No upload API, database, authentication, cross-device persistence, or server-side file storage is part of this feature.

## User workflow

1. Open `/reading` from the home dashboard.
2. Choose a Markdown file with the Open file or Select .md file action.
3. Read the rendered document or switch to raw Markdown.
4. Copy or download the source, print the rendered document, or clear it.

The current implementation uses `react-markdown` with `remark-gfm`, supports rendered/raw views, and reports upload and clipboard errors in the workspace.

## Documentation

- [Architecture](Architecture.md): implementation boundaries and data flow.
- [Scalability](Scalability.md): growth dimensions, scaling triggers, and phased roadmap.
- [Testing](Testing.md): manual verification matrix.
- [Decisions](Decisions.md): decisions and excluded scope.

Update these files whenever the Reading workflow, state model, dependencies, routes, or limitations change.
