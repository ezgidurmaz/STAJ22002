const IMAGE_URL = "https://image.tmdb.org/t/p/";

function MovieDetailEpisodes({
    movie,
    season,
    setSeason,
    episodes,
    episodesLoading
}) {
    if (!movie?.seasons?.length) {
        return null;
    }

    return (
        <div className="season-section">
            <h2>Bölümler</h2>

            <select
                value={season}
                onChange={(event) =>
                    setSeason(Number(event.target.value))
                }
                aria-label="Sezon seç"
            >
                {movie.seasons
                    .filter((item) => item.season_number > 0)
                    .map((item) => (
                        <option
                            key={item.id}
                            value={item.season_number}
                        >
                            {item.season_number}.Sezon
                        </option>
                    ))}
            </select>

            {episodesLoading ? (
                <p className="movie-modal-loading">
                    Bölümler yükleniyor...
                </p>
            ) : episodes.length > 0 ? (
                <div className="episode-list">
                    {episodes.map((episode) => (
                        <div
                            className="episode-card"
                            key={episode.id}
                        >
                            <span className="episode-number">
                                {episode.episode_number}
                            </span>

                            <div className="episode-image">
                                {episode.still_path ? (
                                    <img
                                        src={`${IMAGE_URL}w300${episode.still_path}`}
                                        alt={episode.name}
                                    />
                                ) : (
                                    <div className="episode-no-image">
                                        {episode.episode_number}
                                    </div>
                                )}

                                <button
                                    className="episode-play-icon"
                                    type="button"
                                    title="Bölümü oynat"
                                    aria-label={`${episode.name} bölümünü oynat`}
                                    onClick={() => { }}
                                >
                                    ▶
                                </button>
                            </div>

                            <div className="episode-info">
                                <div className="episode-heading">
                                    <h3>{episode.name}</h3>

                                    <span className="episode-runtime">
                                        {episode.runtime
                                            ? `${episode.runtime} dk.`
                                            : ""}
                                    </span>
                                </div>

                                <p>
                                    {episode.overview ||
                                        "Bu bölüm için açıklama bulunmuyor."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>
                    Bu sezon için bölüm bilgisi bulunamadı.
                </p>
            )}
        </div>
    );
}

export default MovieDetailEpisodes;
