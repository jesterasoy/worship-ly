import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Trash2, Play, Library } from 'lucide-react';

export default function MyLibrary() {
    const [songs, setSongs] = useState([]);
    const navigate = useNavigate();

    // 1. Load data from localStorage on mount
    useEffect(() => {
        const savedSongs = JSON.parse(localStorage.getItem('myWorshipLibrary')) || [];
        setSongs(savedSongs);
    }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 12;

    // Calculate which songs to show
    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

    // Calculate total pages
    const totalPages = Math.ceil(songs.length / songsPerPage);
    // 2. Simple delete function for the library view
    const removeSong = (e, id) => {
        e.stopPropagation(); // Prevents navigating to details when clicking delete
        const confirmed = window.confirm("Remove this song from your library?");
        if (confirmed) {
            const updated = songs.filter(s => String(s.itunesId) !== String(id));
            localStorage.setItem('myWorshipLibrary', JSON.stringify(updated));
            setSongs(updated);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Library</h1>
                        <p className="text-zinc-500 font-medium">
                            You have <span className="text-emerald-500">{songs.length}</span> songs in your collection.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="bg-zinc-900 border border-zinc-800 px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition-all"
                    >
                        + Find New Songs
                    </button>
                </header>

                {songs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentSongs.map((song) => (
                            <div
                                key={song.itunesId}
                                onClick={() => navigate(`/song/${song.itunesId}`, { state: { song } })}
                                className="group relative bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-4 hover:bg-zinc-900 transition-all cursor-pointer overflow-hidden"
                            >
                                {/* Artwork Container */}
                                <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl shadow-lg">
                                    <img
                                        src={song.artwork?.replace('100x100', '600x600')}
                                        alt={song.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Play Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                                            <Play className="fill-current w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Song Info */}
                                <div className="px-2">
                                    {/* Song Info Container */}
                                    <div className="px-2 w-full overflow-hidden"> {/* Added overflow-hidden here */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0 flex-1"> {/* Added min-w-0 to allow child to shrink */}
                                                <h3 className="font-bold text-lg truncate group-hover:text-emerald-500 transition-colors">
                                                    {song.title}
                                                </h3>
                                                <p className="text-zinc-500 text-sm truncate">
                                                    {song.artist}
                                                </p>
                                            </div>

                                            {/* Key Badge */}
                                            <div className="flex-shrink-0 bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded border border-emerald-500/20">
                                                {song.key}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={(e) => removeSong(e, song.itunesId)}
                                            className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-zinc-900 rounded-[3rem]">
                        <Music className="w-16 h-16 text-zinc-800 mb-4" />
                        <p className="text-zinc-600 italic text-lg mb-8">Your library is currently empty.</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-black shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:scale-105 transition-transform"
                        >
                            Discover Songs
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {songs.length > songsPerPage && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1
                                    ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}