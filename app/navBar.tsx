"use client";
import Link from "next/link";
import { useSelectedRoute } from "./hooks/CurrentRoute";
import { useSelectedDashboard } from "./hooks/SelectedDashboardContext";

export default function NavBar() {
    const { routes } = useSelectedRoute();
    const { selectedDashboard } = useSelectedDashboard();

    return (
        <nav
            className="flex flex-row justify-between"
        >
            <div>
                <Link href="./" className="text-indigo-800 text-lg font-extrabold">Home</Link>
                {routes.map((route) => (
                    <Link
                        href={route}
                        key={route}
                        className="text-gray-500 text-sm">
                        {route}
                    </Link>
                ))}
            </div>
            <h1 className="">{selectedDashboard}</h1>
        </nav>);
}