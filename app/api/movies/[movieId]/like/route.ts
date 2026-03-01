import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  try {
    return NextResponse.json({
      success: true,
      message: `Liked movie ${movieId}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  try {
    return NextResponse.json({
      success: true,
      message: `Unliked movie ${movieId}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}