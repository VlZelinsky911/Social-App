import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaGamepad, FaHome, FaStar, FaBars, FaTimes } from "react-icons/fa";
import "./Header.scss";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">GN</div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Пошук ігор..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FaSearch />
          </button>
        </div>
      </div>

      <button className={`burger-menu ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`nav ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          <FaHome /> Головна
        </Link>
        <Link to="/favorites" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          <FaStar /> Обране
        </Link>
        <Link to="/categories" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          <FaGamepad /> Категорії ігор
        </Link>
        <Link to="/profile" className="nav-item" onClick={() => setIsMenuOpen(false)}>
          <FaUser /> Профіль
        </Link>
      </nav>
    </header>
  );
};

export default Header;
