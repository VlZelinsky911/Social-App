import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabaseClient";
import "./SettingsNotifications.scss";

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	
	useEffect(() => {
			const fetchUser = async () => {
				const { data, error } = await supabase.auth.getUser();
				if (!error && data?.user) {
					setUserId(data.user.id);
				}
			};
			fetchUser();
		}, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("email, push")
        .single();
      if (error) {
        console.error("Помилка завантаження налаштувань:", error);
      } else if (data) {
        setEmailNotifications(data.email);
        setPushNotifications(data.push);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async () => {
    const { error } = await supabase.from("notification_settings").upsert(
      {
        id: userId,
        email: emailNotifications,
        push: pushNotifications,
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error("Помилка оновлення налаштувань:", error);
    } else {
      alert("Налаштування збережено!");
    }
  };

  return (
		<>
		<h2 className="notifications__title">Сповіщень</h2>
    <div className="notifications-settings">
      <div className="setting">
        <label>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          Отримувати сповіщення на Email
        </label>
      </div>

      <div className="setting">
        <label>
          <input
            type="checkbox"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          Отримувати Push-сповіщення
        </label>
      </div>

      <button onClick={updateSettings}>Зберегти зміни</button>
    </div>
		</>
  );
};

export default Notifications;
