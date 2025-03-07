import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../../components/Avatar/Avatar";
import Spinner from "../../Home/Feed/FeedComponents/Spinner/Spinner";
import ProfilePosts from "../../Profile/ProfilePosts/ProfilePosts";
import "./UserProfile.scss";

interface UserProfileData {
  id: string;
  username: string;
  fullname: string;
  avatar_url: string;
  bio: string;
  posts: {
    id: string;
    text: string;
    mediaurls?: string;
    created_at: string;
    userId: string;
  }[];
}

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
	const [followersCount, setFollowersCount] = useState<number>(0);
	const [followingCount, setFollowingCount] = useState<number>(0);


  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
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
				fetchFollowersCount(data.id);
				fetchFollowingCount(data.id);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [username]);

	const fetchFollowersCount = async (userId: string) => {
		const { count } = await supabase
			.from("followers")
			.select("id", {count: "exact"})
			.eq("following_id", userId);

			setFollowersCount(count || 0);
	}
	const fetchFollowingCount = async (userId: string) => {
		const { count } = await supabase
			.from("followers")
			.select("id", {count: "exact"})
			.eq("follower_id", userId);

			setFollowingCount(count || 0);
	}

  const checkIfFollowing = async (currentUserId: string, profileUserId: string) => {
    const { data } = await supabase
      .from("followers")
      .select("*")
      .eq("follower_id", currentUserId)
      .eq("following_id", profileUserId)
      .single();

    setIsFollowing(!!data);
  };

  const toggleFollow = async () => {
    if (!profile) return;
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) return;

    if (isFollowing) {
      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.user.id)
        .eq("following_id", profile.id);
    } else {
      await supabase.from("followers").insert([
        { follower_id: user.user.id, following_id: profile.id },
      ]);
    }

    setIsFollowing(!isFollowing);
  };

  if (loading) return <Spinner />;
  if (!profile) return <p className="error">Користувач не знайдений.😥</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-avatar">
          <Avatar name={profile.fullname} avatarUrl={profile.avatar_url} />
        </div>
        <div className="profile-info">
          <p className="username">@{profile.username}</p>
          <h1 className="full-name">{profile.fullname}</h1>
					<div className="profile-subscribers">
						<p className="profile-subscribers__count">Підписників: {followersCount}</p>
						<p className="profile-subscribers__count">Підписані: {followingCount}</p>
					</div>	
          <p className="bio">{profile.bio}</p>
        </div>

        {!isOwnProfile && (
          <button onClick={toggleFollow} className={isFollowing ? "following-btn" : "follow-btn"}>
            {isFollowing ? "Відписатися" : "Підписатися"}
          </button>
        )}

        <div className="profile-line"></div>

        <div className="profile-posts">
          {profile.posts.length > 0 ? (
            profile.posts.map((post) => <ProfilePosts key={post.id} post={post} />)
          ) : (
            <p>У користувача ще немає постів.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;