import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function POST(
  request: Request,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}