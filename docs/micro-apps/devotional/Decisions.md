# Devotional Decisions

## Data-driven navigation

Sidebar navigation is derived from the local data model so adding a deity or category updates the available route targets from one source.

The `/devotional/[god]` landing page also derives its category links from the same `categories` data, so breadcrumb parent routes remain valid as the model changes.

## Local content

Devotional content is currently local mock data. The entries are placeholder text and there is no API or persistence boundary.

## Unknown values

Unknown deity values use `notFound()` at the parent route. The current lookup function still returns explanatory fallback text for unknown categories. Changing leaf-route category behavior would require updated tests and documentation.

## Documentation maintenance

Update the architecture, testing, and decision documents with implementation changes that affect this feature.
