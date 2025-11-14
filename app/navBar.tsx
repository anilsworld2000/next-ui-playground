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
                    route.length > 2 &&
                    <Link
                        href={route}
                        key={route}
                        className="text-gray-500 text-sm">
                        {"\t" + route[0] + route.charAt(1).toUpperCase() + route.slice(2)}
                    </Link>
                ))}
            </div>
            <h1 className="text-slate-800 text-sm">{selectedDashboard}</h1>
        </nav>);
}