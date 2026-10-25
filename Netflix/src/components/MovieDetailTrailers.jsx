function MovieDetailTrailers({ videos, loading }) {
    return (
        <section className="detail-section">
            <h2>Fragmanlar ve daha fazlası</h2>

            {videos.length > 0 ? (
                <div className="trailer-list">
                    {videos.map((video) => (
                        <article
                            className="trailer-card"
                            key={video.id}
                        >
                            <div className="trailer-video">
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${video.key}`}
                                    title={video.name}
                                    loading="lazy"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>

                            <div className="trailer-info">
                                <h3>{video.name}</h3>
                                <p>{video.type}</p>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <p className="detail-empty">
                    {loading
                        ? "Videolar yükleniyor..."
                        : "Bu içerik için fragman bulunamadı."}
                </p>
            )}
        </section>
    );
}

export default MovieDetailTrailers