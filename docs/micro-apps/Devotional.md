# Devotional

## Route

The Devotional micro app is rooted at `/devotional`. Its layout generates sidebar groups from the deity and category data in `app/devotional/data.ts`.

## Navigation and data

Routes follow `/devotional/<god>` and `/devotional/<god>/<category>`. The deity page lists the available categories, while the leaf page resolves content through `GetPrayerContent()` and displays the selected devotional material. The supported deity and category lists are derived from the local data model.

## Maintenance

Update this document when the devotional data model, generated navigation, route parameters, or content lookup behavior changes.

See the [Devotional documentation set](devotional/README.md) for architecture, testing, and decision records.
