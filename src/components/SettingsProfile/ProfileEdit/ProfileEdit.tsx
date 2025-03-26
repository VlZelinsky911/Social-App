import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./ProfileEdit.scss";
import { uploadFiles } from "../../../services/fileUploadService/fileUploadService";

interface UserProfile {
  id: string;
  username: string;
  fullname: string;
  birthdate: string;
  bio: string;
  contact_info: string;
  avatar_url: string;
}

const ProfileEdit = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    id: "",
    username: "",
    fullname: "",
    birthdate: "",
    bio: "",
    contact_info: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [deleteAvatar, setDeleteAvatar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, fullname, birthdate, bio, contact_info, avatar_url")
        .eq("id", user.user.id)
        .single();

      if (error) {
        setMessage("❌ Помилка отримання профілю.");
        console.error("❌ Помилка отримання профілю:", error);
      } else {
        setProfile(data);
        setFormData(data);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatarFile(e.target.files[0]);
      setDeleteAvatar(false);
    }
  };

  const handleDeleteAvatar = () => {
    setDeleteAvatar(true);
    setAvatarFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let avatarUrl = formData.avatar_url;

    if (deleteAvatar) {
      avatarUrl = "";
    } else if (avatarFile) {
      console.log("📤 Завантаження аватарки...");
      const uploadedUrls = await uploadFiles([avatarFile]);

      if (uploadedUrls.length > 0) {
        avatarUrl = uploadedUrls[0];
      } else {
        setMessage("❌ Помилка: Не вдалося завантажити аватарку.");
        setLoading(false);
        return;
      }
    }

    if (formData.username !== profile?.username) {
      const { data: existingUser, error: usernameError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("username", formData.username)
        .single();

      if (usernameError && usernameError.code !== "PGRST116") {
        setMessage("❌ Помилка перевірки унікальності імені.");
        setLoading(false);
        return;
      }

      if (existingUser) {
        setMessage("❌ Ім'я користувача вже використовується.");
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ ...formData, avatar_url: avatarUrl })
      .eq("id", profile?.id);

    if (error) {
      setMessage("❌ Помилка оновлення профілю.");
      console.error("❌ Помилка оновлення профілю:", error);
    } else {
      setMessage("✅ Профіль успішно оновлено!");
      setTimeout(() => navigate("/settings"), 2000);
    }

    setLoading(false);
  };

  return (
		<>
		<h1 className="profile-editor__title">Редагувати профіль</h1>
    <div className="profile-editor">
      {message && <p className={`profile-editor__message ${message.includes('❌') ? 'profile-editor__message--error' : 'profile-editor__message--success'}`}>{message}</p>}
      <form className="profile-editor__form" onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Ім'я" />
        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Повне ім'я" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Біографія"></textarea>
        <input type="text" name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Контактна інформація" />

        {profile?.avatar_url && !deleteAvatar && (
          <div className="profile-editor__avatar-preview">
            <button type="button" onClick={handleDeleteAvatar} className="profile-editor__avatar-delete">Видалити аватар</button>
            <img className="profile-editor__avatar-image" src={profile.avatar_url} alt="Avatar" />
          </div>
        )}

        <input type="file" onChange={handleFileChange}/>
        
        <button type="submit" disabled={loading}>
          {loading ? "Збереження..." : "Зберегти"}
        </button>
        <button type="button" onClick={() => navigate("/profile")}>Скасувати</button>
      </form>
    </div>
		</>	
  );
};

export default ProfileEdit;
