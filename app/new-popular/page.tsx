'use client';

import Link from 'next/link';

export default function NewPopularPage() {
    return (
        <div className="bg-background-dark text-white min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">New & Popular</h1>
                    <Link href="/home" className="text-gray-400 hover:text-white">
                        ← Back to Home
                    </Link>
                </div>

                <div className="text-center text-gray-400 mt-20">
                    <p className="text-2xl mb-4">New & Popular Content Coming Soon!</p>
                    <p>Check back later for trending movies and shows.</p>
                </div>
            </div>
        </div>
    );
}
