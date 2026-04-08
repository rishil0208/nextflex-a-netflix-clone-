'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

export default function Navbar() {
    const [profile, setProfile] = useState<any>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const stored = localStorage.getItem('currentProfile');
        if (stored) {
            setProfile(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        setShowLogoutConfirm(true);
        setShowDropdown(false);
    };

    const confirmLogout = () => {
        localStorage.removeItem('currentProfile');
        localStorage.removeItem('user');
        setShowLogoutConfirm(false);
        router.push('/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleChangeProfile = () => {
        setShowDropdown(false);
        router.push('/profiles');
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-b from-black/90 to-transparent">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/home" className="flex items-center gap-2">
                            <Logo className="animate-pulse" />
                            <span className="text-white text-xl md:text-2xl font-black tracking-tighter uppercase italic">
                                Nextflex
                            </span>
                        </Link>
                        <ul className="hidden lg:flex items-center gap-8">
                            <Link href="/home">
                                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Home</li>
                            </Link>
                            <Link href="/movies">
                                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">Movies</li>
                            </Link>
                            <Link href="/tv-shows">
                                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">TV Shows</li>
                            </Link>
                            <Link href="/my-list">
                                <li className="text-gray-400 hover:text-white cursor-pointer transition-colors">My List</li>
                            </Link>
                        </ul>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/search" className="text-white/80 hover:text-white transition-opacity hover:scale-110 duration-200">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </Link>

                        <div className="relative">
                            <div
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="size-8 md:size-10 rounded-full border border-white/20 overflow-hidden cursor-pointer hover:border-white transition-colors shadow-lg"
                            >
                                <img
                                    alt={profile?.name || 'User'}
                                    className="w-full h-full object-cover"
                                    src={profile?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCkHttlW2M9d91iU3MeUJB27KPDRBuRrWOyNUrVfkCiL-BMytQRpz_vMJSnjFi0mSkrKnbnaRr9-5-IutUdfD2_9U-nDzZgOM0KhoZW2CI-C3ukxmcOMWQOLVzig3YaY3wFAl2o5jZkIIyc6I9Me7gkUt-QvgggttF4MVDcd-cjw6RgoqIY9R6V88tRM8FpsKWz0nHRKGM0uDPpg6jdfkxn7o0QpUzHc-gfhHiCNGw-r2wZNgLb-vtPHpLg5voRyD_t3jmhsAaC-A'}
                                />
                            </div>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-56 glass-card rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                                    <button
                                        onClick={handleChangeProfile}
                                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-xl">swap_horiz</span>
                                        <span>Change Profile</span>
                                    </button>
                                    <div className="border-t border-white/10"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-xl">logout</span>
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <link
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                    rel="stylesheet"
                />
            </nav>

            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="glass-card rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary text-3xl">logout</span>
                            <h2 className="text-2xl font-bold text-white">Log Out</h2>
                        </div>

                        <p className="text-gray-300 mb-8 text-lg">
                            Do you want to log out of your account?
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={cancelLogout}
                                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-6 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded-lg transition-colors neon-button"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </>
    );
}
