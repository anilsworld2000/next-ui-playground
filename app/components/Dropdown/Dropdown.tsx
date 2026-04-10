import { GENERIC_LABELS } from '@/app/utils';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

// --- Types ---
export interface DropdownOption<T> {
    id: string | number;
    label: string;
    value: T;
    render?: (item: T) => React.ReactNode;
}

interface BaseProps<T> {
    options: DropdownOption<T>[];
    label?: string;
    isSearchable?: boolean;
    placeholder?: string;
    allowSelectAll?: boolean;
    className?: string;
}

// Discriminated Union for Type Safety
type DropdownProps<T> = BaseProps<T> & (
    | { multiple: true; value: T[]; onChange: (val: T[]) => void }
    | { multiple?: false; value: T | null; onChange: (val: T) => void }
);

// --- Portal Helper ---
const Portal = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted ? createPortal(children, document.body) : null;
};

export default function Dropdown<T>({
    options,
    value,
    onChange,
    multiple = false,
    label,
    isSearchable = false,
    placeholder = "Select...",
    allowSelectAll = false,
    className = ""
}: DropdownProps<T>) {
    // We'll use a mock theme object - replace with your actual useTheme() hook
    const theme = {
        bg: "bg-white dark:bg-slate-900",
        border: "border-slate-200 dark:border-slate-700",
        textMain: "text-slate-900 dark:text-slate-100",
        textMuted: "text-slate-500",
        accent: "bg-blue-50 dark:bg-blue-900/30",
        hoverBg: "hover:bg-slate-100 dark:hover:bg-slate-800"
    };

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // 1. Position Logic (Portal)
    const updateCoords = () => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    const toggle = () => {
        if (!isOpen) updateCoords();
        setIsOpen(!isOpen);
    };

    // 2. Click-Away Logic
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // 3. Filtering Logic
    const filteredOptions = useMemo(() => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // 4. Selection Logic
    const handleSelect = (optionValue: T) => {
        if (multiple) {
            const currentVal = value as T[];
            const isSelected = currentVal.includes(optionValue);
            const nextVal = isSelected
                ? currentVal.filter(v => v !== optionValue)
                : [...currentVal, optionValue];
            (onChange as (val: T[]) => void)(nextVal);
        } else {
            (onChange as (val: T) => void)(optionValue);
            setIsOpen(false);
        }
    };

    const handleToggleAll = () => {
        if (multiple) {
            const currentVal = value as T[];
            const nextVal = currentVal.length === options.length ? [] : options.map(o => o.value);
            (onChange as (val: T[]) => void)(nextVal);
        }
    };

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`} ref={containerRef}>
            {label && <label className="text-[10px] font-bold uppercase opacity-60 tracking-tighter">{label}</label>}

            <div
                onClick={toggle}
                className={`flex flex-wrap items-center gap-1 min-h-[36px] px-3 py-1.5 border rounded cursor-pointer transition-all ${theme.bg} ${theme.border} ${isOpen ? 'ring-1 ring-blue-500' : ''}`}
            >
                {multiple ? (
                    (value as T[]).length > 0 ? (
                        (value as T[]).map((v, i) => {
                            const opt = options.find(o => o.value === v);
                            return (
                                <div key={i} className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${theme.accent}`}>
                                    {opt?.label}
                                    <span
                                        className="hover:text-red-500 ml-1"
                                        onClick={(e) => { e.stopPropagation(); handleSelect(v); }}
                                    >×</span>
                                </div>
                            );
                        })
                    ) : <span className={theme.textMuted + " text-xs"}>{placeholder}</span>
                ) : (
                    <span className="text-xs">
                        {options.find(o => o.value === value)?.label || placeholder}
                    </span>
                )}
            </div>

            {isOpen && (
                <Portal>
                    <div
                        style={{ position: 'absolute', top: `${coords.top}px`, left: `${coords.left}px`, width: `${coords.width}px` }}
                        className={`z-[9999] mt-1 border rounded shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${theme.bg} ${theme.border}`}
                    >
                        {isSearchable && (
                            <div className="p-2 border-b border-inherit">
                                <input
                                    autoFocus
                                    className={`w-full px-2 py-1.5 text-xs rounded outline-none ${theme.accent}`}
                                    placeholder={`${GENERIC_LABELS.search}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}

                        <ul className="max-h-60 overflow-y-auto custom-scrollbar">
                            {multiple && allowSelectAll && (
                                <li
                                    onClick={handleToggleAll}
                                    className={`px-3 py-2 text-xs font-bold border-b cursor-pointer ${theme.hoverBg}`}
                                >
                                    {(value as T[]).length === options.length ? "Deselect All" : "Select All"}
                                </li>
                            )}
                            {filteredOptions.map((opt) => {
                                const selected = multiple
                                    ? (value as T[]).includes(opt.value)
                                    : value === opt.value;

                                return (
                                    <li
                                        key={opt.id}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between ${selected ? 'text-blue-500 font-medium' : theme.textMain} ${theme.hoverBg}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {multiple && <input
                                                title='Option'
                                                type="checkbox" checked={selected} readOnly className="accent-blue-500" />}
                                            {opt.render ? opt.render(opt.value) : opt.label}
                                        </div>
                                        {!multiple && selected && <span>✓</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </Portal>
            )}
        </div>
    );
}