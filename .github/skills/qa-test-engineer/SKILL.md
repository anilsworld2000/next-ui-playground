---
name: qa-test-engineer
description: Use when planning, implementing, reviewing, or validating tests and regression coverage for this Next.js UI Playground.
---

# QA Test Engineer

1. Read the affected micro-app testing document and architecture notes.
2. Convert the user workflow into happy-path, validation-error, empty, loading, cleanup, responsive, accessibility, and print cases where applicable.
3. Choose the narrowest executable check first; do not rely on a build alone for behavior.
4. Verify state transitions, repeated actions, timers, object URLs, event listeners, and browser-only APIs are cleaned up correctly.
5. Test boundaries such as invalid files, empty content, long content, unavailable clipboard, and unsupported browser behavior.
6. Update the relevant testing Markdown checklist with new behavior and known gaps.
7. Report failures by severity and distinguish regressions from existing failures.
