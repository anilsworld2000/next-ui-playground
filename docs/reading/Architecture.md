# Reading Architecture

## Route boundary

The feature is rooted at `/reading`. `app/reading/layout.tsx` reuses `DashboardLayout` with an Open document navigation item, while `ReadingApp.tsx` owns the interactive client workflow.

## State model

The reader owns the selected file name, raw Markdown text, file size, view mode, and transient status/error messages. Only one document is open at a time. State is intentionally ephemeral and is lost on reload. Transient feedback is rendered with the shared `Notification` component and automatically disappears after its timeout.

## File flow

The file input accepts `.md` and `text/markdown`. Runtime validation checks the extension and supported content before calling `File.text()`. The raw source remains available for copy and download. Download uses a temporary Blob URL and must revoke it after use.

## Rendering flow

Use `react-markdown` with `remark-gfm` for rendering. Do not build an ad hoc Markdown parser. Markdown output is styled explicitly in `app/reading/reading.css` because the project does not use the Typography plugin.

## Browser actions

Clipboard, download, and print actions are client-only. Copy failures should be shown as an actionable status rather than throwing. `window.print()` should run from a user action.

## Print boundary

Print styles hide global navigation, reader controls, and transient UI. The Markdown document becomes full-width with a white background, black text, readable code blocks, and page margins.
