"use client";
import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
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
    headerHeight = "py-2",
    rowHeight = "py-2",
    autoHeight = false,
    loading = false,
    emptyMessage = GENERIC_LABELS.noDataFound,
    ariaLabel = GENERIC_LABELS.dataTable,
    scrollable = false,
    heightClass = "h-[60vh]",
    pagination = false,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50],
    initialPage = 1,
}: DataGridProps<T>) {
    const pl: string = autoHeight ? "pl-2" : "pl-4";
    const px: string = autoHeight ? "px-2" : "px-4";
    const columnIconSize = 12;
    const columnIconThickness = 1;
    const scrollContainerClass = cnClassNames("overflow-auto custom-scrollbar", scrollable ? heightClass : undefined);
    const { theme } = useTheme();
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize);
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>({});
    const [colWidths, setColWidths] = useState<{ [key: string]: number }>(
        Object.fromEntries(columns.map(c => [String(c.accessor), c.width || 150]))
    );

    // Debounce filter changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(columnFilters);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [columnFilters]);

    useEffect(() => {
        if (onSelectionChange) {
            // Convert Set to Array for easier use in the parent component
            onSelectionChange(Array.from(selectedIds));
        }
    }, [selectedIds, onSelectionChange]);

    // Debounced filter change handler
    const handleFilterChange = useCallback((accessor: string, value: string) => {
        setColumnFilters((prev) => ({
            ...prev,
            [accessor]: value,
        }));
    }, []);

    // --- Resizing Logic ---
    const resizingCol = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

    const handleResize = useCallback((e: MouseEvent) => {
        if (!resizingCol.current) return;
        const diff = e.pageX - resizingCol.current.startX;
        const newWidth = Math.max(80, resizingCol.current.startWidth + diff);
        setColWidths(prev => ({ ...prev, [resizingCol.current!.key]: newWidth }));
    }, []);

    const stopResize = useCallback(() => {
        resizingCol.current = null;
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    }, [handleResize]);
    
    const startResize = useCallback((e: React.MouseEvent, key: string) => {
        e.preventDefault();
        resizingCol.current = { key, startX: e.pageX, startWidth: colWidths[key] };
        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    }, [colWidths, handleResize, stopResize]);

    // Cleanup event listeners on unmount
    useEffect(() => {
        return () => {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResize);
        };
    }, [handleResize, stopResize]);

    // --- Filter & Sort Logic (Matches your page.tsx logic) ---
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            return Object.entries(debouncedFilters).every(([accessor, filterValue]) => {
                if (!filterValue) return true;
                const rowValue = String(row[accessor as keyof T] || "").toLowerCase();
                const searchTerm = filterValue.toLowerCase();

                if (searchTerm.startsWith(">")) return Number(rowValue) > Number(searchTerm.substring(1));
                if (searchTerm.startsWith("<")) return Number(rowValue) < Number(searchTerm.substring(1));

                return rowValue.includes(searchTerm);
            });
        });
    }, [data, debouncedFilters]);

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

    const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedData.length / currentPageSize)), [sortedData.length, currentPageSize]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const pageData = useMemo(() => {
        if (!pagination) return sortedData;
        const startIndex = (currentPage - 1) * currentPageSize;
        return sortedData.slice(startIndex, startIndex + currentPageSize);
    }, [sortedData, pagination, currentPage, currentPageSize]);

    const rangeStart = pagination && sortedData.length > 0 ? (currentPage - 1) * currentPageSize + 1 : (sortedData.length > 0 ? 1 : 0);
    const rangeEnd = pagination ? rangeStart + pageData.length - 1 : sortedData.length;

    const goToFirstPage = useCallback(() => setCurrentPage(1), []);
    const goToPreviousPage = useCallback(() => setCurrentPage((prev) => Math.max(1, prev - 1)), []);
    const goToNextPage = useCallback(() => setCurrentPage((prev) => Math.min(totalPages, prev + 1)), [totalPages]);
    const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);

    const handlePageSizeChange = useCallback((value: number) => {
        setCurrentPageSize(value);
        setCurrentPage(1);
    }, []);

    const totalColumns = (enableSelection ? 1 : 0) + (showRowNumbers ? 1 : 0) + columns.length;

    return (
        <div className={cnClassNames("w-full flex flex-col border rounded-lg overflow-hidden", theme.border)}>
            <div className={scrollContainerClass}>
                {loading ? (
                    <div className={cnClassNames("flex items-center justify-center p-8", theme.textMuted)}>
                        <div className={cnClassNames("animate-spin rounded-full h-8 w-8 border-b-2", theme.border)}></div>
                        <span className="ml-2">{GENERIC_LABELS.loading}</span>
                    </div>
                ) : (
                    <table
                        className={cnClassNames("w-full border-separate border-spacing-0 table-fixed min-w-full", theme.border)}
                        aria-label={ariaLabel}
                    >
                        <colgroup>
                            {enableSelection && <col width={32} />}
                            {showRowNumbers && <col width={40} />}
                            {columns.map((col) => (
                                <col key={String(col.accessor)} width={colWidths[String(col.accessor)]} />
                            ))}
                        </colgroup>
                        <thead className={cnClassNames("sticky top-0 z-10 shadow-sm text-xs", theme.textMain)}>
                            <tr className={cnClassNames(theme.bg)}>
                                {/*Checkbox column */}
                                {enableSelection && (
                                    <th
                                        className={cnClassNames("w-12 min-w-[48px] sticky left-0 z-10 border-b", !autoHeight && headerHeight, pl, theme.border)}
                                        aria-label={GENERIC_LABELS.selectAllRows}
                                    >
                                        <CustomCheckbox
                                            checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                                            onChange={() => {
                                                if (selectedIds.size === filteredData.length) setSelectedIds(new Set());
                                                else setSelectedIds(new Set(filteredData.map(d => d.id)));
                                            }}
                                        />
                                    </th>
                                )}

                                {/*Row number column */}
                                {showRowNumbers && (
                                    <th
                                        className={cnClassNames("w-8 text-left text-[11px] font-bold uppercase border-b", !autoHeight && headerHeight, pl, theme.border)}
                                        aria-label={GENERIC_LABELS.rowNumber}
                                    >
                                        #
                                    </th>
                                )}

                                {/*Custom number column */}
                                {columns.map((col) => (
                                    <th
                                        key={String(col.accessor)}
                                        scope="col"
                                        className={cnClassNames(
                                            "relative text-left group transition-colors border-b",
                                            theme.hoverBg, theme.border, !autoHeight && headerHeight, px
                                        )}
                                        aria-label={col.header}
                                    >
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={cnClassNames("font-bold uppercase truncate", theme.textMain)}>
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
                                                    onChange: (value: string) => handleFilterChange(String(col.accessor), value),
                                                    placeholder: `${GENERIC_LABELS.search} ${col.header}...`
                                                } : undefined}
                                            />
                                        </div>

                                        {col.resizable !== false && (
                                            <div
                                                onMouseDown={(e) => startResize(e, String(col.accessor))}
                                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/30 z-10"
                                                aria-label={`${GENERIC_LABELS.resizeColumn} ${col.header} ${GENERIC_LABELS.action.toLowerCase()}`}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={cnClassNames("", theme.textMain)}>
                            {pageData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={totalColumns}
                                        className={cnClassNames("text-center p-8 border-b", theme.textMuted)}
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className={cnClassNames("transition-colors", selectedIds.has(record.id) && theme.accent, theme.hoverBg)}
                                    >
                                        {enableSelection && (
                                            <td
                                                className={cnClassNames("text-center sticky left-0 border-b", !autoHeight && rowHeight, pl, theme.border)}
                                                aria-label={`${GENERIC_LABELS.selectRow} ${index + 1}`}
                                            >
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
                                            <td
                                                className={cnClassNames("text-xs font-medium border-b", pl, theme.textMuted, !autoHeight && rowHeight, theme.border)}
                                                aria-label={`Row ${(currentPage - 1) * currentPageSize + index + 1}`}
                                            >
                                                {(currentPage - 1) * currentPageSize + index + 1}
                                            </td>
                                        )}

                                        {columns.map((col) => (
                                            <td
                                                key={String(col.accessor)}
                                                className={cnClassNames("text-xs truncate border-b", !autoHeight && rowHeight, pl, theme.border)}
                                                aria-label={`${col.header}: ${String(record[col.accessor as keyof T] ?? "")}`}
                                            >
                                                <EditableCell col={col} record={record} index={index} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            <div className={cnClassNames("flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center p-2", theme.bg, theme.border)}>
                <div className={cnClassNames("flex flex-wrap items-center gap-2 text-xs", theme.textMain)}>
                    <span className={cnClassNames("font-medium", theme.textMuted)}>
                        {selectedIds.size} {GENERIC_LABELS.selected}
                    </span>
                    <span className={cnClassNames("font-medium", theme.textMuted)}>
                        {GENERIC_LABELS.rowsOf} {rangeStart}-{rangeEnd} of {sortedData.length}{pagination ? `, ${GENERIC_LABELS.pageOf} ${currentPage} of ${totalPages}` : ''}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {Object.values(columnFilters).some(v => v) && (
                        <Button
                            onClick={() => setColumnFilters({})}
                            className="text-[10px] px-2 py-1 text-red-500 hover:bg-red-50"
                            aria-label={GENERIC_LABELS.clearAllFilters}
                        >
                            {GENERIC_LABELS.clear} {GENERIC_LABELS.filter}
                        </Button>
                    )}

                    {pagination && (
                        <>
                            <div className="flex items-center gap-2 text-[10px]">
                                <label className={cnClassNames("text-xs font-medium", theme.textMuted)} htmlFor="pageSizeSelect">
                                    {GENERIC_LABELS.rowsPerPage}
                                </label>
                                <select
                                    id="pageSizeSelect"
                                    value={currentPageSize}
                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    className={cnClassNames(
                                        "rounded px-2 py-1 text-[10px] border outline-none",
                                        theme.border,  theme.bg
                                    )}
                                >
                                    {pageSizeOptions.map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1 text-[10px]">
                                <Button
                                    onClick={goToFirstPage}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1"
                                    aria-label={GENERIC_LABELS.goToFirstPage}
                                >
                                    &#171;
                                </Button>
                                <Button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-2 py-1"
                                    aria-label={GENERIC_LABELS.goToPreviousPage}
                                >
                                    &#8249;
                                </Button>
                                <span className={cnClassNames("px-2 py-1", theme.textMuted)}>
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-1"
                                    aria-label={GENERIC_LABELS.goToNextPage}
                                >
                                    &#8250;
                                </Button>
                                <Button
                                    onClick={goToLastPage}
                                    disabled={currentPage === totalPages}
                                    className="px-2 py-1"
                                    aria-label={GENERIC_LABELS.goToLastPage}
                                >
                                    &#187;
                                </Button>
                            </div>
                        </>
                    )}
                </div>
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
    const [value, setValue] = useState<string>(String(record[col.accessor as keyof T] ?? ""));

    useEffect(() => {
        setValue(String(record[col.accessor as keyof T] ?? ""));
    }, [record, col.accessor]);

    const handleSave = useCallback(() => {
        setIsEditing(false);
        const originalValue = record[col.accessor as keyof T];
        const newValue = value;

        // Only save if value changed
        if (String(originalValue ?? "") !== newValue) {
            // Try to preserve original type if possible
            let typedValue: T[keyof T] = newValue as unknown as T[keyof T];

            // Attempt type conversion for numbers
            if (typeof originalValue === 'number') {
                const numValue = Number(newValue);
                if (!isNaN(numValue)) {
                    typedValue = numValue as unknown as T[keyof T];
                }
            }

            col.onCellSave?.(typedValue, record);
        }
    }, [value, record, col]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setValue(String(record[col.accessor as keyof T] ?? ""));
            setIsEditing(false);
        }
    }, [handleSave, record, col.accessor]);

    if (col.editable && isEditing) {
        return (
            <input
                type="text"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={cnClassNames(
                    "w-full border rounded px-2 py-1 outline-none ring-2 ring-primary/20 focus:ring-primary/50",
                    theme.border, theme.hoverBg, theme.textMain
                )}
                aria-label={`${GENERIC_LABELS.editCell} ${col.header}`}
            />
        );
    }

    return (
        <button
            type="button"
            className={cnClassNames(
                "w-full h-full min-h-[1.5rem] flex items-center text-left",
                col.editable && "cursor-pointer hover:text-primary focus:ring-2 focus:ring-primary/20 rounded",
                !col.editable && "cursor-default"
            )}
            onClick={() => col.editable && setIsEditing(true)}
            aria-label={col.editable ? `${GENERIC_LABELS.editCell} ${col.header}: ${value}` : undefined}
            disabled={!col.editable}
        >
            {col.render
                ? col.render(record[col.accessor as keyof T], record, index)
                : value
            }
        </button>
    );
}