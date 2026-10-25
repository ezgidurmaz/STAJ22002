import { useNavigate } from "react-router-dom";

const IMAGE_URL = "https://image.tmdb.org/t/p/";

function MovieDetailSimilar({ items, type, loading, currentMovieId }) {
    const navigate = useNavigate();

    const openSimilar = (item) => {
        const itemType = item.media_type || type;

        if (itemType === "movie" || itemType === "tv") {
            navigate(`/${itemType}/${item.id}`);
            window.scrollTo(0, 0);
        }
    };

    const similarItems = items
        .filter((item) => item.poster_path && item.id !== currentMovieId)
        .slice(0, 12);

    return (
        <section className="detail-section">
            <h2>Benzer içerikler</h2>

            {similarItems.length > 0 ? (
                <div className="similar-list">
                    {similarItems.map((item) => (
                        <button
                            className="similar-card"
                            key={`${item.media_type || type}-${item.id}`}
                            type="button"
                            onClick={() => openSimilar(item)}
                            title={item.title || item.name}
                        >
                            <img
                                src={`${IMAGE_URL}w342${item.poster_path}`}
                                alt={item.title || item.name}
                                loading="lazy"
                            />

                            <span className="similar-card-title">
                                {item.title || item.name}
                            </span>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="detail-empty">
                    {loading
                        ? "Benzer içerikler yükleniyor..."
                        : "Benzer içerik bulunamadı."}
                </p>
            )}
        </section>
    );
}

export default MovieDetailSimilar