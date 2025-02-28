import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { supabase } from "../../services/supabaseClient";
import "./LoginForm.scss";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
	email: z.string().email("Невірний формат email"),
	password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
});

type FormData = z.infer<typeof  loginSchema>;

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

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        dispatch(login());
        navigate("/");
      }
    };
    checkUser();
  }, [dispatch, navigate]);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, password_hash")
        .eq("email", data.email)
        .single();

      if (userError || !userData) {
        throw new Error("Користувача з таким email не знайдено");
      }

      const isValidPassword = await bcrypt.compare(data.password, userData.password_hash);
      if (!isValidPassword) {
        throw new Error("Невірний пароль");
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) throw loginError;

      dispatch(login());
      navigate("/");

    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h1 className="site-title">GN</h1>
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
            <p className="register-link">
              У вас немає аккаунту? <Link to="/register">Зареєструватися</Link>
            </p>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Завантаження..." : "Увійти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserRegistration;
