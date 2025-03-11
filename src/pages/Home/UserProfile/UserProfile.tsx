import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../../components/Avatar/Avatar";
import Spinner from "../../Home/Feed/FeedComponents/Spinner/Spinner";
import ProfilePosts from "../../Profile/ProfilePosts/ProfilePosts";
import "./UserProfile.scss";
import ProfileSubscribers from "./ProfileSubscribers/ProfileSubscribers";

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
	const [isProcessing, setIsProcessing] = useState(false);

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
		if (!profile || isProcessing) return;
	
		setIsProcessing(true);
	
		const { data: user } = await supabase.auth.getUser();
		if (!user || !user.user) {
			setIsProcessing(false);
			return;
		}
	
		const currentUserId = user.user.id;
		const profileUserId = profile.id;
	
		const { data: recentActions, error } = await supabase
			.from("followers")
			.select("created_at")
			.eq("follower_id", currentUserId)
			.eq("following_id", profileUserId)
			.order("created_at", { ascending: false })
			.limit(1);
	
		if (error) {
			console.error("Помилка перевірки підписок:", error);
			setIsProcessing(false);
			return;
		}
	
		const lastActionTime = recentActions?.[0]?.created_at;
		const now = new Date();
		if(lastActionTime){
			const lastActionDate = new Date(lastActionTime);
			const timeDiff = (now.getTime() - lastActionDate.getTime()) / 1000;
			if (timeDiff < 10) {
				console.warn("Занадто швидкі підписки. Спробуйте пізніше.");
				alert("Занадто швидкі підписки. Спробуйте пізніше.");
				setIsProcessing(false);
				return;
			}
		}
	
		if (isFollowing) {
			await supabase
				.from("followers")
				.delete()
				.eq("follower_id", currentUserId)
				.eq("following_id", profileUserId);
			setFollowersCount((prev) => Math.max(0, prev - 1));
		} else {
			await supabase.from("followers").insert([
				{ follower_id: currentUserId, following_id: profileUserId },
			]);
			setFollowersCount((prev) => prev + 1);
		}
	
		setIsFollowing(!isFollowing);
		setIsProcessing(false);
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
						<ProfileSubscribers	userId={profile.id} followersCount={followersCount} followingCount={followingCount}/>
					</div>	
          <p className="bio">{profile.bio}</p>
        </div>

        {!isOwnProfile && (
          <button onClick={toggleFollow} className={isFollowing ? "following-btn" : "follow-btn"}>
            {isFollowing ? "Відписатися" : "Підписатися"}
          </button>
        )}
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