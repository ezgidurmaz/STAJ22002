function MovieDetailAbout({
    title,
    type,
    people,
    cast,
    movie,
    ageRating,
    credits,
    loading
}) {
    return (
        <section className="detail-section about-section">
            <h2>{title} hakkında</h2>

            {people.length > 0 && (
                <p>
                    <strong>
                        {type === "tv" ? "Oluşturanlar: " : "Yönetmen: "}
                    </strong>
                    {people.join(", ")}
                </p>
            )}

            {cast.length > 0 && (
                <p>
                    <strong>Oyuncular: </strong>
                    {cast.map((person) => person.name).join(", ")}
                </p>
            )}

            {movie.genres?.length > 0 && (
                <p>
                    <strong>Türler: </strong>
                    {movie.genres.map((genre) => genre.name).join(", ")}
                </p>
            )}

            {ageRating && (
                <p>
                    <strong>Yaş sınıflandırması: </strong>
                    {ageRating}
                </p>
            )}

            {movie.original_language && (
                <p>
                    <strong>Orijinal dil: </strong>
                    {movie.original_language.toUpperCase()}
                </p>
            )}

            {movie.number_of_seasons && (
                <p>
                    <strong>Sezon sayısı: </strong>
                    {movie.number_of_seasons}
                </p>
            )}

            {!credits && loading && (
                <p className="detail-empty">
                    Ek bilgiler yükleniyor...
                </p>
            )}
        </section>
    );
}

export default MovieDetailAbout