'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import Link from 'next/link';
import Logo from '@/components/Logo';

const ADMIN_EMAIL = 'rishil0208@gmail.com';

export default function AdminLoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if the email matches the admin email
            if (user.email === ADMIN_EMAIL) {
                // Store admin session
                localStorage.setItem('adminUser', JSON.stringify({
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL
                }));

                // Redirect to admin dashboard
                router.push('/admin');
            } else {
                // Not authorized - sign out and show error
                await auth.signOut();
                setError('Access Denied: Only authorized admin accounts can access this area.');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-dark text-white flex items-center justify-center p-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background-dark to-background-dark"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Logo className="animate-pulse" />
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                            Nextflex
                        </h1>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-300">Admin Access</h2>
                    <p className="text-gray-400 mt-2">Restricted to authorized personnel only</p>
                </div>

                {/* Login Card */}
                <div className="glass-card rounded-2xl p-8 border border-white/10">
                    <div className="space-y-6">
                        {/* Google Sign In Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </>
                            )}
                        </button>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">error</span>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Info */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <p className="text-blue-300 text-sm flex items-start gap-2">
                                <span className="material-symbols-outlined text-xl">info</span>
                                <span>Only the authorized admin account can access the dashboard. Please sign in with your admin Google account.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <style jsx>{`
                .glass-card {
                    background: rgba(20, 10, 10, 0.65);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
            `}</style>
        </div>
    );
}
