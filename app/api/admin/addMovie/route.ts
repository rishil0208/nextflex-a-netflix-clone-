import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { addDoc, collection, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
// Removed top-level import of { db } to prevent Firebase initialization at build time

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

export async function POST(request: NextRequest) {
    try {
        // Dynamically import db so Firebase only initializes when the route is actually called
        const { db } = await import('@/lib/firebase/config');

        const { movieName, type = 'movie' } = await request.json();

        if (!movieName) {
            return NextResponse.json({ success: false, error: 'Content name is required' }, { status: 400 });
        }

        const isTV = type === 'tv';
        const searchEndpoint = isTV ? 'search/tv' : 'search/movie';
        const detailsEndpoint = isTV ? 'tv' : 'movie';

        // Step 1: Search TMDB for content
        const searchResponse = await axios.get(`${TMDB_BASE_URL}/${searchEndpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                query: movieName
            }
        });

        if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
            return NextResponse.json({ success: false, error: `${isTV ? 'TV show' : 'Movie'} not found` }, { status: 404 });
        }

        const tmdbContent = searchResponse.data.results[0];
        const contentId = tmdbContent.id;

        // Step 2: Get detailed content info
        const detailsResponse = await axios.get(`${TMDB_BASE_URL}/${detailsEndpoint}/${contentId}`, {
            params: { api_key: TMDB_API_KEY }
        });

        // Step 3: Get content videos (trailers)
        const videosResponse = await axios.get(`${TMDB_BASE_URL}/${detailsEndpoint}/${contentId}/videos`, {
            params: { api_key: TMDB_API_KEY }
        });

        const trailer = videosResponse.data.results.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
        );

        // Step 4: Get content credits (cast)
        const creditsResponse = await axios.get(`${TMDB_BASE_URL}/${detailsEndpoint}/${contentId}/credits`, {
            params: { api_key: TMDB_API_KEY }
        });

        // Step 5: Get IMDb rating from OMDb (optional)
        let imdbRating = 0;
        let imdbVotes = 0;

        if (OMDB_API_KEY) {
            try {
                const imdbId = detailsResponse.data.imdb_id;
                let omdbResponse;

                if (imdbId) {
                    // Use IMDb ID if available (more accurate)
                    omdbResponse = await axios.get(OMDB_BASE_URL, {
                        params: {
                            apikey: OMDB_API_KEY,
                            i: imdbId
                        },
                        timeout: 5000
                    });
                } else if (isTV) {
                    // For TV shows without IMDb ID, search by title
                    const tvTitle = detailsResponse.data.name;
                    omdbResponse = await axios.get(OMDB_BASE_URL, {
                        params: {
                            apikey: OMDB_API_KEY,
                            t: tvTitle,
                            type: 'series'
                        },
                        timeout: 5000
                    });
                }

                if (omdbResponse && omdbResponse.data.Response === 'True') {
                    imdbRating = parseFloat(omdbResponse.data.imdbRating) || 0;
                    imdbVotes = parseInt(omdbResponse.data.imdbVotes?.replace(/,/g, '')) || 0;
                    console.log(`OMDb rating for ${isTV ? 'TV show' : 'movie'}: ${imdbRating}/10`);
                }
            } catch (error) {
                console.error('OMDb API error (skipping):', error);
                // Continue without IMDb rating if OMDb fails
            }
        } else {
            console.log('OMDb API key not configured, skipping IMDb ratings');
        }

        // Step 6: Prepare content data
        const contentData = {
            tmdbId: contentId,
            title: isTV ? detailsResponse.data.name : detailsResponse.data.title,
            description: detailsResponse.data.overview,
            poster: `https://image.tmdb.org/t/p/w500${detailsResponse.data.poster_path}`,
            backdrop: `https://image.tmdb.org/t/p/original${detailsResponse.data.backdrop_path}`,
            trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
            cast: creditsResponse.data.cast.slice(0, 10).map((actor: any) => ({
                name: actor.name,
                character: actor.character,
                photo: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : null
            })),
            genres: detailsResponse.data.genres.map((g: any) => g.name),
            imdbRating,
            imdbVotes,
            releaseYear: new Date(
                isTV ? detailsResponse.data.first_air_date : detailsResponse.data.release_date
            ).getFullYear(),
            views: 0,
            likes: 0,
            type: type,
            createdAt: new Date()
        };


        // Step 7: Check for duplicates before saving
        const moviesRef = collection(db, 'movies');
        const duplicateQuery = query(
            moviesRef,
            where('tmdbId', '==', contentId),
            where('type', '==', type)
        );
        const duplicateSnapshot = await getDocs(duplicateQuery);

        if (!duplicateSnapshot.empty) {
            return NextResponse.json({
                success: false,
                error: `This ${isTV ? 'TV show' : 'movie'} already exists in the database`
            }, { status: 409 });
        }

        // Step 8: Save to Firestore
        const docRef = await addDoc(collection(db, 'movies'), {
            ...contentData,
            createdAt: serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            data: { ...contentData, id: docRef.id },
            message: `${isTV ? 'TV show' : 'Movie'} added successfully to database`
        });

    } catch (error: any) {
        console.error('Error adding content:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to add content' },
            { status: 500 }
        );
    }
}
