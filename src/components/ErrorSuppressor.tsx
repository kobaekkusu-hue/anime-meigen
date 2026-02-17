"use client";

import { useEffect } from "react";

export default function ErrorSuppressor() {
    useEffect(() => {
        // Suppress unhandled rejections from MetaMask
        const handleRejection = (event: PromiseRejectionEvent) => {
            const message = event.reason?.message || String(event.reason);
            if (message.includes("MetaMask") || message.includes("ethereum")) {
                event.preventDefault();
                console.warn("Suppressed MetaMask error:", message);
            }
        };

        // Suppress global errors from MetaMask
        const handleError = (event: ErrorEvent) => {
            const message = event.message || String(event.error);
            if (message.includes("MetaMask") || message.includes("ethereum")) {
                event.preventDefault();
                console.warn("Suppressed MetaMask error:", message);
            }
        }

        window.addEventListener("unhandledrejection", handleRejection);
        window.addEventListener("error", handleError);

        return () => {
            window.removeEventListener("unhandledrejection", handleRejection);
            window.removeEventListener("error", handleError);
        };
    }, []);

    return null;
}
