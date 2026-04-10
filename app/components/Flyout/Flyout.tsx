import React, { useRef, useEffect } from 'react';
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import { useTheme } from '@/app/hooks/ThemeContext';

interface FlyoutProps {
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
    // We need to know if it's open and how to close it from the parent
    isOpen: boolean;
    onClose: () => void;
}

export default function Flyout({
    children,
    showCloseButton = false,
    className,
    isOpen,
    title,
    onClose
}: FlyoutProps) {
    const { theme } = useTheme();
    const flyoutRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            // Check if the click was actually outside the flyout element
            if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={flyoutRef}
            className={cnClassNames(
                "absolute right-0 mt-3 w-48 border shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 rounded-2xl duration-100",
                theme.card, theme.border,
                className
            )}
        >
            {showCloseButton && (
                <div className="flex justify-between w-full mb-1 items-center text-xs">
                    <span className='font-bold text-xs opacity-50'>{title}</span>
                    <button
                        title={GENERIC_LABELS.close}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevents the event from bubbling
                            onClose();
                        }}
                        className="hover:text-red-500 transition-colors p-1"
                    >
                        <span>✕</span>
                    </button>
                </div>
            )}
            {children}
        </div>
    );
}