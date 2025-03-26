import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../../components/Avatar/Avatar";
import Spinner from "../../Home/Feed/FeedComponents/Spinner/Spinner";
import ProfilePosts from "../../Profile/ProfilePosts/ProfilePosts";
import ProfileSubscribers from "./ProfileSubscribers/ProfileSubscribers";
import "./UserProfile.scss";
import { FaEllipsisH } from "react-icons/fa";


const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user);
      if (!user || !user.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, fullname, avatar_url, bio, posts(*)")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Помилка отримання профілю:", error);
      } else {
        setProfile(data);
        setIsOwnProfile(data.id === user.user.id);
        checkIfFollowing(user.user.id, data.id);
        checkIfBlocked(user.user.id, data.id);
        fetchFollowersCount(data.id);
        fetchFollowingCount(data.id);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [username]);

  const checkIfBlocked = async (
    currentUserId: string,
    profileUserId: string
  ) => {
    const { data: blockedByUser } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("user_id", profileUserId)
      .eq("blocked_user_id", currentUserId)
      .maybeSingle();

    const { data: userBlocked } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("user_id", currentUserId)
      .eq("blocked_user_id", profileUserId)
      .maybeSingle();

    if (blockedByUser || userBlocked) {
      setIsBlocked(true);
    }
  };

  const fetchFollowersCount = async (userId: string) => {
    const { count } = await supabase
      .from("followers")
      .select("id", { count: "exact" })
      .eq("following_id", userId);

    setFollowersCount(count || 0);
  };

  const fetchFollowingCount = async (userId: string) => {
    const { count } = await supabase
      .from("followers")
      .select("id", { count: "exact" })
      .eq("follower_id", userId);

    setFollowingCount(count || 0);
  };

  const checkIfFollowing = async (
    currentUserId: string,
    profileUserId: string
  ) => {
    const { data } = await supabase
      .from("followers")
      .select("*")
      .eq("follower_id", currentUserId)
      .eq("following_id", profileUserId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const toggleFollow = async () => {
    if (!profile || isProcessing) return;

    setIsProcessing(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      setIsProcessing(false);
      return;
    }

    const currentUserId = user.user.id;
    const profileUserId = profile.id;

    if (isFollowing) {
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profileUserId);
      setFollowersCount((prev) => Math.max(0, prev - 1));
    } else {
      await supabase
        .from("followers")
        .insert([{ follower_id: currentUserId, following_id: profileUserId }]);
      setFollowersCount((prev) => prev + 1);
    }

    setIsFollowing(!isFollowing);
    setIsProcessing(false);
  };

  const startConversation = async () => {
    if (!profile) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const currentUserId = user.user.id;
    const recipientId = profile.id;

    const { data: existingConversation, error } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(user1_id.eq.${currentUserId},user2_id.eq.${recipientId}),` +
          `and(user1_id.eq.${recipientId},user2_id.eq.${currentUserId})`
      )
      .maybeSingle();

    if (error) {
      console.error("❌ Помилка пошуку чату:", error);
      return;
    }

    let conversationId = existingConversation?.id;

    if (!conversationId) {
      const { data: newConversation, error: insertError } = await supabase
        .from("conversations")
        .insert([{ user1_id: currentUserId, user2_id: recipientId }])
        .select()
        .single();

      if (insertError) {
        console.error("❌ Помилка створення чату:", insertError);
        return;
      }

      conversationId = newConversation.id;
    }

    navigate(`/chat/${conversationId}`);
  };

  const handleBlockUser = async () => {
    if (!profile) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const currentUserId = user.user.id;
    const recipientId = profile.id;

    const { data: existingBlock, error: checkError } = await supabase
      .from("blocked_users")
      .select("id")
      .eq("user_id", currentUserId)
      .eq("blocked_user_id", recipientId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Помилка перевірки блокування:", checkError);
      return;
    }

    if (existingBlock) {
      console.warn("⚠️ Користувач уже заблокований");
      return;
    }

    const { error } = await supabase
      .from("blocked_users")
      .insert([{ user_id: currentUserId, blocked_user_id: recipientId }]);

    if (error) {
      console.error("❌ Помилка заблокування користувача:", error);
      return;
    } else {
      alert("Користувача успішно заблоковано!");
    }
  };

  if (loading) return <Spinner />;
  if (!profile) return <p className="error">Користувач не знайдений.😥</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-avatar">
          <Avatar name={profile.username} avatarUrl={profile.avatar_url} />
        </div>
        <div className="profile-info">
          <p className="username">@{profile.username}</p>
          <h1 className="full-name">{profile.fullname}</h1>
          <div className="profile-subscribers">
            <ProfileSubscribers
              userId={profile.id}
              followersCount={followersCount}
              followingCount={followingCount}
            />
          </div>
          <p className="bio">{profile.bio}</p>
        </div>

        <div className="profile-buttons">
          {!isOwnProfile && (
            <button
              onClick={toggleFollow}
              className={isFollowing ? "following-btn" : "follow-btn"}
            >
              {isFollowing ? "Відписатися" : "Підписатися"}
            </button>
          )}
          {!isOwnProfile && !isBlocked && (
            <button onClick={startConversation} className="username__btn">
              Повідомлення
            </button>
          )}
          {!isOwnProfile && (
            <button
              className="setting__btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FaEllipsisH />
            </button>
          )}
        </div>
        {!isBlocked && (
          <div className="profile-posts">
            {profile.posts.length > 0 ? (
              profile.posts.map((post: any) => (
                <ProfilePosts key={post.id} post={post} user={user} />
              ))
            ) : (
              <p className="no-posts">У користувача ще немає постів.</p>
            )}
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="modal_userProfile">
          <div className="modal-content_userProfile">
            <button
              className="close-button_userProfile"
              onClick={() => setIsMenuOpen(false)}
            >
              ❌
            </button>
            <h3>ОПЦІЇ</h3>
            <button className="block-button" onClick={() => setConfirm(true)}>
              Заблокувати користувача
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="modal_userProfile">
          <div className="modal-content_userProfile">
            <button
              className="close-button_userProfile"
              onClick={() => {
                setIsMenuOpen(false);
                setConfirm(false);
              }}
            >
              ❌
            </button>
            <h3>Підтвердження</h3>
            <p>Ви впевнені, що хочете заблокувати користувача?</p>
            <div className="modal-buttons_userProfile">
              <button onClick={handleBlockUser}>Заблокувати</button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setConfirm(false);
                }}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
