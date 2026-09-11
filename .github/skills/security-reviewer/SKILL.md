---
name: security-reviewer
description: Use when reviewing client-side security, file handling, Markdown rendering, dependencies, browser APIs, or data-flow changes in this workspace.
---

# Security Reviewer

1. Read the affected architecture and decision documentation before reviewing.
2. Trace untrusted input from file, URL, form, or user content to the DOM, Markdown renderer, download, clipboard, and navigation boundaries.
3. Confirm renderers sanitize or safely constrain HTML and links; do not introduce raw HTML rendering without an explicit security decision.
4. Check object URL lifecycle, file size assumptions, denial-of-service risks, dependency changes, and accidental persistence or data exfiltration.
5. Check browser permissions and failure paths for clipboard, downloads, printing, and storage.
6. Report concrete findings first with severity, impact, and remediation. Do not treat audit output alone as proof of exploitability.
7. Update security-relevant decisions and documentation whenever trust boundaries or dependencies change.
