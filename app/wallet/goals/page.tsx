"use client";

import { useMemo, useState } from "react";
import GoalCard from "./GoalCard";
import WalletSectionLayout from "../WalletSectionLayout";
import { Column, Goal, LayoutConfig, SortConfig } from "@/app/types";
import cnClassNames, { GENERIC_LABELS, getFormatedCurrency } from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";
import Button from "@/app/components/Buttons/Button";
import { Plus, Printer } from "lucide-react";
import ControlBar from "@/app/components/UnifiedControlls/ControlBar";
import DataGrid from "@/app/components/Tables/DataGrid";
// Mock data - replace with actual data fetching
const mockGoals: Goal[] = [
    {
        id: "1",
        name: "Emergency Fund",
        startYear: 2024,
        endYear: 2025,
        tenure: 1,
        inflation: 5,
        monthlyInvestment: 10000,
        stepUp: 0,
        expectedReturn: 7,
        costToday: 120000,
        futureValue: 127000,
        invested: 80000,
        currentValue: 85000,
        achievedPercent: 70,
        fundingRatio: 0.7,
        status: "Underfunded",
    },
    {
        id: "2",
        name: "Vacation Fund",
        startYear: 2024,
        endYear: 2026,
        tenure: 2,
        inflation: 4,
        monthlyInvestment: 15000,
        stepUp: 5,
        expectedReturn: 8,
        costToday: 400000,
        futureValue: 420000,
        invested: 300000,
        currentValue: 320000,
        achievedPercent: 80,
        fundingRatio: 0.8,
        status: "On Track",
    },
    {
        id: "3",
        name: "Retirement Fund",
        startYear: 2024,
        endYear: 2054,
        tenure: 30,
        inflation: 6,
        monthlyInvestment: 25000,
        stepUp: 10,
        expectedReturn: 10,
        costToday: 10000000,
        futureValue: 12000000,
        invested: 5000000,
        currentValue: 6000000,
        achievedPercent: 60,
        fundingRatio: 0.6,
        status: "Underfunded",
    },
];

const columns: Column<Goal>[] = [
    { header: 'Goal', accessor: 'name', width: 200, sortable: true },
    {
        header: 'Monthly Investment', accessor: 'monthlyInvestment', width: 150, sortable: true, filterable: true, editable: true, render: (val) => getFormatedCurrency(Number(val) || 0), onCellSave: (newVal, goal) => {
            const numericValue = parseFloat(String(newVal));
            if (isNaN(numericValue)) return;
            goal.monthlyInvestment = numericValue;
            console.log(`Update ${goal.name} to ${newVal}`);
        }
    },
    { header: 'Current Value', accessor: 'currentValue', width: 150, sortable: true, render: (val) => getFormatedCurrency(Number(val) || 0) },
    { header: 'Future Value', accessor: 'futureValue', width: 150, sortable: true, render: (val) => getFormatedCurrency(Number(val) || 0) },
    { header: 'Achieved %', accessor: 'achievedPercent', width: 100, sortable: true },
    { header: 'Status', accessor: 'status', width: 150, sortable: true },
];

export default function GoalsPage() {
    const [viewMode, setViewMode] = useState<LayoutConfig>("grid");
    const [goals, setGoals] = useState<Goal[]>(mockGoals);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const { theme } = useTheme();

    // --- STEP 1: Filter Logic ---
    const filteredGoals = useMemo(() => {
        return goals.filter((goal) => {
            const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === "" || goal.status === filterValue;
            return matchesSearch && matchesFilter;
        });
    }, [goals, searchTerm, filterValue]);

    // --- STEP 2: Sort Logic (Applied to filtered result) ---
    const finalDisplayData = useMemo(() => {
        if (!sortConfig) return filteredGoals;

        return [...filteredGoals].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof Goal];
            const bValue = b[sortConfig.key as keyof Goal];

            if (aValue < bValue) return sortConfig.dir === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.dir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredGoals, sortConfig]);

    function handleEdit(goal: Goal): void {
        console.log("Edit goal:", goal);
        // TODO: Open edit goal modal/drawer
    }

    function handleDelete(id: string): void {
        console.log("Delete goal:", id);
        setGoals(goals.filter(goal => goal.id !== id));
    }

    function renderCardView() {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {finalDisplayData.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        );
    }

    function renderListView() {
        return (
            <DataGrid
                data={finalDisplayData} // Uses the sorted + filtered data
                columns={columns}
                showRowNumbers
                enableSelection
                scrollable
            />
        );
    }

    function content() {
        return (
            <div className="space-y-6">
                {finalDisplayData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className={cnClassNames(theme.textMuted)}>{GENERIC_LABELS.noDataFound}</p>
                    </div>
                ) : (
                    viewMode === "grid" ? renderCardView() : renderListView()
                )}
            </div>
        );
    }

    return (
        <WalletSectionLayout
            title="Goals"
            subtitle="Manage your financial goals"
            headerControls={
                <ControlBar
                    controlBarClassName={cnClassNames("flex flex-col md:flex-row items-center gap-1 p-2 rounded-2xl shadow-sm", theme.bg, theme.border)}
                    controlBarItemsClassName={cnClassNames(
                        "flex items-center gap-1 h-10 px-3 rounded-full font-semibold transition-all active:scale-95",
                        theme.hoverBg, theme.primaryText
                    )}
                    iconSize={18}
                    iconStrokeWidth={1}
                    sortButtonConfig={{
                        title: "Goal Name",
                        sortKey: "name",
                        currentSort: sortConfig,
                        onSortChange: setSortConfig,
                    }}
                    searchInputConfigs={{
                        value: searchTerm,
                        onSearch: setSearchTerm // Directly updates state
                    }}
                    filterButtonConfig={{
                        filterOptions: [
                            { value: "", label: "All" },
                            { value: "Underfunded", label: "Underfunded" },
                            { value: "On Track", label: "On Track" },
                            { value: "Completed", label: "Completed" },
                        ],
                        value: filterValue,
                        onChange: setFilterValue
                    }}
                    viewToggleButtonConfig={{
                        view: viewMode,
                        onToggle: (v) => setViewMode(v as LayoutConfig),
                    }}
                    utilityControlls={[
                        <Button
                            isCursorPointer
                            key="add"
                            onClick={() => console.log("Add")}
                            tooltip="Add">
                            <Plus size={18} strokeWidth={1} />
                        </Button>,
                        <Button
                            isCursorPointer
                            key="print"
                            onClick={() => window.print()}
                            tooltip="Print">
                            <Printer size={18} strokeWidth={1} />
                        </Button>
                    ]}
                />
            }
        >
            {content()}
        </WalletSectionLayout >
    );
}