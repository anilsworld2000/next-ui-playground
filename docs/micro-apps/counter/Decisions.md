# Counter Decisions

## Local state

Counter state remains in memory because the feature is a focused utility and has no persistence requirement.

## Maximum behavior

The configured maximum is constrained to 1 through 9999. Invalid or empty input uses an effective maximum of 1 for increment behavior, while blur restores the visible input to 1.

## Optional vibration

Vibration is progressive enhancement. The counter must remain usable when the browser does not expose `navigator.vibrate`.

## Documentation maintenance

Update the architecture, testing, and decision documents with implementation changes that affect this feature.
