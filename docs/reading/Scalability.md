# Reading Scalability

This document describes how the client-only Reading micro app can grow without prematurely introducing a server architecture.

## Current baseline

The current flow is:

```text
File -> File.text() -> React state -> ReactMarkdown -> DOM
```

The app opens one `.md` file, stores its complete source in browser memory, renders it on the client, and supports raw viewing, copy, download, and print. It has no API, database, authentication, synchronization, or cross-device persistence.

## Scaling dimensions

### Document size

The complete source is currently duplicated across browser memory, React state, Markdown parsing, and rendered DOM. Large files can cause memory pressure, long parse times, slow updates, and poor print performance.

Scaling sequence:

1. Add a configurable file-size limit and loading state.
2. Reject or warn on empty and unusually large files.
3. Move metadata calculation and parsing work to a Web Worker.
4. Split documents into heading-based sections.
5. Render visible sections only or virtualize long documents.

The size limit should be measured on target browsers before becoming a product promise.

### Number of documents

The current app intentionally supports one active document. Multiple documents would require a document store with stable ids, metadata, active-document selection, cleanup, and tab/history behavior.

Storage options by scale:

| Need | Suitable boundary |
| --- | --- |
| One active document | React state |
| Small recent documents | `localStorage` for metadata and small content |
| Many or large local documents | IndexedDB |
| Local folder workflows | File System Access API where supported |
| Account-based documents | API and database |
| Large attachments | Object storage plus document metadata |

### Rendering complexity

GitHub-flavored Markdown is the current rendering boundary. Syntax highlighting, math, Mermaid, custom components, raw HTML, external images, and rich embeds each add bundle size, parsing cost, security review, and print behavior.

Advanced features should be added as controlled plugins or lazy-loaded modules rather than making the basic reader pay the full cost.

### Editing complexity

The app is currently read-only. Editing would change the component boundary and state model. Split the feature before adding an editor:

```text
ReadingApp
  DocumentStore
  ReadingToolbar
  MarkdownRenderer
  RawEditor
  DocumentMetadata
  Notification
```

Editing introduces undo/redo, autosave, dirty state, keyboard shortcuts, draft recovery, and conflict handling.

### Persistence and collaboration

Persistence changes the privacy and ownership model. A server boundary becomes necessary when documents must survive reloads across devices, be shared, be permissioned, be versioned, or be edited collaboratively.

Real-time collaboration would additionally require synchronization and conflict-resolution rules, such as an operational transformation or CRDT-based model. It should not be added as an incremental UI-only feature.

### Security surface

Markdown remains untrusted input. Keep raw HTML disabled unless a deliberate sanitization policy is introduced. Reassess links, images, diagrams, file size, downloads, clipboard access, persistence, and server uploads whenever the feature expands.

### Bundle and deployment size

The Reading route currently includes `react-markdown` and `remark-gfm`. Syntax highlighters, editors, math libraries, diagram libraries, and export libraries can grow the client bundle. Use dynamic imports and feature-level loading for expensive capabilities.

### Accessibility and print

Large documents need keyboard navigation, heading-based navigation, stable focus behavior, and readable long code/table content. Print output should remain a separately validated presentation mode rather than an accidental consequence of screen layout.

## Scaling triggers

Consider the next architecture step when one of these becomes true:

- Opening a representative document causes noticeable UI blocking.
- Memory use or tab crashes occur on supported target browsers.
- Users need more than one open or recoverable document.
- Users need documents after reload or on another device.
- Rendering requires expensive plugins that should not load for every reader.
- Documents must be shared, permissioned, audited, or collaboratively edited.

## Phased roadmap

### Phase 1: Harden the current client reader

- Add size and empty-file validation.
- Add an explicit loading state and cancellation strategy.
- Extract file validation and metadata helpers.
- Add regression coverage for browser failure paths.

### Phase 2: Improve long-document performance

- Split `ReadingApp.tsx` into feature components.
- Benchmark representative files.
- Move expensive parsing/counting to a Web Worker.
- Add section navigation and selective rendering.

### Phase 3: Add local document management

- Add multiple open documents or recent history.
- Use IndexedDB for larger local content.
- Add restore, rename, delete, and storage cleanup behavior.

### Phase 4: Add advanced reading features

- Search within document.
- Table of contents and bookmarks.
- Syntax highlighting, math, or diagrams behind lazy-loaded boundaries.
- Export formats with explicit compatibility testing.

### Phase 5: Introduce server capabilities only when required

- Authentication and ownership.
- Upload and metadata APIs.
- Object storage for large files.
- Sharing, permissions, versioning, and collaboration.

## Non-goals

This document does not define a server design, a maximum supported file size, a persistence schema, or a collaboration protocol. Those require measured product requirements and a separate architecture decision.

Update this document whenever a scaling trigger is reached, a performance boundary changes, or the Reading state/storage architecture expands.