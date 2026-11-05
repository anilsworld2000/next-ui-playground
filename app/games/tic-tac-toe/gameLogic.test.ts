import { describe, expect, it } from "vitest";
import { createGame, getGameResult, playMove, type Cell } from "./gameLogic";

describe("Tic-Tac-Toe game logic", () => {
    it("starts with an empty board and X to play", () => {
        expect(createGame()).toEqual({
            board: Array<Cell>(9).fill(null),
            currentPlayer: "X",
            result: { type: "in-progress" },
        });
    });

    it("alternates players after valid moves", () => {
        const afterX = playMove(createGame(), 0);
        const afterO = playMove(afterX, 4);

        expect(afterX.board[0]).toBe("X");
        expect(afterX.currentPlayer).toBe("O");
        expect(afterO.board[4]).toBe("O");
        expect(afterO.currentPlayer).toBe("X");
    });

    it("does not allow occupied cells or invalid indices to change the game", () => {
        const game = playMove(createGame(), 0);

        expect(playMove(game, 0)).toBe(game);
        expect(playMove(game, -1)).toBe(game);
        expect(playMove(game, 9)).toBe(game);
        expect(playMove(game, 1.5)).toBe(game);
    });

    it("detects wins across rows, columns, and diagonals", () => {
        const winningBoards: { board: Cell[]; winner: "X" | "O" }[] = [
            { board: ["X", "X", "X", "O", "O", null, null, null, null], winner: "X" },
            { board: ["X", "O", null, "X", null, "O", "X", null, null], winner: "X" },
            { board: ["X", "O", "O", null, "X", null, null, "O", "X"], winner: "X" },
            { board: [null, null, "O", null, "O", null, "O", null, null], winner: "O" },
        ];

        for (const { board, winner } of winningBoards) {
            expect(getGameResult(board)).toEqual({ type: "won", winner });
        }
    });

    it("detects a draw when the board is full without a winner", () => {
        expect(getGameResult([
            "X", "O", "X",
            "X", "O", "O",
            "O", "X", "X",
        ])).toEqual({ type: "draw" });
    });

    it("does not allow moves after the game is over", () => {
        let game = createGame();
        for (const index of [0, 3, 1, 4, 2]) {
            game = playMove(game, index);
        }
        const finishedGame = game;

        expect(game.result).toEqual({ type: "won", winner: "X" });
        expect(playMove(game, 8)).toBe(finishedGame);
    });
});
