"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

/* -------------------- Wrapper with Suspense -------------------- */

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="text-2xl">Loading...</div>
        </div>
      }
    >
      <PlayerContent />
    </Suspense>
  );
}

/* -------------------- Actual Page Logic -------------------- */

function PlayerContent() {
  const searchParams = useSearchParams();
  const movieId = searchParams.get("id");

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) {
        setLoading(false);
        return;
      }

      try {
        const movieDoc = await getDoc(doc(db, "movies", movieId));
        if (movieDoc.exists()) {
          setMovie({ id: movieDoc.id, ...movieDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-2xl">Movie not found</div>
        <Link href="/home" className="text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center relative">
      <div className="w-full h-screen relative">
        {movie.trailerUrl ? (
          <iframe
            className="w-full h-full"
            src={`${movie.trailerUrl}?autoplay=${
              isPlaying ? 1 : 0
            }&controls=1&modestbranding=1&rel=0`}
            title={movie.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="w-full h-full bg-cover bg-center flex items-center justify-center"
            style={{
              backgroundImage: `url(${movie.backdrop || movie.poster})`,
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 text-center">
              <span className="text-6xl text-gray-400 mb-4 block">
                No Trailer Available
              </span>
              <p className="text-xl text-gray-500">
                Full movie playback coming soon
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-20">
          <div className="flex items-center justify-between">
            <Link
              href="/home"
              className="text-white hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">
                arrow_back
              </span>
            </Link>
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {movie.releaseYear}
              </span>
              {movie.imdbRating > 0 && (
                <span className="text-sm text-green-400">
                  ⭐ {movie.imdbRating}/10
                </span>
              )}
            </div>
          </div>
        </div>

        {!isPlaying && movie.trailerUrl && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="text-center max-w-2xl px-8">
              <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
              <p className="text-gray-300 mb-6">{movie.description}</p>

              <div className="flex gap-2 justify-center mb-8">
                {movie.genres?.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setIsPlaying(true)}
                className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors mx-auto"
              >
                <span className="material-symbols-outlined text-6xl text-white">
                  play_arrow
                </span>
              </button>
              <p className="text-sm text-gray-400 mt-4">Watch Trailer</p>
            </div>
          </div>
        )}
      </div>

      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}