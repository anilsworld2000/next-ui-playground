# Counter Architecture

## Route and shell

`app/counter/page.tsx` owns the client interaction and `app/counter/layout.tsx` provides the shared `DashboardLayout` shell with no sidebar groups.

## State ownership

The page owns `count`, `maxValue`, `cycleCount`, and the temporary animation state. It reads the shared theme and selected-dashboard contexts but has no feature-specific provider.

## Interaction flow

A click or Enter key increments the counter. When the next value reaches the configured maximum, the count resets to zero and the cycle count increments. The page optionally calls `navigator.vibrate(200)` when supported. The maximum input accepts values from 1 through 9999 and resets an empty value on blur.

## Browser boundary

The document-level keyboard listener and vibration API are client-only. The keyboard listener is registered in an effect and removed during cleanup.

Update this document when the state model, route shell, interaction flow, or browser APIs change.
