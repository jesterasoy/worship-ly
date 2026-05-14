import React from 'react';
import { Music, Heart } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-zinc-900 pt-16 pb-8 px-6 mt-20">
            <div className="max-w-6xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Music className="text-black w-5 h-5" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase">
                                Worship<span className="text-emerald-500">.</span>ly
                            </span>
                        </div>
                        <p className="text-zinc-500 text-sm max-w-xs leading-relaxed">
                            Empowering worship leaders with AI-driven tools to simplify preparation and focus on the heart of praise.
                        </p>
                    </div>

                    {/* Quick Navigation */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Library</h4>
                        <ul className="space-y-4 text-zinc-500 text-sm">
                            <li><a href="/" className="hover:text-emerald-500 transition-colors">Home</a></li>
                            <li><a href="/search" className="hover:text-emerald-500 transition-colors">Search Songs</a></li>
                            <li><a href="/mylibrary" className="hover:text-emerald-500 transition-colors">My Library</a></li>
                        </ul>
                    </div>

                    {/* Support/Social */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                                <FaGithub />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-zinc-600 text-xs font-medium">
                        © 2026 Worship.ly. All rights reserved.
                    </p>

                    <div className="flex items-center gap-2 text-zinc-600 text-xs">
                        <span>Made with</span>
                        <Heart className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                        <span>for the Kingdom</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}