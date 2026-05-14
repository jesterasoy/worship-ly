import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sun, CloudRain, Anchor, ShieldCheck } from 'lucide-react';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myWorshipLibrary')) || [];
    setLibrary(saved.slice(0, saved.length)); // Load entire library, but only display the most recent 4 in the UI.
  }, []);

  const themes = [
    { label: 'Gratitude', icon: <Sun className="w-5 h-5" />, color: 'bg-orange-500/10 text-orange-500' },
    { label: 'Peace', icon: <Anchor className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-500' },
    { label: 'Victory', icon: <ShieldCheck className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: 'Comfort', icon: <CloudRain className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">

        {/* 1. ENCOURAGEMENT HEADER */}
        <header className="mb-16 pt-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold mb-6 tracking-widest uppercase">
            <Heart className="w-3 h-3 fill-emerald-500" /> Morning Inspiration
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Where words fail, <br />
            <span className="text-zinc-500 italic font-serif">worship begins.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
            "God is our refuge and strength, an ever-present help in trouble."
            <span className="block mt-2 text-zinc-600 text-sm italic">— Psalm 46:1</span>
          </p>
        </header>

        {/* 2. THEMATIC QUICK-SELECT */}
        <section className="mb-16">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Find songs for...</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.label}
                onClick={() => navigate(`/search?q=${theme.label}`)}
                className="flex items-center justify-between p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/50 transition-all group"
              >
                <span className="font-bold text-lg">{theme.label}</span>
                <div className={`p-2 rounded-xl ${theme.color} group-hover:scale-110 transition-transform`}>
                  {theme.icon}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. RECENT ACTIVITY / LIBRARY */}
        <section className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold">Your Songbook</h3>
              <p className="text-zinc-500 text-sm">{`${library.length === 0 ? 'No songs in your library yet.' : `Continue where you left off with`}`}</p>
            </div>
            <button
              onClick={() => navigate('/mylibrary')}
              className={`${library.length >= 5 ? `px-6 py-2` : ''} rounded-full bg-white text-black text-sm font-bold hover:bg-emerald-500 transition-colors`}
            >
              {`${library.length >= 5 ? `View All (${library.length})` : ""} `}
            </button>
          </div>

          {library.length >= 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {library.slice(0, 4).map((song) => (
                <div
                  key={song.itunesId}
                  onClick={() => navigate(`/song/${song.itunesId}`, { state: { song } })}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
                    <img
                      src={song.artwork?.replace('100x100', '400x400')}
                      className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs font-bold tracking-widest uppercase">Open Sheet</span>
                    </div>
                  </div>
                  <h4 className="font-bold truncate group-hover:text-emerald-500 transition-colors">{song.title}</h4>
                  <p className="text-zinc-500 text-sm truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-16">
              <Heart className="w-12 h-12 fill-emerald-500" />
              <p className="text-zinc-500 text-sm italic">Your saved songs will appear here.</p>
            </div>
          )}
        </section>

        {/* 2. THE MOMENTS SECTION */}
        <section className="mb-16 mt-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Select your moment</h3>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: High Praise */}
            <div className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-zinc-800 bg-gradient-to-br from-orange-500/20 to-transparent">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative h-full p-8 flex flex-col justify-end">
                <h4 className="text-2xl font-black mb-1">High Praise</h4>
                <p className="text-zinc-400 text-sm">Upbeat, energetic anthems to open the service.</p>
              </div>
            </div>

            {/* Card 2: Deep Intimacy */}
            <div className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-zinc-800 bg-gradient-to-br from-emerald-500/20 to-transparent">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1499415479124-43c32433a620?auto=format&fit=crop&w=800')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative h-full p-8 flex flex-col justify-end">
                <h4 className="text-2xl font-black mb-1">Deep Intimacy</h4>
                <p className="text-zinc-400 text-sm">Quiet, prayerful songs for reflection and ministry.</p>
              </div>
            </div>

            {/* Card 3: New Releases */}
            <div className="group relative h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-zinc-800 bg-gradient-to-br from-blue-500/20 to-transparent">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253361-bee8a48740d0?auto=format&fit=crop&w=800')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="relative h-full p-8 flex flex-col justify-end">
                <h4 className="text-2xl font-black mb-1">Fresh Finds</h4>
                <p className="text-zinc-400 text-sm">Discover the latest releases from global worship teams.</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}