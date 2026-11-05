import cnClassNames, { GENERIC_LABELS, ICON_SIZES } from '@/app/utils';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X } from "lucide-react";
import type { DropdownOption } from "@/app/types/ui";

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
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

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
            const target = e.target as Node;

            // Check if the click is inside the trigger
            const clickedInsideTrigger = containerRef.current?.contains(target);
            // Check if the click is inside the portal list
            const clickedInsideList = listRef.current?.contains(target);

            if (!clickedInsideTrigger && !clickedInsideList) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handler);
        }

        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // 3. Filtering Logic
    const filteredOptions = useMemo(() => {
        return options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    // 4. Selection Logic
    const handleSelect = (e: React.MouseEvent, optionValue: T) => {
        e.preventDefault();
        e.stopPropagation();
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

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            // Check if click is outside BOTH the trigger and the portal list
            if (
                containerRef.current && !containerRef.current.contains(target) &&
                listRef.current && !listRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className={`flex flex-col gap-1 w-full ${className}`} ref={containerRef}>
            {label && <label className="text-[10px] font-bold uppercase opacity-60 tracking-tighter">{label}</label>}

            <div
                onClick={toggle}
                className={cnClassNames("flex min-h-[36px] flex-wrap items-center gap-1 rounded border border-border-subtle bg-canvas px-3 py-1.5 text-main transition-all cursor-pointer", isOpen && "border-2")}
            >
                {multiple ? (
                    (value as T[]).length > 0 ? (
                        (value as T[]).map((v, i) => {
                            const opt = options.find(o => o.value === v);
                            return (
                                <div key={i} className="flex items-center gap-1 rounded bg-accent px-2 py-0.5 text-[10px] text-main">
                                    {opt?.label}
                                    <span>
                                        <X className="text-danger ml-1"
                                            onClick={(e) => handleSelect(e, v)}
                                            size={ICON_SIZES.md} />
                                    </span>
                                </div>
                            );
                        })
                    ) : <span className="text-xs text-muted">{placeholder}</span>
                ) : (
                    <span className="text-xs">
                        {options.find(o => o.value === value)?.label || placeholder}
                    </span>
                )}
            </div>

            {isOpen && (
                <Portal>
                    <div
                        ref={listRef}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{ position: 'absolute', top: `${coords.top}px`, left: `${coords.left}px`, width: `${coords.width}px` }}
                        className="z-[9999] mt-1 overflow-hidden rounded border border-border-subtle bg-surface text-main shadow-2xl animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                        {isSearchable && (
                            <div className="p-2 border-b border-inherit">
                                <input
                                    autoFocus
                                    onMouseDown={(e) => e.stopPropagation()}
                                    className="w-full rounded bg-accent px-2 py-1.5 text-xs text-main outline-none focus:ring-2 focus:ring-focus"
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
                                    className="cursor-pointer border-b border-border-subtle px-3 py-2 text-xs font-bold text-main hover:bg-surface-hover"
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
                                        onClick={(e) => handleSelect(e, opt.value)}
                                        className={cnClassNames("flex cursor-pointer items-center justify-between px-3 py-2 text-xs text-main hover:bg-surface-hover", selected && "bg-accent")}
                                    >
                                        <div className="flex items-center gap-2">
                                            {multiple && <input
                                                title='Option'
                                                type="checkbox"
                                                checked={selected}
                                                onClick={(e) => e.stopPropagation()}
                                                readOnly
                                                className="accent-primary" />}
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