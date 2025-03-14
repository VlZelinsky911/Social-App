import React from "react";
import { FaBell, FaSearch, FaHome, FaBookmark, FaUser } from "react-icons/fa"; // Додано іконку Home
import "./NavigationButtons.scss";

interface NavigationButtonsProps {
  handleNavigation: (path: string) => void;
  isSearchExpanded: boolean;
  toggleSearch: () => void;
  showDot?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ handleNavigation, isSearchExpanded, toggleSearch, showDot }) => {
  return (
    <div className="nav-buttons">
      <button onClick={() => handleNavigation("/")} className="nav-item">
        <FaHome />
        <span>Головна</span>
      </button>

      <button onClick={toggleSearch} className={`nav-item ${isSearchExpanded ? "active" : ""}`}>
        <FaSearch />
        <span>Пошук</span>
      </button>

      <button onClick={() => handleNavigation("/notifications")} className="nav-item">
        <FaBell />
        {showDot && <span className="notification-dot"></span>}
        <span>Сповіщення</span>
      </button>

      <button onClick={() => handleNavigation("/saved")} className="nav-item">
			{<FaBookmark />}
			<span>Збережені</span> 
      </button>

      <button onClick={() => handleNavigation("/profile")} className="nav-item">
			{<FaUser />} 
			<span>Профіль</span>
      </button>
    </div>
  );
};
