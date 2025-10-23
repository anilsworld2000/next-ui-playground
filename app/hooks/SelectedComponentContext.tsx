"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type SelectedComponentContextType = {
    selectedComponent: string | null;
    selectComponent: (name: string) => void;
    clearSelection: () => void;
};

const SelectedComponentContext = createContext<SelectedComponentContextType | undefined>(undefined);

export const SelectedComponentProvider = ({ children }: { children: ReactNode }) => {
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

    const selectComponent = (name: string) => setSelectedComponent(name);
    const clearSelection = () => setSelectedComponent(null);

    return (
        <SelectedComponentContext.Provider value={{ selectedComponent, selectComponent, clearSelection }}>
            {children}
        </SelectedComponentContext.Provider>
    );
};

export const useSelectedComponent = () => {
    const context = useContext(SelectedComponentContext);
    if (!context) throw new Error("useSelectedComponent must be used within SelectedComponentProvider");
    return context;
};