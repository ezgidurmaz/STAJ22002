import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MovieDetailHero from "../components/MovieDetailHero";
import MovieDetailInfo from "../components/MovieDetailInfo";
import MovieDetailEpisodes from "../components/MovieDetailEpisodes";
import MovieDetailSimilar from "../components/MovieDetailSimilar";
import MovieDetailTrailers from "../components/MovieDetailTrailers";
import MovieDetailAbout from "../components/MovieDetailAbout";
import "../css/MovieDetail.css";


const IMAGE_URL = "https://image.tmdb.org/t/p/";
const API_URL = "https://api.themoviedb.org/3";

function MovieDetail() {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [season, setSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [episodesLoading, setEpisodesLoading] = useState(false);

    const [similar, setSimilar] = useState([]);
    const [videos, setVideos] = useState([]);
    const [credits, setCredits] = useState(null);
    const [ageRating, setAgeRating] = useState("");
    const [extraLoading, setExtraLoading] = useState(true);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    // Film veya dizi bilgilerini getir
    useEffect(() => {
        let cancelled = false;

        const fetchMovie = async () => {
            setMovie(null);

            try {
                const response = await fetch(
                    `${API_URL}/${type}/${id}?api_key=${apiKey}&language=tr-TR`
                );

                if (!response.ok) {
                    throw new Error("İçerik bilgileri alınamadı.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setMovie(data);
                    setSeason(1);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("İçerik yüklenirken hata:", error);
                }
            }
        };

        fetchMovie();

        return () => {
            cancelled = true;
        };
    }, [type, id, apiKey]);

    // Dizinin sezon bölümlerini getir
    useEffect(() => {
        let cancelled = false;

        const fetchEpisodes = async () => {
            if (type !== "tv" || !movie?.seasons?.length) {
                setEpisodes([]);
                setEpisodesLoading(false);
                return;
            }

            setEpisodesLoading(true);

            try {
                const response = await fetch(
                    `${API_URL}/tv/${id}/season/${season}?api_key=${apiKey}&language=tr-TR`
                );

                if (!response.ok) {
                    throw new Error("Bölümler alınamadı.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setEpisodes(data.episodes || []);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Bölümler yüklenirken hata:", error);
                    setEpisodes([]);
                }
            } finally {
                if (!cancelled) {
                    setEpisodesLoading(false);
                }
            }
        };

        fetchEpisodes();

        return () => {
            cancelled = true;
        };
    }, [type, id, season, apiKey, movie]);

    // Oyuncular, benzer içerikler, fragmanlar ve yaş sınıflandırması
    useEffect(() => {
        let cancelled = false;

        const fetchExtraDetails = async () => {
            setExtraLoading(true);
            setSimilar([]);
            setVideos([]);
            setCredits(null);
            setAgeRating("");

            const requests = [
                fetch(
                    `${API_URL}/${type}/${id}/recommendations?api_key=${apiKey}&language=tr-TR`
                ).then((response) => {
                    if (!response.ok) {
                        throw new Error("Benzer içerikler alınamadı.");
                    }

                    return response.json();
                }),

                fetch(
                    `${API_URL}/${type}/${id}/videos?api_key=${apiKey}&language=tr-TR`
                ).then((response) => {
                    if (!response.ok) {
                        throw new Error("Videolar alınamadı.");
                    }

                    return response.json();
                }),

                fetch(
                    `${API_URL}/${type}/${id}/credits?api_key=${apiKey}&language=tr-TR`
                ).then((response) => {
                    if (!response.ok) {
                        throw new Error("Oyuncu bilgileri alınamadı.");
                    }

                    return response.json();
                }),

                type === "movie"
                    ? fetch(
                        `${API_URL}/movie/${id}/release_dates?api_key=${apiKey}`
                    ).then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                "Yaş sınıflandırması alınamadı."
                            );
                        }

                        return response.json();
                    })
                    : fetch(
                        `${API_URL}/tv/${id}/content_ratings?api_key=${apiKey}`
                    ).then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                "Yaş sınıflandırması alınamadı."
                            );
                        }

                        return response.json();
                    })
            ];

            const results = await Promise.allSettled(requests);

            if (cancelled) return;

            if (results[0].status === "fulfilled") {
                setSimilar(results[0].value.results || []);
            }

            if (results[1].status === "fulfilled") {
                const allVideos = results[1].value.results || [];

                const youtubeVideos = allVideos.filter(
                    (video) =>
                        video.site === "YouTube" &&
                        ["Trailer", "Teaser", "Clip", "Featurette"].includes(
                            video.type
                        ) &&
                        video.key
                );

                youtubeVideos.sort((a, b) => {
                    const order = {
                        Trailer: 1,
                        Teaser: 2,
                        Clip: 3,
                        Featurette: 4
                    };

                    return (order[a.type] || 5) - (order[b.type] || 5);
                });

                setVideos(youtubeVideos.slice(0, 6));
            }

            if (results[2].status === "fulfilled") {
                setCredits(results[2].value);
            }

            if (results[3].status === "fulfilled") {
                const ratingData = results[3].value;
                const countries = ratingData.results || [];

                const usRating = countries.find(
                    (country) => country.iso_3166_1 === "US"
                );

                const selectedCountry = usRating || countries[0];

                if (type === "movie") {
                    const certification =
                        selectedCountry?.release_dates?.find(
                            (item) => item.certification
                        )?.certification || "";

                    setAgeRating(certification);
                } else {
                    setAgeRating(selectedCountry?.rating || "");
                }
            }

            if (!cancelled) {
                setExtraLoading(false);
            }
        };

        fetchExtraDetails().catch((error) => {
            console.error("Ek bilgiler yüklenirken hata:", error);

            if (!cancelled) {
                setExtraLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [type, id, apiKey]);

    // Escape tuşuyla kapatma ve arka plan kaydırmasını durdurma
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                navigate("/");
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [navigate]);

    const closeModal = () => {
        navigate("/");
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    };

    if (!movie) {
        return (
            <div
                className="movie-modal-overlay"
                onClick={handleOverlayClick}
            >
                <div className="movie-modal">
                    <button
                        className="movie-modal-close"
                        onClick={closeModal}
                        aria-label="Kapat"
                    >
                        ✕
                    </button>

                    <div className="movie-modal-loading">
                        İçerik yükleniyor...
                    </div>
                </div>
            </div>
        );
    }

    const title = movie.title || movie.name;

    const backdrop = movie.backdrop_path
        ? `${IMAGE_URL}original${movie.backdrop_path}`
        : "";

    const releaseDate = movie.release_date || movie.first_air_date;
    const releaseYear = releaseDate ? releaseDate.slice(0, 4) : "";

    const runtime = movie.runtime
        ? `${movie.runtime} dakika`
        : movie.episode_run_time?.length
            ? `${movie.episode_run_time[0]} dakika`
            : "";

    const cast = credits?.cast?.slice(0, 8) || [];
    const crew = credits?.crew || [];

    const directors = crew.filter(
        (person) => person.job === "Director"
    );

    const creators = movie.created_by || [];

    const people = type === "tv"
        ? creators.map((person) => person.name)
        : directors.map((person) => person.name);

    return (
        <div
            className="movie-modal-overlay"
            onClick={handleOverlayClick}
        >
            <div className="movie-modal">
                <button
                    className="movie-modal-close"
                    onClick={closeModal}
                    aria-label="Kapat"
                >
                    ✕
                </button>

                <MovieDetailHero
                    title={title}
                    backdrop={backdrop}
                    heroVideo={
                        videos.find((video) => video.type === "Trailer") ||
                        videos.find((video) => video.type === "Teaser")
                    }
                />

                <div className="movie-modal-info">
                    <MovieDetailInfo
                        movie={movie}
                        releaseYear={releaseYear}
                        ageRating={ageRating}
                        runtime={runtime}
                        cast={cast}
                        extraLoading={extraLoading}
                        type={type}
                    />

                    {type === "tv" && (
                        <MovieDetailEpisodes
                            movie={movie}
                            season={season}
                            setSeason={setSeason}
                            episodes={episodes}
                            episodesLoading={episodesLoading}
                        />
                    )}

                    <MovieDetailSimilar
                        items={similar}
                        type={type}
                        loading={extraLoading}
                        currentMovieId={movie.id}
                    />

                    <MovieDetailTrailers
                        videos={videos}
                        loading={extraLoading}
                    />

                    <MovieDetailAbout
                        title={title}
                        type={type}
                        people={people}
                        cast={cast}
                        movie={movie}
                        ageRating={ageRating}
                        credits={credits}
                        loading={extraLoading}
                    />
                </div>
            </div>
        </div>
    );
}

export default MovieDetail