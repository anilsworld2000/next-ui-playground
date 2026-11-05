# Games Architecture

## Routes and shell

`app/games/page.tsx` owns the game catalog. `app/games/layout.tsx` provides the shared `DashboardLayout` shell, and `app/games/tic-tac-toe/page.tsx` renders the route-owned game component.

## State and logic ownership

`app/games/tic-tac-toe/TicTacToeGame.tsx` owns in-memory game state and accessible interaction feedback. Pure board transitions and result detection live in `gameLogic.ts`; they are not promoted to shared application code.

The board uses an explicitly square 3-column by 3-row grid. Each cell fills its grid track, so empty cells keep the same hit area and mark typography as occupied cells.

## Boundaries

The game runs entirely in the browser with no server API, persistence, or additional dependency. `app/config/dashboardRegistry.ts` exposes the catalog from the home dashboard. The catalog links to game-specific routes so additional games can be introduced without coupling their state.

Update this document when route ownership, state, or runtime boundaries change.
