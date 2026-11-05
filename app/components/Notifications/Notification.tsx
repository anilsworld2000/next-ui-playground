"use client";

import { useEffect } from "react";
import { Check, CircleAlert, X } from "lucide-react";
import cnClassNames, { ICON_SIZES } from "../../utils";

export type NotificationTone = "success" | "error";

type NotificationProps = {
    message: string;
    tone?: NotificationTone;
    onDismiss: () => void;
    autoDismissMs?: number;
};

export default function Notification({
    message,
    tone = "success",
    onDismiss,
    autoDismissMs = 3500,
}: NotificationProps) {
    const isError = tone === "error";

    useEffect(() => {
        const timeoutId = window.setTimeout(onDismiss, autoDismissMs);

        return () => window.clearTimeout(timeoutId);
    }, [autoDismissMs, message, onDismiss]);

    return (
        <div
            className={cnClassNames(
                "notification fixed right-4 top-16 z-[100] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg",
                "bg-surface border-border-subtle",
                isError ? "border-danger/50 bg-danger-surface text-danger" : "text-main",
            )}
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
        >
            {isError ? (
                <CircleAlert className="mt-0.5 shrink-0" size={ICON_SIZES.lg} aria-hidden="true" />
            ) : (
                <Check className="mt-0.5 shrink-0" size={ICON_SIZES.lg} aria-hidden="true" />
            )}
            <span className="min-w-0 break-words">{message}</span>
            <button
                type="button"
                className="ml-2 shrink-0 rounded p-1 hover:bg-surface-hover"
                onClick={onDismiss}
                aria-label="Dismiss notification"
                title="Dismiss notification"
            >
                <X size={ICON_SIZES.lg} aria-hidden="true" />
            </button>
        </div>
    );
}