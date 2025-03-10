import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import "./SearchInput.scss";
import Avatar from "../../Avatar/Avatar";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
}

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	setIsSearchExpanded: (value: React.SetStateAction<boolean>) => void
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  onSearchChange,
	setIsSearchExpanded,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length < 1) {
        setUsers([]);
				setErrorMessage(null);
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchTerm}%`);

      if (error) {
        console.error("Помилка отримання користувачів:", error.message);
				setErrorMessage("Помилка завантаження користувачів. Спробуйте пізніше.");
        return;
      }

      if(!data || data.length === 0){
				setErrorMessage("Користувача не знайдено.");
				setUsers([]);
			}else{
				setUsers(data);
				setErrorMessage(null);
			}
      setShowSuggestions(true);
    };

    fetchUsers();
  }, [searchTerm]);

	const handleClose = () => {
		setIsSearchExpanded(false);
	};

  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={onSearchChange}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (
			<>
          {errorMessage ? (
            <li className="error-message">{errorMessage}</li>
          ) : (
            users.map((user) => (
							<ul className="suggestions-list">	
              <Link
                key={user.id}
                to={`/profile/${user.username ?? "unknown"}`}
                className="suggestion-item"
                onClick={handleClose}
              >
                <Avatar name={user.username} avatarUrl={user.avatar_url} />
                <span className="username">{user.username}</span>
              </Link>
						</ul>
            ))
          )}
				</>
      )}
    </div>
  );
};

export default SearchInput;
