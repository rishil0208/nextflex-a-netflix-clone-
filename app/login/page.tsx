'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { signInWithGoogle, signInWithEmail } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            await signInWithGoogle();
            router.push('/profiles');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        } finally {
            setLoading(false);
        }
    };
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Will implement Firebase Auth later
        window.location.href = '/profiles';
    };

    return (
        <div className="font-display bg-background-dark text-white overflow-hidden min-h-screen">
            {/* Main Container */}
            <div className="relative min-h-screen w-full flex items-center justify-center p-4">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-xl brightness-50"
                        style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1qdOf6rZ1Sori1Zrit_PqWq3JGZA7f0qsKDtEnKGMdNOhBVW-mjL4wWSlidgoiHRXrjVkOXtD3m0BLWI4b8F20wvGMgnHijFWsEBylhkW2UHlsaTtWmn2IfliynwBFtLcvASp_Hqe_uWxRKsQ6FrPajkfD2ldRO-pmeuGYBmR-i7N0wHkcugGOcDzo6u-kBiV3Bn5yNOQr6475ieSS12j_bvF9NBWVYN9S-MeqnmtsIjrA7NNXStDZE1yOzkDFhndQHcojfzGheI')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
                </div>

                {/* Glass Login Card */}
                <div className="glass-card relative z-10 w-full max-w-[480px] rounded-[2rem] p-8 md:p-12 flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-4xl neon-text">play_circle</span>
                            <h2 className="text-3xl font-bold tracking-tight text-white neon-text">Nextflex</h2>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-wide">Sign In</h1>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="sr-only" htmlFor="email">Email or phone number</label>
                            <input
                                className="glass-input w-full rounded-full py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-0"
                                id="email"
                                placeholder="Email or phone number"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                className="glass-input w-full rounded-full py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-0"
                                id="password"
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Sign In Button */}
                        <button
                            className="bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-full w-full neon-button mt-2 tracking-wide text-lg"
                            type="submit"
                        >
                            Sign In
                        </button>

                        {/* Helper Links */}
                        <div className="flex items-center justify-between text-sm text-gray-300 px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    className="w-4 h-4 rounded border-gray-500 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary transition-colors cursor-pointer"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className="group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a className="hover:text-primary transition-colors underline decoration-transparent hover:decoration-primary underline-offset-4" href="#">
                                Need help?
                            </a>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600/50"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">OR</span>
                        <div className="flex-grow border-t border-gray-600/50"></div>
                    </div>

                    {/* Social Login */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-full w-full flex items-center justify-center gap-3 transition-colors duration-300 disabled:opacity-50"
                    >
                        <img
                            alt="Google Logo"
                            className="w-6 h-6"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGXguaPVX3yEjLf5jbSryw9eEObf2-3Yz79p3S05oXxg20szvKlt6rVJrRZx34pzINSpFLgPYc3lcgoOfuOTKEQnY3VGLRY6DMm7mEyOdsCUigG4oHz7CQjceyKZv8m6OEyA8oA81qR_1I1uxPXljuX688tKzrCydwbi7dN1oaqcZ1SwT-miXQ8oRpfE-tJtAPcShLZFoav0XsCKkbyZfMtOxzywBJulrFSGVUE0hUJtcclUGKXYnorw37ptKq3F-bA7lpHBF_ico"
                        />
                        <span className="tracking-wide">{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                    </button>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Footer Text */}
                    <div className="pt-2 text-center">
                        <p className="text-gray-400 text-base">
                            New to Nextflex?{' '}
                            <Link className="text-white hover:text-primary font-bold transition-colors ml-1" href="/signup">
                                Sign up now.
                            </Link>
                        </p>
                        <div className="mt-6 text-xs text-gray-500 text-center max-w-xs mx-auto leading-relaxed">
                            This page is protected by Google reCAPTCHA to ensure you're not a bot.
                        </div>
                    </div>
                </div>
            </div>

            {/* Material Symbols Font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
