import type { ReactNode } from "react";

export interface Column<T, K extends keyof T = keyof T> {
    header: string;
    accessor: K;
    width?: number;
    sortable?: boolean;
    resizable?: boolean;
    editable?: boolean;
    filterable?: boolean;
    render?: (value: T[K], record: T, index: number) => ReactNode;
    onCellSave?: (newValue: T[K], record: T) => void;
}

export interface DataGridProps<T> {
    data: T[];
    columns: Column<T>[];
    showRowNumbers?: boolean;
    enableSelection?: boolean;
    onSelectionChange?: (selectedIds: (string | number)[]) => void;
    className?: string;
    headerHeight?: string;
    rowHeight?: string;
    autoHeight?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    ariaLabel?: string;
    scrollable?: boolean;
    heightClass?: string;
    pagination?: boolean;
    pageSize?: number;
    pageSizeOptions?: number[];
    initialPage?: number;
}

export interface DropdownOption<T> {
    id: string | number;
    label: string;
    value: T;
    render?: (item: T) => ReactNode;
}

export type SortConfig = {
    key: string;
    dir: "asc" | "desc";
} | null;

export type LayoutConfig = "grid" | "list";

export type FilterOption = { value: string; label: string };

export interface ListItem<T> {
    id: string | number;
    label: string;
    description?: string;
    icon?: ReactNode;
    indicator?: ReactNode;
    value: T;
}

export interface Tab<T extends string> {
    id: T;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
}

export const statusColors: Record<string, string> = {
    "Warning-bg": "bg-amber-100",
    "Warning-text": "text-amber-600",
    "Success-bg": "bg-green-100",
    "Success-text": "text-green-600",
    "Error-bg": "bg-red-100",
    "Error-text": "text-red-600",
    "Completed-bg": "bg-blue-100",
    "Completed-text": "text-blue-600",
    disabled: "opacity-50 cursor-not-allowed pointer-events-none"
};
