import type { ReactNode } from "react";

export type NavItem = {
    id: string;
    name: string;
    icon?: ReactNode;
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
