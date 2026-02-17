"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, Sparkles } from "lucide-react";

type Category = 'anime' | 'great_person' | 'movie';

interface SearchFormProps {
    onSearch: (data: { keyword: string; characterName: string; count: number; category: Category }) => void;
    isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
    const [keyword, setKeyword] = useState("");
    const [characterName, setCharacterName] = useState("");
    const [count, setCount] = useState(3);
    const [category, setCategory] = useState<Category>('anime');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            onSearch({ keyword, characterName, count, category });
        }
    };

    const getPlaceholder = () => {
        switch (category) {
            case 'anime': return "例: NARUTO, 熱い言葉, 泣ける...";
            case 'great_person': return "例: スティーブ・ジョブズ, 成功, 失敗...";
            case 'movie': return "例: ショーシャンクの空に, 愛, 勇気...";
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8 w-full max-w-3xl mx-auto space-y-8 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

            {/* Category Selector */}
            <div className="flex justify-center gap-2 md:gap-4">
                {[
                    { id: 'anime', label: 'アニメ' },
                    { id: 'great_person', label: '偉人' },
                    { id: 'movie', label: '映画' },
                ].map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as Category)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${category === cat.id
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                    <label className="text-sm text-gray-300 font-medium ml-1 tracking-wide">キーワード (作品名・感情・シチュエーション)</label>
                    <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 focus-within:border-purple-500/50 transition-colors duration-300">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="w-full bg-transparent py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-3 group">
                    <label className="text-sm text-gray-300 font-medium ml-1 tracking-wide">誰の言葉？ (任意)</label>
                    <div className="relative overflow-hidden rounded-xl bg-white/5 border border-white/10 focus-within:border-pink-500/50 transition-colors duration-300">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 group-focus-within:text-pink-400 transition-colors">
                            @
                        </div>
                        <input
                            type="text"
                            value={characterName}
                            onChange={(e) => setCharacterName(e.target.value)}
                            placeholder={category === 'anime' ? "例: うずまきナルト" : "例: 人物名・役名"}
                            className="w-full bg-transparent py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none transition-all"
                            required={false}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-gray-300">取得数</span>
                    <span className="text-purple-300 font-bold">{count} 件</span>
                </div>
                <div className="relative h-2 bg-gray-700/50 rounded-full">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-150"
                        style={{ width: `${(count / 30) * 100}%` }}
                    />
                    <input
                        type="range"
                        min="1"
                        max="30"
                        value={count}
                        onChange={(e) => setCount(parseInt(e.target.value))}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-mono tracking-widest">
                    <span>1</span>
                    <span>30</span>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !keyword.trim()}
                className="w-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:via-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-900/40 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group border border-white/10"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="tracking-widest text-sm">検索中...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-widest text-sm">名言を探す</span>
                    </>
                )}
            </button>
        </motion.form>
    );
}

