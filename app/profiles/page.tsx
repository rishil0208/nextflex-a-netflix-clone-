'use client';

import { useState } from 'react';
import Link from 'next/link';

const profiles = [
    {
        id: '1',
        name: 'Rishi',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCkHttlW2M9d91iU3MeUJB27KPDRBuRrWOyNUrVfkCiL-BMytQRpz_vMJSnjFi0mSkrKnbnaRr9-5-IutUdfD2_9U-nDzZgOM0KhoZW2CI-C3ukxmcOMWQOLVzig3YaY3wFAl2o5jZkIIyc6I9Me7gkUt-QvgggttF4MVDcd-cjw6RgoqIY9R6V88tRM8FpsKWz0nHRKGM0uDPpg6jdfkxn7o0QpUzHc-gfhHiCNGw-r2wZNgLb-vtPHpLg5voRyD_t3jmhsAaC-A'
    },
    {
        id: '2',
        name: 'Kids',
        avatar: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png'
    },
    {
        id: '3',
        name: 'Guest',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'
    }
];

export default function ProfilesPage() {
    const selectProfile = (profile: typeof profiles[0]) => {
        // Store in localStorage (will migrate to Firebase later)
        localStorage.setItem('currentProfile', JSON.stringify(profile));
        window.location.href = '/home';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white">
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-5xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center">Who's watching?</h1>

                {/* Profiles Grid */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4">
                    {profiles.map((profile) => (
                        <button
                            key={profile.id}
                            onClick={() => selectProfile(profile)}
                            className="profile-card flex flex-col items-center gap-4 group cursor-pointer focus:outline-none"
                        >
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-3 border-transparent group-hover:border-white transition-all duration-300 group-hover:scale-105 bg-gray-800 shadow-lg">
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-lg md:text-xl font-medium text-gray-500 group-hover:text-white transition-colors">
                                {profile.name}
                            </span>
                        </button>
                    ))}

                    {/* Add Profile */}
                    <button className="profile-card flex flex-col items-center gap-4 group cursor-pointer focus:outline-none">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-2 border-gray-500 text-gray-500 hover:border-white hover:bg-white hover:text-black transition-all duration-300">
                            <span className="material-symbols-outlined text-6xl">add</span>
                        </div>
                        <span className="text-lg md:text-xl font-medium text-gray-500 group-hover:text-white transition-colors">
                            Add Profile
                        </span>
                    </button>
                </div>

                {/* Manage Button */}
                <button className="mt-8 px-8 py-2.5 border border-gray-500 text-gray-500 uppercase tracking-widest text-sm font-bold hover:border-white hover:text-white transition-all duration-300">
                    Manage Profiles
                </button>
            </div>

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <style jsx>{`
        .profile-card:hover .profile-img {
          border-color: white;
          transform: scale(1.05);
        }
      `}</style>
        </div>
    );
}
