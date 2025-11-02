import React from "react";

export type PropValue = string | number | boolean | undefined | readonly string [];

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
