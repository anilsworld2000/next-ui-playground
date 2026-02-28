"use client";
import { useEffect } from "react";
import { useSelectedDashboard } from "../hooks/SelectedDashboardContext"
import { useUser } from "../hooks/UserContext";

export default function Wallet() {
    const { selectDashboard } = useSelectedDashboard();
    const { setUser } = useUser();

    useEffect(() => {
        // 1. Sync the dashboard selection
        selectDashboard('Wallet');

        // 2. Clear the user state
        setUser(null);
    }, [selectDashboard, setUser]); // Dependencies ensure this runs correctly

    return (
        <div>Wallet</div>
    )
}