# Wallet

## Route

The Wallet micro app is rooted at `/wallet` and uses `app/wallet/layout.tsx` with `DashboardLayout`.

## Sections

The sidebar currently links to overview, goals, stocks, mutual funds, banks, PPF, PF, asset allocation, and preferences. Goal-specific UI lives under `app/wallet/goals/` and uses shared table, control, drawer, and chart components.

## State and behavior

Wallet data is currently owned by route components and local files such as `assetAllocationPlan.json`. Goal creation and detail interactions are client-side. Printing is initiated from the goals page with `window.print()`.

## Maintenance

Update this document when Wallet routes, data ownership, persistence, print behavior, or shared component dependencies change.

See the [Wallet documentation set](wallet/README.md) for architecture, testing, and decision records.
