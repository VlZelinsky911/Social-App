import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabaseClient";
import "./ResetPassword.scss";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Помилка оновлення пароля:", error.message);
      setError("Не вдалося оновити пароль. Можливо, сесія застаріла.");
    } else {
      setMessage("Пароль успішно оновлено! Перенаправляємо на сторінку входу...");
      setTimeout(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="reset-password-page">
			<h1 className="site-title">Pixogram</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleReset}>
			<h2>Оновлення пароля</h2>
        <input
          type="password"
          placeholder="Введіть новий пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={!!error}>Змінити пароль</button>
      </form>
    </div>
  );
};

export default ResetPassword;
