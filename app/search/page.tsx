'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import MovieInfoModal from '@/components/MovieInfoModal';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface Movie {
    id: string;
    title: string;
    poster: string;
    backdrop: string;
    description: string;
    genres: string[];
    imdbRating: number;
    releaseYear: number;
    trailerUrl?: string;
    type: 'movie' | 'tv';
    cast?: any[];
}

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [myListIds, setMyListIds] = useState<string[]>([]);

    useEffect(() => {
        fetchMyList();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            searchMovies();
        } else {
            setResults([]);
        }
    }, [searchQuery]);

    const fetchMyList = async () => {
        try {
            const response = await fetch('/api/mylist');
            const data = await response.json();
            if (data.success) {
                setMyListIds(data.movieIds);
            }
        } catch (error) {
            console.error('Error fetching My List:', error);
        }
    };

    const searchMovies = async () => {
        setLoading(true);
        try {
            const moviesRef = collection(db, 'movies');
            const snapshot = await getDocs(moviesRef);

            const allMovies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Movie[];

            // Filter movies by title (case-insensitive)
            const searchLower = searchQuery.toLowerCase();
            const filtered = allMovies.filter(movie =>
                movie.title.toLowerCase().includes(searchLower)
            );

            setResults(filtered);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToList = async (movieId: string) => {
        const isInList = myListIds.includes(movieId);

        try {
            if (isInList) {
                const response = await fetch(`/api/mylist?movieId=${movieId}`, { method: 'DELETE' });
                if (response.ok) setMyListIds(myListIds.filter(id => id !== movieId));
            } else {
                const response = await fetch('/api/mylist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieId })
                });
                if (response.ok) setMyListIds([...myListIds, movieId]);
            }
        } catch (error) {
            console.error('Error updating My List:', error);
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen">
            <Navbar />

            <div className="pt-24 px-8 pb-12">
                {/* Search Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="glass-card rounded-full p-2 flex items-center gap-4">
                        <span className="material-symbols-outlined text-primary text-3xl ml-4">search</span>
                        <input
                            type="text"
                            placeholder="Search for movies and TV shows..."
                            className="flex-1 bg-transparent border-none outline-none text-white text-xl placeholder-gray-500 py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-screen-2xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="text-xl text-gray-400">Searching...</div>
                        </div>
                    ) : searchQuery ? (
                        <>
                            <h2 className="text-2xl font-bold mb-6">
                                {results.length} {results.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                            </h2>
                            {results.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {results.map((movie) => (
                                        <MovieCard
                                            key={movie.id}
                                            movie={movie}
                                            onInfoClick={setSelectedMovie}
                                            onAddToList={handleAddToList}
                                            isInList={myListIds.includes(movie.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
                                    <p className="text-gray-500 text-sm mt-2">Try searching for a different title</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4 block">search</span>
                            <p className="text-gray-400 text-lg">Start typing to search for movies and shows</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedMovie && (
                <MovieInfoModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onAddToList={handleAddToList}
                    isInList={myListIds.includes(selectedMovie.id)}
                />
            )}

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
