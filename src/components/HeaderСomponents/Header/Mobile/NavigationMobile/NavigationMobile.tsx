import React from "react";
import { Link } from "react-router-dom";
import { FaGamepad, FaHome, FaStar,FaUser } from "react-icons/fa";

interface NavigationProps {
	setIsMenuOpen: (value: React.SetStateAction<boolean>) => void
}

const Navigation: React.FC<NavigationProps> = ({ setIsMenuOpen }) => {
  return (
    <>
      <Link to="/" className="nav-item" onClick={() => setIsMenuOpen(false)}>
        <FaHome /> Головна
      </Link>
      <Link
        to="/favorites"
        className="nav-item"
        onClick={() => setIsMenuOpen(false)}
      >
        <FaStar /> Обране
      </Link>
      <Link
        to="/categories"
        className="nav-item"
        onClick={() => setIsMenuOpen(false)}
      >
        <FaGamepad /> Категорії ігор
      </Link>
      <Link
        to="/profile"
        className="nav-item"
        onClick={() => setIsMenuOpen(false)}
      >
        <FaUser /> Профіль
      </Link>
    </>
  );
};

export default Navigation;
