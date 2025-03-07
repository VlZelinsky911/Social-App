import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../../components/Avatar/Avatar";
import Spinner from "../../Home/Feed/FeedComponents/Spinner/Spinner";
import ProfilePosts from "../../Profile/ProfilePosts/ProfilePosts";
import "./UserProfile.scss";

interface UserProfileData {
  username: string;
  fullname: string;
  birthdate: string;
  bio: string;
  contact_info: string;
  avatar_url: string;
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, fullname, birthdate, bio, contact_info, avatar_url, posts(*)")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Помилка отримання профілю:", error);
      } else {
        setProfile(data);
        setIsOwnProfile(data.id === user.user.id);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [username]);

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
          <p className="bio">{profile.bio}</p>
          <p className="contact-info">{profile.contact_info}</p>
        </div>

        {!isOwnProfile && <p className="friend-info">Додати в друзі</p>}

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
