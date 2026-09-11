# Devotional Testing

## Manual cases

- Open `/devotional` and verify the root placeholder page.
- Verify the sidebar groups are generated for all configured deities and categories.
- Open valid deity/category routes directly.
- Verify valid content lookup and formatting.
- Open an unknown deity and confirm the current fallback response.
- Open an unknown category and confirm the current fallback response.
- Test navigation and content at narrow and wide widths and with each theme.

## Automated candidates

Prioritize data-model validation, generated navigation counts, valid lookups, invalid lookup behavior, and route parameter handling when test infrastructure is added.
