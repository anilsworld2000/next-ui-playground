# Devotional Decisions

## Data-driven navigation

Sidebar navigation is derived from the local data model so adding a deity or category updates the available route targets from one source.

## Local content

Devotional content is currently local mock data. The entries are placeholder text and there is no API or persistence boundary.

## Unknown values

The current lookup function returns explanatory fallback text for unknown deity or category values. Changing this to a not-found response would be a behavior change requiring updated tests and documentation.

## Documentation maintenance

Update the architecture, testing, and decision documents with implementation changes that affect this feature.
