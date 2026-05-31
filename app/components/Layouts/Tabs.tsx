import React, { useState, useEffect } from 'react';
import cnClassNames from '@/app/utils';
import { useTheme } from '@/app/hooks/ThemeContext';
import { Tab } from '@/app/types';

interface TabsProps<T extends string> {
    tabs: Tab<T>[];
    rememberActiveTab?: boolean; // Optional prop to control active tab from parent
    storageKey: string; // To persist the choice (e.g., "allocation-view-tab")
    className?: string;
    onBeforeTabChange?: (newTabId: T, currentTabId: T) => boolean | Promise<boolean>; // Optional callback for custom logic
}

export default function Tabs<T extends string>({
    tabs,
    rememberActiveTab = true,
    storageKey,
    className,
    onBeforeTabChange
}: TabsProps<T>) {
    const { theme } = useTheme();
    // Initialize state with a null-check for SSR
    const [activeTabId, setActiveTabId] = useState<T>(tabs[0].id);

    // Load persisted tab on mount
    useEffect(() => {
        if (rememberActiveTab) {
            const saved = localStorage.getItem(storageKey) as T;
            if (saved && tabs.find(t => t.id === saved)) {
                setActiveTabId(saved);
            }
        }
    }, [storageKey, tabs, rememberActiveTab]);

    const handleTabChange = async (id: T) => {
        // If already on this tab, do nothing
        if (id === activeTabId) return;

        // Call optional callback - if it returns false, don't switch tabs
        if (onBeforeTabChange) {
            const shouldProceed = await onBeforeTabChange(id, activeTabId);
            if (!shouldProceed) return;
        }

        setActiveTabId(id);
        if (rememberActiveTab) {
            localStorage.setItem(storageKey, id);
        }
    };

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    return (
        <div className={cnClassNames("flex flex-col w-full gap-2", className)}>
            {/* Tab Headers */}
            <div className={cnClassNames(
                "flex gap-1  w-fit transition-all shadow-lg",
                theme.accent
            )}>
                {tabs.map((tab) => {
                    const isActive = activeTabId === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTabChange(tab.id);
                            }}
                            className={cnClassNames(
                                "flex items-center gap-1 px-4 py-2 text-xs font-medium transition-all cursor-pointer",
                                isActive
                                    ? `${theme.card} ${theme.primaryText} shadow-sm scale-105`
                                    : `${theme.textMuted} hover:${theme.textMain} opacity-70 hover:opacity-100`
                            )}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab.content}
            </div>
        </div>
    );
}