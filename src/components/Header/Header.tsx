import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBars, FaCog } from "react-icons/fa";
import "./Header.scss";
import { NavigationButtons } from "./NavigationButtons/NavigationButtons";
import SearchInput from "./SearchInput/SearchInput";
import { supabase } from "../../services/supabaseClient";
import UserChats from "./UserChats/UserChats";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
	const [unreadMessages, setUnreadMessages] = useState(false);
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

  useEffect(() => {
    if (!userId) return;

    const subscription = supabase.channel('public:posts')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload: any) => {

        if (!payload.new || payload.new.user_id !== userId) return;

        const storedData = JSON.parse(localStorage.getItem("postCounts") || "{}");
        const prevLikes = storedData[payload.new.id]?.likes_count || 0;
        const prevComments = storedData[payload.new.id]?.comments_count || 0;

        if (
          payload.new.likes_count > prevLikes ||
          payload.new.comments_count > prevComments
        ) {
          setUnreadCount((prev) => prev + 1);
        }

        localStorage.setItem(
          "postCounts",
          JSON.stringify({
            ...storedData,
            [payload.new.id]: {
              likes_count: payload.new.likes_count,
              comments_count: payload.new.comments_count,
            },
          })
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

	useEffect(() => {
		if(!userId) return;

		const subscription = supabase
		.channel("messages")
		.on(
			"postgres_changes",
			{ event: "INSERT", schema: "public", table: "messages" },
			(payload: any) => {
				if (payload.new.receiver_id === userId) {
					setUnreadMessages(true);
				}
			}
		)
		.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	},[userId]);


  const handleNavigation = async (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    if (path === "/notifications" && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

	const goToSettings = () => {
		navigate("/settings");
		setIsMenuOpen(false);
	}
  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-container">
          <div className="logo">
            <span className="logo-text">Pixogram</span>
            <span className="short-text">Pi</span>
          </div>
          <nav className="sidebar-nav">
            <NavigationButtons
              handleNavigation={handleNavigation}
              isSearchExpanded={isSearchExpanded}
							isChatsOpen={isChatsOpen}
              toggleSearch={() => {
                setIsSearchExpanded(!isSearchExpanded);
                setIsChatsOpen(false);
              }}
              toggleChats={() => {
                setIsChatsOpen(!isChatsOpen);
                setIsSearchExpanded(false);
								setUnreadMessages(false);
              }}
							showMessagesDot={unreadMessages}
              showDot={unreadCount > 0}
            />
          </nav>
          <button className="nav-item menu-button" onClick={goToSettings}>
            <FaCog />
            <span>Налаштування</span>
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
				{isChatsOpen && (
					<div className="search-overlay">
						<div className="search-container">
							<h4>Chats</h4>
							<UserChats setIsChatsOpen={setIsChatsOpen}/>
						</div>
					</div>
				)}
      </aside>
      <div className={`backdrop ${isMenuOpen ? "active" : ""}`} onClick={() => setIsMenuOpen(false)}></div>
    </>
  );
};

export default Header;
