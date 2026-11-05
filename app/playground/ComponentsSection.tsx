'use client';
import { useState } from "react";
import { useSelectedComponent } from "../hooks/SelectedComponentContext";
import { componentRegistry } from "../customComponents/componentRegistry";

interface ComponentsSecProps {
    className?: string;
}

export default function ComponentsSection({ className }: ComponentsSecProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const { selectComponent } = useSelectedComponent();

    const components = componentRegistry;

    const filtered = components.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, comp) => {
        acc[comp.category] = acc[comp.category] || [];
        acc[comp.category].push(comp.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <aside className={className}>
            <h2 className="text-center font-semibold mb-4">🧩 Components</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="mb-4 w-full rounded border border-border-subtle bg-canvas px-2 py-1 text-sm text-main focus:outline-none focus:ring-2 focus:ring-focus"
            />

            {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-4">
                    <button
                        onClick={() => setOpenCategory(openCategory === category ? null : category)}
                        className="w-full text-left text-main hover:text-link-hover"
                    >
                        {category}
                    </button>

                    {/* Component List */}
                    {openCategory === category && (
                        <ul className="mt-1 space-y-2">
                            {items.map((item) => (
                                <li
                                    className="flex cursor-pointer items-center gap-1 rounded p-2 text-sm text-main hover:bg-surface-hover"
                                    key={item}
                                    onClick={() => selectComponent(item)}
                                    title={`Add a ${item} component`} // Tooltip
                                >

                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}

            {filtered.length === 0 && (
                <p className="text-sm text-muted">No components found.</p>
            )}
        </aside>
    )
}