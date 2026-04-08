'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function LandingPage() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'trending', 'movies'));
        if (docSnap.exists()) {
          setTrendingMovies(docSnap.data().list || []);
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const loadScripts = async () => {
      if (!window.THREE) {
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
        threeScript.async = true;
        document.body.appendChild(threeScript);

        await new Promise((resolve) => {
          threeScript.onload = resolve;
        });
      }

      if (!window.VANTA) {
        const vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
        vantaScript.async = true;
        document.body.appendChild(vantaScript);

        await new Promise((resolve) => {
          vantaScript.onload = resolve;
        });
      }

      if (vantaRef.current && window.VANTA && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff0000,
          backgroundColor: 0x0a0506,
          points: 10.00,
          maxDistance: 20.00,
          spacing: 15.00,
          showDots: true
        });
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-background-dark text-white font-body min-h-screen flex flex-col overflow-x-hidden">
      <div className="relative w-full min-h-screen flex flex-col">
        {/* Vanta Background */}
        <div ref={vantaRef} className="absolute inset-0 w-full h-full z-0"></div>

        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300">
          <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between shadow-glass">
            
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl animate-pulse">movie_filter</span>
              <h1 className="font-display font-bold text-2xl tracking-tighter text-white">
                Next<span className="text-primary text-glow">flex</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors">
                Search
              </button>
              <button className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors">
                Help
              </button>

              <Link
                href="/admin-login"
                className="px-5 py-2 rounded-full border border-primary/50 hover:bg-primary/10 hover:border-primary text-primary text-sm font-bold transition-all duration-300 backdrop-blur-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
                Admin
              </Link>
              
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 hover:border-white/40 text-white text-sm font-bold transition-all duration-300 backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-20 flex-grow flex flex-col justify-center items-center px-4 w-full pt-20 pb-10">
          <div className="max-w-4xl w-full text-center space-y-8 mt-10 md:mt-0">
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
                Unlimited movies,<br />shows and trailers.
              </h2>
              <p className="text-lg md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
                Watch anywhere. Cancel anytime. <br className="hidden md:block" />
                Ready to watch? Enter your email to create or restart your membership.
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto mt-8">
              <form className="flex flex-col md:flex-row gap-3 p-2 rounded-[2rem] glass-panel transition-transform focus-within:scale-[1.01] duration-300">
                <div className="flex-grow relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <input
                    className="w-full h-14 md:h-16 pl-12 pr-6 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-lg font-display outline-none"
                    placeholder="Email address"
                    type="email"
                    suppressHydrationWarning
                  />
                </div>
                <Link
                  href="/signup"
                  className="h-14 md:h-16 px-8 rounded-full bg-primary hover:bg-red-600 text-white text-lg font-bold tracking-wide shadow-neon transition-all duration-300 flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  Get Started
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward_ios
                  </span>
                </Link>
              </form>
            </div>
          </div>

          <div className="w-full max-w-7xl mt-24 space-y-6">
            <div className="flex items-center gap-4 px-4">
              <div className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent w-12"></div>
              <h3 className="text-gray-400 text-sm font-bold tracking-[0.2em] uppercase font-display">
                Trending Now
              </h3>
              <div className="h-[1px] flex-grow bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-cols-5 gap-4 px-4 pb-12">
              {trendingMovies.length > 0 ? (
                trendingMovies.map((movie) => (
                  <div
                    key={movie.movieId}
                    className="relative group cursor-pointer rounded-xl overflow-hidden aspect-[2/3] bg-surface-dark shrink-0"
                  >
                    <img 
                      src={movie.poster} 
                      alt={movie.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <h4 className="text-white font-bold text-sm mb-2 drop-shadow-md">{movie.title}</h4>
                      <div className="flex items-center gap-2 drop-shadow-md">
                        <span className="text-xs text-gray-300">{movie.releaseYear}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-primary">★ {movie.imdbRating}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500 font-medium tracking-wider">MORE CONTENT COMING SOON</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-20 py-8 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
            <p>© 2024 Nextflex. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
