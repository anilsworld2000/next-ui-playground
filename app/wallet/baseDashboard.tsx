"use client";
import { useState, ReactNode } from "react";
import { Plus, Search, Filter } from "lucide-react";
import Button from "@/app/components/Buttons/Button";
import cnClassNames from "../utils";

interface BaseDashboardProps<T> {
    title: string;
    subtitle: string;
    items: T[];
    searchPlaceholder?: string;
    onAddClick: () => void;
    renderCard: (item: T) => ReactNode;
    filterOptions?: string[];
}

export default function BaseDashboard<T extends { id: string; title?: string; name?: string }>({
    title,
    subtitle,
    items,
    searchPlaceholder = "Search...",
    onAddClick,
    renderCard,
}: BaseDashboardProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredItems = items.filter((item) => {
        const searchTerm = (item.title || item.name || "").toLowerCase();
        return searchTerm.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="opacity-60 text-sm mt-1">{subtitle}</p>
                </div>
                <Button
                    onClick={onAddClick}
                    className={cnClassNames("flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95")}
                >
                    <Plus size={20} /> Add New
                </Button>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10">
                    <Filter size={18} /> Filter
                </Button>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                    <div key={item.id}>
                        {renderCard(item)}
                    </div>
                ))}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-center opacity-40">
                        <Search size={48} className="mb-4" />
                        <p className="text-lg">No items found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}