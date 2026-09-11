# Counter Testing

## Manual cases

- Open `/counter` directly and from the home dashboard.
- Click the counter and verify it increments.
- Press Enter and verify it triggers the same action.
- Set maximum values at 1, 9999, below 1, above 9999, and empty.
- Verify reaching maximum resets the count and increments cycles.
- Verify the pop animation resets after each action.
- Verify vibration is optional and unsupported browsers continue working.
- Navigate away and back to confirm the keyboard listener does not remain active.
- Test the layout at narrow and wide widths and with each theme.

## Automated candidates

Prioritize pure counter transition logic, maximum validation, keyboard cleanup, animation state reset, and vibration fallback when test infrastructure is added.
