function MovieDetailInfo({
    movie,
    releaseYear,
    ageRating,
    runtime,
    cast,
    extraLoading,
    type
}) {
    return (
        <div className="movie-detail-columns">
            <div className="movie-detail-main">
                <div className="movie-modal-meta">
                    {releaseYear && <span>{releaseYear}</span>}

                    {ageRating && (
                        <span className="age-rating">
                            {ageRating}
                        </span>
                    )}

                    {movie.number_of_seasons && (
                        <span>{movie.number_of_seasons} sezon</span>
                    )}

                    {runtime && <span>{runtime}</span>}
                </div>

                <p className="movie-modal-overview">
                    {movie.overview ||
                        "Bu içerik için açıklama bulunmuyor."}
                </p>
            </div>

            <aside className="movie-detail-sidebar">
                <div className="detail-sidebar-item">
                    <span className="detail-sidebar-label">
                        Oyuncu Kadrosu:
                    </span>

                    <p className="detail-sidebar-value">
                        {cast.length > 0
                            ? cast
                                .map((person) => person.name)
                                .join(", ")
                            : extraLoading
                                ? "Oyuncular yükleniyor..."
                                : "Oyuncu bilgisi bulunamadı."}
                    </p>
                </div>

                <div className="detail-sidebar-item">
                    <span className="detail-sidebar-label">
                        Tür:
                    </span>

                    <p className="detail-sidebar-value">
                        {movie.genres?.length > 0
                            ? movie.genres
                                .map((genre) => genre.name)
                                .join(", ")
                            : "Tür bilgisi bulunamadı."}
                    </p>
                </div>
            </aside>
        </div>
    );
}

export default MovieDetailInfo