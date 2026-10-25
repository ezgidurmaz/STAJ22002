import Navbar from "./Navbar";
import Featured from "./Featured";
import MovieRow from "./MovieRow";
import Top10Row from "./Top10Row";

function Home() {
    return (
        <div>
            <Navbar />

            <Featured />

            <Top10Row />

            <MovieRow
                title="Netflix'te Popüler"
                endpoint="movie/popular"
            />

            <MovieRow
                title="Popüler Diziler"
                endpoint="tv/popular"
            />

            <MovieRow
                title="Aksiyon Filmleri"
                endpoint="discover/movie?with_genres=28"
            />

            <MovieRow
                title="Komedi Filmleri"
                endpoint="discover/movie?with_genres=35"
            />

            <MovieRow
                title="Gerilim Filmleri"
                endpoint="discover/movie?with_genres=53"
            />

            <MovieRow
                title="Bilim Kurgu Filmleri"
                endpoint="discover/movie?with_genres=878"
            />

            <MovieRow
                title="En Çok Oy Alanlar"
                endpoint="movie/top_rated"
            />
        </div>
    );
}

export default Home
