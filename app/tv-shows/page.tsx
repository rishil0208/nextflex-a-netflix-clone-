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

export default function TVShowsPage() {
    const [tvShows, setTvShows] = useState<Movie[]>([]);
    const [top10TV, setTop10TV] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [myListIds, setMyListIds] = useState<string[]>([]);

    useEffect(() => {
        fetchTVShows();
        fetchMyList();
        fetchTop10();
    }, []);

    const fetchTVShows = async () => {
        try {
            const tvRef = collection(db, 'movies');
            const q = query(tvRef, where('type', '==', 'tv'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const tvData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Movie[];

            setTvShows(tvData);
        } catch (error) {
            console.error('Error fetching TV shows:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTop10 = async () => {
        try {
            const tvDoc = await getDoc(doc(db, 'top10', 'tv'));
            if (tvDoc.exists()) {
                const tvList = tvDoc.data().list || [];
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

    // Group TV shows by genre
    const getShowsByGenre = (genre: string) => {
        return tvShows.filter(show => show.genres?.includes(genre));
    };

    // Get unique genres from all TV shows
    const allGenres = Array.from(new Set(tvShows.flatMap(show => show.genres || []))).sort();

    return (
        <div className="bg-background-dark text-white min-h-screen">
            <Navbar />

            <div className="pt-24 px-8 pb-12 max-w-screen-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">TV Shows</h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-xl text-gray-400">Loading...</div>
                    </div>
                ) : (
                    <div className="space-y-12">
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
                                            key={show.id}
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

                        {/* Genre Categories */}
                        {allGenres.length > 0 ? (
                            allGenres.map(genre => {
                                const genreShows = getShowsByGenre(genre);
                                if (genreShows.length === 0) return null;

                                return (
                                    <div key={genre}>
                                        <h2 className="text-2xl font-bold mb-6">{genre}</h2>
                                        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                                            {genreShows.map((show) => (
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
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400">No TV shows available yet</p>
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
