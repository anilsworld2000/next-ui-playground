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

