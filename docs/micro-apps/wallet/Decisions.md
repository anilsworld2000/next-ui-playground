# Wallet Decisions

## Local mock data

Wallet workflows currently use local mock data and JSON. There is no API, database, or persistence boundary for financial records.

## Shared dashboard controls

Wallet reuses shared `DashboardLayout`, `WalletSectionLayout`, `DataGrid`, `ControlBar`, `Tabs`, charts, forms, drawers, and theme utilities to keep repeated dashboard behavior consistent.

## Partial implementation is explicit

The route catalog is broader than the implemented feature set. Placeholder pages and placeholder tabs are documented rather than treated as complete workflows.

## Editing limitations

Goal editing and some stock edits are not fully persisted. Inline edits are local and may log changes rather than save them to a durable data source.

## Documentation maintenance

Update the architecture, testing, and decision documents with implementation changes that affect this feature.
