import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import cnClassNames, { GENERIC_LABELS } from "@/app/utils";
import { useTheme } from '@/app/hooks/ThemeContext';
import { createPortal } from 'react-dom';

interface FlyoutProps {
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
    isOpen: boolean;
    width?: number;
    onClose: () => void;
    anchorRef?: React.RefObject<HTMLElement | null>; // Pass the button ref here
}

export default function Flyout({
    children,
    showCloseButton = false,
    className,
    isOpen,
    title,
    width = 48,
    onClose,
    anchorRef
}: FlyoutProps) {
    const { theme } = useTheme();
    const flyoutRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        /**
         * Smart Positioning Logic:
         * 1. Detects window boundaries.
         * 2. Automatically flips alignment if the flyout would clip off-screen.
         * 3. Syncs position with the anchor element.
         * * Moved inside useLayoutEffect to resolve react-hooks/exhaustive-deps warning.
         */
        const updatePosition = () => {
            if (isOpen && anchorRef?.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                const flyoutWidth = width * 4; // Approx tailwind scale (w-48 = 192px)

                const top = rect.bottom + window.scrollY + 8;
                let left = rect.right + window.scrollX - flyoutWidth;

                // Collision Detection: If left side goes off screen, align to left of button instead
                if (left < 10) {
                    left = rect.left + window.scrollX;
                }

                // Collision Detection: If right side goes off screen
                if (left + flyoutWidth > window.innerWidth - 10) {
                    left = window.innerWidth - flyoutWidth - 10;
                }

                setCoords({ top, left });
            }
        };

        updatePosition();

        // Listen for window changes to keep portal pinned
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition, true);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, anchorRef, width]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            ref={flyoutRef}
            style={{
                top: coords.top,
                left: coords.left,
                position: 'absolute',
                zIndex: 9999,
                width: `${width * 0.25}rem` // Match tailwind's w-{width} logic
            }}
            className={cnClassNames(
                "overflow-hidden border shadow-2xl p-2 animate-in fade-in zoom-in-95 rounded-2xl duration-100",
                theme.card,
                theme.border,
                className
            )}
        >
            {showCloseButton && (
                <div className="flex justify-between w-full m-2 items-center text-xs">
                    <span className={cnClassNames('font-bold tracking-widest')}>{title}</span>
                    <button
                        title={GENERIC_LABELS.close}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="text-red-500 hover:text-red-700 text-xs transition-colors p-1"
                    >
                        <span className='m-2 '>✕</span>
                    </button>
                </div>
            )}
            {children}
        </div>,
        document.body
    );
}