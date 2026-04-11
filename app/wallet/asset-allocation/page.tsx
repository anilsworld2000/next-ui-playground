"use client";
import DataGrid from "@/app/components/Tables/DataGrid";
import WalletSectionLayout from "../WalletSectionLayout";
import assetAllocationPlan from "@/app/wallet/asset-allocation/assetAllocationPlan.json";
import { AllocationRow, Column, FilterOption, PortfolioSchema, SortConfig, Tab } from "@/app/types";
import { Activity, LayoutGrid, Shield, Table } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames, { ICON_SIZES } from "@/app/utils";
import ControlBar from "@/app/components/UnifiedControlls/ControlBar";
import Tabs from "@/app/components/Layouts/Tabs";

const filterOption = (portfolio: PortfolioSchema): FilterOption[] => {
    const options: FilterOption[] = [];

    portfolio.buckets.forEach((bucket) => {
        options.push({
            label: bucket.bucketName,
            value: bucket.bucketName
        });
    });

    return options;
};

const flattenAllocationData = (portfolio: PortfolioSchema): AllocationRow[] => {
    const rows: AllocationRow[] = [];

    portfolio.buckets.forEach((bucket) => {
        bucket.classes.forEach((cls) => {
            cls.assets.forEach((asset) => {
                const globalWeight = (cls.allocation / 100) * (asset.allocation / 100) * 100;

                rows.push({
                    id: `${bucket.bucketName}-${cls.type}-${asset.name}`,
                    bucketName: bucket.bucketName,
                    assetClass: cls.type,
                    assetClassDistribution: cls.allocation,
                    assetName: asset.name,
                    assetDistribution: asset.allocation,
                    globalWeight: globalWeight
                });
            });
        });
    });

    return rows;
};
type AllocationView = 'AssetAllocationPlan' | 'AssetAllocationActual' | 'AssetAllocationSummary' | 'AssetAllocationGoals';

export default function AssetAllocationPage() {
    const portfolioSchema: PortfolioSchema = assetAllocationPlan as PortfolioSchema;
    const tabIconSize = ICON_SIZES.xs;
    const { theme } = useTheme();
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");
    const [inputList] = useState<AllocationRow[]>(flattenAllocationData(portfolioSchema));

    function renderPercentageValue(value: number | string): React.ReactNode {
        return (<span className={cnClassNames(theme.textMain)}>{value}%</span>);
    }

    const ALLOCATION_COLUMNS: Column<AllocationRow>[] = [
        {
            header: "Bucket",
            accessor: "bucketName",
            width: 150,
            sortable: true,
            filterable: true,
            render: (value) => (
                <div className="flex items-center gap-2 font-medium">
                    <Shield size={ICON_SIZES.md} className={theme.textMain} />
                    {value}
                </div>
            )
        },
        {
            header: "Class",
            accessor: "assetClass",
            width: 120,
            sortable: true,
            render: (value) => {
                const colors: Record<string, string> = {
                    Equity: "text-orange-500",
                    Debt: "text-blue-500",
                    Cash: "text-emerald-500",
                    Gold: "text-yellow-500",
                    Silver: "text-slate-400"
                };
                return <span className={colors[value as string] || ""}>{value}</span>;
            }
        },
        {
            header: "Class Dist.",
            accessor: "assetClassDistribution",
            width: 120,
            render: (value) => renderPercentageValue(value)
        },
        {
            header: "Asset",
            accessor: "assetName",
            width: 180,
            sortable: true,
            filterable: true
        },
        {
            header: "Asset Dist.",
            accessor: "assetDistribution",
            width: 120,
            render: (value) => renderPercentageValue(value)
        },
        {
            header: "Global Weight",
            accessor: "globalWeight",
            width: 150,
            sortable: true,
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className={cnClassNames("h-full", theme.primary)}
                            style={{ width: `${value}%` }}
                        />
                    </div>
                    <span className={theme.textMain}>{Number(value).toFixed(2)}%</span>
                </div>
            )
        }
    ];

    const filteredData = useMemo(() => {
        return inputList.filter((inputList) => {
            const matchesSearch = inputList.bucketName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterValue === "" || inputList.bucketName === filterValue;
                return matchesSearch && matchesFilter;
            });
    }, [inputList, searchTerm, filterValue]);

    const finalDisplayData = useMemo(() => {
        if (!sortConfig) return filteredData;
    
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key as keyof AllocationRow];
            const bValue = b[sortConfig.key as keyof AllocationRow];
    
                if (aValue < bValue) return sortConfig.dir === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.dir === 'asc' ? 1 : -1;
                return 0;
            });
    }, [filteredData, sortConfig]);

    const allocationTabs: Tab<AllocationView>[] = [
        {
            id: 'AssetAllocationSummary',
            label: 'Summary',
            icon: <Activity size={tabIconSize} />,
            content: <span>AssetAllocationSummary</span>
        },
        {
            id: 'AssetAllocationGoals',
            label: 'Goals',
            icon: <Activity size={tabIconSize} />,
            content: <span>AssetAllocationGoals</span>
        },
        {
            id: 'AssetAllocationPlan',
            label: 'Plan',
            icon: <Table size={tabIconSize} />,
            content: <DataGrid
                scrollable
                columns={ALLOCATION_COLUMNS}
                data={finalDisplayData}
            />
        },
        {
            id: 'AssetAllocationActual',
            label: 'Actual',
            icon: <LayoutGrid size={tabIconSize} />,
            content: (
                <span>Actual</span>
            )
        }
    ];

    return (
        <WalletSectionLayout
            title="Asset Allocation"
            subtitle="Track your Asset Allocation contributions"
            headerControls={<ControlBar
                controlBarClassName={cnClassNames("flex flex-col md:flex-row items-center gap-1 p-2 rounded-2xl shadow-sm", theme.bg, theme.border)}
                controlBarItemsClassName={cnClassNames(
                    "flex items-center gap-1 h-10 px-3 rounded-full font-semibold transition-all active:scale-95",
                    theme.hoverBg, theme.primaryText
                )}
                iconSize={ICON_SIZES.lg}
                iconStrokeWidth={1}
                sortButtonConfig={{
                    title: "Bucket Name",
                    sortKey: "bucketName",
                    currentSort: sortConfig,
                    onSortChange: setSortConfig,
                }}
                searchInputConfigs={{
                    value: searchTerm,
                    onSearch: setSearchTerm // Directly updates state
                }}
                filterButtonConfig={{
                    filterOptions: filterOption(portfolioSchema),
                    value: filterValue,
                    onChange: setFilterValue
                }}
                utilityControlls={[
                ]}
            />
            }
        >
            <Tabs
                tabs={allocationTabs}
                storageKey={"wallet.asset-allocation.activeTab"}
                className="h-8"
            >
                
            </Tabs>
            {/* <DataGrid
                columns={ALLOCATION_COLUMNS}
                data={finalDisplayData}
            /> */}
        </WalletSectionLayout>
    );
}