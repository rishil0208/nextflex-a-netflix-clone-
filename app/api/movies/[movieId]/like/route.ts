import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(
    request: NextRequest,
    { params }: { params: { movieId: string } }
) {
    try {
        const { profileId } = await request.json();
        const { movieId } = params;

        if (!profileId) {
            return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 });
        }

        const likeId = `${profileId}_${movieId}`;
        const likeRef = doc(db, 'likes', likeId);
        const movieRef = doc(db, 'movies', movieId);

        // Check if already liked (simplified - in production use transaction)
        // For now, just toggle
        await setDoc(likeRef, {
            profileId,
            movieId,
            likedAt: serverTimestamp()
        });

        return NextResponse.json({ success: true, message: 'Movie liked' });
    } catch (error: any) {
        console.error('Error liking movie:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { movieId: string } }
) {
    try {
        const { searchParams } = new URL(request.url);
        const profileId = searchParams.get('profileId');
        const { movieId } = params;

        if (!profileId) {
            return NextResponse.json({ success: false, error: 'Profile ID required' }, { status: 400 });
        }

        const likeId = `${profileId}_${movieId}`;
        await deleteDoc(doc(db, 'likes', likeId));

        return NextResponse.json({ success: true, message: 'Like removed' });
    } catch (error: any) {
        console.error('Error unliking movie:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
