import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaGamepad, FaHome, FaStar } from "react-icons/fa";
import "./Header.scss";

const Header: React.FC = () => {
	const [searchTerm, setSearchTerm] = React.useState("");

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		console.log("Пошуковий запит:", event.target.value);
	}
  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">GameNet</div>
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
      <nav className="nav">
        <Link to="/" className="nav-item">
          <FaHome /> Головна
        </Link>
        <Link to="/favorites" className="nav-item">
          <FaStar /> Обране
        </Link>
        <Link to="/categories" className="nav-item">
          <FaGamepad /> Категорії ігор
        </Link>
        <Link to="/profile" className="nav-item">
          <FaUser /> Профіль
        </Link>
      </nav>
    </header>
  );
};

export default Header;
