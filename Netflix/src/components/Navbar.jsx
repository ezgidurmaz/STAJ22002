import "../css/Navbar.css";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiUser } from "react-icons/ci";

function Navbar() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);
  const [showMore, setShowMore] = useState(false);

  return (
    <nav className={scrolled ? "navbar scrolled" : "navbar"}>
      <div className="navbar-left">
        <img src="/logo.svg" alt="Netflix" className="logo" />

        <div className="menu">
          <span className="active">Ana Sayfa</span>
          <span>Diziler</span>
          <span className="desktop-item">Filmler</span>
          <span className="desktop-item">Oyunlar</span>
          <span className="desktop-item">Yeni ve Popüler</span>
          <span className="desktop-item">Benim Netflix'im</span>
          <span className="desktop-item">Dile Göre Göz Atın</span>

          <div className="more-container">
            <span className="more" onClick={() => setShowMore(!showMore)}>
              Daha Fazla
            </span>

            {showMore && (
              <div className="more-menu">
                <span onClick={() => setShowMore(false)}>Filmler</span>
                <span onClick={() => setShowMore(false)}>Oyunlar</span>
                <span onClick={() => setShowMore(false)}>Yeni ve Popüler</span>
                <span onClick={() => setShowMore(false)}>Benim Netflix'im</span>
                <span onClick={() => setShowMore(false)}>Dile Göre Göz Atın</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <CiSearch />
        <IoIosNotificationsOutline />
        <CiUser />
      </div>
    </nav>
  );
}

export default Navbar;
