import { Gamepad2 } from "lucide-react";
import Card from "../components/Cards/Card";
import { ICON_SIZES } from "../utils";

const games = [
    {
        title: "Tic-Tac-Toe",
        description: "Play a quick round with two players on the same device.",
        href: "/games/tic-tac-toe",
    },
];

export default function GamesPage() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6">
            <header className="mb-8 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Quick play
                </p>
                <h1 className="text-3xl font-bold text-main">Games</h1>
                <p className="mt-3 text-sm leading-6 text-muted">
                    Choose a lightweight game and start playing.
                </p>
            </header>

            <section aria-label="Available games" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {games.map(({ title, description, href }) => (
                    <Card
                        key={href}
                        href={href}
                        ariaLabel={`Play ${title}`}
                        className="group flex min-h-52 flex-col border-border-subtle bg-surface text-main transition duration-200 hover:-translate-y-0.5 hover:text-link-hover hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                        <span className="mb-6 flex size-11 items-center justify-center rounded-lg bg-accent">
                            <Gamepad2 className="text-link" size={ICON_SIZES.xlg} strokeWidth={1.7} />
                        </span>
                        <h2 className="text-base font-semibold text-main">{title}</h2>
                        <p className="mt-2 text-sm leading-5 text-muted">{description}</p>
                    </Card>
                ))}
            </section>
        </div>
    );
}
