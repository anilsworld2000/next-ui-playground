# Reading Testing

## Manual matrix

- Open `/reading` directly and from the home dashboard.
- Confirm the empty state has an accessible upload action.
- Upload a valid `.md` file.
- Confirm the Reading sidebar and home dashboard card navigate to `/reading`.
- Confirm success and error notifications disappear automatically and can be dismissed manually.
- Reject a non-Markdown file with a visible error.
- Render headings, paragraphs, nested lists, links, blockquotes, inline code, fenced code, tables, task lists, images, and horizontal rules.
- Switch between rendered and raw views without losing content.
- Copy the source and verify clipboard contents.
- Download the source and verify filename and content.
- Clear the document and reopen another file.
- Test narrow and wide viewport layouts.
- Test every supported theme.
- Use print preview and verify only the document is printed.
- Confirm long code and table content remains readable and scrollable on screen.
- Confirm the document filename, character count, word count, and file size appear after opening a file.

## Automated candidates

When test infrastructure is introduced, prioritize file validation, metadata calculation, mode switching, action disabled states, object URL cleanup, and print visibility rules.

Update this checklist when user workflows or supported Markdown behavior changes.
