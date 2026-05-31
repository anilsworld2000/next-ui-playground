"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import cnClassNames from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";
import GoalCreateForm, { GoalCreateFormData } from "./GoalCreateForm";

interface GoalCreateProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GoalCreateFormData) => void;
}

export default function GoalCreate({ isOpen, onClose, onSubmit }: GoalCreateProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={cnClassNames(
                    "relative w-full max-w-md h-full flex flex-col animate-in slide-in-from-right duration-300",
                    theme.bg,
                    theme.border
                )}
            >
                <GoalCreateForm onSubmit={onSubmit} onClose={onClose} />
            </div>
        </div>,
        document.body
    );
}