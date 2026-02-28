"use client";
import { useTheme } from "@/app/hooks/ThemeContext";
import cnClassNames from "@/app/utils";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ToolTip({ title }: { title: string }) {
    const theme = useTheme();
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMouseEnter = () => {
        if (triggerRef.current && tooltipRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Calculate center point of the sidebar item
            const yCenter = rect.top + rect.height / 2;

            // Pass the dynamic coordinate to CSS via a Variable
            tooltipRef.current.style.setProperty('--tooltip-y', `${yCenter}px`);
            setIsVisible(true);
        }
    };

    if (!mounted) return null;

    return (
        <>
            {/* The Invisible Trigger: Stays inside the Sidebar link */}
            <span
                ref={triggerRef}
                className="absolute inset-0 z-10 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsVisible(false)}
            />

            {/* The Portal: Renders outside the Navbar entirely */}
            {createPortal(
                <div
                    ref={tooltipRef}
                    className={cnClassNames(
                        "tooltip-portal",
                        isVisible && "visible",
                        theme.theme.primary
                    )}
                >
                    <div className={cnClassNames("tooltip-arrow", theme.theme.primary)} />
                    <span className="relative z-10">{title}</span>
                </div>,
                document.body
            )}
        </>
    );
}