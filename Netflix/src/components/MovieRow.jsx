import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPlus, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import "../css/MovieRow.css";

const IMAGE_URL = "https://image.tmdb.org/t/p/";
const HOVER_DELAY = 350; 
const POPUP_SCALE = 2.0;
const EDGE_GAP = 8; // popup ekran kenarına bu kadar yaklaşabilir

// TMDB tür kimlikleri (film + dizi)
const GENRES = {
    28: "Aksiyon",
    12: "Macera",
    16: "Animasyon",
    35: "Komedi",
    80: "Suç",
    99: "Belgesel",
    18: "Dram",
    10751: "Aile",
    14: "Fantastik",
    36: "Tarih",
    27: "Korku",
    10402: "Müzik",
    9648: "Gizem",
    10749: "Romantik",
    878: "Bilim Kurgu",
    10770: "TV Filmi",
    53: "Gerilim",
    10752: "Savaş",
    37: "Vahşi Batı",
    10759: "Aksiyon ve Macera",
    10762: "Çocuk",
    10763: "Haber",
    10764: "Gerçeklik",
    10765: "Bilim Kurgu ve Fantazi",
    10766: "Pembe Dizi",
    10767: "Talk Show",
    10768: "Savaş ve Politika"
};

function MovieRow({ title, endpoint }) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [hovered, setHovered] = useState(null);

    const movieListRef = useRef(null);
    const hoverTimer = useRef(null);

    const getType = (movie) =>
        movie.media_type || (endpoint.startsWith("tv/") ? "tv" : "movie");

    // Filmleri API'den çek
    useEffect(() => {
        let cancelled = false;

        const url = new URL(`https://api.themoviedb.org/3/${endpoint}`);
        url.searchParams.append("api_key", import.meta.env.VITE_TMDB_API_KEY);
        url.searchParams.append("language", "tr-TR");

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (!cancelled) {
                    setMovies(
                        (data.results || []).filter((item) => item.poster_path)
                    );
                }
            })
            .catch((error) => {
                console.error("Liste yüklenirken hata:", error);
            });

        return () => {
            cancelled = true;
        };
    }, [endpoint]);

    
    useEffect(() => {
        const closeOnScroll = () => {
            clearTimeout(hoverTimer.current);
            setHovered(null);
        };

        window.addEventListener("scroll", closeOnScroll, true);
        window.addEventListener("resize", closeOnScroll);

        return () => {
            window.removeEventListener("scroll", closeOnScroll, true);
            window.removeEventListener("resize", closeOnScroll);
            clearTimeout(hoverTimer.current);
        };
    }, []);

    const checkScroll = () => {
        const element = movieListRef.current;

        if (!element) return;

        setCanScrollLeft(element.scrollLeft > 0);

        setCanScrollRight(
            element.scrollLeft + element.clientWidth <
            element.scrollWidth - 5
        );
    };

    const scrollLeft = () => {
        movieListRef.current.scrollBy({ left: -800, behavior: "smooth" });
    };

    const scrollRight = () => {
        movieListRef.current.scrollBy({ left: 800, behavior: "smooth" });
    };

    const openDetail = (movie) => {
        clearTimeout(hoverTimer.current);
        setHovered(null);
        navigate(`/${getType(movie)}/${movie.id}`);
    };

    // Karta gelince kısa bir gecikmeyle popup'ı aç
    const handleCardEnter = (movie, event) => {
        const card = event.currentTarget;

        clearTimeout(hoverTimer.current);

        hoverTimer.current = setTimeout(() => {
            setHovered({ movie, rect: card.getBoundingClientRect() });
        }, HOVER_DELAY);
    };

    // Popup henüz açılmadan karttan çıkıldıysa açılmayı iptal et
    const handleCardLeave = () => {
        clearTimeout(hoverTimer.current);
    };

    const handlePopupLeave = () => {
        setHovered(null);
    };

    // Popup'ı kartın ortasına hizala, ekran kenarlarından taşırma
    const getPopupStyle = ({ rect }) => {
        const width = rect.width * POPUP_SCALE;
        const maxLeft = window.innerWidth - width - EDGE_GAP;
        const centered = rect.left + rect.width / 2 - width / 2;

        return {
            width,
            left: Math.min(Math.max(centered, EDGE_GAP), maxLeft),
            top: rect.top + rect.height / 2,
            minHeight: rect.height
        };
    };

    const renderPopup = () => {
        const { movie } = hovered;
        const name = movie.title || movie.name;
        const image = movie.backdrop_path
            ? `${IMAGE_URL}w500${movie.backdrop_path}`
            : `${IMAGE_URL}w500${movie.poster_path}`;

        const date = movie.release_date || movie.first_air_date;
        const year = date ? date.slice(0, 4) : "";
        const score = movie.vote_average
            ? Math.round(movie.vote_average * 10)
            : 0;
        const genres = (movie.genre_ids || [])
            .map((genreId) => GENRES[genreId])
            .filter(Boolean)
            .slice(0, 3);

        return createPortal(
            <div
                className="movie-popup"
                style={getPopupStyle(hovered)}
                onMouseLeave={handlePopupLeave}
                onClick={() => openDetail(movie)}
            >
                <div className="movie-popup-image">
                    <img src={image} alt={name} />
                    <h3 className="movie-popup-title">{name}</h3>
                </div>

                <div className="movie-popup-body">
                    <div className="movie-popup-actions">
                        <button
                            type="button"
                            className="popup-button play"
                            title="Oynat"
                            aria-label="Oynat"
                        >
                            <FaPlay />
                        </button>

                        <button
                            type="button"
                            className="popup-button"
                            title="Listeme ekle"
                            aria-label="Listeme ekle"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <FaPlus />
                        </button>

                        <button
                            type="button"
                            className="popup-button"
                            title="Beğen"
                            aria-label="Beğen"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <FaThumbsUp />
                        </button>

                        <button
                            type="button"
                            className="popup-button more"
                            title="Daha fazla bilgi"
                            aria-label="Daha fazla bilgi"
                        >
                            <FaChevronDown />
                        </button>
                    </div>

                    <div className="movie-popup-meta">
                        {score > 0 && (
                            <span className="popup-score">%{score} beğeni</span>
                        )}

                        {year && <span>{year}</span>}

                        <span className="popup-type">
                            {getType(movie) === "tv" ? "Dizi" : "Film"}
                        </span>
                    </div>

                    {genres.length > 0 && (
                        <p className="movie-popup-genres">
                            {genres.join(" • ")}
                        </p>
                    )}
                </div>
            </div>,
            document.body
        );
    };

    return (
        <section className="movie-row">
            <h2>{title}</h2>

            <div className="movie-container">
                {canScrollLeft && (
                    <button
                        className="scroll-button left"
                        onClick={scrollLeft}
                        aria-label="Sola kaydır"
                    >
                        ‹
                    </button>
                )}

                <div
                    className="movie-list"
                    ref={movieListRef}
                    onScroll={checkScroll}
                >
                    {movies.map((movie) => (
                        <div
                            className="movie-card"
                            key={movie.id}
                            onClick={() => openDetail(movie)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    openDetail(movie);
                                }
                            }}
                            onMouseEnter={(event) =>
                                handleCardEnter(movie, event)
                            }
                            onMouseLeave={handleCardLeave}
                            role="link"
                            tabIndex={0}
                        >
                            <img
                                src={`${IMAGE_URL}w500${movie.poster_path}`}
                                alt={movie.title || movie.name}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {canScrollRight && (
                    <button
                        className="scroll-button right"
                        onClick={scrollRight}
                        aria-label="Sağa kaydır"
                    >
                        ›
                    </button>
                )}
            </div>

            {hovered && renderPopup()}
        </section>
    );
}

export default MovieRow;
