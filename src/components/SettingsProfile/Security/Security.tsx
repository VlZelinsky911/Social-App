import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import "./Security.scss";

const SecuritySettings = () => {
  const [password, setPassword] = useState("");
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Помилка отримання сесії:", error);
      } else {
        setSession(data.session);
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    async function fetchIp() {
      try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error("Помилка отримання IP:", error);
      }
    }
    fetchIp();
  }, []);

  const handleChangePassword = async () => {
    if (!password) return alert("Введіть новий пароль!");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) alert(error.message);
    else alert("Пароль змінено!");
    setPassword("");
  };

  const handleToggle2FA = () => {
    alert("2FA потребує інтеграції WebAuthn або OTP.");
    setTwoFAEnabled(!twoFAEnabled);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else setSession(null);
  };

  return (
    <>
      <h2 className="security-title">Безпека</h2>
      <div className="security-settings">
        <div className="section">
          <label>Новий пароль</label>
          <input
            className="password-input"
            type="password"
            placeholder="Введіть новий пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleChangePassword}>Змінити пароль</button>
        </div>

        <div className="section">
          <label>Двофакторна аутентифікація</label>
          <button onClick={handleToggle2FA}>
            {twoFAEnabled ? "Вимкнути 2FA" : "Увімкнути 2FA"}
          </button>
        </div>

        <div className="section">
          <h3>Поточна сесія</h3>
          {session ? (
            <div className="session-info">
              <p>IP: {ipAddress || "Невідомий пристрій"}</p>
              <button className="logout-btn" onClick={handleLogout}>
                Вийти з сесії
              </button>
            </div>
          ) : (
            <p>Немає активної сесії.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SecuritySettings;
