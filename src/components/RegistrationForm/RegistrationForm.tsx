import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import "./RegistrationForm.scss";
import { supabase } from "../../services/supabaseClient";


const registrationSchema = z
  .object({
    firstName: z.string().min(2, "Мінімум 2 символи"),
    email: z.string().email("Невірний формат email"),
    password: z
      .string()
      .min(6, "Пароль має бути мінімум 6 символів")
      .regex(/[A-Z]/, "Має містити хоча б одну велику літеру")
      .regex(/[a-z]/, "Має містити хоча б одну малу літеру")
      .regex(/[0-9]/, "Має містити хоча б одну цифру")
      .regex(/[^a-zA-Z0-9]/, "Має містити хоча б один спеціальний символ"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof registrationSchema>;

const UserRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      if (!signUpData.user) throw new Error("Не вдалося створити користувача");

			const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ 
        id: signUpData.user.id,
        full_name: data.firstName,
        email: data.email,
      }]);

    if (profileError) throw profileError;


			setMessage("Реєстрація успішна! Перевірте пошту для підтвердження.");


      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
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
    <div className="registration-container">
      <h1 className="site-title">GN</h1>
      <div className="registration-box">
        <h2 className="title">Реєстрація</h2>
        {message && <p className="success">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <div className="input-group">
            <input type="text" placeholder="Ім'я" {...register("firstName")} />
            <p className="error">{errors.firstName?.message}</p>
          </div>

          <div className="input-group">
            <input type="text" placeholder="Електронна пошта" {...register("email")} />
            <p className="error">{errors.email?.message}</p>
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Новий пароль"
              {...register("password")}
            />
            <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🔒" : "👁"}
            </button>
            <p className="error">{errors.password?.message}</p>
          </div>

          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Підтвердьте пароль"
              {...register("confirmPassword")}
            />
            <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? "🔒" : "👁"}
            </button>
            <p className="error">{errors.confirmPassword?.message}</p>
          </div>

          <button type="submit" className="submit-btn"> {isLoading ? "Завантаження..." : "Зареєструватися"}</button>
        </form>
      </div>
    </div>
  );
};

export default UserRegistration;
