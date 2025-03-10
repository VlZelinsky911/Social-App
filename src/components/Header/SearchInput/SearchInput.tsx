import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { supabase } from "../../../services/supabaseClient";
import "./SearchInput.scss";
import Avatar from "../../Avatar/Avatar";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
}

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length < 1) {
        setUsers([]);
        return;
      }

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .ilike("username", `%${searchTerm}%`);

      if (error) {
        console.error("Помилка отримання користувачів:", error.message);
        return;
      }

      setUsers(data || []);
      setShowSuggestions(true);
    };

    fetchUsers();
  }, [searchTerm]);

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
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </div>

      {showSuggestions && users.length > 0 && (
        <ul className="suggestions-list">
          {users.map((user) => (
            <li key={user.id}>
							<Avatar name={user.username} avatarUrl={user.avatar_url} />
              <span className="username">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
