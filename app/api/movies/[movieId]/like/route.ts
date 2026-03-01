import { NextResponse } from "next/server";

export async function POST(req: any, context: any) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}

export async function DELETE(req: any, context: any) {
  const { movieId } = await context.params;

  return NextResponse.json({
    success: true,
    movieId,
  });
}