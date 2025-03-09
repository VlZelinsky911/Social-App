import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaBars,
  FaHome,
  FaCompass,
  FaHeart,
  FaUser,
} from "react-icons/fa";
import "./Header.scss";
import Navigation from "./Modile/NavigationMobile/NavigationMobile";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setSearchTerm(event.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-container">
          <div className="logo">
            <span className="logo-text">Storygram</span>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item" onClick={() => handleNavigation("/")}>
              <FaHome />
              <span>Home</span>
            </button>

            <button
              className={`nav-item search-button ${
                isSearchExpanded ? "active" : ""
              }`}
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
            >
              <FaSearch />
              <span>Search</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/explore")}
            >
              <FaCompass />
              <span>Explore</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/notifications")}
            >
              <FaHeart />
              <span>Notifications</span>
            </button>

            <button
              className="nav-item"
              onClick={() => handleNavigation("/profile")}
            >
              <FaUser />
              <span>Profile</span>
            </button>
          </nav>

          <button className="nav-item menu-button">
            <FaBars />
            <span>Menu</span>
          </button>
        </div>

        {isSearchExpanded && (
          <div className="search-overlay">
            <div className="search-container">
              <h4>Search</h4>
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
      
      <nav
        className={`navMobile ${isMenuOpen ? "active" : ""}`}
        style={{ display: isMenuOpen ? "flex" : "none" }}
      >
        <Navigation setIsMenuOpen={setIsMenuOpen} />
      </nav>

      <div
        className={`backdrop ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      ></div>
    </>
  );
};

export default Header;
