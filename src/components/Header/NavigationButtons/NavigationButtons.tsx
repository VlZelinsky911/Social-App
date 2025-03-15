import React from "react";
import { FaBell, FaSearch, FaHome, FaBookmark, FaUser, FaComments } from "react-icons/fa";
import "./NavigationButtons.scss";

interface NavigationButtonsProps {
  handleNavigation: (path: string) => void;
  isSearchExpanded: boolean;
	isChatsOpen: boolean;
  toggleSearch: () => void;
	toggleChats: () => void;
  showDot?: boolean;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ handleNavigation, isSearchExpanded,isChatsOpen, toggleSearch, toggleChats ,showDot }) => {
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

			<button onClick={toggleChats} className={`nav-item ${isChatsOpen ? "active" : ""}`}>
				<FaComments />
        <span>Повідомлення</span>
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
