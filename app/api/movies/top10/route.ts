import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
// Removed import { db }

export async function GET(request: NextRequest) {
    try {
        const { db } = await import('@/lib/firebase/config');
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'movie';

        // Query movies sorted by views and likes
        const moviesRef = collection(db, 'movies');
        const q = query(
            moviesRef,
            where('type', '==', type),
            orderBy('views', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: movies });
    } catch (error: any) {
        console.error('Error fetching top 10:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
