"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import { Column, DataGridProps, SortConfig } from "@/app/types";
import { useTheme } from "@/app/hooks/ThemeContext";
import CustomCheckbox from "../CustomCheckbox";
import Button from "../Buttons/Button";
import ControlBar from "../UnifiedControlls/ControlBar";

export default function DataGrid<T extends { id: string | number }>({
    data,
    columns,
    showRowNumbers = false,
    enableSelection = false,
    onSelectionChange,
}: DataGridProps<T>) {
    const columnIconSize = 14;
    const columnIconThickness = 1;
    const { theme } = useTheme();
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [colWidths, setColWidths] = useState<{ [key: string]: number }>(
        Object.fromEntries(columns.map(c => [String(c.accessor), c.width || 150]))
    );

    useEffect(() => {
        if (onSelectionChange) {
            // Convert Set to Array for easier use in the parent component
            onSelectionChange(Array.from(selectedIds));
        }
    }, [selectedIds, onSelectionChange]);

    // --- NEW: Define handleFilterChange to fix the "not defined" error ---
    const handleFilterChange = (accessor: string, value: string) => {
        setColumnFilters((prev) => ({
            ...prev,
            [accessor]: value,
        }));
    };

    // --- Resizing Logic ---
    const resizingCol = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

    const startResize = (e: React.MouseEvent, key: string) => {
        e.preventDefault();
        resizingCol.current = { key, startX: e.pageX, startWidth: colWidths[key] };
        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    };

    const handleResize = (e: MouseEvent) => {
        if (!resizingCol.current) return;
        const diff = e.pageX - resizingCol.current.startX;
        const newWidth = Math.max(80, resizingCol.current.startWidth + diff);
        setColWidths(prev => ({ ...prev, [resizingCol.current!.key]: newWidth }));
    };

    const stopResize = () => {
        resizingCol.current = null;
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    };

    // --- Filter & Sort Logic (Matches your page.tsx logic) ---
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            return Object.entries(columnFilters).every(([accessor, filterValue]) => {
                if (!filterValue) return true;
                const rowValue = String(row[accessor as keyof T] || "").toLowerCase();
                const searchTerm = filterValue.toLowerCase();

                if (searchTerm.startsWith(">")) return Number(rowValue) > Number(searchTerm.substring(1));
                if (searchTerm.startsWith("<")) return Number(rowValue) < Number(searchTerm.substring(1));

                return rowValue.includes(searchTerm);
            });
        });
    }, [data, columnFilters]);

    const sortedData = useMemo(() => {
        const sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof T];
                const bValue = b[sortConfig.key as keyof T];
                if (aValue === bValue) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;
                const result = aValue < bValue ? -1 : 1;
                return sortConfig.dir === 'asc' ? result : -result;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    return (
        <div className={cnClassNames("w-full flex flex-col border rounded-lg overflow-hidden", theme.border)}>
            <div className={cnClassNames("flex justify-between items-center p-2 border-b", theme.bg, theme.border)}>
                <span className={cnClassNames("text-xs font-medium", theme.textMuted)}>
                    {sortedData.length} of {data.length} records
                </span>
                {Object.values(columnFilters).some(v => v) && (
                    <Button
                        onClick={() => setColumnFilters({})}
                        className="text-[10px] px-2 py-1 text-red-500 hover:bg-red-50"
                    >
                        {GENERIC_LABELS.clear} {GENERIC_LABELS.filter}
                    </Button>
                )}
            </div>

            <div className="overflow-auto custom-scrollbar">
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 shadow-sm">
                        <tr className={cnClassNames(theme.bg)}>
                            {enableSelection && (
                                <th className="w-12 p-3 text-center border-b">
                                    <CustomCheckbox
                                        checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                                        onChange={() => {
                                            if (selectedIds.size === filteredData.length) setSelectedIds(new Set());
                                            else setSelectedIds(new Set(filteredData.map(d => d.id)));
                                        }}
                                    />
                                </th>
                            )}

                            {showRowNumbers && (
                                <th className={cnClassNames("w-14 p-3 text-left border-b text-[11px] font-bold uppercase", theme.textMuted)}>
                                    #
                                </th>
                            )}

                            {columns.map((col) => (
                                <th
                                    key={String(col.accessor)}
                                    style={{ width: colWidths[String(col.accessor)] }}
                                    className={cnClassNames(
                                        "relative p-3 text-left border-b group transition-colors",
                                        theme.hoverBg, theme.border
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span className={cnClassNames("text-[11px] font-bold uppercase truncate", theme.textMain)}>
                                            {col.header}
                                        </span>

                                        <ControlBar
                                            iconSize={columnIconSize}
                                            iconStrokeWidth={columnIconThickness}
                                            sortButtonConfig={{
                                                sortKey: String(col.accessor),
                                                currentSort: sortConfig,
                                                onSortChange: setSortConfig
                                            }}
                                            filterButtonConfig={col.filterable ? {
                                                value: columnFilters[String(col.accessor)] || "",
                                                onChange: (val) => handleFilterChange(String(col.accessor), val),
                                                placeholder: `Search ${col.header}...`
                                            } : undefined}
                                            controlBarClassName="flex items-center gap-0.5"
                                        />
                                    </div>

                                    {col.resizable !== false && (
                                        <div
                                            onMouseDown={(e) => startResize(e, String(col.accessor))}
                                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/30 z-10"
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={cnClassNames("divide-y", theme.border)}>
                        {sortedData.map((record, index) => (
                            <tr
                                key={record.id}
                                className={cnClassNames("transition-colors", selectedIds.has(record.id) ? theme.accent : theme.hoverBg)}
                            >
                                {enableSelection && (
                                    <td className="p-3 text-center">
                                        <CustomCheckbox
                                            checked={selectedIds.has(record.id)}
                                            onChange={() => {
                                                const next = new Set(selectedIds);
                                                if (next.has(record.id)) {
                                                    next.delete(record.id);
                                                } else {
                                                    next.add(record.id);
                                                }
                                                setSelectedIds(next);
                                            }}
                                        />
                                    </td>
                                )}

                                {showRowNumbers && (
                                    <td className={cnClassNames("p-3 text-xs font-medium", theme.textMuted)}>
                                        {index + 1}
                                    </td>
                                )}

                                {columns.map((col) => (
                                    <td key={String(col.accessor)} className="p-3 text-xs truncate">
                                        <EditableCell col={col} record={record} index={index} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EditableCell<T extends { id: string | number }>({
    col,
    record,
    index
}: {
    col: Column<T>,
    record: T,
    index: number
}) {
    const { theme } = useTheme();
    const [isEditing, setIsEditing] = useState(false);

    // Use T[keyof T] instead of any to keep the link to your data model
    const [value, setValue] = useState<T[keyof T]>(record[col.accessor as keyof T]);

    useEffect(() => {
        setValue(record[col.accessor as keyof T]);
    }, [record, col.accessor, isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== record[col.accessor as keyof T]) {
            // If onCellSave expects a specific type, cast here at the boundary
            col.onCellSave?.(value as never, record);
        }
    };

    if (col.editable && isEditing) {
        return (
            <input
                title="Edit Cell"
                autoFocus
                // Stringify the value for the DOM, ensuring it's never undefined
                value={String(value ?? "")}
                // Cast the string back to the generic type T[keyof T]
                onChange={(e) => setValue(e.target.value as unknown as T[keyof T])}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                className={cnClassNames(
                    "w-full border rounded px-2 py-1 outline-none ring-0 ring-primary/20",
                    theme.border, theme.hoverBg, theme.textMain
                )}
            />
        );
    }

    return (
        <div
            className={cnClassNames("w-full h-full", col.editable && "cursor-pointer hover:text-primary")}
            onClick={() => col.editable && setIsEditing(true)}
        >
            {col.render
                ? col.render(record[col.accessor as keyof T], record, index)
                : String(record[col.accessor as keyof T] ?? "")
            }
        </div>
    );
}