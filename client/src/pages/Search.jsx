import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isTrending, setIsTrending] = useState(true);
    const [myLibrary, setMyLibrary] = useState([]); // State for saved songs
    const navigate = useNavigate();


    // Load Local Library once on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myWorshipLibrary')) || [];
        setMyLibrary(saved);
    }, []);

    // Fetch Trending/Latest songs on initial load
    useEffect(() => {
        const fetchLatest = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://itunes.apple.com/search?term=worship+latest&entity=song&limit=10`
                );
                const data = await response.json();
                setResults(data.results);
                setIsTrending(true);
            } catch (error) {
                console.error("Error fetching latest:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query.length === 0) {
            fetchLatest();
        }
    }, [query]);

    // Handle actual search typing
    useEffect(() => {
        if (query.length < 3) return;

        const fetchSearch = async () => {
            setLoading(true);
            setIsTrending(false);
            try {
                const response = await fetch(
                    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`
                );
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error("Error searching:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSearch, 500);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Search Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black mb-6 tracking-tighter text-white">
                        {isTrending ? "DISCOVER" : "RESULTS"}
                    </h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search worship songs..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-12 text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
                    </div>
                </div>

                {/* --- NEW: MY SAVED LIBRARY SECTION --- */}
                {isTrending && myLibrary.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] ">
                                📚 My Saved Chords
                            </h2>
                            <button
                                onClick={() => navigate('/mylibrary')}
                                className={` ${myLibrary.length >= 5 ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer" : ""} text-white py-2 px-6 rounded-full transition-colors`}>
                                {`${myLibrary.length >= 5 ? `View All (${myLibrary.length})` : ""}`}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myLibrary.slice(0, 4).map((song) => (
                                <div
                                    key={song.itunesId}
                                    onClick={() => navigate(`/song/${song.itunesId}`, { state: { song } })}
                                    className="flex items-center gap-4 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500/10 transition-all cursor-pointer group"
                                >
                                    <img src={song.artwork} className="h-12 w-12 rounded-lg" alt="cover" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm line-clamp-1">{song.title}</h3>
                                        <p className="text-zinc-500 text-xs italic">Key: {song.key}</p>
                                    </div>
                                    <span className="text-emerald-500 text-xs pr-2">Saved</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* API Results Section */}
                <h2 className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                    {isTrending ? "🔥 Trending Now" : `Search results for "${query}"`}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loading && results.length === 0 ? (
                        <div className="col-span-full py-10 text-center animate-pulse text-zinc-500">Loading worship songs...</div>
                    ) : (
                        results.map((song) => (
                            <div
                                key={song.trackId}
                                onClick={() => navigate(`/song/${song.trackId}`, { state: { song } })}
                                className="flex items-center gap-4 p-3 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl hover:bg-zinc-800/80 hover:border-emerald-500/40 transition-all cursor-pointer group"
                            >
                                <div className="relative overflow-hidden rounded-xl h-16 w-16">
                                    <img
                                        src={song.artworkUrl100}
                                        className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                                        alt="cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-zinc-100 truncate group-hover:text-emerald-400 transition-colors">
                                        {song.trackName}
                                    </h3>
                                    <p className="text-zinc-500 text-sm truncate">{song.artistName}</p>
                                </div>
                                <div className="pr-2">
                                    <div className="h-8 w-8 rounded-full border border-zinc-700 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                                        <span className="text-xs group-hover:text-black">→</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}