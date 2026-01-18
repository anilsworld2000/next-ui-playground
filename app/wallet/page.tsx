"use client";
import { useSelectedDashboard } from "../hooks/SelectedDashboardContext"

export default function Wallet() {
    const { selectDashboard } = useSelectedDashboard();
    selectDashboard('Wallet');

    return (
        <>
            <div>Wallet</div>
        </>
    )
}