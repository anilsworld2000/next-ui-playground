# Wallet Testing

## Manual cases

- Open `/wallet` and verify sidebar navigation.
- Open every Wallet route directly and through the sidebar.
- Goals: create, validate, search, filter, sort, switch grid/list, delete, inspect details, and print.
- Stocks: render rows, sort, select, paginate, toggle column visibility, exercise editable cells, and validate loading skeleton states.
- DataGrid selection: verify checkbox selection remains available, row mode selects a row on click, cell mode marks a single cell, and first/last cell focus edges remain visible.
- Asset Allocation: verify JSON flattening, search, filter, sort, Plan tab, and placeholder tabs.
- Verify placeholder sections remain navigable and do not crash.
- Test tab persistence where used.
- Test narrow and wide layouts and each theme.
- Confirm print output excludes controls where print behavior exists.

## Automated candidates

Prioritize goal calculations and validation, filtering/sorting, allocation flattening, DataGrid interaction contracts, column visibility toggles, loading skeleton states, tab persistence, print visibility, and drawer workflows when test infrastructure is added.
