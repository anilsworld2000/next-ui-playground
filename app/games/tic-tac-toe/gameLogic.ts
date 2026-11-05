export type Player = "X" | "O";
export type Cell = Player | null;

export type GameResult =
    | { type: "in-progress" }
    | { type: "draw" }
    | { type: "won"; winner: Player };

export type GameState = {
    board: Cell[];
    currentPlayer: Player;
    result: GameResult;
};

const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
] as const;

export function createGame(): GameState {
    return {
        board: Array<Cell>(9).fill(null),
        currentPlayer: "X",
        result: { type: "in-progress" },
    };
}

export function getGameResult(board: readonly Cell[]): GameResult {
    for (const [first, second, third] of winningLines) {
        const mark = board[first];
        if (mark && mark === board[second] && mark === board[third]) {
            return { type: "won", winner: mark };
        }
    }

    return board.every((cell) => cell !== null)
        ? { type: "draw" }
        : { type: "in-progress" };
}

export function playMove(game: GameState, index: number): GameState {
    if (
        game.result.type !== "in-progress"
        || !Number.isInteger(index)
        || index < 0
        || index >= game.board.length
        || game.board[index] !== null
    ) {
        return game;
    }

    const board = [...game.board];
    board[index] = game.currentPlayer;
    const result = getGameResult(board);

    return {
        board,
        currentPlayer: result.type === "in-progress"
            ? game.currentPlayer === "X" ? "O" : "X"
            : game.currentPlayer,
        result,
    };
}
