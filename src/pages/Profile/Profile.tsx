import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import "./Profile.scss";
import Spinner from "../Home/Feed/FeedComponents/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import ProfilePosts from "./ProfilePosts/ProfilePosts";

interface UserProfile {
  username: string;
	fullname: string;
  birthdate: string;
  bio: string;
  contact_info: string;
  avatar_url: string;
	posts: Post[];
}
interface Post{
  id: string,
  text: string,
  mediaurls?: string,
  created_at: string,
  userId: string
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) return;
      
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username, fullname, birthdate, bio, contact_info, avatar_url, posts(*)")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error("Помилка отримання профілю:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) return <Spinner/>;
  if (!profile) return <p className="error">Профіль не знайдено.😥</p>;

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-avatar">
					<Avatar name={profile.fullname}	avatarUrl={profile.avatar_url}/>
        </div>
        <div className="profile-info">
          <p className="username">@{profile.username}</p>
					<h1 className="full-name">{profile.fullname}</h1>
          <p className="bio">{profile.bio}</p>
          <p className="friends">100 друзів</p>
          <p className="contact-info">{profile.contact_info}</p>
        </div>
        <div className="profile-actions">
				<button className="edit-profile-btn" onClick={() => navigate("/profile/edit")}>
					Відредагувати
				</button>
        </div>
				<div className="profile-line"></div>
				<div className="profile-posts">
						{profile.posts.length > 0 ? (
							profile.posts.map((post) => (
							<ProfilePosts key={post.id} post={post}/>
							))
						) : (
							<h2>Постів поки немає🥲</h2>
						)}
				</div>
      </div>
    </div>
  );
};

export default Profile;
