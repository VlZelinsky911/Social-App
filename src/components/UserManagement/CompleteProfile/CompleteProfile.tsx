import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { supabase } from "../../../services/supabaseClient";
import { setProfileComplete } from "../../../features/auth/authSlice";
import "./CompleteProfile.scss";
import Spinner from "../../../pages/Home/Feed/FeedComponents/Spinner/Spinner";

interface ProfileData {
  username: string;
  birthdate: string;
  bio: string;
  contact_info: string;
  avatar_url: string;
}

interface Errors {
  username?: string;
  birthdate?: string;
}

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<ProfileData>({
    username: "",
    birthdate: "",
    bio: "",
    contact_info: "",
    avatar_url: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        navigate("/login");
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("username, birthdate, bio, contact_info, avatar_url")
        .eq("id", user.user.id)
        .single();
      
      if (!profileError && profile) {
        setFormData(profile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Errors = {};
    if (!formData.username) newErrors.username = "Ім'я обов'язкове";
    if (!formData.birthdate) newErrors.birthdate = "Дата народження обов'язкова";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { error } = await supabase.from("user_profiles").upsert(
      { id: user.user.id, ...formData },
      { onConflict: "id" }
    );
    
    if (!error) {
      dispatch(setProfileComplete(true));
      navigate("/dashboard");
    }
    setLoading(false);
  };

  if (loading) return <Spinner/>

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h1 className="site-title">GN</h1>
        <div className="registration-box">
          <h2 className="title">Заповніть ваш профіль</h2>
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Ім'я користувача"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <p className="error-message">{errors.username}</p>}
            </div>

            <div className="input-group">
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
              {errors.birthdate && <p className="error-message">{errors.birthdate}</p>}
            </div>

            <div className="input-group">
              <textarea
                name="bio"
                placeholder="Біографія"
                value={formData.bio}
                onChange={handleChange}
								className="bio-textarea"
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="contact_info"
                placeholder="Контактна інформація"
                value={formData.contact_info}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Збереження..." : "Зберегти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;