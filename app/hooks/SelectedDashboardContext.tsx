"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SelectedDashboardContextType = {
    selectedDashboard: string | null;
    selectDashboard: (name: string) => void;
    clearSelection: () => void;
};

const SelectedDashboardContext = createContext<SelectedDashboardContextType | undefined>(undefined);

export const SelectedDashboardProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

    const selectDashboard = (name: string) => setSelectedDashboard(name);
    const clearSelection = () => setSelectedDashboard(null);

    return (
        <SelectedDashboardContext.Provider value={{ selectedDashboard, selectDashboard, clearSelection }}>
            {children}
        </SelectedDashboardContext.Provider>
    );
};

export const useSelectedDashboard = () => {
    const context = useContext(SelectedDashboardContext);
    if (!context) throw new Error("useSelectedDashboard must be used within SelectedDashboardProvider");
    return context;
};