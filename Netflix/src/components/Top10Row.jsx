
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Top10Row.css";

function Top10Row() {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const movieListRef = useRef(null);

    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/trending/all/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=tr-TR`
        )
            .then((response) => response.json())
            .then((data) => {
                const top10 = (data.results || [])
                    .filter(
                        (item) =>
                            (item.media_type === "movie" ||
                                item.media_type === "tv") &&
                            item.poster_path
                    )
                    .slice(0, 10);

                setMovies(top10);
            })
            .catch((error) => {
                console.error("Top 10 içerikleri alınamadı:", error);
            });
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
        movieListRef.current?.scrollBy({
            left: -800,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        movieListRef.current?.scrollBy({
            left: 800,
            behavior: "smooth",
        });
    };

    return (
        <section className="top10-row">
            <h2>Türkiye'de Top 10</h2>

            <div className="top10-container">
                {canScrollLeft && (
                    <button
                        className="top10-scroll-button left"
                        onClick={scrollLeft}
                    >
                        ‹
                    </button>
                )}

                <div
                    className="top10-list"
                    ref={movieListRef}
                    onScroll={checkScroll}
                >
                    {movies.map((movie, index) => {
                        const title = movie.title || movie.name;
                        const date =
                            movie.release_date || movie.first_air_date;

                        return (
                            <div
                                className="top10-card"
                                key={`${movie.media_type}-${movie.id}`}
                                onClick={() =>
                                    navigate(
                                        `/${movie.media_type}/${movie.id}`
                                    )
                                }
                                role="link"
                                tabIndex={0}
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter" ||
                                        event.key === " "
                                    ) {
                                        event.preventDefault();
                                        navigate(
                                            `/${movie.media_type}/${movie.id}`
                                        );
                                    }
                                }}
                            >
                                <div className="top10-rank">
                                    {index + 1}
                                </div>

                                <div className="top10-poster">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={title}
                                    />

                                    <div className="top10-info">
                                        <p>{title}</p>

                                        <div className="top10-meta">
                                            <span>
                                                ⭐{" "}
                                                {movie.vote_average?.toFixed(1)}
                                            </span>

                                            <span>
                                                {date
                                                    ? date.slice(0, 4)
                                                    : ""}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {canScrollRight && (
                    <button
                        className="top10-scroll-button right"
                        onClick={scrollRight}
                    >
                        ›
                    </button>
                )}
            </div>
        </section>
    );
}

export default Top10Row