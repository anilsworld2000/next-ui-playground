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
    search: "Search",
    filter: "Filter",
    view: "View",
    sort: "Sort",
    toggle: "Toggle",
    asc: "Ascending",
    desc: "Descending",
    noDataFound: "No data found.",
}
