import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AddChords() {
    const location = useLocation();
    const navigate = useNavigate();
    const song = location.state?.song;

    // Use the passed chords if they exist, otherwise start empty
    const [chords, setChords] = useState(location.state?.existingChords || "");
    const [key, setKey] = useState("C");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateAIChords = async () => {
        if (!song) return;
        setIsGenerating(true);

        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

            // Fix: Use 'gemini-flash-latest' which automatically routes to the best model
            // Or explicitly 'gemini-3.1-flash-lite' for maximum speed
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

            const prompt = `
            Task: Generate a worship-style chord sheet for "${song.trackName}" in ${key}.
            Rules:
            1. Format: ChordPro (e.g. [G]Lyrics).
            2. Style: Simple "Worship Leader" chords. 
            3. Preference: Use standard worship voicings (like G, Cadd9, Em7, Dsus4). 
            4. Constraint: Avoid overly complex jazz chords unless essential to the song.
            5. Layout: Include clear section headers like --- VERSE 1 --- and --- CHORUS ---.
            `;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            setChords(text);
        } catch (error) {
            console.error("AI Error:", error);
            // If it still 404s, it's likely a region-specific model availability issue
            alert("Model error. Try changing the model name to 'gemini-pro-latest'.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {

        if (!chords.trim()) return alert("Please enter some chords!");
        const savedSongs = JSON.parse(localStorage.getItem('myWorshipLibrary')) || [];
        const newEntry = {
            itunesId: song.trackId,
            title: song.trackName,
            artist: song.artistName,
            key: key,
            chords: chords,
            artwork: song.artworkUrl100,
            previewUrl: song.previewUrl
        };
        localStorage.setItem('myWorshipLibrary', JSON.stringify([newEntry, ...savedSongs]));
        navigate('/search');
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black italic">ADD CHORDS</h1>
                        <p className="text-zinc-500">{song?.trackName} - {song?.artistName}</p>
                    </div>
                    <button
                        onClick={generateAIChords}
                        disabled={isGenerating}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isGenerating ? "✨ Thinking..." : "✨ AI Generate"}
                    </button>
                </div>

                <div className="space-y-6">
                    <textarea
                        className="w-full h-80 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl font-mono text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                        placeholder="Paste chords or use the AI button..."
                        value={chords}
                        onChange={(e) => setChords(e.target.value)}
                    />

                    <button
                        onClick={handleSave}
                        className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl hover:bg-emerald-400 transition-all"
                    >
                        SAVE TO MY LIBRARY
                    </button>
                </div>
            </div>
        </div>
    );
}