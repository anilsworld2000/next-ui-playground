# Devotional Testing

## Manual cases

- Open `/devotional` and verify the root placeholder page.
- Open `/devotional/ram` from a leaf-page breadcrumb and verify the deity landing page loads with all configured category links.
- Verify the sidebar groups are generated for all configured deities and categories.
- Open valid deity/category routes directly.
- Verify valid content lookup and formatting.
- Open an unknown deity and confirm the current fallback response.
- Open `/devotional/unknown` and verify the route returns 404.
- Open an unknown category and confirm the current fallback response.
- Test navigation and content at narrow and wide widths and with each theme.

## Automated candidates

Prioritize data-model validation, generated navigation counts, valid lookups, invalid lookup behavior, and route parameter handling when test infrastructure is added.
