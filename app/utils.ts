import { PropValue } from "./types";
import { cursorStyles, roundedStyles, sizeStyles, variantStyles } from "./variants";

export const newLine: string = '\n';
export const tab: string = '\t';
export default function cnClassNames(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function getStyleClassesFromProps(props: Record<string, PropValue>) {
    return (`\'${sizeStyles[props['size'] as string]} ${variantStyles[props['variant'] as string]} ${roundedStyles[props['rounded'] as string]} ${props.disabled ? 'opacity-50 cursor-not-allowed' : cursorStyles[props['cursor'] as string]}\'`);
}


export function generateJSXCode() {

}

export function generateHTMLCode() {

}

export function getFormatedCurrency(value: number): string {
    return `₹${Intl.NumberFormat().format(value)}`;
}

export const GOAL_LABELS = {
    goal: "Goal",
    monthlyInvestment: "Monthly SIP",
    currentValue: "Current Investment",
    futureValue: "Target Value",
    achievedPercent: "Achieved",
    progress: "Progress",
}

export const GENERIC_LABELS = {
    action: "Action",
    status: "Status",
    edit: "Edit",
    delete: "Delete",
    add: "Add",
    print: "Print",
    save: "Save",
    cancel: "Cancel",
    clear: "Clear",
    close: "Close",
    search: "Search",
    filter: "Filter",
    filterBy: "Filter by",
    view: "View",
    sort: "Sort",
    toggle: "Toggle",
    asc: "Ascending",
    desc: "Descending",
    noDataFound: "No data found.",
    // DataGrid specific labels
    loading: "Loading...",
    dataTable: "Data table",
    selectAllRows: "Select all rows",
    rowNumber: "Row number",
    selected: "selected",
    rowsOf: "Rows",
    pageOf: "Page",
    clearAllFilters: "Clear all filters",
    rowsPerPage: "Rows per page:",
    goToFirstPage: "Go to first page",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    goToLastPage: "Go to last page",
    resizeColumn: "Resize",
    selectRow: "Select row",
    editCell: "Edit",
}

export const ICON_SIZES = {
    xlg: 18,
    lg: 16,
    md: 14,
    sm: 12,
    xs: 10,
    xxs: 8
}
