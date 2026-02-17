import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface Quote {
    quote: string;
    character: string;
    anime: string;
}

interface QuoteCardProps {
    quote: Quote;
    index: number;
}

export default function QuoteCard({ quote, index }: QuoteCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textToCopy = `"${quote.quote}"\n- ${quote.character} (${quote.anime})`;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="glass-card rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full"
        >
            <div className="absolute top-0 right-0 p-6 opacity-5 font-serif text-8xl leading-none select-none pointer-events-none text-white group-hover:opacity-10 transition-opacity">
                ”
            </div>

            <div className="relative z-10 mb-8">
                <div className="mb-6">
                    <span className="inline-block w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4" />
                    <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-100 tracking-wide line-clamp-6">
                        {quote.quote}
                    </p>
                </div>
            </div>

            <div className="relative z-10 mt-auto border-t border-white/5 pt-6">
                <div className="flex items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold text-base tracking-wider">
                            {quote.character}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                            {quote.anime}
                        </span>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        )}
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}
