# Games

## Routes

- `/games` lists the games available to play.
- `/games/tic-tac-toe` provides a two-player Tic-Tac-Toe game on the same device.

## Behavior

Players take turns as X and O. The game reports a win or draw, prevents moves after the game ends, and can be reset for another round. State is local to the game page and is not persisted.

See the [Games documentation set](games/README.md) for architecture, testing, and decisions.
