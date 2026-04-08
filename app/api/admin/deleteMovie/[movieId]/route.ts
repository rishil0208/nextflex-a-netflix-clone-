import { NextRequest, NextResponse } from 'next/server';
import { doc, deleteDoc } from 'firebase/firestore';
// Removed import { db }

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ movieId: string }> }
) {
    try {
        const { db } = await import('@/lib/firebase/config');
        // Await params in Next.js 15+
        const { movieId } = await context.params;

        console.log('Delete request for movie ID:', movieId);

        if (!movieId) {
            return NextResponse.json(
                { success: false, error: 'Movie ID is required' },
                { status: 400 }
            );
        }

        // Delete movie from Firestore
        await deleteDoc(doc(db, 'movies', movieId));

        console.log('Movie deleted successfully:', movieId);

        return NextResponse.json({
            success: true,
            message: 'Movie deleted successfully'
        });

    } catch (error: any) {
        console.error('Error deleting movie:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete movie' },
            { status: 500 }
        );
    }
}
