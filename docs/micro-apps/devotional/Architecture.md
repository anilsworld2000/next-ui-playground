# Devotional Architecture

## Route and shell

`app/devotional/layout.tsx` composes the shared `DashboardLayout`. It generates sidebar groups from the deity and category data in `app/devotional/data.ts`.

The dynamic page at `app/devotional/[god]/page.tsx` renders a deity landing page with category links. The nested page at `app/devotional/[god]/[category]/page.tsx` renders the selected content. The root `/devotional` page is currently a placeholder page.

## Data flow

The local data model contains eight deities and three categories: `strotram`, `bhajan`, and `ashtakam`. `GetPrayerContent(god, category)` finds the deity and category and returns the content joined with blank lines.

## State ownership

There is no devotional-specific mutable state or provider. Route parameters select the content, while shared theme context controls presentation.

## Invalid input

Unknown deity values on `/devotional/[god]` call `notFound()`. Missing route parameters call `notFound()`. Unknown category values on the leaf route currently produce fallback text from `GetPrayerContent()` rather than a not-found response.

Update this document when the data model, generated navigation, route behavior, or lookup boundary changes.
