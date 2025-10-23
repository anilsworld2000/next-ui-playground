"use client";
import { JSX, useState } from "react";
import Link from "next/link";

type ComponentMeta = {
    name: string;
    description: string;
    preview: JSX.Element;
};

const componentsList: ComponentMeta[] = [
    {
        name: "Button",
        description: "Customizable button with variants and sizes.",
        preview: (
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Click Me
            </button>
        ),
    },
    {
        name: "Card",
        description: "Responsive card layout for content blocks.",
        preview: (
            <div className="p-4 border rounded shadow-sm">
                <h3 className="font-semibold">Card Title</h3>
                <p className="text-sm text-gray-500">Card description here</p>
            </div>
        ),
    },
     {
         name: "Modal",
        description: "Overlay modal for dialogs and popups.",
        preview: (
            <div className="p-4 bg-gray-100 rounded shadow-inner">
                <p className="text-sm">Modal preview</p>
            </div>
        ),
     },
];

export default function HomeDashboard() {
    const [search, setSearch] = useState("");

    const filteredComponents = componentsList.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800">UI Playground</h1>
                <p className="text-gray-600">
                    Explore, customize, and copy ready-to-use UI components.
                </p>
            </header>

            {/* Search */}
            <div className="max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Search components..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Component Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredComponents.map((comp) => (
                    <div
                        key={comp.name}
                        className="p-4 rounded-lg shadow hover:shadow-md transition"
                    >
                        <div className="mb-4">{comp.preview}</div>
                        <h2 className="text-lg font-semibold">{comp.name}</h2>
                        <p className="text-sm mb-4">{comp.description}</p>
                        <Link
                            href={`/playground/${comp.name.toLowerCase()}`}
                            className="inline-block px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Open in Playground
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}