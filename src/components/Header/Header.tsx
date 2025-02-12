import React from "react";
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaGamepad, FaHome, FaStar } from "react-icons/fa";
import "./Header.scss";

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">GameNet</div>
      <nav className="nav">
        <Link to="/" className="nav-item">
          <FaHome />Головна
        </Link>
        <Link to="/categories" className="nav-item">
          <FaGamepad /> Категорії ігор
        </Link>
        <Link to="/favorites" className="nav-item">
          <FaStar /> Обране
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser /> Профіль
        </Link>
      </nav>
      <div className="search-box">
        <input type="text" placeholder="Пошук ігор..." />
        <button>
          <FaSearch />
        </button>
      </div>
    </header>
  );
};

export default Header;
