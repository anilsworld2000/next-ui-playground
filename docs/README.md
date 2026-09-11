# Project Documentation

This directory describes the architecture and behavior of the Next.js UI Playground.

## Sections

- [Architecture](architecture/Architecture.md): macro-app composition, routing, providers, and extension rules.
- [Shared UI](architecture/SharedUI.md): shared components, themes, accessibility, and styling conventions.
- [Developer Guidelines](architecture/DeveloperGuidelines.md): day-to-day coding, validation, review, accessibility, and documentation standards.
- [Micro apps](micro-apps/README.md): route ownership, structured app documentation, and current micro-app behavior.
- [Reading](reading/README.md): the client-only Markdown reader feature.

## Agent Workflows

Workspace skills live under `.github/skills/`:

- `macro-architect`: architecture checkpoint before feature work.
- `senior-developer`: implementation and risk-first code review workflow.
- `developer-guidelines`: practical coding standards.
- `qa-test-engineer`: regression and workflow validation.
- `security-reviewer`: client-side trust-boundary and dependency review.
- `ux-reviewer`: accessibility, responsive, workflow, and print review.

Use the role skill that matches the current task. Role skills are workspace-specific and should be used with the relevant architecture and micro-app documents.

## Maintenance rule

Every implementation change must update the relevant documentation in the same change. Update the affected micro-app document and, when applicable, its architecture, decisions, and testing files. Update macro architecture documentation when shared contracts, routing, providers, or conventions change.

Documentation should describe verified behavior, not planned behavior presented as implemented behavior.
