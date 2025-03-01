import { useState } from "react";
import "./ForgotPasswordForm.scss";
import { supabase } from "../../../services/supabaseClient";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5175/reset-password",
    });

    if (error)
      setError("Сталася помилка. Перевірте правильність введених даних.");
    else setMessage("Новий пароль надіслано на вашу пошту.");
  };

  return (
    <div className="forgot-password-page">
      <h1 className="site-title">GN</h1>
      <div className="forgot-password-container">
        <h2>Відновлення пароля</h2>
        {message && <p className="success">{message}</p>}
				{error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            placeholder="Введіть ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Надіслати</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
