import Link from 'next/link';

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

interface MovieInfoModalProps {
    movie: Movie;
    onClose: () => void;
    onAddToList?: (movieId: string) => void;
    isInList?: boolean;
}

export default function MovieInfoModal({ movie, onClose, onAddToList, isInList }: MovieInfoModalProps) {
    const handleAddToList = () => {
        if (onAddToList) {
            onAddToList(movie.id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div
                className="glass-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative h-96">
                    <img
                        src={movie.backdrop || movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                    >
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>

                    <div className="absolute bottom-8 left-8 right-8">
                        <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
                        
                        <div className="flex gap-3">
                            <Link
                                href={`/player?id=${movie.id}`}
                                className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-white/90 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">play_arrow</span>
                                Play
                            </Link>

                            {onAddToList && (
                                <button
                                    onClick={handleAddToList}
                                    className={`px-6 py-3 ${isInList ? 'bg-primary' : 'bg-gray-500/50'
                                        } text-white font-bold rounded-lg hover:bg-gray-500/70 transition-colors flex items-center gap-2`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isInList ? 'close' : 'add'}
                                    </span>
                                    {isInList ? 'Remove from List' : 'My List'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6 text-sm">
                        {movie.imdbRating > 0 && (
                            <span className="text-green-500 font-bold">⭐ {movie.imdbRating}/10</span>
                        )}
                        {movie.releaseYear && (
                            <span className="text-gray-400">{movie.releaseYear}</span>
                        )}
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs uppercase">
                            {movie.type === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                    </div>

                    <p className="text-gray-300 mb-6 leading-relaxed">{movie.description}</p>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-400 mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {movie.genres?.map((genre) => (
                                <span key={genre} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>

                    {movie.cast && movie.cast.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 mb-3">Cast</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {movie.cast.slice(0, 8).map((actor: any) => (
                                    <div key={actor.name} className="flex items-center gap-3">
                                        {actor.photo && (
                                            <img
                                                src={actor.photo}
                                                alt={actor.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{actor.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
        </div>
    );
}
