# Games Testing

## Automated

Run the game-logic unit tests with:

```text
npm test -- app/games/tic-tac-toe/gameLogic.test.ts
```

The tests cover the initial state, alternating turns, invalid and occupied cells, row/column/diagonal wins, draws, and rejecting moves after completion.

## Manual cases

- Open `/games` directly and from the home dashboard; verify the Tic-Tac-Toe card navigates to its game route.
- Open `/games/tic-tac-toe` directly, play as two local players, and verify turn feedback.
- Verify a winning line and a full-board draw are announced.
- Verify occupied cells and cells after the game ends cannot be selected.
- Use New game after a win or draw and verify the board returns to X's turn.
- Navigate back to the catalog and return to the game; verify a fresh game starts.
- Use the board and reset action with keyboard navigation, checking visible focus and accessible cell names.
- Before and after placing X or O, verify all nine cells remain equal-sized and visibly arranged in three rows and three columns, including empty cells.
- Check the catalog and board at narrow and wide viewport widths and across the available themes.

There is no browser-component test harness in the current app test setup; the interaction cases above remain manual.
