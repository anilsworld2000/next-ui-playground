"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import Button from "../../components/Buttons/Button";
import { createGame, playMove, type GameState } from "./gameLogic";

function getStatusMessage(game: GameState): string {
    if (game.result.type === "won") {
        return `Player ${game.result.winner} wins!`;
    }
    if (game.result.type === "draw") {
        return "It's a draw!";
    }
    return `Player ${game.currentPlayer}'s turn`;
}

export default function TicTacToeGame() {
    const [game, setGame] = useState(createGame);

    function handleMove(index: number) {
        setGame((currentGame) => playMove(currentGame, index));
    }

    function resetGame() {
        setGame(createGame());
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 pt-8 sm:px-6">
            <Link
                href="/games"
                className="inline-flex rounded-sm text-sm font-medium text-link underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
                Back to games
            </Link>

            <header className="mb-8 mt-6 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Two players, one device
                </p>
                <h1 className="text-3xl font-bold text-main">Tic-Tac-Toe</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Take turns placing X and O. Get three in a row to win.
                </p>
            </header>

            <section className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-6" aria-label="Tic-Tac-Toe game">
                <p className="mb-5 text-center text-lg font-semibold text-main" role="status" aria-atomic="true">
                    {getStatusMessage(game)}
                </p>

                <div className="mx-auto grid aspect-square w-full max-w-80 grid-cols-3 grid-rows-3 gap-2 sm:gap-3" role="group" aria-label="Tic-Tac-Toe board">
                    {game.board.map((cell, index) => {
                        const row = Math.floor(index / 3) + 1;
                        const column = (index % 3) + 1;

                        return (
                            <button
                                key={index}
                                type="button"
                                disabled={cell !== null || game.result.type !== "in-progress"}
                                aria-label={`Row ${row}, column ${column}: ${cell ?? "empty"}`}
                                onClick={() => handleMove(index)}
                                className="h-full w-full min-w-0 rounded-xl border border-border-subtle bg-canvas p-0 text-5xl font-bold leading-none text-primary transition hover:bg-accent focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-70 sm:text-6xl"
                            >
                                {cell}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={resetGame}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <RotateCcw aria-hidden="true" size={16} />
                        New game
                    </Button>
                </div>
            </section>
        </div>
    );
}
