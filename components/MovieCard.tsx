import Link from 'next/link';
import { useState } from 'react';

interface Movie {
    id: string;
    title: string;
    poster: string;
    releaseYear: number;
    type: 'movie' | 'tv';
}

interface MovieCardProps {
    movie: Movie;
    onInfoClick: (movie: any) => void;
    onAddToList: (movieId: string) => void;
    isInList?: boolean;
}

export default function MovieCard({ movie, onInfoClick, onAddToList, isInList }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group cursor-pointer shrink-0"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-48 h-72 bg-gray-800 rounded-lg overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            {isHovered && (
                <div className="absolute inset-0 top-0 left-0 right-0 bottom-0 bg-black/80 rounded-lg flex flex-col items-center justify-center gap-3 p-4 z-10">
                    <h3 className="text-sm font-semibold text-center line-clamp-2">{movie.title}</h3>
                    {movie.releaseYear && !isNaN(movie.releaseYear) && movie.releaseYear > 0 && (
                        <p className="text-xs text-gray-400">{movie.releaseYear}</p>
                    )}

                    <div className="flex gap-2">
                        <Link
                            href={`/player?id=${movie.id}`}
                            className="w-10 h-10 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center transition-colors"
                            title="Play"
                        >
                            <span className="material-symbols-outlined text-black text-xl">play_arrow</span>
                        </Link>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToList(movie.id);
                            }}
                            className={`w-10 h-10 rounded-full ${isInList ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-600'
                                } flex items-center justify-center transition-colors`}
                            title={isInList ? 'Remove from My List' : 'Add to My List'}
                        >
                            <span className="material-symbols-outlined text-white text-xl">
                                {isInList ? 'close' : 'add'}
                            </span>
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onInfoClick(movie);
                            }}
                            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                            title="More Info"
                        >
                            <span className="material-symbols-outlined text-white text-xl">info</span>
                        </button>
                    </div>
                </div>
            )}

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
