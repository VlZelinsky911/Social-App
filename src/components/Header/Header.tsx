import React, { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import "./Header.scss";
import Navigation from "./Modile/NavigationMobile/NavigationMobile";
import InputMobile from "./Modile/InputMobile/InputMobile";

const Header: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
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
        <InputMobile
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
        />
        <nav className={`nav`}>
          <Navigation setIsMenuOpen={setIsMenuOpen} />
        </nav>
        <button
          className={`burger-menu ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <nav
          className={`navMobile ${isMenuOpen ? "active" : ""}`}
          style={{ display: isMenuOpen ? "flex" : "none" }}
        >
          <Navigation setIsMenuOpen={setIsMenuOpen} />
        </nav>
      </header>
      <div
        className={`backdrop ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>
    </>
  );
};

export default Header;
