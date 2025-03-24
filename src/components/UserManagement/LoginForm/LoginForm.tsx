import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setProfileComplete } from "../../../features/auth/authSlice";
import { supabase } from "../../../services/supabaseClient";
import "./LoginForm.scss";

const loginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

type FormData = z.infer<typeof loginSchema>;

const UserRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);



	const onSubmit = async (data: FormData) => {
		try {
			const { data: loginData, error } = await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});
	
			if (error) throw error;
			if (!loginData.session) throw new Error("Помилка отримання токену");
	
			localStorage.setItem("access_token", loginData.session.access_token);
			localStorage.setItem("refresh_token", loginData.session.refresh_token);
	
			dispatch(login());
	
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", loginData.user.id)
				.single();
	
			if (profileError) throw profileError;
	
			const isProfileComplete =
				profile.username &&
				profile.birthdate &&
				profile.bio &&
				profile.contact_info &&
				profile.avatar_url;
	
			dispatch(setProfileComplete(!!isProfileComplete));
	
			if (isProfileComplete) {
				navigate("/dashboard");
			} else {
				navigate("/complete-profile");
			}
		} catch (error: any) {
			setMessage(error.message);
		} finally {
			setIsLoading(false);
		}
	};	

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        dispatch(login());
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h1 className="site-title">Pixogram</h1>
        <div className="registration-box">
          <h2 className="title">Вхід</h2>
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Електронна пошта"
                {...register("email", { required: "Введіть email" })}
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                required
              />
              <p className="error">{errors.email?.message}</p>
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Ваш пароль"
                {...register("password", { required: "Введіть пароль" })}
                autoComplete="current-password"
                aria-invalid={errors.password ? "true" : "false"}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🔓" : "👁"}
              </button>
              <p className="error">{errors.password?.message}</p>
            </div>

            <p className="forgot-password">
              <Link to="/forgot-password">Забули пароль?</Link>
            </p>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Завантаження..." : "Увійти"}
            </button>

            <p className="register-link">
              У вас немає аккаунту? <Link to="/register">Зареєструватися</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;