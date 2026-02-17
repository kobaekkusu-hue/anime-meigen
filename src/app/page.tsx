"use client";

import { useState } from "react";

import SearchForm from "@/components/SearchForm";
import QuoteCard from "@/components/QuoteCard";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";


interface Quote {
    quote: string;
    character: string;
    anime: string;
}

export default function Home() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (data: { keyword: string; characterName: string; count: number }) => {
        setIsLoading(true);
        setError("");
        setQuotes([]);

        try {
            const response = await fetch("/api/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    keyword: data.keyword,
                    character: data.characterName,
                    count: data.count,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch quotes");
            }

            const result = await response.json();
            setQuotes(result.quotes);
        } catch (err) {
            setError("名言の取得に失敗しました。もう一度お試しください。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 relative overflow-hidden flex flex-col items-center">
            {/* Background Image */}
            <div
                className="background-image"
                style={{ backgroundImage: 'url(/background_theme.webp)' }}
            />

            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col items-center">
                <header className="text-center mb-16 pt-12 md:pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-lg"
                    >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-purple-200 uppercase">AI Powered Quote Search</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400 mb-8 text-glow tracking-tighter"
                    >
                        アニメ名言<br className="md:hidden" />サーチ
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        <span className="text-white font-medium">Gemini 2.5 Flash</span> が、あなたの好きなアニメや<br className="hidden md:block" />
                        今の気分にぴったりの名言を瞬時に探し出します。
                    </motion.p>
                </header>

                <section className="w-full mb-20">
                    <SearchForm onSearch={handleSearch} isLoading={isLoading} />
                </section>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-200 px-8 py-6 rounded-2xl text-center mb-12 backdrop-blur-md max-w-2xl"
                    >
                        {error}
                    </motion.div>
                )}

                {quotes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 w-full">
                        {quotes.map((quote, index) => (
                            <QuoteCard key={index} quote={quote} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
