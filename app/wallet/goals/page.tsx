'use client';
import { ReactNode } from "react";
import BaseDashboard from "../baseDashboard";

export default function GoalsPage() {
    return (
        <BaseDashboard
            title={"Goals"}
            subtitle={""}
            items={[{ id: '1', title: 's' }, { id: '2', title: 'p' }]}
            onAddClick={function (): void {
                alert
            }}
            renderCard={function (item: { id: string; title?: string; name?: string; }): ReactNode {
                return <div>{item.title || item.name}</div>;
            }}>
        </BaseDashboard>
    );
}