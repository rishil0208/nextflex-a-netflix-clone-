'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import MovieInfoModal from '@/components/MovieInfoModal';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
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

export default function MyListPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [myListIds, setMyListIds] = useState<string[]>([]);

    useEffect(() => {
        fetchMyList();
    }, []);

    const fetchMyList = async () => {
        try {
            // Fetch My List IDs
            const response = await fetch('/api/mylist');
            const data = await response.json();

            if (data.success && data.movieIds.length > 0) {
                setMyListIds(data.movieIds);

                // Fetch actual movie data
                const moviesRef = collection(db, 'movies');
                const q = query(moviesRef, where(documentId(), 'in', data.movieIds));
                const snapshot = await getDocs(q);

                const moviesData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Movie[];

                setMovies(moviesData);
            }
        } catch (error) {
            console.error('Error fetching My List:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromList = async (movieId: string) => {
        try {
            const response = await fetch(`/api/mylist?movieId=${movieId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setMovies(movies.filter(m => m.id !== movieId));
                setMyListIds(myListIds.filter(id => id !== movieId));
            }
        } catch (error) {
            console.error('Error removing from list:', error);
        }
    };

    return (
        <div className="bg-background-dark text-white min-h-screen">
            <Navbar />

            <div className="pt-24 px-8 pb-12">
                <h1 className="text-4xl font-bold mb-8">My List</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl text-gray-400">Loading...</div>
                    </div>
                ) : movies.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-xl text-gray-400 mb-4">Your list is empty</p>
                        <p className="text-gray-500">Add movies and TV shows to see them here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onInfoClick={setSelectedMovie}
                                onAddToList={handleRemoveFromList}
                                isInList={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedMovie && (
                <MovieInfoModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
