import React from "react";
import { FaSearch } from "react-icons/fa";
import "./InputMobile.scss";
interface MobileInputProps{
	searchTerm: string,
	handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>)=> void 
}

const MobileInput: React.FC<MobileInputProps> = ({ searchTerm, handleSearchChange }) => {
  return (
    <>
    <div className="search-box-mobile">
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
    </>
  );
}
export default MobileInput;
