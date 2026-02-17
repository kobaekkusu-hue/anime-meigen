import type { Metadata } from "next";
import "./globals.css";
import ErrorSuppressor from "@/components/ErrorSuppressor";

export const metadata: Metadata = {
    title: "Anime Quotes Generator",
    description: "Generate anime quotes using AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body>
                <ErrorSuppressor />
                {children}
            </body>
        </html>
    );
}
