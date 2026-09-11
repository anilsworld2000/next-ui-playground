# Counter

## Route

The Counter micro app is rooted at `/counter` and uses a minimal `DashboardLayout` from `app/counter/layout.tsx`.

## Behavior

The counter is a client component with local count, maximum, cycle count, and animation state. Enter activates the same increment action as the main button. A supported browser vibration is triggered when the configured maximum is reached.

## Maintenance

Update this document when counter state, keyboard behavior, limits, animation, or route layout changes.

See the [Counter documentation set](counter/README.md) for architecture, testing, and decision records.
