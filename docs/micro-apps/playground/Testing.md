# Playground Testing

## Manual cases

- Open `/playground` and verify the component list.
- Search and filter the registry.
- Select the Button component and verify its preview.
- Edit string, select, boolean, and JSX properties.
- Verify rendered output updates with property changes.
- Verify generated JSX and HTML output.
- Copy generated output and verify the feedback state.
- Exercise clipboard failure behavior.
- Verify the empty-selection state.
- Test narrow and wide layouts and each theme.

## Known coverage gap

There are no automated tests or test script. The loading branch should be covered if its behavior is corrected because the current component does not return `Loader` while loading.
