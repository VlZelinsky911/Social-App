import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./Header.scss";
import { NavigationButtons } from "./NavigationButtons/NavigationButtons";
import SearchInput from "./SearchInput/SearchInput";
import { supabase } from "../../services/supabaseClient";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  const fetchUnreadCount = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact" })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (!error) {
      setUnreadCount(data.length);
    }
  };

  useEffect(() => {
    if (!userId) return;

    fetchUnreadCount();

    const subscription = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload: any) => {
        if (!payload?.new) return;

        if (payload.eventType === "INSERT" && payload.new.user_id === userId) {
          setUnreadCount((prev) => prev + 1);
        } else if (payload.eventType === "UPDATE" && payload.new.is_read && payload.new.user_id === userId) {
          setUnreadCount((prev) => Math.max(prev - 1, 0));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const handleNavigation = async (path: string) => {
    navigate(path);
    setIsMenuOpen(false);

    if (path === "/notifications" && unreadCount > 0) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      setUnreadCount(0);
    }
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
              toggleSearch={() => setIsSearchExpanded(!isSearchExpanded)}
              showDot={unreadCount > 0}
            />
          </nav>

          <button className="nav-item menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars />
            <span>Menu</span>
          </button>
        </div>

        {isSearchExpanded && (
          <div className="search-overlay">
            <div className="search-container">
              <h4>Search</h4>
              <SearchInput searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} setIsSearchExpanded={setIsSearchExpanded} />
            </div>
          </div>
        )}
      </aside>

      <div className={`backdrop ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
    </>
  );
};

export default Header;
