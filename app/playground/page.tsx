'use client'
import Dashboard from '@/app/playground/Dashboard'
import { useSelectedDashboard } from '../hooks/SelectedDashboardContext';

export default function PlaygroundPage() {
    const { selectDashboard } = useSelectedDashboard();
    selectDashboard("UI Playground");

    return <Dashboard />
}