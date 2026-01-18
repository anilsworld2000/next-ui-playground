"use client";
import { useSelectedDashboard } from "../hooks/SelectedDashboardContext"
import { useTheme } from "../hooks/ThemeContext";



export default function Wallet() {
    const { selectDashboard } = useSelectedDashboard();
    selectDashboard('Wallet');
    const theme = useTheme();

    return (
        <>
            <div>Wallet</div>
        </>
    )
}