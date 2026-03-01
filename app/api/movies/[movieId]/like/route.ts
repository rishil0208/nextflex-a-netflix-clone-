import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ movieId: string }> }
) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}