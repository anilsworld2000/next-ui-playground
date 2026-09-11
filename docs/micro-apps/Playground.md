# Playground

## Route

The Playground micro app is rooted at `/playground`. Its layout provides `SelectedComponentProvider`.

## Workflow

`componentRegistry` defines available components, default properties, render functions, and generated JSX/HTML output. The dashboard coordinates component selection, preview rendering, and property editing through `SelectedComponentContext`.

## Maintenance

Update this document when the component registry contract, selection context, preview workflow, generated output, or provider structure changes.

See the [Playground documentation set](playground/README.md) for architecture, testing, and decision records.
