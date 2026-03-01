import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for My List (replace with Firestore later)
const myListStorage = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('x-user-id') || 'default-user';
        const userList = myListStorage.get(userId) || new Set();

        return NextResponse.json({
            success: true,
            movieIds: Array.from(userList)
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { movieId } = await request.json();
        const userId = request.headers.get('x-user-id') || 'default-user';

        if (!movieId) {
            return NextResponse.json(
                { success: false, error: 'Movie ID is required' },
                { status: 400 }
            );
        }

        if (!myListStorage.has(userId)) {
            myListStorage.set(userId, new Set());
        }

        const userList = myListStorage.get(userId)!;
        userList.add(movieId);

        return NextResponse.json({
            success: true,
            message: 'Added to My List'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const movieId = searchParams.get('movieId');
        const userId = request.headers.get('x-user-id') || 'default-user';

        if (!movieId) {
            return NextResponse.json(
                { success: false, error: 'Movie ID is required' },
                { status: 400 }
            );
        }

        const userList = myListStorage.get(userId);
        if (userList) {
            userList.delete(movieId);
        }

        return NextResponse.json({
            success: true,
            message: 'Removed from My List'
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
