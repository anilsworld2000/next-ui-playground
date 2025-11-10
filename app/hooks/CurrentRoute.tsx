"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";

type CurrentRouteContextType = {
    routes: string[];
    selectedRoute: string | null;
    clearRoutes: () => void;
};

const CurrentRouteContext = createContext<CurrentRouteContextType | undefined>(undefined);

export const CurrentRouteContextProvider = ({ children }: { children: ReactNode }) => {
    const [routes, setRoutes] = useState<string[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        // Normalize pathname to a readable format
        const cleanPath = pathname === "/" ? "" : pathname;
        //const cleanPath = pathname === "/" ? "" : pathname.replace("/", "");

        setSelectedRoute(cleanPath);
        setRoutes((prev) => {
            // Avoid duplicate entries when navigating back/forth
            const last = prev[prev.length - 1];
            if (last === cleanPath) return prev;
            return [...prev, cleanPath];
        });
    }, [pathname]);

    const clearRoutes = () => {
        setRoutes([]);
        setSelectedRoute(null);
    };

    return (
        <CurrentRouteContext.Provider value={{ routes, selectedRoute, clearRoutes }}>
            {children}
        </CurrentRouteContext.Provider>
    );
};

export const useSelectedRoute = () => {
    const context = useContext(CurrentRouteContext);
    if (!context)
        throw new Error("useSelectedRoute must be used within a CurrentRouteContextProvider");
    return context;
};
