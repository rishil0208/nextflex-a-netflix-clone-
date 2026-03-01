import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { Movie } from '@/types';

export async function addMovieToFirestore(movieData: Omit<Movie, 'id' | 'createdAt'>) {
    try {
        const docRef = await addDoc(collection(db, 'movies'), {
            ...movieData,
            createdAt: serverTimestamp()
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error adding movie to Firestore:', error);
        throw error;
    }
}

export async function getMovies() {
    // Will implement query logic
}

export async function updateMovie(movieId: string, updates: Partial<Movie>) {
    // Will implement update logic
}

export async function deleteMovie(movieId: string) {
    // Will implement delete logic
}
