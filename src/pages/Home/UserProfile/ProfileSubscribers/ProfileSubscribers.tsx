import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../services/supabaseClient";
import Avatar from "../../../../components/Avatar/Avatar";
import "./ProfileSubscribers.scss";

interface ProfileSubscribersProps {
  userId: string;
  followersCount: number;
  followingCount: number;
}

const ProfileSubscribers = ({ userId, followersCount, followingCount }: ProfileSubscribersProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isFollowers, setIsFollowers] = useState(true);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async (type: "followers" | "following") => {
    setIsFollowers(type === "followers");
    setLoading(true);

    const { data, error } = await supabase
      .from("followers")
      .select("follower_id, following_id")
      .eq(type === "followers" ? "following_id" : "follower_id", userId);

    if (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      return;
    }

    const ids = data.map((item) => (type === "followers" ? item.follower_id : item.following_id));

    if (ids.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .in("id", ids);

      if (profileError) {
        console.error("Error fetching profiles:", profileError);
        setLoading(false);
        return;
      }

      const profilesWithFollowStatus = await Promise.all(
        profiles.map(async (profile) => {
          const { data: followData } = await supabase
            .from("followers")
            .select("id")
            .eq("follower_id", userId)
            .eq("following_id", profile.id)
            .single();

          return {
            ...profile,
            isFollowing: !!followData,
          };
        })
      );

      setList(profilesWithFollowStatus || []);
    } else {
      setList([]);
    }

    setLoading(false);
    setShowModal(true);
  };

  const handleProfileClick = (username: string) => {
    setShowModal(false);
    navigate(`/profile/${username}`);
  };

  const toggleFollow = async (profileId: string, isFollowing: boolean) => {
    if (isFollowing) {
      await supabase
        .from("followers")
        .delete()
        .match({ follower_id: userId, following_id: profileId });
    } else {
      await supabase
        .from("followers")
        .insert([{ follower_id: userId, following_id: profileId }]);
    }
    setList((prevList) =>
      prevList.map((user) =>
        user.id === profileId ? { ...user, isFollowing: !isFollowing } : user
      )
    );
  };

  return (
    <>
      <p className="profile-subscribers__count" onClick={() => fetchData("followers")}>
        Підписників: {followersCount}
      </p>
      <p className="profile-subscribers__count" onClick={() => fetchData("following")}>
        Підписані: {followingCount}
      </p>

      {showModal && (
        <div className="modal">
          <div className="profile-subscribers__modal-content">
            <h2 className="profile-subscribers__modal-title">{isFollowers ? "Підписники" : "Підписки"}</h2>
            <button onClick={() => setShowModal(false)} className="close-button">❌</button>

            {loading ? (
              <p className="loading-text">Завантаження...</p>
            ) : list.length === 0 ? (
              <p className="empty-list">
                У вас {isFollowers ? "немає підписників" : "ви ні на кого не підписані"}.
              </p>
            ) : (
              <ul className="profile-subscribers__list">
                {list.map((user) => (
                  <li key={user.id} className="profile-subscribers__user-item">
                    <button onClick={() => handleProfileClick(user.username ?? "unknown")} className="profile-subscribers__user-item">
                      <Avatar name={user.username} avatarUrl={user.avatar_url} />
                      <span className="profile-subscribers__user-name">{user.username ?? "Невідомий"}</span>
                    </button>
                    <button
                      className={`profile-subscribers__follow-btn ${user.isFollowing ? "unfollow" : "follow"}`}
                      onClick={() => toggleFollow(user.id, user.isFollowing)}
                    >
                      {user.isFollowing ? "Відписатися" : "Підписатися"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSubscribers;
