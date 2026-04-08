import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
// Removed import { db } due to Netlify build error

export async function GET(request: NextRequest) {
    try {
        const { db } = await import('@/lib/firebase/config');
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q') || '';
        const genre = searchParams.get('genre');
        const actor = searchParams.get('actor');

        const moviesRef = collection(db, 'movies');
        let moviesQuery = query(moviesRef);

        // Note: For production, use Algolia or Typesense for better search
        // This is a basic Firestore search
        const snapshot = await getDocs(moviesQuery);
        let movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Client-side filtering (not optimal for large datasets)
        if (q) {
            movies = movies.filter((movie: any) =>
                movie.title?.toLowerCase().includes(q.toLowerCase())
            );
        }

        if (genre) {
            movies = movies.filter((movie: any) =>
                movie.genres?.includes(genre)
            );
        }

        if (actor) {
            movies = movies.filter((movie: any) =>
                movie.cast?.some((c: any) => c.name.toLowerCase().includes(actor.toLowerCase()))
            );
        }

        return NextResponse.json({ success: true, data: movies });
    } catch (error: any) {
        console.error('Error searching movies:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
