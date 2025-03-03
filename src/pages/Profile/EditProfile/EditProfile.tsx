import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./EditProfile.scss";
import { uploadFiles } from "../uploadFiles";

interface UserProfile {
  username: string;
  fullname: string;
  birthdate: string;
  bio: string;
  contact_info: string;
  avatar_url: string;
}

const EditProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    username: "",
    fullname: "",
    birthdate: "",
    bio: "",
    contact_info: "",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("username, fullname, birthdate, bio, contact_info, avatar_url")
        .eq("id", user.user.id)
        .single();

      if (error) {
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl = formData.avatar_url;

    if (avatarFile) {
      console.log("📤 Завантаження аватарки...");
      const uploadedUrls = await uploadFiles([avatarFile], "avatars");

      if (uploadedUrls.length > 0) {
        avatarUrl = uploadedUrls[0];
      } else {
        console.error("❌ Помилка: Не вдалося завантажити аватарку.");
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ ...formData, avatar_url: avatarUrl })
      .eq("username", profile?.username);

    if (error) {
      console.error("❌ Помилка оновлення профілю:", error);
    } else {
      console.log("✅ Профіль успішно оновлено!");
      navigate("/profile");
    }

    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <h2>Редагувати профіль</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Повне ім'я" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Біографія"></textarea>
        <input type="text" name="contact_info" value={formData.contact_info} onChange={handleChange} placeholder="Контактна інформація" />
        <input type="file" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Збереження..." : "Зберегти"}
        </button>
        <button type="button" onClick={() => navigate("/profile")}>Скасувати</button>
      </form>
    </div>
  );
};

export default EditProfile;
