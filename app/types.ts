import React from "react";

export type PropValue = string | number | boolean | undefined | readonly string[];

export type Category = 'Action' | 'Input';

export interface PlaygroundComponent {
    id: string;
    name: string;
    render: (props: Record<string, PropValue>) => React.ReactNode;
    code?: {
        jsx: (props: Record<string, PropValue>) => string;
        html: (props: Record<string, PropValue>) => string;
    };
    category: Category;
    tags: string[];
    defaultProps: ComponentProperty[];
}

export interface ComponentProperty {
    name: 'label' | 'size' | 'variant' | 'rounded' | 'cursor' | 'disabled' | 'useJSX' | 'JSX';
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range' | 'string' | 'jsx';
    label: string;
    value?: string;
    defaultValue?: PropValue;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
}

export type NavItem = {
    id: string;
    name: string;
    icon?: React.ReactNode;
    href: string;
};

export type NavGroup = {
    id: string;
    title: string;
    items: NavItem[];
};

export enum UserSectionPosition {
    Undefined,
    Vertical,
    Horizontal
}

export type Goal = {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    tenure: number;
    inflation: number;
    monthlyInvestment: number;
    stepUp: number;
    expectedReturn: number;

    costToday: number;
    futureValue: number;

    invested: number;
    currentValue: number;

    achievedPercent: number;
    fundingRatio: number;

    status: GoalStatus;
};

export type GoalStatus = "Underfunded" | "On Track" | "Off Track" | "Completed";

export const statusColors: Record<string, string> = {
    "Warning-bg": "bg-amber-100",
    "Warning-text": "text-amber-600",
    "Success-bg": "bg-green-100",
    "Success-text": "text-green-600",
    "Error-bg": "bg-red-100",
    "Error-text": "text-red-600",
    "Completed-bg": "bg-blue-100",
    "Completed-text": "text-blue-600",
    "disabled": "opacity-50 cursor-not-allowed pointer-events-none"
};

export interface Column<T, K extends keyof T = keyof T> {
    header: string;
    accessor: K ;
    width?: number;
    sortable?: boolean;
    resizable?: boolean;
    editable?: boolean;
    filterable?: boolean;
    render?: (value: T[K], record: T, index: number) => React.ReactNode;
    onCellSave?: (newValue: T[K], record: T) => void;
}

export interface DataGridProps<T> {
    data: T[];
    columns: Column<T>[];
    showRowNumbers?: boolean;
    enableSelection?: boolean;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    className?: string;
    headerHeight?: string; // e.g., "h-12", "py-4", etc.
    rowHeight?: string; // e.g., "h-10", "py-2", etc.
    autoHeight?: boolean; // When true, rows adjust height based on content
    loading?: boolean;
    emptyMessage?: string;
    ariaLabel?: string;
    scrollable?: boolean; // Fix table container height and show scrollbar
    heightClass?: string; // Tailwind height class when scrollable is enabled, e.g. "h-96" or "h-[60vh]"
    pagination?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    initialPage?: number;
}

export interface DropdownOption<T> {
    id: string | number;
    label: string;
    value: T;
    render?: (item: T) => React.ReactNode;
}

export type SortConfig = {
    key: string;
    dir: 'asc' | 'desc';
} | null;

export type LayoutConfig =  'grid' | 'list';

export type FilterOption = { value: string; label: string };

