import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Helper component for the Portal
export default function Portal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted ? createPortal(children, document.body) : null;
}