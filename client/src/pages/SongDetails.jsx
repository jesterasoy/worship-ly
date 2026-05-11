import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function SongDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [savedData, setSavedData] = useState(null);
    // This state holds the chords currently being displayed (and transposed)
    const [currentChords, setCurrentChords] = useState("");
    const songFromApi = location.state?.song;

    useEffect(() => {
        const library = JSON.parse(localStorage.getItem('myWorshipLibrary')) || [];
        const match = library.find(s => String(s.itunesId) === String(id));
        if (match) {
            setSavedData(match);
            setCurrentChords(match.chords); // Initialize display chords
        }
    }, [id]);

    // --- THE TRANSPOSER LOGIC ---
    const transposeChords = (text, semitones) => {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Regex looks for notes at the start of a bracket [G] or [F#m7]
        return text.replace(/\[([A-G][b#]?)([^\]]*)\]/g, (match, note, suffix) => {
            // Normalize flats to sharps for our array
            let normalizedNote = note.replace('Db', 'C#').replace('Eb', 'D#').replace('Gb', 'F#').replace('Ab', 'G#').replace('Bb', 'A#');

            const index = notes.indexOf(normalizedNote);
            if (index === -1) return match; // If not found, don't change

            let newIndex = (index + semitones) % 12;
            if (newIndex < 0) newIndex += 12; // Handle shifting down past 'C'

            return `[${notes[newIndex]}${suffix}]`;
        });
    };

    const handleTranspose = (dir) => {
        const amount = dir === 'up' ? 1 : -1;
        setCurrentChords(prev => transposeChords(prev, amount));
    };

    // --- YOUR TAILWIND FORMATTER ---
    const formatChords = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, i) => (
            <div key={i} className="flex flex-wrap mb-6 relative">
                {line.split(/(\[[^\]]*\])/g).map((part, j) => {
                    if (part.startsWith('[')) {
                        const chord = part.replace('[', '').replace(']', '');
                        return (
                            <span key={j} className="relative inline-flex flex-col min-w-[1ch]">
                                <span className="absolute -top-6 left-0 text-emerald-400 font-bold text-sm whitespace-nowrap">
                                    {chord}
                                </span>
                            </span>
                        );
                    }
                    return <span key={j} className="text-zinc-200 text-lg whitespace-pre">{part}</span>;
                })}
            </div>
        ));
    };

    if (!songFromApi && !savedData) return <div className="p-20 text-white">Loading...</div>;
    const [showVideo, setShowVideo] = useState(false);

    // Create a search query for YouTube
    const videoSearchQuery = encodeURIComponent(`${songFromApi?.trackName || savedData?.title} ${songFromApi?.artistName || savedData?.artist} worship lyrics`);
    const videoEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${videoSearchQuery}`;

    // ... in your return JSX, above the chord display section ...
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                    <img
                        src={songFromApi?.artworkUrl100?.replace('100x100', '600x600') || savedData?.artwork}
                        className="w-48 h-48 rounded-3xl shadow-2xl border border-zinc-800"
                        alt="cover"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-black mb-2">{songFromApi?.trackName || savedData?.title}</h1>
                        <p className="text-zinc-500 text-xl mb-6">{songFromApi?.artistName || savedData?.artist}</p>

                        {/* Transpose Controls */}
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <button
                                onClick={() => handleTranspose('down')}
                                className="cursor-pointer w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 transition-all"
                            >
                                -
                            </button>
                            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-bold text-sm">
                                TRANSPOSE
                            </div>
                            <button
                                onClick={() => handleTranspose('up')}
                                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer"
                            >
                                +
                            </button>

                            {/* Edit Button */}
                            <button
                                onClick={() => navigate('/add-chords', { state: { song: songFromApi || savedData, existingChords: currentChords } })}
                                className="cursor-pointer ml-4 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
                {/* Preview of the Song */}
                <div>
                    <div className="mb-8">
                        <button
                            onClick={() => setShowVideo(!showVideo)}
                            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-bold bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800"
                        >
                            {showVideo ? "✕ CLOSE VIDEO" : "📺 WATCH FULL VIDEO"}
                        </button>

                        {showVideo && (
                            <div className="mt-4 aspect-video w-full overflow-hidden rounded-3xl border border-zinc-800 shadow-2xl animate-in fade-in zoom-in duration-300">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={videoEmbedUrl}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
                {/* Main Chord Display */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 pt-14 overflow-x-auto">
                    {currentChords ? (
                        <div className="font-mono">
                            {formatChords(currentChords)}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/add-chords', { state: { song: songFromApi } })} className="w-full py-10 border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
                            + Add Chords
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}