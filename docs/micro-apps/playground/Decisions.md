# Playground Decisions

## Registry-driven components

The component registry is the extension point for adding previewable components. Rendering and code generation remain defined with each registry entry.

## Route-local selection

Component selection is provided only within the Playground route. It is not global because other micro apps do not depend on the selected component.

## In-memory editing

Property edits and copy feedback are ephemeral. There is no persistence or server-backed component catalog.

## Current scope

The Playground currently contains a Button registry entry. Component creation, persistent templates, and a larger catalog are future expansions rather than implemented behavior.

## Documentation maintenance

Update the architecture, testing, and decision documents with implementation changes that affect this feature.
