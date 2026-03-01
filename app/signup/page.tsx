'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validatePassword = (pwd: string) => {
        if (pwd.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (!/[A-Z]/.test(pwd)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[0-9]/.test(pwd)) {
            return 'Password must contain at least one number';
        }
        return '';
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
        const error = validatePassword(value);
        setErrors(prev => ({ ...prev, password: error }));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        if (value && value !== password) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        } else {
            setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const passwordError = validatePassword(password);
        const confirmError = password !== confirmPassword ? 'Passwords do not match' : '';

        if (passwordError || confirmError) {
            setErrors({
                password: passwordError,
                confirmPassword: confirmError
            });
            return;
        }

        // Will implement Firebase Auth later
        window.location.href = '/login';
    };

    return (
        <div className="font-display bg-background-dark text-white overflow-hidden min-h-screen">
            <div className="relative min-h-screen w-full flex items-center justify-center p-4">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-110 blur-xl brightness-50"
                        style={{
                            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1qdOf6rZ1Sori1Zrit_PqWq3JGZA7f0qsKDtEnKGMdNOhBVW-mjL4wWSlidgoiHRXrjVkOXtD3m0BLWI4b8F20wvGMgnHijFWsEBylhkW2UHlsaTtWmn2IfliynwBFtLcvASp_Hqe_uWxRKsQ6FrPajkfD2ldRO-pmeuGYBmR-i7N0wHkcugGOcDzo6u-kBiV3Bn5yNOQr6475ieSS12j_bvF9NBWVYN9S-MeqnmtsIjrA7NNXStDZE1yOzkDFhndQHcojfzGheI')"
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
                </div>

                {/* Glass Card */}
                <div className="glass-card relative z-10 w-full max-w-[480px] rounded-[2rem] p-8 md:p-12 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-4xl neon-text">play_circle</span>
                            <h2 className="text-3xl font-bold tracking-tight text-white neon-text">Nextflex</h2>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-wide">Sign Up</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <label className="sr-only" htmlFor="email">Email address</label>
                            <input
                                className="glass-input w-full rounded-full py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-0"
                                id="email"
                                placeholder="Email address"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                suppressHydrationWarning
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="sr-only" htmlFor="password">Password</label>
                            <input
                                className={`glass-input w-full rounded-full py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-0 ${errors.password ? 'border-2 border-red-500' : ''
                                    }`}
                                id="password"
                                placeholder="Password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                suppressHydrationWarning
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm px-4">{errors.password}</p>
                            )}
                            <p className="text-gray-400 text-xs px-4">
                                Must be 6+ characters with uppercase and number
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="sr-only" htmlFor="confirm_password">Confirm Password</label>
                            <input
                                className={`glass-input w-full rounded-full py-4 px-6 text-white placeholder-gray-400 outline-none focus:ring-0 ${errors.confirmPassword ? 'border-2 border-red-500' : ''
                                    }`}
                                id="confirm_password"
                                placeholder="Confirm Password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                suppressHydrationWarning
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-400 text-sm px-4">{errors.confirmPassword}</p>
                            )}
                            {confirmPassword && !errors.confirmPassword && password === confirmPassword && (
                                <p className="text-green-400 text-sm px-4">✓ Passwords match</p>
                            )}
                        </div>

                        <button
                            className="bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-full w-full neon-button mt-2 tracking-wide text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={!!errors.password || !!errors.confirmPassword}
                        >
                            Sign Up
                        </button>

                        <div className="flex items-center justify-between text-sm text-gray-300 px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    className="w-4 h-4 rounded border-gray-500 bg-transparent text-primary focus:ring-offset-0 focus:ring-primary transition-colors cursor-pointer"
                                    type="checkbox"
                                    required
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                />
                                <span className="group-hover:text-white transition-colors">I agree to Terms</span>
                            </label>
                        </div>
                    </form>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-600/50"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-sm font-medium">OR</span>
                        <div className="flex-grow border-t border-gray-600/50"></div>
                    </div>

                    <button className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-full w-full flex items-center justify-center gap-3 transition-colors duration-300">
                        <img
                            alt="Google Logo"
                            className="w-6 h-6"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGXguaPVX3yEjLf5jbSryw9eEObf2-3Yz79p3S05oXxg20szvKlt6rVJrRZx34pzINSpFLgPYc3lcgoOfuOTKEQnY3VGLRY6DMm7mEyOdsCUigG4oHz7CQjceyKZv8m6OEyA8oA81qR_1I1uxPXljuX688tKzrCydwbi7dN1oaqcZ1SwT-miXQ8oRpfE-tJtAPcShLZFoav0XsCKkbyZfMtOxzywBJulrFSGVUE0hUJtcclUGKXYnorw37ptKq3F-bA7lpHBF_ico"
                        />
                        <span className="tracking-wide">Sign up with Google</span>
                    </button>

                    <div className="pt-2 text-center">
                        <p className="text-gray-400 text-base">
                            Already have an account?{' '}
                            <Link className="text-white hover:text-primary font-bold transition-colors ml-1" href="/login">
                                Sign in.
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
