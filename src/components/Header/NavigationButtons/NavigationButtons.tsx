import React, { JSX } from "react";
import { FaHome, FaSearch, FaCompass, FaHeart, FaUser, FaBookmark } from "react-icons/fa";

interface NavigationButtonProps {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
  activeClassName?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick, icon, label, activeClassName }) => {
  return (
    <button className={`nav-item ${activeClassName}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
};

export const NavigationButtons = ({
  handleNavigation,
  isSearchExpanded,
  toggleSearch,
}: {
  handleNavigation: (path: string) => void;
  isSearchExpanded: boolean;
  toggleSearch: () => void;
}) => (
  <>
    <NavigationButton onClick={() => handleNavigation("/")} icon={<FaHome />} label="Home" />
    <NavigationButton
      onClick={toggleSearch}
      icon={<FaSearch />}
      label="Search"
      activeClassName={isSearchExpanded ? "active" : ""}
    />
    <NavigationButton onClick={() => handleNavigation("/explore")} icon={<FaCompass />} label="Explore" />
    <NavigationButton onClick={() => handleNavigation("/saved")} icon={<FaBookmark />} label="Saved" />
    <NavigationButton onClick={() => handleNavigation("/profile")} icon={<FaUser />} label="Profile" />
  </>
);
