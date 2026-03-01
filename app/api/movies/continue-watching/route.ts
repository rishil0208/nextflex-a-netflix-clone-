import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');

        if (!profileId) {
            return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 });
        }

        // Query watchHistory for this profile
        const watchHistoryRef = collection(db, 'watchHistory');
        const q = query(
            watchHistoryRef,
            where('profileId', '==', profileId),
            orderBy('lastWatched', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(q);
        const movies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: movies });
    } catch (error: any) {
        console.error('Error fetching continue watching:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
