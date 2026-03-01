// User & Profile Types
export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
    createdAt: Date;
    subscription: 'free' | 'premium';
}

export interface Profile {
    id: string;
    userId: string;
    name: string;
    avatar: string;
    type: 'adult' | 'child';
    watchHistory: string[];
    myList: string[];
    continueWatching: Record<string, ContinueWatching>;
    createdAt: Date;
}

// Movie Types
export interface Movie {
    id: string;
    title: string;
    description: string;
    poster: string;
    backdrop: string;
    trailerUrl: string;
    cast: CastMember[];
    genres: string[];
    imdbRating: number;
    imdbVotes: number;
    releaseYear: number;
    tmdbId: number;
    views: number;
    likes: number;
    type: 'movie' | 'series';
    createdAt: Date;
}

export interface CastMember {
    name: string;
    character: string;
    photo?: string;
}

// Interaction Types
export interface WatchHistory {
    id: string;
    profileId: string;
    movieId: string;
    progress: number; // seconds
    lastWatched: Date;
}

export interface ContinueWatching {
    progress: number; // seconds
    duration: number; // total seconds
    percentage: number; // 0-100
    lastWatched: Date;
}

export interface MyListItem {
    id: string;
    profileId: string;
    movieId: string;
    addedAt: Date;
}

export interface Like {
    id: string;
    profileId: string;
    movieId: string;
    likedAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// TMDB API Types
export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
    release_date: string;
    vote_average: number;
    vote_count: number;
}

export interface TMDBSearchResponse {
    results: TMDBMovie[];
    total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
    genres: { id: number; name: string }[];
    runtime: number;
    imdb_id: string;
}

export interface TMDBVideo {
    key: string;
    site: string;
    type: string;
    official: boolean;
}

export interface TMDBCredits {
    cast: {
        name: string;
        character: string;
        profile_path: string | null;
    }[];
}

// OMDb API Types
export interface OMDbMovie {
    Title: string;
    Year: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
}
