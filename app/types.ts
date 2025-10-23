import React from "react";

export type Category = 'Action' | 'Input';
export interface PlaygroundComponent {
    id: string;
    name: string;
    render: (props: Record<string, any>) => React.ReactNode;
    code: (props: Record<string, any>) => string;
    category: Category;
    tags: string[];
    //component: {};
    defaultProps: ComponentProperty[];

}

export interface ComponentProperty {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range' | 'string';
    label: string;
    value?: string;
    defaultValue?: any;
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
}

export interface ComponentTemplate {
    id: string;
    name: string;
    //category: string;
    //description: string;
    //icon: React.ReactNode;
    defaultProps: ComponentProperty[];
    //generateJSX: (props: Record<string, any>, theme: any) => string;
    //renderComponent: (props: Record<string, any>, theme: any) => React.ReactNode;
}

