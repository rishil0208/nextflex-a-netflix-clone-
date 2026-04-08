'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import MovieInfoModal from '@/components/MovieInfoModal';
import Top10Card from '@/components/Top10Card';
import Toast from '@/components/Toast';

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

export default function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [tvShows, setTvShows] = useState<Movie[]>([]);
    const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
    const [top10TV, setTop10TV] = useState<Movie[]>([]);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const [myListIds, setMyListIds] = useState<string[]>([]);

    useEffect(() => {
        fetchContent();
        fetchMyList();
        fetchTop10();
    }, []);

    const fetchContent = async () => {
        try {
            const contentRef = collection(db, 'movies');
            const q = query(contentRef, orderBy('createdAt', 'desc'), limit(20));
            const snapshot = await getDocs(q);

            const allContent = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Movie[];

            setMovies(allContent.filter(item => item.type === 'movie'));
            setTvShows(allContent.filter(item => item.type === 'tv'));
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
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

    const fetchTop10 = async () => {
        try {
            const { doc, getDoc } = await import('firebase/firestore');

            const moviesDoc = await getDoc(doc(db, 'top10', 'movies'));
            if (moviesDoc.exists()) {
                const moviesList = moviesDoc.data().list || [];
                const movieIds = moviesList.map((item: any) => item.movieId);
                const moviesRef = collection(db, 'movies');
                const snapshot = await getDocs(moviesRef);
                const allMovies = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Movie[];
                const top10MoviesData = moviesList
                    .map((item: any) => allMovies.find(m => m.id === item.movieId))
                    .filter(Boolean);
                setTop10Movies(top10MoviesData);
            }

            const tvDoc = await getDoc(doc(db, 'top10', 'tv'));
            if (tvDoc.exists()) {
                const tvList = tvDoc.data().list || [];
                const tvIds = tvList.map((item: any) => item.movieId);
                const tvRef = collection(db, 'movies');
                const snapshot = await getDocs(tvRef);
                const allTV = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Movie[];
                const top10TVData = tvList
                    .map((item: any) => allTV.find(t => t.id === item.movieId))
                    .filter(Boolean);
                setTop10TV(top10TVData);
            }
        } catch (error) {
            console.error('Error fetching Top 10:', error);
        }
    };

    const handleAddToList = async (movieId: string) => {
        const isInList = myListIds.includes(movieId);

        try {
            if (isInList) {
                const response = await fetch(`/api/mylist?movieId=${movieId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setMyListIds(myListIds.filter(id => id !== movieId));
                    setToast({ message: 'Movie removed from My List', type: 'success' });
                }
            } else {
                const response = await fetch('/api/mylist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieId })
                });
                if (response.ok) {
                    setMyListIds([...myListIds, movieId]);
                    setToast({ message: 'Added to My List', type: 'success' });
                }
            }
        } catch (error) {
            console.error('Error updating My List:', error);
            setToast({ message: 'Failed to update My List', type: 'error' });
        }
    };

    const allContent = [...movies, ...tvShows];
    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % allContent.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + allContent.length) % allContent.length);
    const getPrevIndex = () => (currentSlide - 1 + allContent.length) % allContent.length;
    const getNextIndex = () => (currentSlide + 1) % allContent.length;

    if (loading) {
        return (
            <div className="bg-background-white text-dark min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading...</div>
            </div>
        );
    }

    const currentMovie = allContent[currentSlide];
    const prevMovie = allContent[getPrevIndex()];
    const nextMovie = allContent[getNextIndex()];

    return (
        <div className="bg-background-white text-dark min-h-screen overflow-hidden">
            <Navbar />

            {allContent.length > 0 && currentMovie && (
                <header className="relative w-full h-[95vh] flex flex-col justify-center items-center pt-16">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={currentMovie.backdrop || currentMovie.poster}
                            alt={currentMovie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full px-4 mb-4 h-[60vh] relative z-10">
                        {prevMovie && (
                            <div
                                onClick={prevSlide}
                                className="hidden md:flex flex-col w-64 h-96 glass-card rounded-xl shrink-0 cursor-pointer overflow-hidden relative opacity-60 hover:opacity-100 transition-all"
                            >
                                <img src={prevMovie.poster} alt={prevMovie.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="relative z-10 mt-auto p-6">
                                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60">Previous</p>
                                    <h3 className="text-xl font-bold leading-tight uppercase text-white/80">{prevMovie.title}</h3>
                                </div>
                            </div>
                        )}

                        {/* Current Card */}
                        <div className="flex flex-col w-full max-w-xl h-[600px] glass-card rounded-2xl overflow-hidden relative shadow-2xl transform scale-105">
                            <img src={currentMovie.backdrop || currentMovie.poster} alt={currentMovie.title} className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                            <div className="relative z-10 mt-auto p-8">
                                <p className="text-xs uppercase tracking-widest font-bold mb-2 text-primary">Now Playing</p>
                                <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4 uppercase">{currentMovie.title}</h2>

                                <div className="flex items-center gap-3 mb-4 text-sm">
                                    {currentMovie.imdbRating && currentMovie.imdbRating > 0 && (
                                        <span className="text-green-500 font-bold">⭐ {currentMovie.imdbRating}/10</span>
                                    )}
                                    {currentMovie.releaseYear && !isNaN(currentMovie.releaseYear) && currentMovie.releaseYear > 0 && (
                                        <span>{currentMovie.releaseYear}</span>
                                    )}
                                    {currentMovie.genres && currentMovie.genres.length > 0 && (
                                        <span>{currentMovie.genres.slice(0, 2).join(', ')}</span>
                                    )}
                                </div>

                                <p className="text-sm mb-6 text-gray-300 line-clamp-2">{currentMovie.description}</p>

                                <div className="flex gap-3">
                                    <Link href={`/player?id=${currentMovie.id}`} className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                        Play
                                    </Link>

                                    <button
                                        onClick={() => setSelectedMovie(currentMovie)}
                                        className="px-6 py-3 bg-gray-500/50 text-white font-bold rounded-lg hover:bg-gray-500/70 transition-colors flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">info</span>
                                        Info
                                    </button>
                                </div>
                            </div>
                        </div>

                        {nextMovie && (
                            <div
                                onClick={nextSlide}
                                className="hidden md:flex flex-col w-64 h-96 glass-card rounded-xl shrink-0 cursor-pointer overflow-hidden relative opacity-60 hover:opacity-100 transition-all"
                            >
                                <img src={nextMovie.poster} alt={nextMovie.title} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="relative z-10 mt-auto p-6">
                                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-60">Next</p>
                                    <h3 className="text-xl font-bold leading-tight uppercase text-white/80">{nextMovie.title}</h3>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-5 relative z-15">
                        {allContent.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-8' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                </header>
            )}

            <div className="max-w-screen-2xl mx-auto px-8 py-12 space-y-12">
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

                {/* Top 10 TV Shows Section */}
                {top10TV.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="text-primary">🔥</span>
                            Top 10 TV Shows of All Time
                        </h2>
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
                            {top10TV.map((show, index) => (
                                <Top10Card
                                    key={`${show.id}-${index}`}
                                    movie={show}
                                    rank={index + 1}
                                    onInfoClick={setSelectedMovie}
                                    onAddToList={handleAddToList}
                                    isInList={myListIds.includes(show.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Movies Section */}
                {movies.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Movies</h2>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                            {movies.map((movie) => (
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
                )}

                {/* TV Shows Section */}
                {tvShows.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">TV Shows</h2>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                            {tvShows.map((show) => (
                                <MovieCard
                                    key={show.id}
                                    movie={show}
                                    onInfoClick={setSelectedMovie}
                                    onAddToList={handleAddToList}
                                    isInList={myListIds.includes(show.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Empty State Fallback Screen if Database empty */}
            {allContent.length === 0 && !loading && (
                <div className="px-8 py-12 text-center h-screen flex items-center justify-center">
                    <div>
                        <p className="text-gray-400 text-lg mb-4">No content added yet.</p>
                        <p className="text-gray-500">Visit the <Link href="/admin" className="text-primary underline">admin dashboard</Link> to add movies and TV shows.</p>
                    </div>
                </div>
            )}

            {selectedMovie && (
                <MovieInfoModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onAddToList={handleAddToList}
                    isInList={myListIds.includes(selectedMovie.id)}
                />
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}


            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div >
    );
}
