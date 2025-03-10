import React from "react";
import Navigation from "../Modile/NavigationMobile/NavigationMobile";

const MobileMenu: React.FC<{ isMenuOpen: boolean; setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  isMenuOpen,
  setIsMenuOpen,
}) => {
  return (
    <nav className={`navMobile ${isMenuOpen ? "active" : ""}`} style={{ display: isMenuOpen ? "flex" : "none" }}>
      <Navigation setIsMenuOpen={setIsMenuOpen} />
    </nav>
  );
};

export default MobileMenu;