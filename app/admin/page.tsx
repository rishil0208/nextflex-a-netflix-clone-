'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, orderBy, query, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

type ContentType = 'movie' | 'tv';
type TabType = 'add' | 'manage' | 'top10' | 'trending';

const ADMIN_EMAIL = 'rishil0208@gmail.com';

export default function AdminPage() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('add');
    const [contentType, setContentType] = useState<ContentType>('movie');
    const [contentName, setContentName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [allContent, setAllContent] = useState<any[]>([]);
    const [loadingContent, setLoadingContent] = useState(true);

    // Top 10 state
    const [top10Movies, setTop10Movies] = useState<Array<{ rank: number, movieId: string, title: string }>>([]);
    const [top10TV, setTop10TV] = useState<Array<{ rank: number, movieId: string, title: string }>>([]);
    const [trendingMovies, setTrendingMovies] = useState<Array<{ movieId: string, title: string, poster: string, releaseYear: number, imdbRating: number }>>([]);
    const [selectedRank, setSelectedRank] = useState<number>(1);
    const [selectedMovie, setSelectedMovie] = useState<string>('');

    // Check admin authentication
    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            router.push('/admin-login');
            return;
        }

        try {
            const user = JSON.parse(adminUser);
            if (user.email !== ADMIN_EMAIL) {
                localStorage.removeItem('adminUser');
                router.push('/admin-login');
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            localStorage.removeItem('adminUser');
            router.push('/admin-login');
        }
    }, [router]);

    useEffect(() => {
        if (isAuthorized) {
            fetchContent();
            fetchTop10Lists();
        }
    }, [isAuthorized]);

    const fetchContent = async () => {
        try {
            setLoadingContent(true);
            const contentRef = collection(db, 'movies');
            const q = query(contentRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const contentData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setAllContent(contentData);
        } catch (err) {
            console.error('Error fetching content:', err);
        } finally {
            setLoadingContent(false);
        }
    };

    const fetchTop10Lists = async () => {
        try {
            const moviesDoc = await getDoc(doc(db, 'top10', 'movies'));
            const tvDoc = await getDoc(doc(db, 'top10', 'tv'));
            const trendingDoc = await getDoc(doc(db, 'trending', 'movies'));

            if (moviesDoc.exists()) {
                setTop10Movies(moviesDoc.data().list || []);
            }
            if (tvDoc.exists()) {
                setTop10TV(tvDoc.data().list || []);
            }
            if (trendingDoc.exists()) {
                setTrendingMovies(trendingDoc.data().list || []);
            }
        } catch (err) {
            console.error('Error fetching Top 10 lists:', err);
        }
    };

    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('/api/admin/addMovie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movieName: contentName,
                    type: contentType
                })
            });

            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                setContentName('');
                fetchContent();
            } else {
                setError(data.error || `Failed to add ${contentType}`);
            }
        } catch (err: any) {
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContent = async (contentId: string, contentTitle: string) => {
        if (!confirm(`Are you sure you want to delete "${contentTitle}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/deleteMovie/${contentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                fetchContent();
                if (result?.id === contentId) {
                    setResult(null);
                }
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (err: any) {
            alert('Error deleting: ' + err.message);
        }
    };

    const handleAddToTop10 = async () => {
        if (!selectedMovie) {
            alert('Please select a movie/show');
            return;
        }

        const movie = allContent.find(m => m.id === selectedMovie);
        if (!movie) return;

        const currentList = contentType === 'movie' ? [...top10Movies] : [...top10TV];
        const newEntry = { rank: selectedRank, movieId: movie.id, title: movie.title };

        // Remove existing entry at this rank
        const filtered = currentList.filter(item => item.rank !== selectedRank);
        filtered.push(newEntry);
        filtered.sort((a, b) => a.rank - b.rank);

        try {
            await setDoc(doc(db, 'top10', contentType === 'movie' ? 'movies' : 'tv'), {
                list: filtered
            });

            if (contentType === 'movie') {
                setTop10Movies(filtered);
            } else {
                setTop10TV(filtered);
            }

            setSelectedMovie('');
            alert(`Added to Top 10 at rank #${selectedRank}`);
        } catch (err) {
            console.error('Error updating Top 10:', err);
            alert('Failed to update Top 10');
        }
    };

    const handleRemoveFromTop10 = async (rank: number) => {
        const currentList = contentType === 'movie' ? [...top10Movies] : [...top10TV];
        const filtered = currentList.filter(item => item.rank !== rank);

        try {
            await setDoc(doc(db, 'top10', contentType === 'movie' ? 'movies' : 'tv'), {
                list: filtered
            });

            if (contentType === 'movie') {
                setTop10Movies(filtered);
            } else {
                setTop10TV(filtered);
            }
        } catch (err) {
            console.error('Error removing from Top 10:', err);
        }
    };

    const handleAddToTrending = async () => {
        if (!selectedMovie) {
            alert('Please select a movie/show');
            return;
        }

        const movie = allContent.find(m => m.id === selectedMovie);
        if (!movie) return;

        if (trendingMovies.some(m => m.movieId === movie.id)) {
            alert('Already exists in Trending Now list!');
            return;
        }

        const newEntry = { 
            movieId: movie.id, 
            title: movie.title, 
            poster: movie.poster || '', 
            releaseYear: movie.releaseYear || new Date().getFullYear(),
            imdbRating: movie.imdbRating || 0 
        };
        const updatedList = [...trendingMovies, newEntry];

        try {
            await setDoc(doc(db, 'trending', 'movies'), {
                list: updatedList
            });
            setTrendingMovies(updatedList);
            setSelectedMovie('');
            alert('Added to Trending Now (Front Page)!');
        } catch (err) {
            console.error('Error updating Trending:', err);
            alert('Failed to update Trending');
        }
    };

    const handleRemoveFromTrending = async (movieIdToRemove: string) => {
        const filtered = trendingMovies.filter(item => item.movieId !== movieIdToRemove);
        try {
            await setDoc(doc(db, 'trending', 'movies'), {
                list: filtered
            });
            setTrendingMovies(filtered);
        } catch (err) {
            console.error('Error removing from Trending:', err);
        }
    };


    const filteredContent = allContent.filter(item => item.type === contentType);
    const currentTop10 = contentType === 'movie' ? top10Movies : top10TV;

    const handleAdminLogout = () => {
        localStorage.removeItem('adminUser');
        router.push('/');
    };

    // Show loading while checking authorization
    if (!isAuthorized) {
        return (
            <div className="bg-background-dark text-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-400">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark text-white min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <Link href="/home" className="text-gray-400 hover:text-white transition-colors">
                            Back to Home
                        </Link>
                        <button
                            onClick={handleAdminLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-xl">logout</span>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Main Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'add' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        Add Content
                    </button>
                    <button
                        onClick={() => setActiveTab('manage')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'manage' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        Manage Content
                    </button>
                    <button
                        onClick={() => setActiveTab('top10')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'top10' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        Top 10 Rankings
                    </button>
                    <button
                        onClick={() => setActiveTab('trending')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'trending' ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        Trending Now
                    </button>
                </div>

                {/* Content Type Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setContentType('movie')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${contentType === 'movie' ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        Movies
                    </button>
                    <button
                        onClick={() => setContentType('tv')}
                        className={`px-6 py-3 rounded-lg font-bold transition-colors ${contentType === 'tv' ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        TV Shows
                    </button>
                </div>

                {/* Add Content Tab */}
                {activeTab === 'add' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Add New {contentType === 'movie' ? 'Movie' : 'TV Show'}
                            </h2>
                            <form onSubmit={handleAddContent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {contentType === 'movie' ? 'Movie' : 'TV Show'} Name
                                    </label>
                                    <input
                                        type="text"
                                        value={contentName}
                                        onChange={(e) => setContentName(e.target.value)}
                                        placeholder={`Enter ${contentType === 'movie' ? 'movie' : 'TV show'} name`}
                                        className="glass-input w-full rounded-lg py-3 px-4 text-white placeholder-gray-400 outline-none"
                                        required
                                        suppressHydrationWarning
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg neon-button disabled:opacity-50 disabled:cursor-not-allowed w-full"
                                >
                                    {loading ? 'Searching...' : `Add ${contentType === 'movie' ? 'Movie' : 'TV Show'}`}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                                    {error}
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="glass-card rounded-2xl p-8">
                                <h2 className="text-2xl font-bold mb-6 text-green-400">
                                    ✓ Added Successfully
                                </h2>
                                <img src={result.poster} alt={result.title} className="w-full rounded-lg mb-4" />
                                <h3 className="text-2xl font-bold mb-2">{result.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                    <span>{result.releaseYear}</span>
                                    <span>•</span>
                                    <span>⭐ {result.imdbRating}/10</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.genres?.map((genre: string) => (
                                        <span key={genre} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Manage Content Tab */}
                {activeTab === 'manage' && (
                    <div className="glass-card rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">
                            All {contentType === 'movie' ? 'Movies' : 'TV Shows'} ({filteredContent.length})
                        </h2>

                        {loadingContent ? (
                            <div className="text-center py-8 text-gray-400">Loading...</div>
                        ) : filteredContent.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No {contentType === 'movie' ? 'movies' : 'TV shows'} added yet.
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredContent.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <img src={item.poster} alt={item.title} className="w-16 h-24 object-cover rounded" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.title}</h3>
                                            <p className="text-sm text-gray-400">
                                                {item.releaseYear} • ⭐ {item.imdbRating}/10
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteContent(item.id, item.title)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Top 10 Tab */}
                {activeTab === 'top10' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Add to Top 10 */}
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Add to Top 10 {contentType === 'movie' ? 'Movies' : 'TV Shows'}
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rank (1-10)</label>
                                    <select
                                        value={selectedRank}
                                        onChange={(e) => setSelectedRank(Number(e.target.value))}
                                        className="glass-input w-full rounded-lg py-3 px-4 text-white outline-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                            <option key={num} value={num}>#{num}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select {contentType === 'movie' ? 'Movie' : 'TV Show'}
                                    </label>
                                    <select
                                        value={selectedMovie}
                                        onChange={(e) => setSelectedMovie(e.target.value)}
                                        className="glass-input w-full rounded-lg py-3 px-4 text-white outline-none"
                                    >
                                        <option value="">Choose...</option>
                                        {filteredContent.map(item => (
                                            <option key={item.id} value={item.id}>{item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleAddToTop10}
                                    className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg w-full"
                                >
                                    Add to Top 10
                                </button>
                            </div>
                        </div>

                        {/* Current Top 10 */}
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Current Top 10 {contentType === 'movie' ? 'Movies' : 'TV Shows'}
                            </h2>

                            {currentTop10.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No Top 10 rankings yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {currentTop10.map((item) => (
                                        <div
                                            key={item.rank}
                                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                                        >
                                            <div className="text-3xl font-bold text-primary w-12">
                                                #{item.rank}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold">{item.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromTop10(item.rank)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Trending Now Tab */}
                {activeTab === 'trending' && (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Add to Trending */}
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Add to "Trending Now"
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                Items added here will appear directly on the main Landing Page for anonymous users.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select Content
                                    </label>
                                    <select
                                        value={selectedMovie}
                                        onChange={(e) => setSelectedMovie(e.target.value)}
                                        className="glass-input w-full rounded-lg py-3 px-4 text-white outline-none mb-4"
                                    >
                                        <option value="">Choose content to feature...</option>
                                        {allContent.map(item => (
                                            <option key={item.id} value={item.id}>{item.title} ({item.releaseYear})</option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleAddToTrending}
                                    className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg w-full"
                                >
                                    Feature on Landing Page
                                </button>
                            </div>
                        </div>

                        {/* Current Trending */}
                        <div className="glass-card rounded-2xl p-8">
                            <h2 className="text-2xl font-bold mb-6">
                                Current Featured Trending
                            </h2>

                            {trendingMovies.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    No movies featured in Trending Now yet
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {trendingMovies.map((item, index) => (
                                        <div
                                            key={item.movieId || index}
                                            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
                                        >
                                            {item.poster && (
                                                <img src={item.poster} alt={item.title} className="w-12 h-16 object-cover rounded" />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-bold">{item.title}</h3>
                                                <p className="text-xs text-gray-400">{item.releaseYear} • ★ {item.imdbRating}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromTrending(item.movieId)}
                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
