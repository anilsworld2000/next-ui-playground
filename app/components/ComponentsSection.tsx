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
    const { selectedComponent, selectComponent } = useSelectedComponent();

    // const components = [
    //     { name: "Button", category: "Inputs", path:`/customComponents/${''})}` },
    //     { name: "TextField", category: "Inputs" },
    //     { name: "Checkbox", category: "Inputs" },
    //     { name: "Grid", category: "Layouts" },
    //     { name: "FlexBox", category: "Layouts" },
    //     { name: "Container", category: "Layouts" },
    //     { name: "Sidebar", category: "Navigation" },
    //     { name: "Navbar", category: "Navigation" },
    //     { name: "Tabs", category: "Navigation" },
    // ];

    const components = componentRegistry;

    const filtered = components.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = filtered.reduce((acc, comp) => {
        acc[comp.category] = acc[comp.category] || [];
        acc[comp.category].push(comp.name);
        return acc;
    }, {} as Record<string, string[]>);
      
    //const componentsClassName: string = 'p-2 bg-white rounded hover:bg-blue-50 cursor-pointer';

    return (
        <aside className={className}>
            <h2 className="text-center font-semibold mb-4">🧩 Components</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="mb-4">
                    <button
                        onClick={() => setOpenCategory(openCategory === category ? null : category)}
                        className="w-full text-left hover:text-blue-600"
                    >
                        {category}
                    </button>

                    {/* Component List */}
                    {openCategory === category && (
                        <ul className="mt-1 space-y-2">
                            {items.map((item) => (
                                <li
                                    className="flex items-center text-sm gap-1 p-2 bg-white rounded hover:bg-blue-50 cursor-pointer"
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
                <p className="text-sm text-gray-500">No components found.</p>
            )}
        </aside>
    )
}