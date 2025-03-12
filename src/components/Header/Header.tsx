import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./Header.scss";
import { NavigationButtons } from "./NavigationButtons/NavigationButtons";
import SearchInput from "./SearchInput/SearchInput";

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

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-container">
          <div className="logo">
            <span className="logo-text">Storygram</span>
          </div>

          <nav className="sidebar-nav">
            <NavigationButtons
              handleNavigation={handleNavigation}
              isSearchExpanded={isSearchExpanded}
              toggleSearch={toggleSearch}
            />
          </nav>

          <button className="nav-item menu-button" onClick={toggleMenu}>
            <FaBars />
            <span>Menu</span>
          </button>
        </div>

        {isSearchExpanded && (
          <div className="search-overlay">
            <div className="search-container">
              <h4>Search</h4>
              <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} setIsSearchExpanded={setIsSearchExpanded}/>
            </div>
          </div>
        )}
      </aside>master

      <div className={`backdrop ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}></div>
    </>
  );
};

export default Header;