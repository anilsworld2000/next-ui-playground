"use client";
import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from "@/app/utils";
import type { Column, DataGridProps, SortConfig } from "@/app/types/ui";
import { useTheme } from "@/app/hooks/ThemeContext";
import CustomCheckbox from "../CustomCheckbox";
import Button from "../Buttons/Button";
import ControlBar from "../UnifiedControlls/ControlBar";

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightedText({ value, searchTerm, highlightMatches = true }: { value: string | number | null | undefined; searchTerm: string; highlightMatches?: boolean }) {
    const text = String(value ?? "");
    const trimmed = searchTerm.trim();

    if (!highlightMatches || !trimmed) {
        return <>{text}</>;
    }

    const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, "ig");
    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, index) => {
                const isMatch = part.toLowerCase() === trimmed.toLowerCase();
                return isMatch ? <mark key={`${part}-${index}`} className="rounded bg-yellow-200 px-0.5 text-inherit">{part}</mark> : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
            })}
        </>
    );
}

export default function DataGrid<T extends { id: string | number }>({
    data,
    columns,
    showRowNumbers = false,
    enableSelection = false,
    selectionMode: requestedSelectionMode,
    onSelectionChange,
    onCellSelectionChange,
    headerHeight = "py-2",
    rowHeight = "py-2",
    autoHeight = false,
    loading = false,
    loadingSkeletonRows = 5,
    emptyMessage = GENERIC_LABELS.noDataFound,
    ariaLabel = GENERIC_LABELS.dataTable,
    scrollable = false,
    heightClass = "h-[60vh]",
    pagination = false,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50],
    initialPage = 1,
    enableColumnVisibility = false,
    initialVisibleColumns,
    showGlobalSearch = false,
    globalSearchTerm,
    onGlobalSearchChange,
    highlightMatches = true,
    enableKeyboardNavigation = false,
    enableMultiSort = false,
    enableExport = false,
    bulkActions = [],
    enableBulkActions = false,
}: DataGridProps<T>) {
    const selectionMode = requestedSelectionMode ?? (enableSelection ? "checkbox" : "none");
    const hasRowSelection = selectionMode === "checkbox" || selectionMode === "row";
    const hasCellSelection = selectionMode === "cell";
    const pl: string = autoHeight ? "pl-2" : "pl-4";
    const px: string = autoHeight ? "px-2" : "px-4";
    const columnIconSize = ICON_SIZES.md;
    const columnIconThickness = 1;
    const scrollContainerClass = cnClassNames("overflow-auto custom-scrollbar", scrollable ? heightClass : undefined);
    const { theme } = useTheme();
    const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [currentPageSize, setCurrentPageSize] = useState<number>(pageSize);
    const [sortConfig, setSortConfig] = useState<SortConfig | SortConfig[] | null>(null);
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string>>({});
    const [globalSearch, setGlobalSearch] = useState<string>(globalSearchTerm ?? "");
    const [focusedCell, setFocusedCell] = useState<{ row: number; column: number }>({ row: 0, column: 0 });
    const [selectedCell, setSelectedCell] = useState<{ rowId: string | number; column: string } | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);
    const [colWidths, setColWidths] = useState<{ [key: string]: number }>(
        Object.fromEntries(columns.map(c => [String(c.accessor), c.width || 150]))
    );
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
        const visibleSet = initialVisibleColumns ?? columns.map(col => String(col.accessor));
        return Object.fromEntries(columns.map(col => [String(col.accessor), visibleSet.includes(String(col.accessor))]));
    });

    useEffect(() => {
        if (globalSearchTerm !== undefined) {
            setGlobalSearch(globalSearchTerm);
        }
    }, [globalSearchTerm]);

    useEffect(() => {
        setVisibleColumns((prev) => {
            const next: Record<string, boolean> = {};
            columns.forEach((col) => {
                const key = String(col.accessor);
                next[key] = prev[key] ?? (initialVisibleColumns ? initialVisibleColumns.includes(key) : true);
            });
            return next;
        });
    }, [columns, initialVisibleColumns]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilters(columnFilters), 250);
        return () => clearTimeout(timer);
    }, [columnFilters]);

    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(Array.from(selectedIds));
        }
    }, [selectedIds, onSelectionChange]);

    useEffect(() => {
        onCellSelectionChange?.(selectedCell);
    }, [onCellSelectionChange, selectedCell]);

    const handleFilterChange = useCallback((accessor: string, value: string) => {
        setColumnFilters((prev) => ({ ...prev, [accessor]: value }));
    }, []);

    const selectRow = useCallback((rowId: string | number) => {
        setSelectedIds(new Set([rowId]));
    }, []);

    const selectCell = useCallback((rowId: string | number, column: string) => {
        setSelectedCell({ rowId, column });
    }, []);

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
        resizingCol.current = { key, startX: e.pageX, startWidth: colWidths[key] ?? 150 };
        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", stopResize);
    }, [colWidths, handleResize, stopResize]);

    useEffect(() => () => {
        document.removeEventListener("mousemove", handleResize);
        document.removeEventListener("mouseup", stopResize);
    }, [handleResize, stopResize]);

    const visibleColumnDefs = useMemo(
        () => columns.filter((col) => visibleColumns[String(col.accessor)] !== false),
        [columns, visibleColumns]
    );

    const toggleColumnVisibility = useCallback((accessor: string) => {
        setVisibleColumns((prev) => {
            const next = { ...prev, [accessor]: !(prev[accessor] ?? true) };
            const visibleCount = Object.values(next).filter(Boolean).length;
            if (visibleCount === 0) next[accessor] = true;
            return next;
        });
    }, []);

    const effectiveGlobalSearch = globalSearchTerm !== undefined ? globalSearchTerm : globalSearch;
    const updateGlobalSearch = useCallback((value: string) => {
        setGlobalSearch(value);
        onGlobalSearchChange?.(value);
    }, [onGlobalSearchChange]);

    const activeSorts = useMemo(() => {
        if (Array.isArray(sortConfig)) return sortConfig.filter((sort): sort is NonNullable<SortConfig> => sort !== null);
        if (sortConfig) return [sortConfig].filter((sort): sort is NonNullable<SortConfig> => sort !== null);
        return [];
    }, [sortConfig]);

    const filteredData = useMemo(() => {
        const searchTerm = effectiveGlobalSearch.trim().toLowerCase();

        return data.filter((row) => {
            const matchesGlobalSearch = !searchTerm || Object.values(row as Record<string, unknown>).some((value) => {
                if (value == null) return false;
                if (typeof value === "string" || typeof value === "number") {
                    return String(value).toLowerCase().includes(searchTerm);
                }
                return false;
            });

            if (!matchesGlobalSearch) return false;

            return Object.entries(debouncedFilters).every(([accessor, filterValue]) => {
                if (!filterValue) return true;
                const rowSource = row as Record<string, unknown>;
                const rowValue = String(rowSource[accessor] ?? "").toLowerCase();
                const searchTermValue = filterValue.toLowerCase();

                if (searchTermValue.startsWith(">")) return Number(rowValue) > Number(searchTermValue.substring(1));
                if (searchTermValue.startsWith("<")) return Number(rowValue) < Number(searchTermValue.substring(1));
                return rowValue.includes(searchTermValue);
            });
        });
    }, [data, debouncedFilters, effectiveGlobalSearch]);

    const sortedData = useMemo(() => {
        const sortableItems = [...filteredData];
        if (activeSorts.length === 0) return sortableItems;

        sortableItems.sort((a, b) => {
            for (const sort of activeSorts) {
                const aValue = a[sort.key as keyof T];
                const bValue = b[sort.key as keyof T];
                if (aValue === bValue) continue;
                if (aValue == null) return sort.dir === "asc" ? 1 : -1;
                if (bValue == null) return sort.dir === "asc" ? -1 : 1;
                if (aValue < bValue) return sort.dir === "asc" ? -1 : 1;
                if (aValue > bValue) return sort.dir === "asc" ? 1 : -1;
            }
            return 0;
        });

        return sortableItems;
    }, [filteredData, activeSorts]);

    const totalPages = useMemo(() => Math.max(1, Math.ceil(sortedData.length / currentPageSize)), [sortedData.length, currentPageSize]);

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
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

    const selectedRows = useMemo(
        () => data.filter((row) => selectedIds.has(row.id)),
        [data, selectedIds]
    );

    const totalColumns = (selectionMode === "checkbox" ? 1 : 0) + (showRowNumbers ? 1 : 0) + visibleColumnDefs.length;

    const handleGridKeyDown = useCallback((event: React.KeyboardEvent<HTMLTableElement>) => {
        if (!enableKeyboardNavigation) return;

        const { row, column } = focusedCell;
        const maxRows = Math.max(pageData.length, 1);
        const maxColumns = Math.max(visibleColumnDefs.length, 1);

        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(event.key)) {
            event.preventDefault();
        }

        let nextRow = row;
        let nextColumn = column;

        switch (event.key) {
            case "ArrowDown":
                nextRow = Math.min(row + 1, maxRows - 1);
                break;
            case "ArrowUp":
                nextRow = Math.max(row - 1, 0);
                break;
            case "ArrowRight":
                nextColumn = Math.min(column + 1, maxColumns - 1);
                break;
            case "ArrowLeft":
                nextColumn = Math.max(column - 1, 0);
                break;
            case "Home":
                nextColumn = 0;
                break;
            case "End":
                nextColumn = maxColumns - 1;
                break;
            case "PageDown":
                nextRow = Math.min(row + 5, maxRows - 1);
                break;
            case "PageUp":
                nextRow = Math.max(row - 5, 0);
                break;
            default:
                return;
        }

        setFocusedCell({ row: nextRow, column: nextColumn });

        const focusSelector = `[data-grid-row="${nextRow}"][data-grid-column="${nextColumn}"]`;
        const nextElement = tableRef.current?.querySelector<HTMLElement>(focusSelector);
        nextElement?.focus();
    }, [enableKeyboardNavigation, focusedCell, pageData.length, visibleColumnDefs.length]);

    const exportCsv = useCallback(() => {
        const rows = sortedData.map((record) => {
            const csvRow = visibleColumnDefs.map((col) => {
                const value = record[col.accessor as keyof T];
                const normalized = String(value ?? "").replace(/"/g, '""');
                return `"${normalized}"`;
            });
            return csvRow.join(",");
        });

        const header = visibleColumnDefs.map((col) => `"${String(col.header).replace(/"/g, '""')}"`).join(",");
        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "datatable.csv";
        link.click();
        URL.revokeObjectURL(url);
    }, [sortedData, visibleColumnDefs]);

    const exportPdf = useCallback(() => {
        if (typeof window !== "undefined") {
            window.print();
        }
    }, []);

    return (
        <div className={cnClassNames("w-full flex flex-col overflow-hidden rounded-lg border shadow-sm", theme.border)}>
            {(showGlobalSearch || enableColumnVisibility || enableExport || (enableBulkActions && bulkActions.length > 0)) && (
                <div className={cnClassNames("flex flex-col items-stretch justify-between gap-3 border-b p-3 text-[10px] sm:flex-row sm:items-center", theme.bg, theme.border)}>
                    <div className="flex flex-wrap items-center gap-2">
                        {showGlobalSearch && (
                            <input
                                value={effectiveGlobalSearch}
                                onChange={(event) => updateGlobalSearch(event.target.value)}
                                placeholder="Search all rows..."
                                className={cnClassNames("min-w-[220px] rounded border px-3 py-2 text-xs outline-none transition-shadow focus:ring-2 focus:ring-current/20", theme.border, theme.bg, theme.textMain)}
                                aria-label="Global search"
                            />
                        )}

                        {enableColumnVisibility && (
                            <div className={cnClassNames("flex flex-wrap items-center gap-2", theme.textMain)}>
                                <span className={cnClassNames("font-semibold uppercase", theme.textMuted)}>Columns</span>
                                {columns.map((col) => {
                                    const key = String(col.accessor);
                                    const isVisible = visibleColumns[key] !== false;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            aria-pressed={isVisible}
                                            onClick={() => toggleColumnVisibility(key)}
                                            className={cnClassNames(
                                                "rounded border px-2 py-1 transition-colors",
                                                isVisible
                                                    ? cnClassNames(theme.accent, "text-white border-transparent")
                                                    : cnClassNames(theme.bg, theme.border, theme.textMain)
                                            )}
                                        >
                                            {col.header}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {enableBulkActions && bulkActions.length > 0 && (
                            <>
                                {bulkActions.map((action) => (
                                    <Button
                                        key={action.id}
                                        onClick={() => action.onAction(selectedRows)}
                                        disabled={selectedRows.length === 0}
                                        className={cnClassNames(
                                            "rounded border px-2 py-1 text-[10px] transition-colors",
                                            action.variant === "danger" ? "border-red-300 text-red-600 hover:bg-red-50" : "border-slate-300 text-slate-700 hover:bg-slate-50",
                                            selectedRows.length === 0 && "cursor-not-allowed opacity-50"
                                        )}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </>
                        )}

                        {enableExport && (
                            <>
                                <Button onClick={exportCsv} className="rounded border px-3 py-2 text-[10px]">Export CSV</Button>
                                <Button onClick={exportPdf} className="rounded border px-3 py-2 text-[10px]">Export PDF</Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className={scrollContainerClass}>
                {loading ? (
                    <table className={cnClassNames("w-full border-separate border-spacing-0 table-fixed min-w-full animate-pulse", theme.border)} aria-label={ariaLabel}>
                        <colgroup>
                            {selectionMode === "checkbox" && <col width={32} />}
                            {showRowNumbers && <col width={40} />}
                            {visibleColumnDefs.map((col) => (
                                <col key={String(col.accessor)} width={colWidths[String(col.accessor)] ?? 150} />
                            ))}
                        </colgroup>
                        <tbody>
                            {Array.from({ length: loadingSkeletonRows }).map((_, rowIndex) => (
                                <tr key={rowIndex} className={cnClassNames("border-b", theme.border)}>
                                    {selectionMode === "checkbox" && <td className={cnClassNames("p-3", theme.border)}><div className={cnClassNames("h-4 w-4 rounded bg-slate-200 dark:bg-slate-700")} /></td>}
                                    {showRowNumbers && <td className={cnClassNames("p-3", theme.border)}><div className={cnClassNames("h-4 w-4 rounded bg-slate-200 dark:bg-slate-700")} /></td>}
                                    {visibleColumnDefs.map((col) => (
                                        <td key={`${rowIndex}-${String(col.accessor)}`} className={cnClassNames("p-3", theme.border)}>
                                            <div className={cnClassNames("h-4 rounded bg-slate-200 dark:bg-slate-700")} style={{ width: `${Math.min(100, Math.max(40, (rowIndex + 1) * 20))}%` }} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table
                        ref={tableRef}
                        className={cnClassNames("w-full border-separate border-spacing-0 table-fixed min-w-full", theme.border)}
                        aria-label={ariaLabel}
                        onKeyDown={handleGridKeyDown}
                    >
                        <colgroup>
                            {selectionMode === "checkbox" && <col width={32} />}
                            {showRowNumbers && <col width={40} />}
                            {visibleColumnDefs.map((col) => (
                                <col key={String(col.accessor)} width={colWidths[String(col.accessor)] ?? 150} />
                            ))}
                        </colgroup>
                        <thead className={cnClassNames("sticky top-0 z-10 shadow-sm text-xs", theme.textMain)}>
                            <tr className={cnClassNames(theme.bg)}>
                                {selectionMode === "checkbox" && (
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

                                {showRowNumbers && (
                                    <th className={cnClassNames("w-8 text-left text-[11px] font-bold uppercase border-b", !autoHeight && headerHeight, pl, theme.border)} aria-label={GENERIC_LABELS.rowNumber}>
                                        #
                                    </th>
                                )}

                                {visibleColumnDefs.map((col) => (
                                    <th
                                        key={String(col.accessor)}
                                        scope="col"
                                        className={cnClassNames("relative text-left group transition-colors border-b", theme.hoverBg, theme.border, !autoHeight && headerHeight, px)}
                                        aria-label={col.header}
                                    >
                                        <div className="flex items-center justify-between gap-1">
                                            <span className={cnClassNames("font-bold uppercase truncate", theme.textMain)}>{col.header}</span>

                                            <ControlBar
                                                iconSize={columnIconSize}
                                                iconStrokeWidth={columnIconThickness}
                                                sortButtonConfig={{
                                                    title: col.header,
                                                    sortKey: String(col.accessor),
                                                    currentSort: enableMultiSort ? activeSorts : sortConfig,
                                                    onSortChange: (config) => {
                                                        if (enableMultiSort) {
                                                            setSortConfig(config as SortConfig[] | null);
                                                        } else {
                                                            setSortConfig(config as SortConfig | null);
                                                        }
                                                    }
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
                                    <td colSpan={totalColumns} className={cnClassNames("text-center p-8 border-b", theme.textMuted)}>
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        aria-selected={hasRowSelection ? selectedIds.has(record.id) : undefined}
                                        onClick={() => selectionMode === "row" && selectRow(record.id)}
                                        className={cnClassNames(
                                            "transition-colors",
                                            hasRowSelection && selectedIds.has(record.id) && theme.accent,
                                            selectionMode === "row" && "cursor-pointer",
                                            theme.hoverBg
                                        )}
                                    >
                                        {selectionMode === "checkbox" && (
                                            <td className={cnClassNames("text-center sticky left-0 border-b", !autoHeight && rowHeight, pl, theme.border)} aria-label={`${GENERIC_LABELS.selectRow} ${index + 1}`}>
                                                <CustomCheckbox
                                                    checked={selectedIds.has(record.id)}
                                                    onChange={() => {
                                                        const next = new Set(selectedIds);
                                                        if (next.has(record.id)) next.delete(record.id);
                                                        else next.add(record.id);
                                                        setSelectedIds(next);
                                                    }}
                                                />
                                            </td>
                                        )}

                                        {showRowNumbers && (
                                            <td className={cnClassNames("text-xs font-medium border-b", pl, theme.textMuted, !autoHeight && rowHeight, theme.border)} aria-label={`Row ${(currentPage - 1) * currentPageSize + index + 1}`}>
                                                {(currentPage - 1) * currentPageSize + index + 1}
                                            </td>
                                        )}

                                        {visibleColumnDefs.map((col, colIndex) => {
                                            const value = record[col.accessor as keyof T];
                                            const displayValue = String(value ?? "");
                                            const isSelectedCell = selectedCell?.rowId === record.id && selectedCell.column === String(col.accessor);
                                            return (
                                                <td
                                                    key={String(col.accessor)}
                                                    data-grid-row={index}
                                                    data-grid-column={colIndex}
                                                    tabIndex={enableKeyboardNavigation ? 0 : -1}
                                                    onFocus={() => setFocusedCell({ row: index, column: colIndex })}
                                                    onClick={() => hasCellSelection && selectCell(record.id, String(col.accessor))}
                                                    aria-selected={hasCellSelection ? isSelectedCell : undefined}
                                                    className={cnClassNames(
                                                        "text-xs truncate border-b outline-none",
                                                        !autoHeight && rowHeight,
                                                        pl,
                                                        theme.border,
                                                        focusedCell.row === index && focusedCell.column === colIndex ? "ring-2 ring-inset ring-primary/40" : "",
                                                        hasCellSelection && isSelectedCell && "ring-2 ring-inset ring-primary"
                                                    )}
                                                    aria-label={`${col.header}: ${displayValue}`}
                                                    title={displayValue}
                                                >
                                                    <EditableCell
                                                        col={col}
                                                        record={record}
                                                        index={index}
                                                        searchTerm={effectiveGlobalSearch}
                                                        highlightMatches={highlightMatches}
                                                    />
                                                </td>
                                            );
                                        })}
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
                        {GENERIC_LABELS.rowsOf} {rangeStart}-{rangeEnd} of {sortedData.length}{pagination ? `, ${GENERIC_LABELS.pageOf} ${currentPage} of ${totalPages}` : ""}
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
                                <label className={cnClassNames("text-xs font-medium", theme.textMuted)} htmlFor="pageSizeSelect">{GENERIC_LABELS.rowsPerPage}</label>
                                <select
                                    id="pageSizeSelect"
                                    value={currentPageSize}
                                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                                    className={cnClassNames("rounded px-2 py-1 text-[10px] border outline-none", theme.border, theme.bg)}
                                >
                                    {pageSizeOptions.map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-1 text-[10px]">
                                <Button onClick={goToFirstPage} disabled={currentPage === 1} className="px-2 py-1" aria-label={GENERIC_LABELS.goToFirstPage}>&#171;</Button>
                                <Button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-2 py-1" aria-label={GENERIC_LABELS.goToPreviousPage}>&#8249;</Button>
                                <span className={cnClassNames("px-2 py-1", theme.textMuted)}>{currentPage} / {totalPages}</span>
                                <Button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-2 py-1" aria-label={GENERIC_LABELS.goToNextPage}>&#8250;</Button>
                                <Button onClick={goToLastPage} disabled={currentPage === totalPages} className="px-2 py-1" aria-label={GENERIC_LABELS.goToLastPage}>&#187;</Button>
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
    index,
    searchTerm,
    highlightMatches,
}: {
    col: Column<T>;
    record: T;
    index: number;
    searchTerm: string;
    highlightMatches: boolean;
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

        if (String(originalValue ?? "") !== newValue) {
            let typedValue: T[keyof T] = newValue as unknown as T[keyof T];

            if (typeof originalValue === "number") {
                const numValue = Number(newValue);
                if (!isNaN(numValue)) typedValue = numValue as unknown as T[keyof T];
            }

            col.onCellSave?.(typedValue, record);
        }
    }, [value, record, col]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSave();
        else if (e.key === "Escape") {
            setValue(String(record[col.accessor as keyof T] ?? ""));
            setIsEditing(false);
        }
    }, [handleSave, record, col.accessor]);

    const displayValue = String(record[col.accessor as keyof T] ?? "");

    if (col.editable && isEditing) {
        return (
            <input
                type="text"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={cnClassNames("w-full border rounded px-2 py-1 outline-none ring-2 ring-primary/20 focus:ring-primary/50", theme.border, theme.hoverBg, theme.textMain)}
                aria-label={`${GENERIC_LABELS.editCell} ${col.header}`}
            />
        );
    }

    return (
        <button
            type="button"
            className={cnClassNames("w-full h-full min-h-[1.5rem] flex items-center text-left", col.editable && "cursor-pointer hover:text-primary focus:ring-2 focus:ring-primary/20 rounded", !col.editable && "cursor-default")}
            onClick={() => col.editable && setIsEditing(true)}
            aria-label={col.editable ? `${GENERIC_LABELS.editCell} ${col.header}: ${displayValue}` : undefined}
            disabled={!col.editable}
            title={displayValue}
        >
            {col.render
                ? (() => {
                    const rendered = col.render(record[col.accessor as keyof T], record, index);
                    if (typeof rendered === "string" || typeof rendered === "number") {
                        return <HighlightedText value={rendered} searchTerm={searchTerm} highlightMatches={highlightMatches} />;
                    }
                    return rendered;
                })()
                : <HighlightedText value={displayValue} searchTerm={searchTerm} highlightMatches={highlightMatches} />}
        </button>
    );
}