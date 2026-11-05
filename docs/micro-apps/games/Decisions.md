# Games Decisions

## Initial game scope

The first release includes Tic-Tac-Toe only. The catalog lists playable games rather than placeholder entries for future games.

## Local two-player gameplay

Both players share the same device. The client owns the board and turn state, so the game needs no persistence, API, account, or multiplayer infrastructure.

## Game logic boundary

Tic-Tac-Toe transition and result logic stays within its route directory and is tested independently. It will only move to shared code if another game demonstrates a need.

## Stable board cells

The board has fixed three-column and three-row tracks inside a responsive square container. Cell buttons fill their tracks instead of relying on mark content to establish size, keeping empty-cell targets consistent with X and O cells.

Update these decisions when the supported games or gameplay modes change.
