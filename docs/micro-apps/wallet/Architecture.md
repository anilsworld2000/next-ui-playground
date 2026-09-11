# Wallet Architecture

## Route and shell

`app/wallet/layout.tsx` composes `DashboardLayout` and defines Wallet, Assets, and Settings navigation groups. Section routes commonly reuse `WalletSectionLayout` for headers and content.

Routes include overview, goals, stocks, mutual funds, banks, PPF, PF, asset allocation, and preferences.

## State and data ownership

Goals own mock goal state, filtering, sorting, view mode, creation, deletion, and drawer interactions locally. Asset Allocation reads `assetAllocationPlan.json`, flattens nested portfolio data, and owns local search, filtering, sorting, and tab selection. Stocks uses shared `DataGrid` with mock rows. Shared `Tabs` may persist active tabs through `localStorage`.

## Implemented workflows

Goals support grid/list views, search, status filtering, sorting, goal creation, deletion, derived calculations, and printing. Asset Allocation renders the Plan tab with flattened data. Stocks renders an editable/selectable/paginated grid.

## Incomplete sections

Overview, Mutual Funds, Banks, PPF, PF, and Preferences are largely placeholders. Asset Allocation Summary, Goals, and Actual tabs are placeholders. Some edit/detail components are present but not fully wired.

Update this document when Wallet routes, state boundaries, persistence, shared dependencies, or section maturity changes.
