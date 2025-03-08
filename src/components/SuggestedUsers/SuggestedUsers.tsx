import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import Avatar from "../Avatar/Avatar";
import "./SuggestedUsers.scss";
import { Link } from "react-router-dom";

interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  avatar_url: string | null;
  isFollowing?: boolean;
}

const SuggestedUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;

      let { data: usersData, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, username, fullname, avatar_url")
        .neq("id", currentUserId)
        .limit(5);

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setLoading(false);
        return;
      }

      let { data: followingData, error: followingError } = await supabase
        .from("followers")
        .select("following_id")
        .eq("follower_id", currentUserId);

      if (followingError) {
        console.error("Error fetching following list:", followingError);
        setLoading(false);
        return;
      }

      const followingIds = new Set(followingData?.map(f => f.following_id));
      const usersWithFollowStatus = usersData?.map(user => ({
        ...user,
        isFollowing: followingIds.has(user.id),
      }));

      setUsers(usersWithFollowStatus || []);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUserId]);

  const handleFollow = async (userId: string) => {
    if (!currentUserId) return;

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) return;

    const isFollowing = users[userIndex].isFollowing;

    if (!isFollowing) {
      const { error } = await supabase
        .from("followers")
        .insert([{ follower_id: currentUserId, following_id: userId }]);

      if (error) {
        console.error("Error following user:", error);
        return;
      }
    } else {
      const { error } = await supabase
        .from("followers")
        .delete()
        .match({ follower_id: currentUserId, following_id: userId });

      if (error) {
        console.error("Error unfollowing user:", error);
        return;
      }
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex].isFollowing = !isFollowing;
    setUsers(updatedUsers);
  };

  if (loading) {
    return <div className="suggested-users-container">Loading...</div>;
  }

  return (
    <div className="suggested-users-container">
      <h3>Рекомендовані користувачі</h3>
      <div className="suggested-users-list">
        {users.map((user) => (
          <div key={user.id} className="suggested-user">
            <div className="user-info">
              <Avatar name={user.fullname} avatarUrl={user.avatar_url} />
              <div className="user-details">
								<Link to={`/profile/${user.username ?? "unknown"}`} className="username">
									@{user.username ?? "Невідомий"}
								</Link>
              </div>
            </div>
            <button
              className={`follow-button ${user.isFollowing ? "following" : ""}`}
              onClick={() => handleFollow(user.id)}
            >
              {user.isFollowing ? "Підписаний" : "Підписатися"}
            </button>
          </div>
        ))}
      </div>
      <div className="line"></div>
      <div className="policy">
        <Link className="policy-link" to="/privacy-policy">
          Політика конфіденційності
        </Link>
        <Link className="policy-link" to="/terms-of-service">
          Умови використання
        </Link>
      </div>
    </div>
  );
};

export default SuggestedUsers;
