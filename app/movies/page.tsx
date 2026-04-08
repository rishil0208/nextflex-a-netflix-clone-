'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import MovieInfoModal from '@/components/MovieInfoModal';
import Top10Card from '@/components/Top10Card';

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

export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [myListIds, setMyListIds] = useState<string[]>([]);

    useEffect(() => {
        fetchMovies();
        fetchMyList();
        fetchTop10();
    }, []);

    const fetchMovies = async () => {
        try {
            const moviesRef = collection(db, 'movies');
            const q = query(moviesRef, where('type', '==', 'movie'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const moviesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Movie[];

            setMovies(moviesData);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTop10 = async () => {
        try {
            const moviesDoc = await getDoc(doc(db, 'top10', 'movies'));
            if (moviesDoc.exists()) {
                const moviesList = moviesDoc.data().list || [];
                const moviesRef = collection(db, 'movies');
                const snapshot = await getDocs(moviesRef);
                const allMovies = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Movie[];
                const top10MoviesData = moviesList
                    .map((item: any) => allMovies.find(m => m.id === item.movieId))
                    .filter(Boolean);
                setTop10Movies(top10MoviesData);
            }
        } catch (error) {
            console.error('Error fetching Top 10:', error);
        }
    };

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

    // Group movies by genre
    const getMoviesByGenre = (genre: string) => {
        return movies.filter(movie => movie.genres?.includes(genre));
    };

    // Get unique genres from all movies
    const allGenres = Array.from(new Set(movies.flatMap(movie => movie.genres || []))).sort();

    return (
        <div className="bg-background-dark text-white min-h-screen">
            <Navbar />

            <div className="pt-24 px-8 pb-12 max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Movies</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl text-gray-400">Loading...</div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Top 10 Movies Section */}
                        {top10Movies.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                    <span className="text-primary">🔥</span>
                                    Top 10 Movies of All Time
                                </h2>
                                <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                                    {top10Movies.map((movie, index) => (
                                        <Top10Card
                                            key={`${movie.id}-${index}`}
                                            movie={movie}
                                            rank={index + 1}
                                            onInfoClick={setSelectedMovie}
                                            onAddToList={handleAddToList}
                                            isInList={myListIds.includes(movie.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Genre Categories */}
                        {allGenres.length > 0 ? (
                            allGenres.map(genre => {
                                const genreMovies = getMoviesByGenre(genre);
                                if (genreMovies.length === 0) return null;

                                return (
                                    <div key={genre}>
                                        <h2 className="text-2xl font-bold mb-6">{genre}</h2>
                                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                                            {genreMovies.map((movie) => (
                                                <MovieCard
                                                    key={movie.id}
                                                    movie={movie}
                                                    onInfoClick={setSelectedMovie}
                                                    onAddToList={handleAddToList}
                                                    isInList={myListIds.includes(movie.id)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400">No movies available yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedMovie && (
                <MovieInfoModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onAddToList={handleAddToList}
                    isInList={myListIds.includes(selectedMovie.id)}
                />
            )}

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
